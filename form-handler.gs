/**
 * AI Innovators — form handler
 * ---------------------------------------------------------------
 * Receives submissions from the website's native forms and appends
 * them to a Google Sheet. No third-party service involved: the data
 * goes straight from the page into a Sheet you own.
 *
 * SETUP (about 5 minutes)
 * 1. Create a Google Sheet in the LBCC/project Google Drive.
 *    Name it something like "AI Innovators — Interest List".
 * 2. In that Sheet: Extensions > Apps Script.
 * 3. Delete the placeholder code, paste this file in, and save.
 * 4. Deploy > New deployment > type "Web app".
 *      Execute as:        Me
 *      Who has access:    Anyone
 *    ("Anyone" is required for the website to post to it. The script
 *    only ever appends rows — it never reads or returns sheet data.)
 * 5. Copy the Web app URL it gives you.
 * 6. Paste that URL into FORM_ENDPOINT at the top of main.js.
 *
 * Each form gets its own tab, created automatically on first
 * submission: "interest", "referral", "partner".
 * ---------------------------------------------------------------
 */

// Optional: paste your Sheet ID here to be explicit. Leave blank when
// the script is bound to the Sheet (Extensions > Apps Script).
var SHEET_ID = '';

// Only accept submissions from forms we know about.
var ALLOWED_FORMS = ['interest', 'referral', 'partner'];

function doPost(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var formName = params._form || 'interest';

    if (ALLOWED_FORMS.indexOf(formName) === -1) {
      return json({ ok: false, error: 'unknown form' });
    }

    // Honeypot — silently accept and discard.
    if (params._website) {
      return json({ ok: true });
    }

    var book = SHEET_ID
      ? SpreadsheetApp.openById(SHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    var sheet = book.getSheetByName(formName) || book.insertSheet(formName);

    // Build the header row from the field names on first write.
    var keys = Object.keys(params).filter(function (k) { return k !== '_form'; });
    keys.sort();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(keys);
      sheet.getRange(1, 1, 1, keys.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Align to the existing header so columns stay stable over time.
    var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = header.map(function (h) { return params[h] || ''; });

    // Any new field not yet in the header gets appended as a new column.
    keys.forEach(function (k) {
      if (header.indexOf(k) === -1) {
        sheet.getRange(1, header.length + 1).setValue(k).setFontWeight('bold');
        header.push(k);
        row.push(params[k]);
      }
    });

    sheet.appendRow(row);
    return json({ ok: true });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// A GET returns nothing useful — the endpoint is write-only by design.
function doGet() {
  return json({ ok: true, message: 'AI Innovators form endpoint' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
