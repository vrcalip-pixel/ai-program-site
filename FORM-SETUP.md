# Setting up the request-info form (about five minutes)

The form at `/request-info` posts to a Google Apps Script attached to a Google Sheet. The script appends each submission to the sheet and emails you. Until the script is deployed, the form still works: it opens the visitor's email app with the message prefilled.

Do this signed in to the Google account that should own the sheet. (Interim: personal account. Later: a school-facing account; moving is just repeating these steps there and pasting the new URL.)

## 1. Create the sheet and script

1. Go to https://sheets.new and name the sheet something like **AI program · request-info**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the placeholder code and paste the whole contents of `scripts/apps-script/Code.gs`.
4. At the top of the script, check the three settings:
   - `NOTIFY_TO`: the address that should receive each submission (your work email).
   - `SITE_TOKEN`: must match `form.token` in `src/data/program.json`. Change both if you change one.
   - `AUTO_REPLY`: `true` if senders should get an automatic acknowledgement.
5. Save (the disk icon or Ctrl/Cmd+S).

## 2. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**. ("Anyone" is required so the public site can post to it; the token, honeypot and timing check filter bots.)
4. Click **Deploy**. Google will ask you to authorize the script to use Sheets and send mail as you. Approve it. If you see "Google hasn't verified this app", click **Advanced → Go to … (unsafe)**; that warning appears for every personal script.
5. Copy the **Web app URL** (it ends in `/exec`).

Paste that URL into a browser tab. You should see `{"ok":true,"service":"request-info",…}`.

## 3. Connect the site

1. In `src/data/program.json`, set `form.endpoint` to the Web app URL.
2. Commit and push. The site redeploys in about a minute.
3. Submit a test on the live form. A row should appear in the sheet and an email should arrive.

## Changing the script later

Editing `Code.gs` in the Apps Script editor is not enough on its own: after saving, go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.

## Limits and notes

- A personal Google account can send about 100 emails a day from Apps Script; a Google Workspace account about 1,500. Plenty for this form.
- The sheet holds names, emails and free-text messages. Keep it in the account you'd be comfortable showing to the college, and move it to the school-facing account when that exists.
- Spam: the token is visible in the site's code, so it stops generic bots, not a determined person. If junk gets through, the next steps are a stricter timing threshold in the script or reCAPTCHA on the page.
