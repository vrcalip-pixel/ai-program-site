/**
 * Request-info form backend for the AI for Digital Transformation site.
 * Lives in a Google Apps Script project bound to a Google Sheet. See FORM-SETUP.md.
 *
 * What it does on each submission:
 *   1. Rejects bots: wrong token, filled honeypot, or submitted in under 3 seconds.
 *   2. Appends one row to the "Submissions" sheet.
 *   3. Emails NOTIFY_TO with the message, reply-to set to the sender.
 *   4. Optionally sends the sender a short acknowledgement (AUTO_REPLY).
 */

var NOTIFY_TO = 'vcalip@lbcc.edu';           // where notifications go
var SITE_TOKEN = 'aidt-site-2026';           // must match "form.token" in src/data/program.json
var SHEET_NAME = 'Submissions';
var AUTO_REPLY = false;                      // set true to acknowledge the sender automatically
var PROGRAM = 'A.S. in AI for Digital Transformation · Long Beach City College';

var HEADERS = ['Timestamp', 'Role', 'Name', 'Email', 'Organization / office', 'Interest', 'Topic', 'Message', 'Page'];

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents || '{}');
    if (d.token !== SITE_TOKEN) return json_({ ok: false, reason: 'token' });
    if (d.website) return json_({ ok: false, reason: 'honeypot' });
    if (Number(d.elapsed || 0) < 3000) return json_({ ok: false, reason: 'too fast' });
    if (!d.name || !d.email || !d.message) return json_({ ok: false, reason: 'missing fields' });

    var row = [
      new Date(),
      d.roleLabel || d.role || '',
      String(d.name).slice(0, 200),
      String(d.email).slice(0, 200),
      d.organization || d.office || '',
      d.interest || '',
      d.topicLabel || '',
      String(d.message).slice(0, 5000),
      d.page || ''
    ];

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
    sh.appendRow(row);

    var subject = 'AI program · ' + row[1] + (row[6] ? ' · ' + row[6] : '') + ' · ' + row[2];
    var body = [
      'New request-info submission',
      '',
      'Role: ' + row[1],
      row[4] ? 'Organization / office: ' + row[4] : null,
      row[5] ? 'Interest: ' + row[5] : null,
      row[6] ? 'Topic: ' + row[6] : null,
      'Name: ' + row[2],
      'Email: ' + row[3],
      '',
      row[7],
      '',
      'Sent from: ' + row[8],
      'Sheet: ' + ss.getUrl()
    ].filter(function (l) { return l !== null; }).join('\n');

    MailApp.sendEmail({ to: NOTIFY_TO, replyTo: row[3], subject: subject, body: body });

    if (AUTO_REPLY) {
      MailApp.sendEmail({
        to: row[3],
        subject: 'We got your message · ' + PROGRAM,
        body: 'Hi ' + row[2] + ',\n\nThanks for getting in touch about the ' + PROGRAM + '. Your message has reached the program lead, who will reply by email, usually within a few working days.\n\nYour message:\n' + row[7]
      });
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Visiting the deployment URL in a browser confirms it is alive.
function doGet() {
  return json_({ ok: true, service: 'request-info', program: PROGRAM });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
