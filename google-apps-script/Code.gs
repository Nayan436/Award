/**
 * Oscar Award 2026 – Student pending-items form : Google Sheet backend
 *
 * HOW TO USE (see README.md for screenshots-level detail):
 *   1. Open your Google Sheet → Extensions → Apps Script.
 *   2. Delete everything there, paste this whole file, Save.
 *   3. Choose the function "setup" at the top and press Run (allow permissions).
 *   4. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy.
 *   5. Copy the Web app URL into public/config.js.
 */

var RESPONSES = 'Responses';
var PENDING = 'Pending Dispatch';
var SUMMARY = 'Summary';

// [key sent by the form, column heading in the sheet]
var COLUMNS = [
  ['timestamp', 'Timestamp'],
  ['ref', 'Ref No'],
  ['medium', 'Medium'],
  ['name', 'Student Name'],
  ['mobile', 'Mobile'],
  ['altMobile', 'Alternate Mobile'],
  ['city', 'City'],
  ['address', 'Address'],
  ['pincode', 'Pincode'],
  ['category', 'Category'],
  ['standard', 'Standard'],
  ['board', 'Board'],
  ['course', 'Course'],
  ['college', 'College / Institute'],
  ['achievement', 'Achievement'],
  ['giftKit', 'Gift Kit'],
  ['memento', 'Memento Shield'],
  ['certificate', 'Certificate'],
  ['medal', 'Medal'],
  ['pendingItems', 'Pending Items'],
  ['pendingCount', 'Pending Count'],
  ['delivery', 'Delivery Method'],
  ['relativeName', 'Relative Name'],
  ['relativeMobile', 'Relative Mobile'],
  ['relativeAddress', 'Relative Address (Rajkot)'],
  ['remarks', 'Remarks'],
  ['dispatchStatus', 'Dispatch Status'],
  ['dispatchDate', 'Dispatch Date'],
  ['adminNotes', 'Admin Notes'],
  ['duplicateOf', 'Possible Duplicate Of'],
  ['language', 'Form Language'],
  ['submissionId', 'Submission ID']
];

var ITEMS = [
  ['giftKit', 'Gift Kit'],
  ['memento', 'Memento Shield'],
  ['certificate', 'Certificate'],
  ['medal', 'Medal']
];

var STATUSES = ['Pending', 'Ready', 'Dispatched', 'Delivered', 'Collected', 'Nothing Pending'];
var DELIVERY = ['Relative in Rajkot', 'Home Delivery', 'Self Collect'];
var PHONE = /^[6-9]\d{9}$/;

// ------------------------------------------------------------------
//  Web app endpoints
// ------------------------------------------------------------------
function doGet() {
  return json_({ ok: true, message: 'Oscar Award 2026 form backend is running.' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return json_({ ok: false, error: 'Server busy, please try again.' });
  }
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Spam trap: bots fill the hidden "website" field. Pretend success.
    if (d.website) return json_({ ok: true, ref: 'OA26-0000' });

    var error = validate_(d);
    if (error) return json_({ ok: false, error: error });

    var sheet = getResponsesSheet_();
    var c = colIndex_();
    var last = sheet.getLastRow();
    var rows = last > 1 ? sheet.getRange(2, 1, last - 1, COLUMNS.length).getValues() : [];

    // Same submission sent twice (e.g. retry on slow internet) → return the same ref.
    for (var i = 0; i < rows.length; i++) {
      if (d.submissionId && rows[i][c.submissionId] === d.submissionId) {
        return json_({ ok: true, ref: rows[i][c.ref], repeated: true });
      }
    }

    // Same student (same mobile + same name) already submitted → flag it, still save.
    var dupRefs = rows.filter(function (r) {
      return String(r[c.mobile]) === d.mobile && norm_(r[c.name]) === norm_(d.name);
    }).map(function (r) { return r[c.ref]; });

    var pending = ITEMS.filter(function (it) { return d[it[0]] === 'Not Received'; })
                       .map(function (it) { return it[1]; });

    // Next number after the highest existing ref (safe even if rows are deleted)
    var maxNo = rows.reduce(function (m, r) {
      var k = parseInt(String(r[c.ref]).replace(/\D/g, '').slice(2), 10); // "OA26-0042" -> 42
      return isNaN(k) ? m : Math.max(m, k);
    }, 0);
    var ref = 'OA26-' + ('0000' + (maxNo + 1)).slice(-4);

    var rec = {};
    COLUMNS.forEach(function (col) { rec[col[0]] = d[col[0]] || ''; });
    rec.timestamp = new Date();
    rec.ref = ref;
    rec.pendingItems = pending.join(', ');
    rec.pendingCount = pending.length;
    rec.dispatchStatus = pending.length ? 'Pending' : 'Nothing Pending';
    rec.dispatchDate = '';
    rec.adminNotes = '';
    rec.duplicateOf = dupRefs.join(', ');
    if (!pending.length) {
      rec.delivery = rec.relativeName = rec.relativeMobile = rec.relativeAddress = '';
    }

    sheet.appendRow(COLUMNS.map(function (col) { return clean_(rec[col[0]]); }));
    return json_({ ok: true, ref: ref });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Server error: ' + err.message });
  } finally {
    lock.releaseLock();
  }
}

