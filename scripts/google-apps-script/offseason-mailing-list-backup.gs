const SHEET_ID = '1qDSnZSG0K6X6aWs9U8cqNJr8-NiZwvME6CoAOfhAcWo';
const SHEET_NAME = 'OFFSEASON Mailing List';
const SHARED_SECRET = 'OS0PfK6Sd2VgbpTSR7RjX6Kg0cx7zmcdYBAibFIFY4k';

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    const headerSecret =
      (e && e.parameter && e.parameter.secret) ||
      (body && body.token) ||
      '';

    if (SHARED_SECRET && headerSecret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const kind = String(body.kind || '').trim();
    const email = String(body.email || '').trim();

    if (!kind || !email) {
      return jsonResponse({ ok: false, error: 'Missing required fields' }, 400);
    }

    const sheet = getOrCreateSheet_();
    ensureHeader_(sheet);

    sheet.appendRow([
      body.submittedAt || new Date().toISOString(),
      kind,
      email,
      body.name || '',
      body.company || '',
      body.message || '',
      body.source || 'website',
      body.userAgent || ''
    ]);

    return jsonResponse({ ok: true }, 200);
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error && error.message ? error.message : 'Unknown script error'
      },
      500
    );
  }
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const existing = spreadsheet.getSheetByName(SHEET_NAME);
  if (existing) return existing;
  return spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    'submittedAt',
    'kind',
    'email',
    'name',
    'company',
    'message',
    'source',
    'userAgent'
  ]);
}

function jsonResponse(obj, statusCode) {
  // Apps Script does not allow setting HTTP status directly in ContentService responses.
  // We include an explicit status code in payload for easier debugging.
  if (typeof statusCode === 'number') {
    obj.status = statusCode;
  }
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
