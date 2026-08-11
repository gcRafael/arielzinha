const SPREADSHEET_ID = '1asEXBa225YLaeo4Iy9qBmM08V1J6Vn8EdqLwDxPeWe0';
const SHEET_NAME = 'Respostas';

function doPost(e) {
  try {
    const sheet = getResponseSheet_();
    const p = e && e.parameter ? e.parameter : {};

    const nome = clean_(p.nome);
    const adultos = toNumber_(p.adultos);
    const criancas = toNumber_(p.criancas);
    const whatsapp = clean_(p.whatsapp);
    const presenca = clean_(p.presenca);
    const mensagem = clean_(p.mensagem);

    if (!nome || !whatsapp || !presenca) {
      return json_({
        success: false,
        error: 'Campos obrigatórios ausentes.'
      });
    }

    LockService.getScriptLock().waitLock(10000);

    try {
      sheet.appendRow([
        new Date(),
        nome,
        adultos,
        criancas,
        whatsapp,
        presenca,
        mensagem
      ]);
    } finally {
      LockService.getScriptLock().releaseLock();
    }

    return json_({
      success: true,
      message: 'Presença registrada com sucesso!'
    });

  } catch (error) {
    return json_({
      success: false,
      error: String(error)
    });
  }
}

function doGet() {
  return json_({
    success: true,
    message: 'Arielzinha RSVP API funcionando.'
  });
}

function getResponseSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Data/Hora',
      'Nome',
      'Adultos',
      'Crianças',
      'WhatsApp',
      'Presença',
      'Mensagem'
    ]);

    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function clean_(value) {
  let text = String(value == null ? '' : value).trim();

  // Evita que alguém consiga inserir uma fórmula na planilha através do formulário.
  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  return text;
}

function toNumber_(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.floor(number);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