function validate_(d) {
  if (!d.name || String(d.name).trim().length < 2) return 'Name is required';
  if (!PHONE.test(d.mobile || '')) return 'Invalid mobile number';
  if (d.altMobile && !PHONE.test(d.altMobile)) return 'Invalid alternate mobile number';
  if (!d.address) return 'Address is required';
  if (!d.city) return 'City is required';
  if (!d.category) return 'Category is required';
  for (var i = 0; i < ITEMS.length; i++) {
    var v = d[ITEMS[i][0]];
    if (v !== 'Received' && v !== 'Not Received') return 'Please answer for ' + ITEMS[i][1];
  }
  var anyPending = ITEMS.some(function (it) { return d[it[0]] === 'Not Received'; });
  if (anyPending) {
    if (DELIVERY.indexOf(d.delivery) < 0) return 'Delivery method is required';
    if (d.delivery === 'Relative in Rajkot') {
      if (!d.relativeName || !d.relativeAddress) return 'Relative details are required';
      if (!PHONE.test(d.relativeMobile || '')) return 'Invalid relative mobile number';
    }
  }
  return '';
}

// ------------------------------------------------------------------
//  Auto-fill Dispatch Date when status becomes Dispatched / Delivered / Collected
// ------------------------------------------------------------------
function onEdit(e) {
  var sheet = e.range.getSheet();
  if (sheet.getName() !== RESPONSES || e.range.getRow() < 2) return;
  var c = colIndex_();
  if (e.range.getColumn() !== c.dispatchStatus + 1) return;
  var v = String(e.value || '');
  if (['Dispatched', 'Delivered', 'Collected'].indexOf(v) < 0) return;
  var dateCell = sheet.getRange(e.range.getRow(), c.dispatchDate + 1);
  if (!dateCell.getValue()) dateCell.setValue(new Date());
}

// ------------------------------------------------------------------
//  One-time setup: run this once from the Apps Script editor
// ------------------------------------------------------------------
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = getResponsesSheet_();
  var c = colIndex_();
  var n = COLUMNS.length;

  // Header style
  sh.getRange(1, 1, 1, n)
    .setValues([COLUMNS.map(function (col) { return col[1]; })])
    .setFontWeight('bold').setBackground('#7a1b1b').setFontColor('#ffffff').setWrap(true);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(4);
  sh.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
  sh.getRange(2, c.dispatchDate + 1, sh.getMaxRows() - 1, 1).setNumberFormat('dd/mm/yyyy');

  // Status dropdown
  var statusRange = sh.getRange(2, c.dispatchStatus + 1, sh.getMaxRows() - 1, 1);
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build()
  );

  // Colours
  var colours = {
    'Pending': '#fde8e6', 'Ready': '#fff4d6', 'Dispatched': '#e8f1fd',
    'Delivered': '#e3f4e8', 'Collected': '#e3f4e8', 'Nothing Pending': '#f1f1f1'
  };
  var rules = Object.keys(colours).map(function (s) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s)
      .setBackground(colours[s]).setRanges([statusRange]).build();
  });
  var itemsRange = sh.getRange(2, c.giftKit + 1, sh.getMaxRows() - 1, ITEMS.length);
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Not Received')
    .setFontColor('#b42318').setBold(true).setRanges([itemsRange]).build());
  var dupRange = sh.getRange(2, c.duplicateOf + 1, sh.getMaxRows() - 1, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenCellNotEmpty()
    .setBackground('#fff4d6').setRanges([dupRange]).build());
  sh.setConditionalFormatRules(rules);

  sh.setColumnWidth(c.address + 1, 260);
  sh.setColumnWidth(c.relativeAddress + 1, 220);
  sh.setColumnWidth(c.name + 1, 180);
  sh.setColumnWidth(c.pendingItems + 1, 200);
  sh.setColumnWidth(c.submissionId + 1, 80);

  buildPendingSheet_(ss, c);
  buildSummarySheet_(ss, c);
  ss.setActiveSheet(sh);
  safeAlert_('Setup complete! Now deploy as Web app (see README).');
}

