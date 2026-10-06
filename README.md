# Oscar Award 2026 – Student Pending Items Form

**સમસ્ત વરિયા પ્રજાપતિ શિક્ષણ સમિતિ આયોજિત ઓસ્કર એવોર્ડ 2026** · 4 October 2026 · Rajkot

This is a mobile-first form (Gujarati + English). Students use it to say which items they received
(Gift Kit, Memento Shield, Certificate, Medal). If anything is pending, they choose how to get it:
through a relative in Rajkot, by home delivery, or by collecting it themselves.
All answers go into a **Google Sheet**, which also works as your dispatch tracker.

```
public/                 ← the website (upload this folder to Cloudflare)
  index.html, style.css, app.js
  config.js             ← the ONLY file you edit (paste the Google link here)
google-apps-script/
  Code.gs               ← paste this into Google Sheets → Apps Script
```

Setup takes about 15 minutes and needs no coding. Follow the 3 steps in order.

---

## STEP 1 – Create the Google Sheet (database)

1. Go to <https://sheets.google.com> and create a **Blank spreadsheet**.
   Name it `Oscar Award 2026 – Pending Items`.
2. Click the menu **Extensions → Apps Script**. A new tab opens.
3. Delete everything in the editor. Open the file `google-apps-script/Code.gs` from this project
   in Notepad, copy **all** of it and paste it into the editor. Click the 💾 **Save** icon.
4. In the toolbar's function dropdown (next to "Debug"), choose **`setup`** and click **▶ Run**.
   - Google asks for permission: **Review permissions** → choose your account →
     **Advanced** → **Go to … (unsafe)** → **Allow**.
     (It says "unsafe" only because you wrote the script yourself. It's safe.)
   - Go back to the Sheet tab. You'll now see 3 sheets: **Responses**, **Pending Dispatch**, **Summary**.
5. Back in Apps Script, click **Deploy → New deployment**.
   - Click the ⚙️ next to "Select type" → **Web app**.
   - Description: `Form v1`
   - Execute as: **Me**
   - Who has access: **Anyone** ← important
   - Click **Deploy** and copy the **Web app URL** (ends with `/exec`).

## STEP 2 – Connect the form to the Sheet

Open `public/config.js` in Notepad and paste the URL between the quotes:

```js
SCRIPT_URL: "https://script.google.com/macros/s/AKfy....../exec",
HELPLINE: "98250 12345",   // optional – shown at the bottom of the form
```

Save the file.

> Until you do this, the form runs in **Demo mode**: a yellow banner shows and nothing is saved.

## STEP 3 – Put the form online (Cloudflare Pages, free)

1. Sign up or log in at <https://dash.cloudflare.com>.
2. Go to **Workers & Pages → Create → Pages → Upload assets**
   (the option is called "Drag and drop your files").
3. Project name: e.g. `oscar-award-2026`, then click **Create project**.
4. Drag the **`public` folder** onto the upload box and click **Deploy site**.
5. Your link will be something like **`https://oscar-award-2026.pages.dev`**.
   Open it on your phone and submit one test entry. It should appear in the **Responses** sheet.

Share the link on WhatsApp groups. For printed notices, make a QR code of the link with any free
QR generator.

**To update the site later** (for example, after changing `config.js`): Cloudflare → your project →
**Create new deployment** → drag the `public` folder again.

*(Optional: if you prefer GitHub, upload this whole folder to a GitHub repository. Then in Cloudflare choose
**Pages → Connect to Git**, pick the repo, leave the build command empty and set the output directory to `public`.
Every change you commit on GitHub then goes live automatically.)*

---

## Using the Google Sheet (for the committee)

| Sheet | What it is |
|---|---|
| **Responses** | Every form submission, one row per student. **Dispatch Status** has a dropdown: `Pending → Ready → Dispatched → Delivered / Collected`. When you set Dispatched, Delivered or Collected, **Dispatch Date** fills in automatically. Use **Admin Notes** for anything else. |
| **Pending Dispatch** | Your daily working list: only the students whose items are not yet delivered or collected, grouped by delivery method and city. It updates automatically. Don't type in this sheet. |
| **Summary** | Live counts: total forms, pending per item (how many medals, certificates and so on to pack), by delivery method, status, city, category and medium. |

Things that happen automatically:
- Every form gets a **reference number** like `OA26-0007`, which the student sees on screen.
- If the same student (same name + mobile) submits twice, the second row is highlighted yellow
  in **Possible Duplicate Of**.
- "Not Received" items show in **red** and status cells are colour-coded.
- If a student received everything, the status is set to **Nothing Pending**.

**Don't** rename the "Responses" sheet, or rename, reorder or insert columns before the last one.
You can freely add new columns **after** the last column, and you can sort or filter.

## Features of the form
- Asks for the **medium** first and shows the whole form in **Gujarati or English** to match.
- Large, thumb-friendly buttons. Works on any phone browser.
- Questions appear only when needed: Std/Board for school, Course for college,
  Delivery options only if something is pending, Relative details only if "Relative in Rajkot" is chosen.
- Checks mobile numbers (10 digits; "+91" or a leading "0" is removed automatically) and pincode.
- **Auto-save**: if the student closes the page or the internet drops, their answers are still
  there when they come back. If submitting fails, they can just tap Submit again (no duplicate row is created).
- A "Fill form for another student" button for parents with more than one child.
- A hidden spam trap blocks bots.

## If you change the Apps Script code later
Paste the new code → Save → **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
The URL stays the same, so you don't need to change `config.js`.

## Troubleshooting
| Problem | Fix |
|---|---|
| Yellow "Demo mode" banner on the live site | `SCRIPT_URL` in `config.js` is empty or wrong. Fix it and upload `public` again. |
| "Could not submit" message | Check that the deployment has **Who has access: Anyone**. Open the `/exec` URL in a browser; it should say *"…backend is running."* |
| Mobile numbers show as `9.88E+09` | Shouldn't happen (they're saved as text). If it does, select the column → Format → Number → Plain text. |
| Pending Dispatch sheet shows `#N/A` | It means no pending students yet. It fills in once data arrives. |
