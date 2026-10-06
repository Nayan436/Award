(function () {
  "use strict";

  var CFG = window.APP_CONFIG || {};
  var DRAFT_KEY = "oscar2026-draft";
  var ITEMS = ["giftKit", "memento", "certificate", "medal"];
  var PHONE = /^[6-9]\d{9}$/;

  // ---------------------------------------------------------------
  //  Texts in both languages
  // ---------------------------------------------------------------
  var I18N = {
    gu: {
      pageTitle: "ઓસ્કર એવોર્ડ 2026 – વિદ્યાર્થી ફોર્મ",
      orgName: "સમસ્ત વરિયા પ્રજાપતિ શિક્ષણ સમિતિ આયોજિત",
      eventName: "ઓસ્કર એવોર્ડ 2026",
      eventDate: "4 ઓક્ટોબર 2026",
      eventPlace: "રાજકોટ",
      footer: "સમસ્ત વરિયા પ્રજાપતિ શિક્ષણ સમિતિ",
      formPurpose: "ઇવેન્ટમાં તમને કઈ વસ્તુઓ મળી છે તે જણાવવા માટે આ ફોર્મ ભરો. જે વસ્તુ બાકી હશે તે અમે તમારા સુધી પહોંચાડીશું.",
      demoMode: "ડેમો મોડ: Google Sheet હજુ જોડાયેલ નથી, ડેટા સેવ થશે નહીં.",
      draftRestored: "તમે અગાઉ ભરેલી માહિતી પાછી લાવવામાં આવી છે.",

      secStudent: "વિદ્યાર્થીની વિગતો",
      medium: "માધ્યમ",
      mediumGu: "ગુજરાતી માધ્યમ",
      mediumEn: "અંગ્રેજી માધ્યમ",
      name: "વિદ્યાર્થીનું પૂરું નામ",
      namePh: "દા.ત. પ્રજાપતિ રાહુલ મહેશભાઈ",
      mobile: "મોબાઇલ નંબર (WhatsApp)",
      mobilePh: "10 અંકનો મોબાઇલ નંબર",
      altMobile: "બીજો મોબાઇલ નંબર",
      optional: "(જો હોય તો)",

      secAddress: "સરનામું",
      city: "શહેર / ગામ",
      cityRajkot: "રાજકોટ",
      cityMorbi: "મોરબી",
      cityThangadh: "થાનગઢ",
      cityOther: "અન્ય",
      cityOtherLabel: "શહેર / ગામનું નામ લખો",
      address: "પૂરું સરનામું",
      addressPh: "ઘર નં., સોસાયટી, વિસ્તાર, લેન્ડમાર્ક",
      pincode: "પિનકોડ",

      secCategory: "શ્રેણી",
      categoryQ: "તમને કઈ શ્રેણીમાં સન્માન મળ્યું?",
      catSchool: "ધોરણ 1 થી 12",
      catCollege: "કોલેજ ડિગ્રી કોર્સ",
      catAchievement: "અન્ય સિદ્ધિ",
      standard: "ધોરણ",
      selectStd: "ધોરણ પસંદ કરો",
      stdPrefix: "ધોરણ ",
      board: "બોર્ડ",
      boardGsebGu: "GSEB – ગુજરાતી માધ્યમ",
      boardGsebEn: "GSEB – અંગ્રેજી માધ્યમ",
      boardOther: "અન્ય બોર્ડ (CBSE / ICSE)",
      course: "કોર્સનું નામ",
      coursePh: "દા.ત. B.Com, B.Sc, B.E., MBBS",
      college: "કોલેજ / સંસ્થાનું નામ",
      achievement: "સિદ્ધિની વિગત",
      achievementPh: "દા.ત. રાજ્ય કક્ષાની રમતગમત સ્પર્ધામાં પ્રથમ ક્રમ",

      secItems: "મળેલી વસ્તુઓ",
      itemsHelp: "દરેક વસ્તુ માટે જણાવો કે તમને મળી છે કે નહીં.",
      giftKit: "ગિફ્ટ કિટ",
      memento: "મોમેન્ટો શિલ્ડ",
      certificate: "પ્રમાણપત્ર (સર્ટિફિકેટ)",
      medal: "મેડલ",
      received: "મળી ગયું",
      notReceived: "નથી મળ્યું",

      secDelivery: "બાકી વસ્તુઓ કેવી રીતે મેળવશો?",
      pendingLabel: "બાકી વસ્તુઓ:",
      delRelative: "રાજકોટમાં રહેતા સંબંધીને આપો",
      delHome: "મારા ઘરના સરનામે મોકલો",
      delSelf: "હું જાતે આવીને લઈ જઈશ",
      delHomeNote: "વસ્તુઓ ઉપર આપેલા સરનામે મોકલવામાં આવશે.",
      delSelfNote: "લેવા આવવાનું સ્થળ અને સમય અમે ફોન / WhatsApp દ્વારા જણાવીશું.",
      relativeName: "સંબંધીનું નામ",
      relativeMobile: "સંબંધીનો મોબાઇલ નંબર",
      relativeAddress: "સંબંધીનું રાજકોટનું સરનામું",
      committeeNote: "નોંધ: વિતરણની અંતિમ પદ્ધતિ અને સમય સમિતિની અનુકૂળતા મુજબ નક્કી થશે.",

      remarks: "અન્ય નોંધ",
      remarksPh: "કંઈ કહેવું હોય તો અહીં લખો",
      declare: "હું ખાતરી આપું છું કે ઉપર આપેલી માહિતી સાચી છે.",
      submit: "ફોર્મ સબમિટ કરો",
      submitting: "સબમિટ થઈ રહ્યું છે...",

      errRequired: "આ માહિતી જરૂરી છે",
      errChoose: "કૃપા કરીને એક વિકલ્પ પસંદ કરો",
      errMobile: "સાચો 10 અંકનો મોબાઇલ નંબર લખો",
      errPincode: "સાચો 6 અંકનો પિનકોડ લખો",
      errShort: "કૃપા કરીને પૂરી માહિતી લખો",
      errDeclare: "આગળ વધવા માટે ખાતરી આપો",
      errForm: "કૃપા કરીને લાલ રંગમાં દર્શાવેલી માહિતી સુધારો",
      errSubmit: "ફોર્મ મોકલી શકાયું નથી. ઇન્ટરનેટ ચેક કરીને ફરી પ્રયાસ કરો. તમારી માહિતી સચવાયેલી છે.",

      successTitle: "આભાર! તમારું ફોર્મ મળી ગયું છે.",
      refLabel: "તમારો રેફરન્સ નંબર",
      successPending: "બાકી વસ્તુઓ",
      successDelivery: "વિતરણ પદ્ધતિ",
      successNone: "તમને બધી વસ્તુઓ મળી ગઈ છે. કંઈ બાકી નથી. 🎉",
      successContact: "અમારી ટીમ ટૂંક સમયમાં તમારો સંપર્ક કરશે.",
      screenshotTip: "કૃપા કરીને આ સ્ક્રીનનો સ્ક્રીનશોટ લઈ રાખો.",
      another: "બીજા વિદ્યાર્થીનું ફોર્મ ભરો",
      helpline: "મદદ માટે સંપર્ક:"
    },
    en: {
      pageTitle: "Oscar Award 2026 – Student Form",
      orgName: "Samast Variya Prajapati Shikshan Samiti presents",
      eventName: "Oscar Award 2026",
      eventDate: "4 October 2026",
      eventPlace: "Rajkot",
      footer: "Samast Variya Prajapati Shikshan Samiti",
      formPurpose: "Please fill this form to tell us which items you received at the event. We will deliver any pending items to you.",
      demoMode: "Demo mode: Google Sheet is not connected yet, data will NOT be saved.",
      draftRestored: "Your previously entered details have been restored.",

      secStudent: "Student Details",
      medium: "Medium",
      mediumGu: "Gujarati Medium",
      mediumEn: "English Medium",
      name: "Student's Full Name",
      namePh: "e.g. Prajapati Rahul Maheshbhai",
      mobile: "Mobile Number (WhatsApp)",
      mobilePh: "10-digit mobile number",
      altMobile: "Alternate Mobile Number",
      optional: "(optional)",

      secAddress: "Address",
      city: "City / Village",
      cityRajkot: "Rajkot",
      cityMorbi: "Morbi",
      cityThangadh: "Thangadh",
      cityOther: "Other",
      cityOtherLabel: "Enter city / village name",
      address: "Full Address",
      addressPh: "House no., society, area, landmark",
      pincode: "Pincode",

      secCategory: "Category",
      categoryQ: "In which category were you felicitated?",
      catSchool: "Std 1 to 12",
      catCollege: "College Degree Course",
      catAchievement: "Other Achievement",
      standard: "Standard",
      selectStd: "Select standard",
      stdPrefix: "Std ",
      board: "Board",
      boardGsebGu: "GSEB – Gujarati Medium",
      boardGsebEn: "GSEB – English Medium",
      boardOther: "Other Board (CBSE / ICSE)",
      course: "Course Name",
      coursePh: "e.g. B.Com, B.Sc, B.E., MBBS",
      college: "College / Institute Name",
      achievement: "Achievement Details",
      achievementPh: "e.g. 1st rank in state-level sports competition",

      secItems: "Items Received",
      itemsHelp: "For each item, tell us whether you received it.",
      giftKit: "Gift Kit",
      memento: "Memento Shield",
      certificate: "Certificate",
      medal: "Medal",
      received: "Received",
      notReceived: "Not Received",

      secDelivery: "How should we deliver pending items?",
      pendingLabel: "Pending items:",
      delRelative: "Give to my relative in Rajkot",
      delHome: "Send to my home address",
      delSelf: "I will collect it myself",
      delHomeNote: "Items will be sent to the address given above.",
      delSelfNote: "We will inform you of the collection place and time by phone / WhatsApp.",
      relativeName: "Relative's Name",
      relativeMobile: "Relative's Mobile Number",
      relativeAddress: "Relative's Address in Rajkot",
      committeeNote: "Note: The final mode and time of delivery will be decided by the committee as per convenience.",

      remarks: "Remarks",
      remarksPh: "Anything else you want to tell us",
      declare: "I confirm that the above information is correct.",
      submit: "Submit Form",
      submitting: "Submitting...",

      errRequired: "This field is required",
      errChoose: "Please select an option",
      errMobile: "Enter a valid 10-digit mobile number",
      errPincode: "Enter a valid 6-digit pincode",
      errShort: "Please enter complete details",
      errDeclare: "Please confirm to continue",
      errForm: "Please correct the fields marked in red",
      errSubmit: "Could not submit. Check your internet and try again. Your answers are saved.",

      successTitle: "Thank you! Your form has been received.",
      refLabel: "Your reference number",
      successPending: "Pending items",
      successDelivery: "Delivery method",
      successNone: "You have received all items. Nothing is pending. 🎉",
      successContact: "Our team will contact you soon.",
      screenshotTip: "Please take a screenshot of this screen.",
      another: "Fill form for another student",
      helpline: "For help call:"
    }
  };

  // Stored (English) values -> text key, used on the success screen
  var DELIVERY_KEYS = {
    "Relative in Rajkot": "delRelative",
    "Home Delivery": "delHome",
    "Self Collect": "delSelf"
  };

  // ---------------------------------------------------------------
  //  Helpers
  // ---------------------------------------------------------------
  var form = document.getElementById("form");
  var lang = "gu";

  function $(id) { return document.getElementById(id); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function t(key) { return I18N[lang][key] || I18N.en[key] || key; }
  function val(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el.type === "checkbox") return el.checked ? "yes" : "";
    return String(el.value || "").trim();
  }
  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var toastTimer;
  function toast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 5000);
  }

  // ---------------------------------------------------------------
  //  Language
  // ---------------------------------------------------------------
  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.title = t("pageTitle");
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });

    // Standard dropdown 1..12
    var sel = $("standard");
    var current = sel.value;
    var html = '<option value="">' + t("selectStd") + "</option>";
    for (var i = 1; i <= 12; i++) html += '<option value="' + i + '">' + t("stdPrefix") + i + "</option>";
    sel.innerHTML = html;
    sel.value = current;

    // Re-translate any visible error messages
    $$(".err[data-key]").forEach(function (el) { el.textContent = t(el.dataset.key); });
    updateConditional();
  }

  function langForMedium(m) { return m === "English Medium" ? "en" : "gu"; }

  // ---------------------------------------------------------------
  //  Show / hide parts of the form
  // ---------------------------------------------------------------
  function pendingItems() {
    return ITEMS.filter(function (i) { return val(i) === "Not Received"; });
  }

  function updateConditional() {
    $("cityOtherWrap").hidden = val("city") !== "Other";

    var cat = val("category");
    $("schoolFields").hidden = cat !== "Std 1 to 12";
    $("collegeFields").hidden = cat !== "College Degree Course";
    $("achievementFields").hidden = cat !== "Other Achievement";

    var pending = pendingItems();
    $("deliveryCard").hidden = pending.length === 0;
    $("pendingList").textContent = pending.map(t).join(", ");

    var d = val("delivery");
    $("relativeFields").hidden = d !== "Relative in Rajkot";
    $("homeNote").hidden = d !== "Home Delivery";
    $("selfNote").hidden = d !== "Self Collect";
  }

  // ---------------------------------------------------------------
  //  Validation
  // ---------------------------------------------------------------
  var RULES = [
    { name: "medium", req: true, empty: "errChoose" },
    { name: "name", req: true, min: 3 },
    { name: "mobile", req: true, re: PHONE, msg: "errMobile" },
    { name: "altMobile", re: PHONE, msg: "errMobile" },
    { name: "city", req: true, empty: "errChoose" },
    { name: "cityOther", req: true, min: 2 },
    { name: "address", req: true, min: 10 },
    { name: "pincode", re: /^\d{6}$/, msg: "errPincode" },
    { name: "category", req: true, empty: "errChoose" },
    { name: "standard", req: true, empty: "errChoose" },
    { name: "board", req: true, empty: "errChoose" },
    { name: "course", req: true, min: 2 },
    { name: "achievement", req: true, min: 3 },
    { name: "giftKit", req: true, empty: "errChoose" },
    { name: "memento", req: true, empty: "errChoose" },
    { name: "certificate", req: true, empty: "errChoose" },
    { name: "medal", req: true, empty: "errChoose" },
    { name: "delivery", req: true, empty: "errChoose" },
    { name: "relativeName", req: true, min: 2 },
    { name: "relativeMobile", req: true, re: PHONE, msg: "errMobile" },
    { name: "relativeAddress", req: true, min: 10 },
    { name: "declare", req: true, empty: "errDeclare" }
  ];

  function firstInput(name) {
    var el = form.elements[name];
    return el && el.length && !el.tagName ? el[0] : el; // RadioNodeList -> first radio
  }

  function setError(field, key) {
    var err = field.querySelector(".err");
    if (key) {
      field.classList.add("invalid");
      err.dataset.key = key;
      err.textContent = t(key);
    } else {
      field.classList.remove("invalid");
      delete err.dataset.key;
      err.textContent = "";
    }
  }

  function checkRule(rule) {
    var input = firstInput(rule.name);
    if (!input) return true;
    var field = input.closest(".field");
    if (input.closest("[hidden]")) { setError(field, null); return true; }

    var v = val(rule.name);
    var key = null;
    if (!v) {
      if (rule.req) key = rule.empty || "errRequired";
    } else if (rule.re && !rule.re.test(v)) {
      key = rule.msg;
    } else if (rule.min && v.length < rule.min) {
      key = "errShort";
    }
    setError(field, key);
    return !key;
  }

  function validateAll() {
    var firstBad = null;
    RULES.forEach(function (r) {
      if (!checkRule(r) && !firstBad) firstBad = firstInput(r.name).closest(".field");
    });
    if (firstBad) {
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      toast(t("errForm"));
      return false;
    }
    return true;
  }

  // Re-check a field as soon as the user fixes it
  function revalidate(name) {
    RULES.forEach(function (r) {
      if (r.name !== name) return;
      var f = firstInput(name).closest(".field");
      if (f.classList.contains("invalid")) checkRule(r);
    });
  }

  // ---------------------------------------------------------------
  //  Draft (auto-save so nothing is lost if the page closes)
  // ---------------------------------------------------------------
  function saveDraft() {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name === "website") return;
      if (el.type === "radio") { if (el.checked) data[el.name] = el.value; }
      else if (el.type === "checkbox") data[el.name] = el.checked;
      else data[el.name] = el.value;
    });
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (e) { /* private mode */ }
  }

  function loadDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (e) { return null; }
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
  }

  function fillForm(data) {
    Object.keys(data).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var v = data[name];
      if (el.length && !el.tagName) {
        Array.prototype.forEach.call(el, function (r) { r.checked = r.value === v; });
      } else if (el.type === "checkbox") {
        el.checked = !!v;
      } else {
        el.value = v;
      }
    });
  }

  // ---------------------------------------------------------------
  //  Submit
  // ---------------------------------------------------------------
  function buildPayload() {
    var cat = val("category");
    var pending = pendingItems();
    var p = {
      submissionId: val("submissionId"),
      website: val("website"),
      language: lang,
      medium: val("medium"),
      name: val("name"),
      mobile: val("mobile"),
      altMobile: val("altMobile"),
      city: val("city") === "Other" ? "Other - " + val("cityOther") : val("city"),
      address: val("address"),
      pincode: val("pincode"),
      category: cat,
      standard: cat === "Std 1 to 12" ? val("standard") : "",
      board: cat === "Std 1 to 12" ? val("board") : "",
      course: cat === "College Degree Course" ? val("course") : "",
      college: cat === "College Degree Course" ? val("college") : "",
      achievement: cat === "Other Achievement" ? val("achievement") : "",
      remarks: val("remarks"),
      delivery: "",
      relativeName: "",
      relativeMobile: "",
      relativeAddress: ""
    };
    ITEMS.forEach(function (i) { p[i] = val(i); });
    if (pending.length) {
      p.delivery = val("delivery");
      if (p.delivery === "Relative in Rajkot") {
        p.relativeName = val("relativeName");
        p.relativeMobile = val("relativeMobile");
        p.relativeAddress = val("relativeAddress");
      }
    }
    return p;
  }

  function isConfigured() {
    return /^https:\/\/script\.google(usercontent)?\.com\//.test(CFG.SCRIPT_URL || "");
  }

  function send(payload) {
    if (!isConfigured()) {
      console.warn("DEMO MODE – SCRIPT_URL not set in config.js. Payload:", payload);
      return new Promise(function (res) { setTimeout(function () { res("DEMO-0000"); }, 700); });
    }
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 30000);
    // text/plain body avoids a CORS pre-flight, which Apps Script cannot answer
    return fetch(CFG.SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.json(); })
      .then(function (out) {
        if (!out || !out.ok) throw new Error((out && out.error) || "Server error");
        return out.ref;
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  function setBusy(busy) {
    var b = $("submitBtn");
    b.disabled = busy;
    b.textContent = t(busy ? "submitting" : "submit");
  }

  function showSuccess(ref, p) {
    $("refNo").textContent = ref;
    var pending = ITEMS.filter(function (i) { return p[i] === "Not Received"; });
    var html = '<div class="summary"><p><strong>' + escapeHtml(p.name) + "</strong> · " + escapeHtml(p.mobile) + "</p>";
    if (pending.length) {
      html += "<p><strong>" + t("successPending") + ":</strong> " + pending.map(t).join(", ") + "</p>";
      html += "<p><strong>" + t("successDelivery") + ":</strong> " + t(DELIVERY_KEYS[p.delivery]) + "</p>";
      html += "</div><p>" + t("successContact") + "</p>";
    } else {
      html += "<p>" + t("successNone") + "</p></div>";
    }
    $("successBody").innerHTML = html;
    form.hidden = true;
    $("draftBanner").hidden = true;
    $("success").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateAll()) return;
    var payload = buildPayload();
    setBusy(true);
    send(payload)
      .then(function (ref) {
        clearDraft();
        showSuccess(ref, payload);
      })
      .catch(function (err) {
        console.error(err);
        saveDraft();
        toast(t("errSubmit"));
      })
      .finally(function () { setBusy(false); });
  });

  // ---------------------------------------------------------------
  //  Events
  // ---------------------------------------------------------------
  function startForm(medium) {
    form.elements.medium.value = medium;
    if (!val("submissionId")) form.elements.submissionId.value = newId();
    applyLang(langForMedium(medium));
    $("gate").hidden = true;
    form.hidden = false;
    saveDraft();
    window.scrollTo({ top: 0 });
  }

  $$(".gate-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { startForm(btn.dataset.medium); });
  });

  // Keep only digits in phone / pincode boxes
  $$("input.phone, input.digits").forEach(function (el) {
    el.addEventListener("input", function () {
      var d = el.value.replace(/\D/g, "");
      if (d !== el.value) el.value = d;
    });
  });
  // Phone boxes accept up to 12 digits so "+91 98250 12345" / "098250 12345" can be typed;
  // the country code / leading 0 is removed when the user leaves the box.
  $$("input.phone").forEach(function (el) {
    el.addEventListener("change", function () {
      var d = el.value;
      if (d.length === 12 && d.indexOf("91") === 0) el.value = d.slice(2);
      else if (d.length === 11 && d.charAt(0) === "0") el.value = d.slice(1);
    });
  });

  form.addEventListener("change", function (e) {
    if (e.target.name === "medium") applyLang(langForMedium(e.target.value));
    updateConditional();
    revalidate(e.target.name);
    saveDraft();
  });
  form.addEventListener("input", function (e) {
    revalidate(e.target.name);
    saveDraft();
  });

  $("anotherBtn").addEventListener("click", function () {
    var medium = val("medium");
    form.reset();
    form.elements.submissionId.value = "";
    $$(".field.invalid").forEach(function (f) { setError(f, null); });
    $("success").hidden = true;
    startForm(medium);
  });

  // ---------------------------------------------------------------
  //  Start-up
  // ---------------------------------------------------------------
  $("demoBanner").hidden = isConfigured();
  if (CFG.HELPLINE) {
    $("helpline").hidden = false;
    $("helplineLink").textContent = CFG.HELPLINE;
    $("helplineLink").href = "tel:" + CFG.HELPLINE.replace(/[^\d+]/g, "");
  }

  var draft = loadDraft();
  if (draft && draft.medium) {
    fillForm(draft);
    $("draftBanner").hidden = !draft.name;
    applyLang(langForMedium(draft.medium));
    // applyLang rebuilt the dropdown, so put the saved standard back
    if (draft.standard) form.elements.standard.value = draft.standard;
    $("gate").hidden = true;
    form.hidden = false;
  } else {
    applyLang("gu");
  }
})();