function buildPendingSheet_(ss, c) {
  var sh = ss.getSheetByName(PENDING) || ss.insertSheet(PENDING);
  sh.clear();
  var L = function (k) { return letter_(c[k]); };
  var cols = ['ref', 'name', 'mobile', 'city', 'address', 'pincode', 'pendingItems', 'delivery',
              'relativeName', 'relativeMobile', 'relativeAddress', 'dispatchStatus', 'remarks'];
  var q = 'select ' + cols.map(L).join(', ') +
          ' where ' + L('pendingCount') + ' > 0' +
          " and " + L('dispatchStatus') + " <> 'Delivered'" +
          " and " + L('dispatchStatus') + " <> 'Collected'" +
          ' order by ' + L('delivery') + ', ' + L('city');
  sh.getRange('A1').setValue('Students whose items are still to be delivered (updates automatically – change status in "Responses" sheet)')
    .setFontWeight('bold').setFontColor('#7a1b1b');
  sh.getRange('A2').setFormula('=QUERY(' + RESPONSES + '!A1:' + letter_(COLUMNS.length - 1) + ', "' + q + '", 1)');
  sh.getRange('2:2').setFontWeight('bold').setBackground('#f6e7c1');
  sh.setFrozenRows(2);
  sh.setColumnWidth(5, 260);
  sh.setColumnWidth(11, 220);
}

function buildSummarySheet_(ss, c) {
  var sh = ss.getSheetByName(SUMMARY) || ss.insertSheet(SUMMARY);
  sh.clear();
  var R = function (k) { var l = letter_(c[k]); return RESPONSES + '!' + l + '2:' + l; };

  var rows = [['OSCAR AWARD 2026 – SUMMARY', ''], ['', ''], ['Overall', 'Count']];
  rows.push(['Total forms received', '=COUNTA(' + R('ref') + ')']);
  rows.push(['Students with pending items', '=COUNTIF(' + R('pendingCount') + ',">0")']);
  rows.push(['Students with nothing pending', '=COUNTIF(' + R('pendingCount') + ',0)']);
  rows.push(['Possible duplicate forms', '=COUNTIF(' + R('duplicateOf') + ',"?*")']);
  rows.push(['', '']);
  rows.push(['Items pending', 'Count']);
  ITEMS.forEach(function (it) {
    rows.push([it[1], '=COUNTIF(' + R(it[0]) + ',"Not Received")']);
  });
  rows.push(['', '']);
  rows.push(['Delivery method', 'Count']);
  DELIVERY.forEach(function (m) { rows.push([m, '=COUNTIF(' + R('delivery') + ',"' + m + '")']); });
  rows.push(['', '']);
  rows.push(['Dispatch status', 'Count']);
  STATUSES.forEach(function (s) { rows.push([s, '=COUNTIF(' + R('dispatchStatus') + ',"' + s + '")']); });
  rows.push(['', '']);
  rows.push(['Pending students by city', 'Count']);
  ['Rajkot', 'Morbi', 'Thangadh'].forEach(function (city) {
    rows.push([city, '=COUNTIFS(' + R('city') + ',"' + city + '",' + R('pendingCount') + ',">0")']);
  });
  rows.push(['Other', '=COUNTIFS(' + R('city') + ',"Other*",' + R('pendingCount') + ',">0")']);
  rows.push(['', '']);
  rows.push(['Forms by category', 'Count']);
  ['Std 1 to 12', 'College Degree Course', 'Other Achievement'].forEach(function (cat) {
    rows.push([cat, '=COUNTIF(' + R('category') + ',"' + cat + '")']);
  });
  rows.push(['', '']);
  rows.push(['Forms by medium', 'Count']);
  ['Gujarati Medium', 'English Medium'].forEach(function (m) {
    rows.push([m, '=COUNTIF(' + R('medium') + ',"' + m + '")']);
  });

  sh.getRange(1, 1, rows.length, 2).setValues(rows);
  sh.getRange('A1').setFontSize(14).setFontWeight('bold').setFontColor('#7a1b1b');
  rows.forEach(function (r, i) {
    if (r[1] === 'Count') sh.getRange(i + 1, 1, 1, 2).setFontWeight('bold').setBackground('#f6e7c1');
  });
  sh.setColumnWidth(1, 260);
  sh.setColumnWidth(2, 90);
}

// ------------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------------
function getResponsesSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(RESPONSES);
  if (!sh) {
    sh = ss.insertSheet(RESPONSES, 0);
    sh.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS.map(function (c) { return c[1]; })]);
  }
  return sh;
}

function colIndex_() {
  var idx = {};
  COLUMNS.forEach(function (c, i) { idx[c[0]] = i; });
  return idx;
}

// 0 -> A, 25 -> Z, 26 -> AA
function letter_(i) {
  var s = '';
  i += 1;
  while (i > 0) {
    var m = (i - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    i = Math.floor((i - 1) / 26);
  }
  return s;
}

function norm_(s) {
  return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// Keep phone numbers / pincodes as text (no lost leading digits, no 9.8E+09)
// and stop anything typed into the form from being treated as a formula.
function clean_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v !== 'string') return v;
  v = v.trim().slice(0, 1000);
  if (/^[=+\-@]/.test(v) || /^\d+$/.test(v)) return "'" + v;
  return v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function safeAlert_(msg) {
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { console.log(msg); }
}
