// Plantilla correctora digital — © 2025 Juan José de Haro
// Código con licencia AGPL v3: ver LICENSE.txt
// Repositorio: https://github.com/jjdeharo/examen-digital-gas
const DEFAULT_ADMIN_TOKEN = 'CANVIA_AIXO';

const SHEET_NAMES = {
  CONFIG: 'Config',
  KEYS: 'Keys',
  SETTINGS: 'Settings'
};

const SHEET_HEADERS = {
  Config: ['exam_id', 'exam_name', 'n_questions', 'options', 'start_iso', 'end_iso', 'manual_state', 'shuffle_questions', 'shuffle_answers', 'enforce_fullscreen', 'grade_max', 'pass_threshold', 'penalize_wrong', 'penalty_value'],
  Keys: ['exam_id', 'key_json'],
  Submissions: ['timestamp', 'exam_id', 'student_code', 'answers_json', 'user_agent'],
  'Correcció': ['Data', 'Codi alumne', 'Encerts', 'Errors', 'En blanc', 'Nota (0-10)'],
  Settings: ['name', 'value']
};

const CONFIG_COLUMNS = {
  EXAM_ID: 1,
  EXAM_NAME: 2,
  N_QUESTIONS: 3,
  OPTIONS: 4,
  START_ISO: 5,
  END_ISO: 6,
  MANUAL_STATE: 7,
  SHUFFLE_QUESTIONS: 8,
  SHUFFLE_ANSWERS: 9,
  ENFORCE_FULLSCREEN: 10,
  GRADE_MAX: 11,
  PASS_THRESHOLD: 12,
  PENALIZE_WRONG: 13,
  PENALTY_VALUE: 14
};

const SETTINGS_KEYS = {
  ADMIN_TOKEN: 'admin_token',
  LAST_EXAM_ID: 'last_exam_id'
};

// ===== Minimal i18n support (ca/es) for user-facing text =====
function normalizeLang_(lang) {
  const raw = String(lang || '').toLowerCase();
  if (raw.indexOf('es') === 0) return 'es';
  if (raw.indexOf('ca') === 0) return 'ca';
  // Try Apps Script session locale as fallback
  try {
    const sess = (Session.getActiveUserLocale && Session.getActiveUserLocale()) || '';
    if (String(sess || '').toLowerCase().indexOf('es') === 0) return 'es';
  } catch (e) {}
  return 'ca';
}

function i18n_(lang) {
  const L = normalizeLang_(lang);
  const ca = {
    sheetCreated: "S'ha creat un document nou amb els resultats.",
    sheetCorrection: 'Correcció',
    sheetAnalysis: 'Anàlisi',
    examPrefix: 'Examen:',
    penaltyLabel: 'Penalització per incorrecta:',
    noPenalty: 'Sense penalització',
    qualifyOver: 'Qualificar sobre',
    passAtLeast: 'Aprovats: ≥',
    colDate: 'Data',
    colStudent: 'Codi alumne',
    colCorrect: 'Encerts',
    colWrong: 'Errors',
    colBlank: 'En blanc',
    colScorePrefix: 'Nota (',
    keyLabel: 'Clau',
    hQuestion: 'Pregunta',
    hResponses: 'Respostes',
    hCorrect: 'Encerts',
    hWrong: 'Incorrectes',
    hBlank: 'En blanc',
    hPercent: 'Percentatge',
    hStats: 'Estadístiques',
    hValue: 'Valor',
    hAvgCorrect: "Mitjana d'encerts",
    hHardest: 'Preguntes més difícils',
    hPercentCorrect: "Percentatge d'encerts",
    chartTitle: 'Correctes / Incorrectes / En blanc per pregunta',
    statusClosed: 'Tancat',
    statusPending: 'En espera',
    statusFinished: 'Finalitzat',
    statusOpen: 'Obert',
    statusOpenManual: 'Obert (manual)',
    statusClosedManual: 'Tancat (manual)',
    msgNoSchedule: "L'examen està tancat fins que defineixis una finestra d'obertura o el passis a mode manual.",
    blockNoSchedule: "L'examen està tancat perquè no hi ha horari definit.",
    msgOpensAt: 'Obertura programada per a',
    msgClosesAt: 'Es tancarà a',
    blockNotOpen: "L'examen encara no està obert.",
    msgFinishedAt: "L'examen va finalitzar a",
    blockFinished: "L'examen ja ha finalitzat.",
    msgOpen: 'Examen obert.',
    msgManualClosed: 'La prova està tancada i no admet respostes en aquest moment.',
    blockManualClosed: "L'examen està tancat manualment.",
    availableFrom: 'Disponible del',
    to: 'al',
    availableFromDate: 'Disponible a partir del',
    availableUntil: 'Disponible fins al',
    summaryPerQuestion: 'Resum per pregunta'
  };
  const es = {
    sheetCreated: 'Se ha creado un nuevo documento con los resultados.',
    sheetCorrection: 'Corrección',
    sheetAnalysis: 'Análisis',
    examPrefix: 'Examen:',
    penaltyLabel: 'Penalización por incorrecta:',
    noPenalty: 'Sin penalización',
    qualifyOver: 'Calificar sobre',
    passAtLeast: 'Aprobados: ≥',
    colDate: 'Fecha',
    colStudent: 'Código alumno',
    colCorrect: 'Aciertos',
    colWrong: 'Errores',
    colBlank: 'En blanco',
    colScorePrefix: 'Nota (',
    keyLabel: 'Clave',
    hQuestion: 'Pregunta',
    hResponses: 'Respuestas',
    hCorrect: 'Aciertos',
    hWrong: 'Incorrectas',
    hBlank: 'En blanco',
    hPercent: 'Porcentaje',
    hStats: 'Estadísticas',
    hValue: 'Valor',
    hAvgCorrect: 'Media de aciertos',
    hHardest: 'Preguntas más difíciles',
    hPercentCorrect: 'Porcentaje de aciertos',
    chartTitle: 'Aciertos / Errores / En blanco por pregunta',
    statusClosed: 'Cerrado',
    statusPending: 'En espera',
    statusFinished: 'Finalizado',
    statusOpen: 'Abierto',
    statusOpenManual: 'Abierto (manual)',
    statusClosedManual: 'Cerrado (manual)',
    msgNoSchedule: 'El examen está cerrado hasta que definas una ventana de apertura o lo pongas en modo manual.',
    blockNoSchedule: 'El examen está cerrado porque no hay horario definido.',
    msgOpensAt: 'Apertura programada para',
    msgClosesAt: 'Se cerrará a las',
    blockNotOpen: 'El examen aún no está abierto.',
    msgFinishedAt: 'El examen finalizó a las',
    blockFinished: 'El examen ya ha finalizado.',
    msgOpen: 'Examen abierto.',
    msgManualClosed: 'La prueba está cerrada y no admite respuestas en este momento.',
    blockManualClosed: 'El examen está cerrado manualmente.',
    availableFrom: 'Disponible del',
    to: 'al',
    availableFromDate: 'Disponible a partir del',
    availableUntil: 'Disponible hasta el',
    summaryPerQuestion: 'Resumen por pregunta'
  };
  return L === 'es' ? es : ca;
}

// Clau de propietats d'script per emmagatzemar l'ID del full principal
// S'utilitza a getSpreadsheet_ i funcions d'admin per vincular una fulla concreta
const SCRIPT_PROP_SPREADSHEET_ID = 'spreadsheet_id';

function doGet(e) {
  const params = (e && e.parameter) || {};
  const view = params.view || '';
  const examId = params.exam || '';
  // Nova regla: si no s'especifica cap examen, el panell per defecte és l'admin
  const serveAdmin = (!examId && view !== 'student') || view === 'admin';
  if (serveAdmin) {
    const template = HtmlService.createTemplateFromFile('Admin');
    template.view = 'admin';
    return template
      .evaluate()
      .setTitle("Panell del professorat")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  const template = HtmlService.createTemplateFromFile('Index');
  template.examId = examId;
  return template
    .evaluate()
    .setTitle("Lliurament d'examen")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getConfig(examId, lang) {
  ensureSheets_();
  if (!examId) {
    throw new Error("Falta l'identificador de l'examen.");
  }
  // Aplica transicions programades si escau perquè l'estat sigui immediat
  let config = getExamConfig_(examId);
  try { if (applyScheduledTransitionsIfDue_(config, new Date())) { config = getExamConfig_(examId); } } catch (e) {}
  const status = buildExamStatus_(config, new Date(), normalizeLang_(lang));
  return {
    examId: config.examId,
    nQuestions: config.nQuestions,
    options: config.options,
    startIso: config.startIso,
    endIso: config.endIso,
    manualState: config.manualState,
    shuffleQuestions: config.shuffleQuestions,
    shuffleAnswers: config.shuffleAnswers,
    enforceFullscreen: config.enforceFullscreen,
    acceptingSubmissions: status.isOpen,
    statusMessage: status.message
  };
}

function submitResponse(payload) {
  ensureSheets_();
  if (!payload || typeof payload !== 'object') {
    throw new Error('Sol·licitud incompleta.');
  }
  const examId = String(payload.examId || '').trim();
  if (!examId) {
    throw new Error('Falta el codi de l\'examen.');
  }

  // Aplica transicions programades si escau just abans de validar
  let config = getExamConfig_(examId);
  try { if (applyScheduledTransitionsIfDue_(config, new Date())) { config = getExamConfig_(examId); } } catch (e) {}

  const studentCode = String(payload.studentCode || '').trim();
  if (!studentCode) {
    throw new Error("Cal informar el codi de l'alumne.");
  }

  const answers = Array.isArray(payload.answers) ? payload.answers : [];
  if (answers.length !== config.nQuestions) {
    throw new Error('Nombre de respostes incorrecte.');
  }

  const normalizedAnswers = answers.map(ans => {
    const value = String(ans || '').toUpperCase();
    if (value && config.options.indexOf(value) === -1) {
      throw new Error('Resposta invàlida: ' + value);
    }
    return value;
  });

  const status = buildExamStatus_(config, new Date());
  if (!status.isOpen) {
    throw new Error(status.blockingMessage || "L'examen no està obert en aquest moment.");
  }

  const submissionsSheet = getOrCreateExamSheet_('Submissions', SHEET_HEADERS.Submissions, examId);
  submissionsSheet.appendRow([
    new Date(),
    examId,
    studentCode,
    JSON.stringify(normalizedAnswers),
    String(payload.userAgent || 'unknown')
  ]);

  return { saved: true };
}

function verifyAdminCode(code) {
  checkAdminCode_(code);
  return { ok: true };
}

function getAdminState(code, requestedExamId, lang) {
  checkAdminCode_(code);
  ensureSheets_();

  const configs = getAllExamConfigs_();
  const now = new Date();
  const exams = configs.map(cfg => ({
    examId: cfg.examId,
    examName: cfg.examName,
    nQuestions: cfg.nQuestions,
    manualState: cfg.manualState,
    status: buildExamStatus_(cfg, now, lang)
  }));

  let selectedExamId = '';
  if (requestedExamId && exams.some(item => item.examId === requestedExamId)) {
    selectedExamId = requestedExamId;
  } else if (exams.length) {
    selectedExamId = exams[0].examId;
  }

  const state = {
    exams: exams.map(item => ({
      examId: item.examId,
      examName: item.examName,
      label: buildExamLabel_(item)
    })),
    selectedExamId,
    config: null,
    status: null,
    keyPresent: false,
    keyError: '',
    keyValue: '',
    submissions: { total: 0, lastTimestamp: '' },
    configError: '',
    baseUrl: getBaseUrl_()
  };

  if (!selectedExamId) {
    state.configError = 'Encara no hi ha cap examen. Crea\'n un de nou.';
    return state;
  }

  // Aplica transicions programades si escau per a l'examen seleccionat
  let config = getExamConfig_(selectedExamId);
  try { if (applyScheduledTransitionsIfDue_(config, now)) { config = getExamConfig_(selectedExamId); } } catch (e) {}
  state.config = {
    examId: config.examId,
    examName: config.examName,
    nQuestions: config.nQuestions,
    options: config.options,
    optionsString: config.options.join(''),
    startIso: config.startIso,
    endIso: config.endIso,
    manualState: config.manualState,
    shuffleQuestions: config.shuffleQuestions,
    shuffleAnswers: config.shuffleAnswers,
    enforceFullscreen: config.enforceFullscreen,
    gradeMax: config.gradeMax,
    passThreshold: config.passThreshold,
    penalizeWrong: config.penalizeWrong,
    penaltyValue: config.penaltyValue
  };
  state.status = buildExamStatus_(config, now, lang);
  state.submissions = getSubmissionStatsForExam_(config.examId);

  try {
    const keyArray = getAnswerKey_(config.examId, config);
    state.keyPresent = true;
    state.keyValue = keyArray.join('');
  } catch (keyErr) {
    state.keyError = keyErr.message;
    state.keyValue = '';
  }

  return state;
}

function getSubmissionListForAdmin(code, examId) {
  checkAdminCode_(code);
  ensureSheets_();
  examId = String(examId || '').trim();
  if (!examId) {
    throw new Error('Selecciona un examen per veure els enviaments.');
  }
  // Assegura que s'apliquen transicions si escau
  let cfg = getExamConfig_(examId);
  if (applyScheduledTransitionsIfDue_(cfg, new Date())) {
    cfg = getExamConfig_(examId);
  }
  const rows = getExamSheetValues_('Submissions', SHEET_HEADERS.Submissions, examId);
  const tz = Session.getScriptTimeZone() || 'Europe/Madrid';
  const items = [];
  rows.forEach(row => {
    if (!sameExamId_(row[1], examId)) return;
    const ts = row[0] instanceof Date ? row[0] : new Date(row[0]);
    const code = String(row[2] || '').trim();
    items.push({
      timestamp: ts instanceof Date && !isNaN(ts.getTime()) ? ts.getTime() : 0,
      timestampStr: (ts instanceof Date && !isNaN(ts.getTime())) ? Utilities.formatDate(ts, tz, 'yyyy-MM-dd HH:mm:ss') : '',
      studentCode: code
    });
  });
  items.sort((a, b) => b.timestamp - a.timestamp);
  return {
    examId: cfg.examId,
    total: items.length,
    items: items
  };
}

function createExamForAdmin(code) {
  checkAdminCode_(code);
  ensureSheets_();
  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const examId = generateExamId_();
  const defaultRow = [examId, '', 10, 'ABCD', '', '', 'auto', false, false, true, 10, 5, false, 0.3333333333];
  sheet.appendRow(defaultRow);
  try {
    updateAllScheduleTriggers_();
  } catch (e) {}
  return getAdminState(code, examId);
}

function saveConfigForAdmin(code, payload) {
  checkAdminCode_(code);
  ensureSheets_();
  if (!payload) {
    throw new Error('Falten dades de configuració.');
  }

  const valid = validateConfigPayload_(payload);
  let examId = String(payload.examId || '').trim();
  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const values = sheet.getDataRange().getValues();

  if (!examId) {
    examId = generateExamId_();
    sheet.appendRow([
      examId,
      valid.examName,
      valid.nQuestions,
      valid.optionsString,
      valid.startIso,
      valid.endIso,
      valid.manualState,
      valid.shuffleQuestions,
      valid.shuffleAnswers,
      valid.enforceFullscreen,
      valid.gradeMax,
      valid.passThreshold,
      false, // penalize_wrong (es manté via botó específic)
      0      // penalty_value
    ]);
    return getAdminState(code, examId);
  }

  let updated = false;
  for (let i = 1; i < values.length; i++) {
    if (sameExamId_(values[i][0], examId)) {
      // conserva penalització existent a les columnes 13-14
      const existingPenalize = !!values[i][CONFIG_COLUMNS.PENALIZE_WRONG - 1];
      const existingPenalty = Number(values[i][CONFIG_COLUMNS.PENALTY_VALUE - 1]) || 0;
      sheet.getRange(i + 1, 1, 1, SHEET_HEADERS.Config.length).setValues([
        [
          examId,
          valid.examName,
          valid.nQuestions,
          valid.optionsString,
          valid.startIso,
          valid.endIso,
          valid.manualState,
          valid.shuffleQuestions,
          valid.shuffleAnswers,
          valid.enforceFullscreen,
          valid.gradeMax,
          valid.passThreshold,
          existingPenalize,
          existingPenalty
        ]
      ]);
      updated = true;
      break;
    }
  }
  if (!updated) {
    sheet.appendRow([
      examId,
      valid.examName,
      valid.nQuestions,
      valid.optionsString,
      valid.startIso,
      valid.endIso,
      valid.manualState,
      valid.shuffleQuestions,
      valid.shuffleAnswers,
      valid.enforceFullscreen,
      valid.gradeMax,
      valid.passThreshold,
      false,
      0
    ]);
  }
  try {
    updateAllScheduleTriggers_();
  } catch (e) {
    // no bloqueja el desat si hi ha un error en triggers
  }
  return getAdminState(code, examId);
}

function saveAnswerKeyForAdmin(code, examId, keyInput) {
  checkAdminCode_(code);
  ensureSheets_();
  examId = String(examId || '').trim();
  if (!examId) {
    throw new Error('Selecciona un examen abans de desar la clau.');
  }
  const config = getExamConfig_(examId);
  const keyArray = normalizeKeyInput_(keyInput, config);
  writeKey_(examId, keyArray);
  return getAdminState(code, examId);
}

function saveGradingForAdmin(code, examId, gradeMax, passThreshold) {
  checkAdminCode_(code);
  ensureSheets_();
  examId = String(examId || '').trim();
  if (!examId) {
    throw new Error('Selecciona un examen abans de desar els criteris.');
  }
  let g = Number(gradeMax);
  if (!Number.isFinite(g) || g <= 0) g = 10;
  let p = Number(passThreshold);
  if (!Number.isFinite(p) || p < 0) p = 5;
  if (p > g) p = g;

  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const values = sheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < values.length; i++) {
    if (sameExamId_(values[i][0], examId)) {
      sheet.getRange(i + 1, CONFIG_COLUMNS.GRADE_MAX).setValue(g);
      sheet.getRange(i + 1, CONFIG_COLUMNS.PASS_THRESHOLD).setValue(p);
      found = true;
      break;
    }
  }
  if (!found) {
    throw new Error('No s\'ha trobat l\'examen seleccionat.');
  }
  return getAdminState(code, examId);
}

function savePenaltyForAdmin(code, examId, enabled, value) {
  checkAdminCode_(code);
  ensureSheets_();
  examId = String(examId || '').trim();
  if (!examId) {
    throw new Error('Selecciona un examen abans de desar la penalització.');
  }
  const use = normalizeBooleanInput_(enabled);
  let pen = Number(value);
  if (!Number.isFinite(pen) || pen < 0) pen = 0;
  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const values = sheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < values.length; i++) {
    if (sameExamId_(values[i][0], examId)) {
      sheet.getRange(i + 1, CONFIG_COLUMNS.PENALIZE_WRONG).setValue(use);
      sheet.getRange(i + 1, CONFIG_COLUMNS.PENALTY_VALUE).setValue(pen);
      found = true;
      break;
    }
  }
  if (!found) {
    throw new Error('No s\'ha trobat l\'examen seleccionat.');
  }
  return getAdminState(code, examId);
}

function runCombinedReportForAdmin(code, examId, lang) {
  checkAdminCode_(code);
  ensureSheets_();
  examId = String(examId || '').trim();
  if (!examId) {
    throw new Error('Selecciona un examen per generar la correcció i l\'anàlisi.');
  }
  const config = getExamConfig_(examId);
  const report = generateCorrectionReport_(config, normalizeLang_(lang));
  const sheetUrl = report && report.spreadsheet ? report.spreadsheet.getUrl() : '';
  return {
    message: report.correctionResult.message + '\n' + report.analysisResult.message + (sheetUrl ? '\n' + i18n_(normalizeLang_(lang)).sheetCreated : ''),
    sheetUrl: sheetUrl,
    sheetName: ''
  };
}

function setManualStateForAdmin(code, examId, manualState) {
  checkAdminCode_(code);
  ensureSheets_();
  examId = String(examId || '').trim();
  if (!examId) {
    throw new Error('Selecciona un examen per canviar el mode.');
  }
  if (['auto', 'open', 'closed'].indexOf(manualState) === -1) {
    throw new Error('Mode manual desconegut.');
  }

  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const values = sheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < values.length; i++) {
    if (sameExamId_(values[i][0], examId)) {
      sheet.getRange(i + 1, CONFIG_COLUMNS.MANUAL_STATE).setValue(manualState);
      // marca la darrera modificació manual per evitar que un trigger retardat la sobreescrigui
      try {
        setSettingValue_('manual_changed_ts:' + examId, formatDateWithOffset_(new Date()));
      } catch (e) {}
      found = true;
      break;
    }
  }
  if (!found) {
    throw new Error('No s\'ha trobat l\'examen seleccionat.');
  }
  return getAdminState(code, examId);
}

function clearExamSubmissionsForAdmin(code, examId) {
  checkAdminCode_(code);
  ensureSheets_();
  examId = String(examId || '').trim();
  if (!examId) {
    throw new Error('Selecciona un examen abans d\'esborrar els enviaments.');
  }

  const ss = getSpreadsheet_();
  const bases = ['Submissions', 'Correcció', 'Anàlisi'];
  let cleared = 0;
  bases.forEach(base => {
    const sheet = getExistingExamSheet_(base, examId);
    if (sheet) {
      ss.deleteSheet(sheet);
      cleared++;
    }
  });

  const message = cleared
    ? 'Enviaments, correccions i anàlisis esborrats per a ' + examId + '.'
    : 'No hi havia dades per esborrar per a ' + examId + '.';

  return {
    message: message,
    state: getAdminState(code, examId)
  };
}

function deleteExamForAdmin(code, examId) {
  checkAdminCode_(code);
  ensureSheets_();
  examId = String(examId || '').trim();
  if (!examId) {
    throw new Error('Selecciona un examen abans d\'esborrar-lo.');
  }

  // 1) Esborra pestanyes específiques (lliuraments/correcció/anàlisi)
  const ss = getSpreadsheet_();
  ['Submissions', 'Correcció', 'Anàlisi'].forEach(base => {
    const sheet = getExistingExamSheet_(base, examId);
    if (sheet) {
      try { ss.deleteSheet(sheet); } catch (e) {}
    }
  });

  // 2) Elimina fila de Config
  (function removeFromConfig() {
    const sheet = getSheet_(SHEET_NAMES.CONFIG);
    const last = sheet.getLastRow();
    if (last <= 1) return; // només capçalera
    const range = sheet.getRange(2, 1, last - 1, 1); // només columna exam_id
    const ids = range.getValues();
    for (let i = ids.length - 1; i >= 0; i--) {
      if (sameExamId_(ids[i][0], examId)) {
        try { sheet.deleteRow(i + 2); } catch (e) {}
      }
    }
  })();

  // 3) Elimina fila de Keys
  (function removeFromKeys() {
    const ks = getSheet_(SHEET_NAMES.KEYS);
    const values = ks.getDataRange().getValues();
    for (let i = values.length - 1; i >= 1; i--) {
      if (sameExamId_(values[i][0], examId)) {
        try { ks.deleteRow(i + 1); } catch (e) {}
      }
    }
  })();

  // 4) Reprograma triggers
  try { updateAllScheduleTriggers_(); } catch (e) {}

  // 5) Retorna nou estat (ja no ha de contenir l'examen esborrat)
  const state = getAdminState(code, '');
  return {
    message: 'Examen ' + examId + ' esborrat completament.',
    state: state
  };
}

function resetAllDataForAdmin(code) {
  checkAdminCode_(code);
  const ss = getSpreadsheet_();

  // Esborrem contingut i deixem només capçaleres
  Object.keys(SHEET_HEADERS).forEach(name => {
    if (name === 'Settings' || name === 'Submissions' || name === 'Correcció') {
      return;
    }
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    sheet.clearContents();
    sheet.getRange(1, 1, 1, SHEET_HEADERS[name].length).setValues([SHEET_HEADERS[name]]);
    if (sheet.getMaxRows() > 1) {
      sheet.deleteRows(2, sheet.getMaxRows() - 1);
    }
    if (sheet.getMaxColumns() > SHEET_HEADERS[name].length) {
      sheet.deleteColumns(SHEET_HEADERS[name].length + 1, sheet.getMaxColumns() - SHEET_HEADERS[name].length);
    }
  });

  ['Submissions', 'Correcció', 'Anàlisi'].forEach(legacyName => {
    const legacy = ss.getSheetByName(legacyName);
    if (legacy) {
      ss.deleteSheet(legacy);
    }
  });

  deleteExamSpecificSheets_();

  // Reinicia el comptador d'IDs d'examen
  try {
    setSettingValue_(SETTINGS_KEYS.LAST_EXAM_ID, 0);
  } catch (err) {
    // si falla, no bloquegem el reset general
  }

  // Neteja triggers de planificació
  try {
    clearSchedulerTriggers_();
  } catch (err) {}

  return {
    reset: true,
    message: 'Fulla reiniciada. Ja pots crear un nou examen.'
  };
}

function uiDefinirClave() {
  ensureSheets_();
  const ui = SpreadsheetApp.getUi();
  const examId = promptExamId_('Introdueix l\'identificador de l\'examen per definir la clau.');
  if (!examId) {
    return;
  }
  const config = getExamConfig_(examId);
  const response = ui.prompt(
    'Definir clau',
    'Introdueix la cadena de ' + config.nQuestions + ' lletres (ex. ABCDE...) o enganxa respostes separades per espais.',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const raw = String(response.getResponseText() || '').trim();
  if (!raw) {
    ui.alert('No s\'ha rebut cap clau.');
    return;
  }

  const keyArray = normalizeKeyInput_(raw, config);
  writeKey_(config.examId, keyArray);
  ui.alert('Clau desada correctament.');
}

function corregirExamen() {
  ensureSheets_();
  const examId = promptExamId_('Introdueix l\'identificador de l\'examen per generar la correcció i l\'anàlisi.');
  if (!examId) {
    return;
  }
  const config = getExamConfig_(examId);
  const report = generateCorrectionReport_(config);
  const url = report && report.spreadsheet ? report.spreadsheet.getUrl() : '';
  SpreadsheetApp.getUi().alert((report.correctionResult.message + '\n' + report.analysisResult.message + (url ? '\nURL: ' + url : '')));
}

function sortCurrentCorrectionByStudent() {
  return sortCurrentCorrectionSheet_('student');
}

function sortCurrentCorrectionByDate() {
  return sortCurrentCorrectionSheet_('date');
}

function sortCurrentCorrectionSheet_(mode) {
  const sh = SpreadsheetApp.getActiveSheet();
  const name = sh.getName();
  // Esperem fulls anomenats 'Correcció' o 'Correcció - <id>'
  if (name !== 'Correcció' && name.indexOf(buildExamSheetPrefix_('Correcció')) !== 0) {
    SpreadsheetApp.getUi().alert('Situa\'t a la pestanya "Correcció" per ordenar.');
    return;
  }
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  const headerRow = 3;
  const keyRow = headerRow + 1; // fila "Clau" fixa
  const dataStart = keyRow + 1;
  if (lastRow < dataStart) {
    SpreadsheetApp.getUi().alert('No hi ha files d\'alumnes per ordenar.');
    return;
  }
  const range = sh.getRange(dataStart, 1, lastRow - dataStart + 1, lastCol);
  const columnIndex = mode === 'date' ? 1 : 2;
  try {
    range.sort([{ column: columnIndex, ascending: true }]);
  } catch (e) {
    SpreadsheetApp.getUi().alert('No s\'ha pogut ordenar: ' + e.message);
    return;
  }
  SpreadsheetApp.getActive().toast('Taula ordenada per ' + (mode === 'date' ? 'data' : 'codi alumne') + '.');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Examen')
    .addItem('Definir la clau', 'uiDefinirClave')
    .addItem('Generar correcció + anàlisi', 'corregirExamen')
    .addSeparator()
    .addItem('Ordenar correcció per codi', 'sortCurrentCorrectionByStudent')
    .addItem('Ordenar correcció per data', 'sortCurrentCorrectionByDate')
    .addToUi();
}

function getExamConfig_(examId) {
  const targetId = normalizeExamId_(examId);
  if (!targetId) {
    throw new Error('No s\'ha trobat cap examen amb aquest identificador.');
  }
  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const candidateId = normalizeExamId_(row[0]);
    if (candidateId !== targetId) {
      continue;
    }
    const examName = String(row[CONFIG_COLUMNS.EXAM_NAME - 1] || '').trim();
    const nQuestions = Number(row[CONFIG_COLUMNS.N_QUESTIONS - 1]);
    if (!Number.isFinite(nQuestions) || nQuestions <= 0) {
      throw new Error('El nombre de preguntes ha de ser un enter positiu.');
    }
    const optionsText = String(row[CONFIG_COLUMNS.OPTIONS - 1] || '').toUpperCase().replace(/\s+/g, '');
    if (!optionsText) {
      throw new Error('Cal definir les opcions (ex. ABCDE).');
    }
    const options = optionsText.split('');
    const startIso = normalizeIsoString_(row[CONFIG_COLUMNS.START_ISO - 1]);
    const endIso = normalizeIsoString_(row[CONFIG_COLUMNS.END_ISO - 1]);
    const manualState = String(row[CONFIG_COLUMNS.MANUAL_STATE - 1] || 'auto').toLowerCase();
  const shuffleQuestions = normalizeBooleanInput_(row[CONFIG_COLUMNS.SHUFFLE_QUESTIONS - 1]);
  const shuffleAnswers = normalizeBooleanInput_(row[CONFIG_COLUMNS.SHUFFLE_ANSWERS - 1]);
  const enforceFullscreen = normalizeBooleanInput_(row[CONFIG_COLUMNS.ENFORCE_FULLSCREEN - 1]);
  let gradeMax = Number(row[CONFIG_COLUMNS.GRADE_MAX - 1]);
  if (!Number.isFinite(gradeMax) || gradeMax <= 0) { gradeMax = 10; }
  let passThreshold = Number(row[CONFIG_COLUMNS.PASS_THRESHOLD - 1]);
  if (!Number.isFinite(passThreshold) || passThreshold < 0) { passThreshold = 5; }
  if (passThreshold > gradeMax) { passThreshold = gradeMax; }
  const penalizeWrong = normalizeBooleanInput_(row[CONFIG_COLUMNS.PENALIZE_WRONG - 1]);
  let penaltyValue = Number(row[CONFIG_COLUMNS.PENALTY_VALUE - 1]);
  if (!Number.isFinite(penaltyValue) || penaltyValue < 0) {
    penaltyValue = options.length > 1 ? (1 / (options.length - 1)) : 0;
  }

    return {
      examId: targetId,
      examName: examName,
      nQuestions: nQuestions,
      options: options,
      startIso: startIso,
      endIso: endIso,
      manualState: ['open', 'closed'].indexOf(manualState) !== -1 ? manualState : 'auto',
      shuffleQuestions: shuffleQuestions,
      shuffleAnswers: shuffleAnswers,
      enforceFullscreen: enforceFullscreen,
      gradeMax: gradeMax,
      passThreshold: passThreshold,
      penalizeWrong: penalizeWrong,
      penaltyValue: penaltyValue
    };
  }
  throw new Error('No s\'ha trobat cap examen amb aquest identificador.');
}

function getAllExamConfigs_() {
  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const values = sheet.getDataRange().getValues();
  const results = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const examId = normalizeExamId_(row[0]);
    if (!examId) {
      continue;
    }
    try {
      results.push(getExamConfig_(examId));
    } catch (err) {
      // ometem registres amb errors de format
    }
  }
  return results;
}

function examIdExists_(examId) {
  const targetId = normalizeExamId_(examId);
  if (!targetId) {
    return false;
  }
  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (normalizeExamId_(values[i][0]) === targetId) {
      return true;
    }
  }
  return false;
}

function getAnswerKey_(examId, config) {
  const sheet = getSheet_(SHEET_NAMES.KEYS);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (sameExamId_(values[i][0], examId)) {
      return parseKey_(values[i][1], config.nQuestions, config.options);
    }
  }
  throw new Error('Encara no s\'ha definit la clau per a aquest examen.');
}


function corregirExamenCore_(config) {
  const key = getAnswerKey_(config.examId, config);
  const values = getExamSheetValues_('Submissions', SHEET_HEADERS.Submissions, config.examId);
  const rows = [];

  values.forEach(row => {
    if (!sameExamId_(row[1], config.examId)) {
      return;
    }
    const answers = parseAnswers_(row[3], config.nQuestions);
    let correct = 0;
    let incorrect = 0;
    let blank = 0;
    answers.forEach((answer, index) => {
      if (!answer) {
        blank++;
      } else if (answer === key[index]) {
        correct++;
      } else {
        incorrect++;
      }
    });
    const penalty = config.penalizeWrong ? (Number(config.penaltyValue) || (config.options.length > 1 ? (1 / (config.options.length - 1)) : 0)) : 0;
    let effective = correct - penalty * incorrect;
    if (!Number.isFinite(effective)) effective = 0;
    effective = Math.max(0, Math.min(config.nQuestions, effective));
    const scoreRaw = (effective / config.nQuestions) * config.gradeMax;
    const score = Math.round(scoreRaw * 100) / 100;
    // ['Data', 'Codi alumne', 'Encerts', 'Errors', 'En blanc', 'Nota']
    rows.push([
      row[0],
      row[2],
      correct,
      incorrect,
      blank,
      score
    ]);
  });
 
  if (rows.length) {
    return {
      corrected: rows.length,
      message: 'Correcció generada per a ' + config.examId + '. Consulta la pestanya "Correcció".',
      rows: rows
    };
  }
  return {
    corrected: 0,
    message: 'No hi ha enviaments per corregir per a ' + config.examId + '.',
    rows: []
  };
}

function analisiPerPreguntaCore_(config) {
  const key = getAnswerKey_(config.examId, config);
  const values = getExamSheetValues_('Submissions', SHEET_HEADERS.Submissions, config.examId);
  const stats = key.map(() => ({ total: 0, correct: 0, incorrect: 0, blank: 0 }));
  let hasData = false;

  values.forEach(row => {
    if (!sameExamId_(row[1], config.examId)) {
      return;
    }
    const answers = parseAnswers_(row[3], config.nQuestions);
    hasData = true;
    answers.forEach((answer, index) => {
      if (!answer) {
        stats[index].blank++;
        return;
      }
      stats[index].total++;
      if (answer === key[index]) {
        stats[index].correct++;
      } else {
        stats[index].incorrect++;
      }
    });
  });

  const summaryRows = stats.map((stat, index) => ({
    question: index + 1,
    responses: stat.total + stat.blank,
    correct: stat.correct,
    incorrect: stat.incorrect,
    blank: stat.blank,
    percent: (stat.total + stat.blank) ? stat.correct / (stat.total + stat.blank) : 0
  }));

  if (hasData) {
    return {
      analyzed: true,
      message: 'Anàlisi per pregunta generada per a ' + config.examId + '. Consulta la pestanya "Correcció".',
      rows: summaryRows
    };
  }
  return {
    analyzed: false,
    message: 'No hi ha suficients dades per analitzar l\'examen ' + config.examId + '.',
    rows: []
  };
}

function writeCorrectionReport_(config, correctionRows, summaryRows) {
  // Taula principal tipus "Respostes" dins de Correcció
  const respHeader = ['Data', 'Codi alumne'];
  for (let i = 1; i <= config.nQuestions; i++) respHeader.push('Q' + i);
  respHeader.push('Encerts','Errors','En blanc','Nota (0-' + (Number(config.gradeMax) || 10) + ')');
  const sheet = getOrCreateExamSheet_('Correcció', respHeader, config.examId);
  const header = respHeader;
  const totalColumns = header.length;

  // Garantim files/columnes mínimes sense esborrar tota la fulla (més segur en entorns WebApp)
  const neededRows = 1 + Math.max(1, correctionRows.length) + (summaryRows && summaryRows.length ? (2 + 1 + summaryRows.length) : 0);
  const neededCols = totalColumns;
  let maxRows = sheet.getMaxRows();
  let maxCols = sheet.getMaxColumns();
  if (maxRows < neededRows) {
    sheet.insertRowsAfter(maxRows, neededRows - maxRows);
    maxRows = sheet.getMaxRows();
  }
  if (maxCols < neededCols) {
    sheet.insertColumnsAfter(maxCols, neededCols - maxCols);
    maxCols = sheet.getMaxColumns();
  }

  // Escriu capçalera
  sheet.getRange(1, 1, 1, totalColumns).setValues([header]);
  sheet.getRange(1, 1, 1, totalColumns)
    .setFontWeight('bold')
    .setBackground('#e3f2fd')
    .setHorizontalAlignment('center');

  // Neteja contingut de dades (de la fila 2 cap avall) sense tocar formats globals
  if (maxRows > 1) {
    sheet.getRange(2, 1, maxRows - 1, maxCols).clearContent();
  }

  // Construeix taula de respostes (amb data i colors)
  let nextRow = 2;
  (function buildResponsesInto(sheetRef) {
    // Reutilitza la lògica de writeResponsesTable_, però amb data primera columna
    const key = getAnswerKey_(config.examId, config);
    const values = getExamSheetValues_('Submissions', SHEET_HEADERS.Submissions, config.examId);
    const n = config.nQuestions;
    const gradeMax = Number(config.gradeMax) || 10;
    const penalty = config.penalizeWrong ? (Number(config.penaltyValue) || (config.options.length > 1 ? (1 / (config.options.length - 1)) : 0)) : 0;
    const rows = [];
    const wrongMatrix = [];
    const ts = [];
    const passVals = [];
    const thr = Number(config.passThreshold);
    values.forEach(row => {
      if (!sameExamId_(row[1], config.examId)) return;
      const timestamp = row[0];
      const student = String(row[2] || '').trim();
      const answers = parseAnswers_(row[3], n);
      let correct = 0, incorrect = 0, blank = 0;
      const display = [];
      const wrongRow = [];
      for (let i = 0; i < n; i++) {
        const ans = String(answers[i] || '').toUpperCase();
        if (!ans) { display.push(''); blank++; wrongRow.push(false); }
        else if (ans === key[i]) { display.push(ans); correct++; wrongRow.push(false); }
        else { display.push(ans); incorrect++; wrongRow.push(true); }
      }
      let effective = correct - penalty * incorrect;
      if (!Number.isFinite(effective)) effective = 0;
      effective = Math.max(0, Math.min(n, effective));
      const score = Math.round(((effective / n) * gradeMax) * 100) / 100;
      rows.push([timestamp, student].concat(display).concat([correct, incorrect, blank, score]));
      wrongMatrix.push(wrongRow);
      ts.push(timestamp);
      passVals.push(score);
    });
    // Ordena per codi alumne (alfabètic) i després afegeix la clau
    if (rows.length) {
      const idx = rows.map((r, i) => ({ i, code: String(r[1] || '').toLowerCase() }));
      idx.sort((a, b) => a.code.localeCompare(b.code, 'ca'));
      const rowsSorted = [];
      const wrongSorted = [];
      const passSorted = [];
      idx.forEach(({ i }) => {
        rowsSorted.push(rows[i]);
        wrongSorted.push(wrongMatrix[i]);
        passSorted.push(passVals[i]);
      });
      rows.length = 0; Array.prototype.push.apply(rows, rowsSorted);
      wrongMatrix.length = 0; Array.prototype.push.apply(wrongMatrix, wrongSorted);
      passVals.length = 0; Array.prototype.push.apply(passVals, passSorted);
    }
    // Afegeix fila de clau com a model
    const keyRow = (function(){
      const arr = ['','Clau'];
      for (let i = 0; i < n; i++) arr.push(String(key[i] || '').toUpperCase());
      arr.push('', '', '', '');
      return arr;
    })();
    const countRows = rows.length; // alumnes
    const totalRows = countRows + 1; // + clau
    // Assegura capacitat abans d'escriure
    {
      const needRows = Math.max(startRow + 1, startRow + totalRows);
      if (sheetRef.getMaxRows() < needRows) {
        sheetRef.insertRowsAfter(sheetRef.getMaxRows(), needRows - sheetRef.getMaxRows());
      }
      if (sheetRef.getMaxColumns() < totalColumns) {
        sheetRef.insertColumnsAfter(sheetRef.getMaxColumns(), totalColumns - sheetRef.getMaxColumns());
      }
    }
    if (countRows) {
      const withKey = [keyRow].concat(rows);
      sheetRef.getRange(nextRow, 1, totalRows, totalColumns).setValues(withKey);
      sheetRef.getRange(nextRow, 1, totalRows, 1).setNumberFormat('dd/MM/yyyy HH:mm');
      sheetRef.getRange(nextRow, 2, totalRows, 1).setHorizontalAlignment('left');
      sheetRef.getRange(nextRow, 3, totalRows, n).setHorizontalAlignment('center');
      sheetRef.getRange(nextRow, 3 + n, totalRows, 3).setHorizontalAlignment('center');
      sheetRef.getRange(nextRow, 6 + n, totalRows, 1).setNumberFormat('0.00');
      sheetRef.getRange(1, 1, totalRows + 1, totalColumns).setBorder(true, true, true, true, true, true);
      // Ressalta la fila de clau
      try {
        sheetRef.getRange(startRow + 1, 1, 1, totalColumns).setBackground('#fff8e1');
        sheetRef.getRange(startRow + 1, 2, 1, 1).setFontWeight('bold');
      } catch (e) {}
      // Colors d'errors cel·la a cel·la
      try {
        for (let r = 0; r < countRows; r++) {
          const rowIdx = nextRow + 1 + r; // salta la clau
          for (let c = 0; c < n; c++) {
            if (wrongMatrix[r][c]) {
              sheetRef.getRange(rowIdx, 2 + 1 + c, 1, 1).setBackground('#fdecea').setFontColor('#c62828');
            }
          }
        }
      } catch (e) {}
      // Colors d'aprovat/suspens a la nota
      try {
        const gradeCol = 6 + n;
        const gradeRange = sheetRef.getRange(nextRow + 1, gradeCol, countRows, 1);
        const bg = [], fg = [];
        for (let i = 0; i < countRows; i++) {
          const v = Number(passVals[i]) || 0;
          if (Number.isFinite(thr) ? v >= thr : v >= 5) { bg.push(['#e8f5e9']); fg.push(['#2e7d32']); }
          else { bg.push(['#fdecea']); fg.push(['#c62828']); }
        }
        gradeRange.setBackgrounds(bg).setFontColors(fg);
      } catch (e) {}
      nextRow += totalRows;
    }
  })(sheet);
  // Ajusta amplada de la columna A perquè el text de la capçalera no l'estiri
  try { sheet.setColumnWidth(1, 140); } catch (e) {}

  // Escriu resum per pregunta
  if (summaryRows && summaryRows.length) {
    nextRow++; // línia en blanc
    const titleRow = nextRow;
    const blockCols = Math.min(4, totalColumns);
    if (blockCols > 1) {
      try { sheet.getRange(titleRow, 1, 1, blockCols).merge(); } catch (err) {}
    }
    sheet.getRange(titleRow, 1)
      .setValue('Resum per pregunta')
      .setFontWeight('bold')
      .setBackground('#f1f8e9')
      .setHorizontalAlignment('center');
    nextRow++;

    const summaryHeader = [['Pregunta', 'Respostes', 'Encerts', 'Percentatge']];
    sheet.getRange(nextRow, 1, 1, summaryHeader[0].length)
      .setValues(summaryHeader)
      .setFontWeight('bold')
      .setBackground('#e0f2f1')
      .setHorizontalAlignment('center');
    nextRow++;

    const summaryValues = summaryRows.map(row => [row.question, row.responses, row.correct, row.percent]);
    sheet.getRange(nextRow, 1, summaryValues.length, summaryHeader[0].length)
      .setValues(summaryValues)
      .setHorizontalAlignment('center');
    sheet.getRange(nextRow, 1, summaryValues.length, 3).setNumberFormat('0');
    sheet.getRange(nextRow, summaryHeader[0].length, summaryValues.length, 1).setNumberFormat('0.00%');
    sheet.getRange(titleRow, 1, summaryValues.length + 2, summaryHeader[0].length).setBorder(true, true, true, true, true, true);
  }

  // Ajustos finals suaus
  try { sheet.autoResizeColumns(1, totalColumns); } catch (err) {}
  sheet.getRange(1, 1, Math.max(nextRow - 1, 1), totalColumns).setFontFamily('Arial');
  try { sheet.setFrozenRows(sheet.getLastRow() > 1 ? 1 : 0); } catch (err) {}
  return sheet;
}

function generateCorrectionReport_(config, lang) {
  const correctionResult = corregirExamenCore_(config);
  const analysisResult = analisiPerPreguntaCore_(config);
  const tz = Session.getScriptTimeZone() || 'Europe/Madrid';
  const examTitle = (config.examName ? config.examName + ' ' : '') + '(' + config.examId + ')';
  const title = examTitle;
  const ss = SpreadsheetApp.create(title);

  // Full 1: Correcció
  const corrSheet = ss.getSheets()[0];
  corrSheet.setName(i18n_(lang).sheetCorrection);
  writeCorrectionTable_(corrSheet, correctionResult.rows, config.gradeMax, config.passThreshold, config, lang);
  safeHideGrid_(corrSheet);

  // Full 2: Anàlisi
  const anaSheet = ss.insertSheet(i18n_(lang).sheetAnalysis);
  writeAnalysisTable_(anaSheet, analysisResult.rows, config, lang);
  safeHideGrid_(anaSheet);

  return {
    spreadsheet: ss,
    correctionSheet: corrSheet,
    analysisSheet: anaSheet,
    correctionResult,
    analysisResult
  };
}

function safeHideGrid_(sheet) {
  try { sheet.setHiddenGridlines(true); } catch (err) { /* ignore if not supported */ }
}

function writeMetaHeader_(sheet, totalColumns, config, lang) {
  const tx = i18n_(lang);
  const title = tx.examPrefix + ' ' + (config.examName || '') + ' (' + (config.examId || '') + ')';
  const penaltyText = config.penalizeWrong ? (tx.penaltyLabel + ' ' + (Number(config.penaltyValue).toFixed(2))) : tx.noPenalty;
  const line2 = tx.qualifyOver + ': ' + (config.gradeMax || 10) + ' · ' + tx.passAtLeast + ' ' + (config.passThreshold || 5) + ' · ' + penaltyText;
  try {
    if (totalColumns > 1) {
      sheet.getRange(1, 1, 1, totalColumns).merge();
      sheet.getRange(2, 1, 1, totalColumns).merge();
    }
  } catch (e) {}
  sheet.getRange(1, 1).setValue(title).setFontWeight('bold').setBackground('#e8f5e9').setWrap(true);
  sheet.getRange(2, 1).setValue(line2).setBackground('#f1f8e9').setWrap(true);
}

function writeCorrectionTable_(sheet, rows, gradeMax, passThreshold, config, lang) {
  // Taula de "Respostes" dins de Correcció: Data, Codi, Q1..Qn, Encerts, Errors, En blanc, Nota
  const n = Number(config.nQuestions) || 0;
  const gMax = Number(gradeMax) || (Number(config.gradeMax) || 10);
  const tx = i18n_(lang);
  const header = [tx.colDate, tx.colStudent];
  for (let i = 1; i <= n; i++) header.push('Q' + i);
  header.push(tx.colCorrect, tx.colWrong, tx.colBlank, tx.colScorePrefix + '0-' + gMax + ')');
  const totalColumns = header.length;
  const penalty = config.penalizeWrong ? (Number(config.penaltyValue) || (config.options.length > 1 ? (1 / (config.options.length - 1)) : 0)) : 0;

  // Prepare header row index
  const startRow = 3;
  // Assegura columnes; les files s'ajusten després de construir el cos
  if (sheet.getMaxColumns() < totalColumns) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), totalColumns - sheet.getMaxColumns());
  }

  // Meta header + header de taula
  writeMetaHeader_(sheet, totalColumns, config, lang);
  sheet.getRange(startRow, 1, 1, totalColumns).setValues([header])
    .setFontWeight('bold')
    .setBackground('#e3f2fd')
    .setHorizontalAlignment('center');

  // Clear body
  if (sheet.getMaxRows() >= startRow + 1) {
    sheet.getRange(startRow + 1, 1, sheet.getMaxRows() - startRow, sheet.getMaxColumns()).clearContent();
  }

  // Body: deriveix de Submissions i la clau
  const key = getAnswerKey_(config.examId, config);
  const subs = getExamSheetValues_('Submissions', SHEET_HEADERS.Submissions, config.examId);
  const bodyRows = [];
  const wrongMatrix = [];
  const scores = [];
  subs.forEach(row => {
    if (!sameExamId_(row[1], config.examId)) return;
    const timestamp = row[0];
    const student = String(row[2] || '').trim();
    const answers = parseAnswers_(row[3], n);
    let correct = 0, incorrect = 0, blank = 0;
    const display = [];
    const wrongRow = [];
    for (let i = 0; i < n; i++) {
      const ans = String(answers[i] || '').toUpperCase();
      if (!ans) { display.push(''); blank++; wrongRow.push(false); }
      else if (ans === key[i]) { display.push(ans); correct++; wrongRow.push(false); }
      else { display.push(ans); incorrect++; wrongRow.push(true); }
    }
    let effective = correct - penalty * incorrect;
    if (!Number.isFinite(effective)) effective = 0;
    effective = Math.max(0, Math.min(n, effective));
    const score = Math.round(((effective / n) * gMax) * 100) / 100;
    bodyRows.push([timestamp, student].concat(display).concat([correct, incorrect, blank, score]));
    wrongMatrix.push(wrongRow);
    scores.push(score);
  });
  // Afegeix fila de clau com a model
  const keyRow = (function(){
    const arr = ['', tx.keyLabel];
    for (let i = 0; i < n; i++) arr.push(String(key[i] || '').toUpperCase());
    arr.push('', '', '', '');
    return arr;
  })();
  // Ordena per codi alumne (alfabètic)
  if (bodyRows.length) {
    const idx = bodyRows.map((r, i) => ({ i, code: String(r[1] || '').toLowerCase() }));
    idx.sort((a, b) => a.code.localeCompare(b.code, 'ca'));
    const rowsSorted = [];
    const wrongSorted = [];
    const scoresSorted = [];
    idx.forEach(({ i }) => {
      rowsSorted.push(bodyRows[i]);
      wrongSorted.push(wrongMatrix[i]);
      scoresSorted.push(scores[i]);
    });
    bodyRows.length = 0; Array.prototype.push.apply(bodyRows, rowsSorted);
    wrongMatrix.length = 0; Array.prototype.push.apply(wrongMatrix, wrongSorted);
    scores.length = 0; Array.prototype.push.apply(scores, scoresSorted);
  }
  const countRows = bodyRows.length; // alumnes
  const totalRows = countRows + 1; // + clau
  // Ara que coneixem quantes files calen, assegurem capacitat
  {
    const needRows = Math.max(startRow + 1, startRow + totalRows);
    if (sheet.getMaxRows() < needRows) {
      sheet.insertRowsAfter(sheet.getMaxRows(), needRows - sheet.getMaxRows());
    }
  }
  if (countRows) {
    const withKey = [keyRow].concat(bodyRows);
    sheet.getRange(startRow + 1, 1, totalRows, totalColumns).setValues(withKey);
    sheet.getRange(startRow + 1, 1, totalRows, 1).setNumberFormat('dd/MM/yyyy HH:mm');
    sheet.getRange(startRow + 1, 2, totalRows, 1).setHorizontalAlignment('left');
    if (n > 0) sheet.getRange(startRow + 1, 3, totalRows, n).setHorizontalAlignment('center');
    sheet.getRange(startRow + 1, 3 + n, totalRows, 3).setHorizontalAlignment('center');
    sheet.getRange(startRow + 1, 6 + n, totalRows, 1).setNumberFormat('0.00');
    sheet.getRange(startRow, 1, totalRows + 1, totalColumns).setBorder(true, true, true, true, true, true);
    // Ressalta la fila de clau
    try {
      sheet.getRange(startRow + 1, 1, 1, totalColumns).setBackground('#fff8e1');
      sheet.getRange(startRow + 1, 2, 1, 1).setFontWeight('bold');
    } catch (e) {}
    // Elimina qualsevol filtre existent per evitar ordenar la fila "Clau"
    try { const existing = sheet.getFilter(); if (existing) existing.remove(); } catch (e) {}
    // Colors d'errors en les respostes
    try {
      for (let r = 0; r < countRows; r++) {
        const rowIdx = startRow + 1 + 1 + r; // salta clau
        for (let c = 0; c < n; c++) {
          if (wrongMatrix[r][c]) {
            sheet.getRange(rowIdx, 3 + c, 1, 1).setBackground('#fdecea').setFontColor('#c62828');
          }
        }
      }
    } catch (e) {}
    // Colors de nota segons aprovat/suspès
    try {
      const gradeCol = 6 + n;
      const thr = Number(passThreshold);
      const gradeRange = sheet.getRange(startRow + 1 + 1, gradeCol, countRows, 1);
      const bg = [], fg = [];
      for (let i = 0; i < scores.length; i++) {
        const v = Number(scores[i]) || 0;
        if (Number.isFinite(thr) ? v >= thr : v >= 5) { bg.push(['#e8f5e9']); fg.push(['#2e7d32']); }
        else { bg.push(['#fdecea']); fg.push(['#c62828']); }
      }
      gradeRange.setBackgrounds(bg).setFontColors(fg);
    } catch (e) {}
  }
  try { sheet.autoResizeColumns(1, totalColumns); } catch (err) {}
  // Evita que la capçalera fusionada ampliï massa la columna A
  try { sheet.setColumnWidth(1, 140); } catch (err) {}
  sheet.setFrozenRows(1);

  // Estadístiques a la dreta
  const startCol = totalColumns + 2; // una columna en blanc de separació
  const statsHeader = [['Estadístiques', 'Valor']];
  sheet.getRange(1, startCol, 1, 2).setValues(statsHeader)
    .setFontWeight('bold')
    .setBackground('#f1f8e9');
  let total = countRows;
  let avg = 0, max = 0, min = 0, pass = 0;
  if (countRows) {
    total = scores.length;
    const sum = scores.reduce((a,b)=>a+b,0);
    avg = sum / total;
    max = Math.max.apply(null, scores);
    min = Math.min.apply(null, scores);
    const threshold = Number(passThreshold);
    pass = scores.filter(s => s >= (Number.isFinite(threshold) ? threshold : 5)).length / total;
  }
  const statsRows = [
    ['Total enviaments', total],
    ['Mitjana (0-' + (Number(gradeMax) || 10) + ')', avg],
    ['Nota màxima', max],
    ['Nota mínima', min],
    ['Aprovats (%)', pass]
  ];
  sheet.getRange(2, startCol, statsRows.length, 2).setValues(statsRows);
  // Formats sobre la columna de valors (startCol + 1)
  sheet.getRange(3, startCol + 1, 1, 1).setNumberFormat('0.00');
  sheet.getRange(4, startCol + 1, 2, 1).setNumberFormat('0.##');
  sheet.getRange(6, startCol + 1, 1, 1).setNumberFormat('0%');
  sheet.getRange(1, startCol, statsRows.length + 1, 2).setBorder(true, true, true, true, true, true);

  // Histograma per intervals (freqüències) amb regla de Sturges i ressalt del llindar d'aprovat
  if (countRows) {
    try {
      const maxVal = Number(gradeMax) || 10;
      const nBins = scores.length;
      const bins = Math.max(5, Math.ceil(Math.log(nBins) / Math.log(2) + 1)); // Regla de Sturges
      const step = maxVal / bins;
      const labels = [];
      const below = Array(bins).fill(0);
      const passOnly = Array(bins).fill(0);
      const above = Array(bins).fill(0);
      const pass = Number(passThreshold);
      const passBin = Math.min(bins - 1, Math.max(0, Math.floor(pass / step)));
      for (let i = 0; i < bins; i++) {
        const a = Math.round((i * step) * 100) / 100;
        const b = Math.round(((i + 1) * step) * 100) / 100;
        labels.push(a + '–' + b);
      }
      scores.forEach(v => {
        if (v < 0) return;
        let idx = Math.floor(v / step);
        if (idx >= bins) idx = bins - 1;
        if (idx < passBin) below[idx]++;
        else if (idx === passBin) passOnly[idx]++;
        else above[idx]++;
      });
      // Taula visible simplificada: una sola columna de freqüència, amb colors per categoria
      const simpleHeader = [['Interval', 'Freqüència']];
      const totals = labels.map((_, i) => below[i] + passOnly[i] + above[i]);
      const simpleTable = labels.map((lab, i) => [lab, totals[i]]);
      const tableCol = startCol + 3;
      sheet.getRange(1, tableCol, 1, simpleHeader[0].length).setValues(simpleHeader)
        .setFontWeight('bold')
        .setBackground('#e3f2fd');
      sheet.getRange(2, tableCol, simpleTable.length, simpleHeader[0].length).setValues(simpleTable);
      sheet.getRange(2, tableCol + 1, simpleTable.length, 1).setNumberFormat('0');
      sheet.getRange(1, tableCol, simpleTable.length + 1, simpleHeader[0].length).setBorder(true, true, true, true, true, true);
      // Aplica colors per fila segons relació amb llindar
      try {
        for (let i = 0; i < simpleTable.length; i++) {
          const row = 2 + i;
          let bg = '#e8f5e9', fg = '#2e7d32'; // verd per defecte
          if (i < passBin) { bg = '#fdecea'; fg = '#c62828'; } // per sota aprovat
          else if (i === passBin) { bg = '#fff8e1'; fg = '#f9a825'; } // llindar
          sheet.getRange(row, tableCol, 1, simpleHeader[0].length).setBackground(bg).setFontColor(fg);
        }
      } catch (e) {}

      // Dades ocultes per al gràfic, amb 3 sèries apilades
      const hiddenCol = tableCol + 4;
      const chartHeader = [['Interval', 'Freq. < aprovat', 'Llindar', 'Freq. ≥ aprovat']];
      const chartTable = labels.map((lab, i) => [lab, below[i], passOnly[i], above[i]]);
      sheet.getRange(1, hiddenCol, 1, chartHeader[0].length).setValues(chartHeader);
      sheet.getRange(2, hiddenCol, chartTable.length, chartHeader[0].length).setValues(chartTable);
      try { sheet.hideColumns(hiddenCol, chartHeader[0].length); } catch (e) {}

      const chartRange = sheet.getRange(1, hiddenCol, chartTable.length + 1, chartHeader[0].length);
      const chart = sheet.newChart()
        .setChartType(Charts.ChartType.STEPPED_AREA)
        .addRange(chartRange)
        .setOption('title', 'Distribució de puntuacions')
        .setOption('legend', { position: 'top' })
        .setOption('isStacked', true)
        .setOption('series', {
          0: { color: '#d32f2f', labelInLegend: 'Freq. < aprovat' },
          1: { color: '#f9a825', labelInLegend: 'Llindar' },
          2: { color: '#2e7d32', labelInLegend: 'Freq. ≥ aprovat' }
        })
        // Situa el gràfic sota Estadístiques i Intervals
        .setPosition(2 + simpleTable.length + 4, startCol, 0, 0)
        .build();
      sheet.insertChart(chart);

      // Anotació del llindar d'aprovat
      try {
        sheet.getRange(2, tableCol + 1, 1, 1).setNote('Llindar d\'aprovat ≈ ' + pass.toFixed(2));
      } catch (e) {}
    } catch (err) {}
  }

  // Sense vista ordenada addicional: la taula ja surt ordenada per codi alumne
}

function writeAnalysisTable_(sheet, summaryRows, config, lang) {
  const tx = i18n_(lang);
  const header = [tx.hQuestion, tx.hCorrect, tx.hWrong, tx.hBlank, tx.hPercent];
  const totalColumns = header.length;
  const countRows = summaryRows && summaryRows.length ? summaryRows.length : 0;

  const startRow = 3;
  const needRows = Math.max(startRow + 1, startRow - 1 + countRows + 1);
  if (sheet.getMaxRows() < needRows) {
    sheet.insertRowsAfter(sheet.getMaxRows(), needRows - sheet.getMaxRows());
  }
  if (sheet.getMaxColumns() < totalColumns) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), totalColumns - sheet.getMaxColumns());
  }
  writeMetaHeader_(sheet, totalColumns, config, lang);
  sheet.getRange(startRow, 1, 1, totalColumns).setValues([header])
    .setFontWeight('bold')
    .setBackground('#e0f2f1')
    .setHorizontalAlignment('center');
  if (sheet.getMaxRows() >= startRow + 1) {
    sheet.getRange(startRow + 1, 1, sheet.getMaxRows() - startRow, sheet.getMaxColumns()).clearContent();
  }
  if (countRows) {
    const values = summaryRows.map(r => [r.question, r.correct, r.incorrect, r.blank, r.percent]);
    sheet.getRange(startRow + 1, 1, values.length, totalColumns).setValues(values)
      .setHorizontalAlignment('center');
    sheet.getRange(startRow + 1, 1, values.length, 4).setNumberFormat('0');
    sheet.getRange(startRow + 1, 5, values.length, 1).setNumberFormat('0.##%');
    sheet.getRange(startRow, 1, values.length + 1, totalColumns).setBorder(true, true, true, true, true, true);
  }
  try { sheet.autoResizeColumns(1, totalColumns); } catch (err) {}
  sheet.setFrozenRows(1);

  // Estadístiques i gràfic
  const startCol = totalColumns + 2;
  const statsHeader = [[tx.hStats, tx.hValue]];
  sheet.getRange(1, startCol, 1, 2).setValues(statsHeader)
    .setFontWeight('bold')
    .setBackground('#f1f8e9');
  let avgPct = 0, hardest = [];
  if (countRows) {
    const pcts = summaryRows.map(r => Number(r.percent) || 0);
    avgPct = pcts.reduce((a,b)=>a+b,0) / pcts.length;
    hardest = summaryRows.slice().sort((a,b)=>(a.percent - b.percent)).slice(0, Math.min(5, summaryRows.length));
  }
  const statsRows = [ [tx.hAvgCorrect, avgPct] ];
  sheet.getRange(2, startCol, statsRows.length, 2).setValues(statsRows);
  sheet.getRange(2, startCol + 1, 1, 1).setNumberFormat('0.##%');
  sheet.getRange(1, startCol, statsRows.length + 1, 2).setBorder(true, true, true, true, true, true);

  // Llista de preguntes més difícils
  if (hardest.length) {
    const startCol2 = startCol + 3;
    const hardHeader = [[tx.hHardest, tx.hPercentCorrect]];
    sheet.getRange(1, startCol2, 1, 2).setValues(hardHeader)
      .setFontWeight('bold')
      .setBackground('#fdecea');
    const hardRows = hardest.map(r => ['#' + r.question, r.percent]);
    sheet.getRange(2, startCol2, hardRows.length, 2).setValues(hardRows);
    sheet.getRange(2, startCol2 + 1, hardRows.length, 1).setNumberFormat('0.##%');
    sheet.getRange(1, startCol2, hardRows.length + 1, 2).setBorder(true, true, true, true, true, true);
  }

  // Gràfic: columnes apilades (Correctes, Incorrectes, En blanc)
  if (countRows) {
    try {
      const range = sheet.getRange(startRow, 1, countRows + 1, 4); // taula resum per pregunta
      const chart = sheet.newChart()
        .setChartType(Charts.ChartType.COLUMN)
        .addRange(range)
        .setOption('title', tx.chartTitle)
        .setOption('legend', { position: 'top' })
        .setOption('isStacked', true)
        .setOption('series', {
          0: { color: '#2e7d32', labelInLegend: tx.hCorrect },
          1: { color: '#c62828', labelInLegend: tx.hWrong },
          2: { color: '#eeeeee', labelInLegend: tx.hBlank }
        })
        // Situa sota Estadístiques i "Preguntes més difícils"
        .setPosition(Math.max(8, 3 + hardest.length), startCol, 0, 0)
        .build();
      sheet.insertChart(chart);
    } catch (err) {}
  }
}

function writeResponsesTable_(sheet, config) {
  const key = getAnswerKey_(config.examId, config);
  const values = getExamSheetValues_('Submissions', SHEET_HEADERS.Submissions, config.examId);
  const n = config.nQuestions;
  const gradeMax = Number(config.gradeMax) || 10;
  const penalty = config.penalizeWrong ? (Number(config.penaltyValue) || (config.options.length > 1 ? (1 / (config.options.length - 1)) : 0)) : 0;

  const header = ['Codi alumne'];
  for (let i = 1; i <= n; i++) header.push('Q' + i);
  header.push('Encerts', 'Errors', 'En blanc', 'Nota (0-' + gradeMax + ')');
  const totalColumns = header.length;

  const rows = [];
  const wrongMatrix = []; // Per marcar on aplicar color

  values.forEach(row => {
    if (!sameExamId_(row[1], config.examId)) return;
    const student = String(row[2] || '').trim();
    const answers = parseAnswers_(row[3], n);
    let correct = 0, incorrect = 0, blank = 0;
    const display = [];
    const wrongRow = [];
    for (let i = 0; i < n; i++) {
      const ans = String(answers[i] || '').toUpperCase();
      if (!ans) {
        display.push('');
        blank++;
        wrongRow.push(false);
      } else if (ans === key[i]) {
        display.push(ans);
        correct++;
        wrongRow.push(false);
      } else {
        display.push(ans);
        incorrect++;
        wrongRow.push(true);
      }
    }
    let effective = correct - penalty * incorrect;
    if (!Number.isFinite(effective)) effective = 0;
    effective = Math.max(0, Math.min(n, effective));
    const score = Math.round(((effective / n) * gradeMax) * 100) / 100;
    rows.push([student].concat(display).concat([correct, incorrect, blank, score]));
    wrongMatrix.push(wrongRow);
  });

  // Capçalera i cos (patró semblant a Correcció)
  const startRow = 3;
  const countRows = rows.length;
  const needRows = Math.max(startRow + 1, startRow - 1 + countRows + 1);
  if (sheet.getMaxRows() < needRows) {
    sheet.insertRowsAfter(sheet.getMaxRows(), needRows - sheet.getMaxRows());
  }
  if (sheet.getMaxColumns() < totalColumns) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), totalColumns - sheet.getMaxColumns());
  }
  writeMetaHeader_(sheet, totalColumns, config);
  sheet.getRange(startRow, 1, 1, totalColumns).setValues([header])
    .setFontWeight('bold')
    .setBackground('#fff8e1')
    .setHorizontalAlignment('center');
  if (sheet.getMaxRows() >= startRow + 1) {
    sheet.getRange(startRow + 1, 1, sheet.getMaxRows() - startRow, sheet.getMaxColumns()).clearContent();
    sheet.getRange(startRow + 1, 1, sheet.getMaxRows() - startRow, sheet.getMaxColumns()).setBackground(null).setFontColor(null);
  }
  if (countRows) {
    sheet.getRange(startRow + 1, 1, countRows, totalColumns).setValues(rows);
    sheet.getRange(startRow + 1, 1, countRows, 1).setHorizontalAlignment('left'); // Codi alumne
    // Preguntes al centre
    if (n > 0) sheet.getRange(startRow + 1, 2, countRows, n).setHorizontalAlignment('center');
    // Resums al centre i formats
    sheet.getRange(startRow + 1, 2 + n, countRows, 3).setHorizontalAlignment('center');
    sheet.getRange(startRow + 1, 2 + n + 3, countRows, 1).setNumberFormat('0.00');
    sheet.getRange(startRow, 1, countRows + 1, totalColumns).setBorder(true, true, true, true, true, true);
    // Coloreja respostes incorrectes en vermell
    try {
      for (let r = 0; r < countRows; r++) {
        const rowIdx = startRow + 1 + r;
        for (let c = 0; c < n; c++) {
          if (wrongMatrix[r][c]) {
            const cell = sheet.getRange(rowIdx, 2 + c, 1, 1);
            cell.setBackground('#fdecea').setFontColor('#c62828');
          }
        }
      }
    } catch (e) {}
  }
  try { sheet.autoResizeColumns(1, totalColumns); } catch (err) {}
  sheet.setFrozenRows(1);
}

function getOrCreateExamSheet_(baseName, header, examId) {
  const ss = getSpreadsheet_();
  const sheetName = buildExamSheetName_(baseName, examId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  ensureSheetHeader_(sheet, header);
  return sheet;
}

function getExistingExamSheet_(baseName, examId) {
  const ss = getSpreadsheet_();
  const sheetName = buildExamSheetName_(baseName, examId);
  return ss.getSheetByName(sheetName);
}

function ensureSheetHeader_(sheet, header) {
  const headerLength = header.length;
  const existing = sheet.getRange(1, 1, 1, headerLength).getValues()[0];
  let matches = existing.length >= headerLength;
  if (matches) {
    for (let i = 0; i < headerLength; i++) {
      if (String(existing[i] || '').toLowerCase() !== header[i].toLowerCase()) {
        matches = false;
        break;
      }
    }
  }
  if (!matches) {
    sheet.clearContents();
    sheet.getRange(1, 1, 1, headerLength).setValues([header]);
  }
  trimSheet_(sheet, headerLength);
}

function writeExamSheetRows_(baseName, header, rows, examId) {
  const sheet = getOrCreateExamSheet_(baseName, header, examId);
  sheet.clearContents();
  const requiredRows = Math.max(1, rows.length + 1);
  const currentRows = sheet.getMaxRows();
  if (currentRows < requiredRows) {
    sheet.insertRowsAfter(currentRows, requiredRows - currentRows);
  }
  const requiredColumns = header.length;
  const currentColumns = sheet.getMaxColumns();
  if (currentColumns < requiredColumns) {
    sheet.insertColumnsAfter(currentColumns, requiredColumns - currentColumns);
  }
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
  if (rows.length) {
    sheet.getRange(2, 1, rows.length, header.length).setValues(rows);
  }
  trimSheet_(sheet, header.length);
  return sheet;
}

function getExamSheetValues_(baseName, header, examId) {
  const sheet = getExistingExamSheet_(baseName, examId);
  if (!sheet) {
    return [];
  }
  const values = sheet.getDataRange().getValues();
  if (!values.length) {
    return [];
  }
  const firstRow = values[0];
  const headerMatches = header.every((title, index) => String(firstRow[index] || '').toLowerCase() === title.toLowerCase());
  const startIndex = headerMatches ? 1 : 0;
  if (startIndex >= values.length) {
    return [];
  }
  return values.slice(startIndex);
}

function trimSheet_(sheet, headerLength) {
  const extraColumns = sheet.getMaxColumns() - headerLength;
  if (extraColumns > 0) {
    sheet.deleteColumns(headerLength + 1, extraColumns);
  }
  const requiredRows = Math.max(1, sheet.getLastRow());
  const extraRows = sheet.getMaxRows() - requiredRows;
  if (extraRows > 0) {
    sheet.deleteRows(requiredRows + 1, extraRows);
  }
}

function columnToLetter_(col) {
  let temp = '';
  let n = col;
  while (n > 0) {
    const rem = (n - 1) % 26;
    temp = String.fromCharCode(65 + rem) + temp;
    n = Math.floor((n - 1) / 26);
  }
  return temp;
}

function normalizeExamId_(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function sameExamId_(candidate, examId) {
  return normalizeExamId_(candidate) === normalizeExamId_(examId);
}

function buildExamSheetName_(baseSheetName, examId) {
  const prefix = buildExamSheetPrefix_(baseSheetName);
  const safeId = String(examId || '')
    .replace(/[^A-Za-z0-9_\-]/g, '_')
    .slice(0, 60);
  return prefix + (safeId || 'sense_id');
}

function buildExamSheetPrefix_(baseSheetName) {
  return baseSheetName + ' - ';
}

function deleteExamSpecificSheets_() {
  const ss = getSpreadsheet_();
  const prefixes = [
    buildExamSheetPrefix_('Submissions'),
    buildExamSheetPrefix_('Correcció'),
    'Anàlisi - '
  ];

  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    const name = sheet.getName();
    if (prefixes.some(prefix => name.startsWith(prefix))) {
      ss.deleteSheet(sheet);
    }
  }
}

function parseKey_(value, size, allowedOptions) {
  let keyArray;
  if (typeof value === 'string' && value.trim().startsWith('[')) {
    keyArray = JSON.parse(value);
  } else {
    keyArray = String(value || '').replace(/\s+/g, '').split('');
  }
  if (keyArray.length !== size) {
    throw new Error('La clau ha de tenir ' + size + ' respostes.');
  }
  return keyArray.map(letter => {
    const option = String(letter || '').toUpperCase();
    if (!option || allowedOptions.indexOf(option) === -1) {
      throw new Error('Resposta de la clau invàlida: ' + option);
    }
    return option;
  });
}

function parseAnswers_(raw, size) {
  if (!raw) {
    return Array(size).fill('');
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error('Format de respostes no vàlid.');
  }
  if (!Array.isArray(parsed) || parsed.length !== size) {
    throw new Error('Format de respostes no vàlid.');
  }
  return parsed.map(item => String(item || '').toUpperCase());
}

function upsertKeyRow_(examId, keyJson) {
  const sheet = getSheet_(SHEET_NAMES.KEYS);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    sheet.getRange(1, 1, 1, SHEET_HEADERS.Keys.length).setValues([SHEET_HEADERS.Keys]);
  }
  for (let i = 1; i < values.length; i++) {
    if (sameExamId_(values[i][0], examId)) {
      sheet.getRange(i + 1, 1, 1, 2).setValues([[examId, keyJson]]);
      return;
    }
  }
  sheet.appendRow([examId, keyJson]);
}

function getSheet_(name) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error('No s\'ha trobat la pestanya ' + name + '.');
  }
  return sheet;
}

function ensureSheets_() {
  const ss = getSpreadsheet_();
  Object.keys(SHEET_HEADERS).forEach(name => {
    if (name === 'Submissions' || name === 'Correcció') {
      return;
    }
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    const headers = SHEET_HEADERS[name];
    const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    let needsUpdate = existing.length === 0;
    if (!needsUpdate) {
      for (let i = 0; i < headers.length; i++) {
        if (String(existing[i] || '').toLowerCase() !== headers[i].toLowerCase()) {
          needsUpdate = true;
          break;
        }
      }
    }
    if (needsUpdate) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  });

  ['Anàlisi', 'Submissions', 'Correcció'].forEach(legacyName => {
    const legacy = ss.getSheetByName(legacyName);
    if (legacy) {
      ss.deleteSheet(legacy);
    }
  });
}

function checkAdminCode_(code) {
  ensureSheets_();
  const adminToken = getAdminToken_();
  if (!code || code !== adminToken) {
    throw new Error("Codi d'administració incorrecte.");
  }
}

function getAdminToken_() {
  return ensureSettingValue_(SETTINGS_KEYS.ADMIN_TOKEN, DEFAULT_ADMIN_TOKEN);
}

function ensureSettingValue_(key, defaultValue) {
  const sheet = getSheet_(SHEET_NAMES.SETTINGS);
  const normalizedKey = String(key).toLowerCase();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    const rowKey = String(values[i][0] || '').toLowerCase();
    if (rowKey !== normalizedKey) {
      continue;
    }
    const stored = String(values[i][1] || '').trim();
    if (stored) {
      return stored;
    }
    const rng = sheet.getRange(i + 1, 2);
    // Si es el codi d'administració, força format de text
    if (normalizedKey === String(SETTINGS_KEYS.ADMIN_TOKEN).toLowerCase()) {
      try { rng.setNumberFormat('@'); } catch (e) {}
    }
    rng.setValue(String(defaultValue));
    return String(defaultValue);
  }
  // Afegeix la fila i, si és admin_token, assegura format de text per conservar zeros a l'esquerra
  sheet.appendRow([normalizedKey, String(defaultValue)]);
  if (normalizedKey === String(SETTINGS_KEYS.ADMIN_TOKEN).toLowerCase()) {
    try { sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('@'); } catch (e) {}
  }
  return String(defaultValue);
}

function setSettingValue_(key, value) {
  const sheet = getSheet_(SHEET_NAMES.SETTINGS);
  const normalizedKey = String(key).toLowerCase();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    const rowKey = String(values[i][0] || '').toLowerCase();
    if (rowKey === normalizedKey) {
      const rng = sheet.getRange(i + 1, 2);
      if (normalizedKey === String(SETTINGS_KEYS.ADMIN_TOKEN).toLowerCase()) {
        try { rng.setNumberFormat('@'); } catch (e) {}
      }
      rng.setValue(String(value));
      return;
    }
  }
  sheet.appendRow([normalizedKey, String(value)]);
  if (normalizedKey === String(SETTINGS_KEYS.ADMIN_TOKEN).toLowerCase()) {
    try { sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('@'); } catch (e) {}
  }
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let storedId = props.getProperty(SCRIPT_PROP_SPREADSHEET_ID) || '';
  if (storedId) {
    try {
      return SpreadsheetApp.openById(storedId);
    } catch (err) {
      storedId = '';
    }
  }

  let active = null;
  try {
    active = SpreadsheetApp.getActive();
  } catch (err) {
    active = null;
  }
  if (active) {
    try {
      props.setProperty(SCRIPT_PROP_SPREADSHEET_ID, active.getId());
    } catch (err) {
      // ignore storage errors, we still return the active spreadsheet
    }
    return active;
  }

  throw new Error('No s\'ha pogut accedir al full de càlcul principal. Obre el projecte des del full correcte o desa l\'ID a les propietats de l\'script.');
}

function getSpreadsheetBindingForAdmin(code) {
  checkAdminCode_(code);
  const props = PropertiesService.getScriptProperties();
  const storedId = props.getProperty(SCRIPT_PROP_SPREADSHEET_ID) || '';
  let accessible = false;
  let title = '';
  let deployerEmail = '';
  try {
    deployerEmail = (Session.getEffectiveUser && Session.getEffectiveUser().getEmail()) || '';
  } catch (err) {
    deployerEmail = '';
  }
  if (storedId) {
    try {
      const ss = SpreadsheetApp.openById(storedId);
      accessible = true;
      title = ss.getName();
    } catch (err) {
      accessible = false;
    }
  }
  let activeId = '';
  let activeTitle = '';
  try {
    const active = SpreadsheetApp.getActive();
    if (active) {
      activeId = active.getId();
      activeTitle = active.getName();
    }
  } catch (err) {
    activeId = '';
  }
  return {
    storedId,
    accessible,
    title,
    activeId,
    activeTitle,
    deployerEmail
  };
}

function setSpreadsheetBindingForAdmin(code, spreadsheetInput) {
  checkAdminCode_(code);
  const props = PropertiesService.getScriptProperties();
  const normalized = normalizeSpreadsheetIdInput_(spreadsheetInput);
  if (!normalized) {
    props.deleteProperty(SCRIPT_PROP_SPREADSHEET_ID);
    return getSpreadsheetBindingForAdmin(code);
  }
  try {
    const ss = SpreadsheetApp.openById(normalized);
    props.setProperty(SCRIPT_PROP_SPREADSHEET_ID, normalized);
    return getSpreadsheetBindingForAdmin(code);
  } catch (err) {
    throw new Error('No s\'ha pogut accedir a la fulla amb aquest identificador. Revisa que tinguis permisos i que l\'ID sigui correcte.');
  }
}

// Alias per compatibilitat amb versions antigues del client
function fetchSpreadsheetBinding(code) {
  return getSpreadsheetBindingForAdmin(code);
}

function saveSpreadsheetBinding(code, spreadsheetInput) {
  return setSpreadsheetBindingForAdmin(code, spreadsheetInput);
}

function normalizeSpreadsheetIdInput_(value) {
  const text = String(value || '').trim();
  if (!text) {
    return '';
  }
  const urlMatch = text.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  const idMatch = text.match(/[a-zA-Z0-9-_]{30,}/);
  if (idMatch) {
    return idMatch[0];
  }
  return text;
}

function updateAdminToken(code, newToken) {
  checkAdminCode_(code);
  const trimmed = String(newToken || '').trim();
  if (!trimmed) {
    throw new Error('El nou codi no pot estar buit.');
  }
  setSettingValue_(SETTINGS_KEYS.ADMIN_TOKEN, trimmed);
  return {
    message: 'Codi d\'administració actualitzat correctament.'
  };
}

function validateConfigPayload_(raw) {
  const examName = String(raw.examName || '').trim();
  if (!examName) {
    throw new Error('Introdueix un nom per a l\'examen.');
  }
  if (examName.length > 120) {
    throw new Error('El nom de l\'examen és massa llarg (màxim 120 caràcters).');
  }
  const nQuestions = Number(raw.nQuestions);
  if (!Number.isInteger(nQuestions) || nQuestions <= 0) {
    throw new Error('El nombre de preguntes ha de ser un enter positiu.');
  }
  const optionsText = String(raw.options || '').toUpperCase().replace(/\s+/g, '');
  if (!optionsText) {
    throw new Error('Introdueix com a mínim una opció (ABC...).');
  }
  const uniqueOptions = Array.from(new Set(optionsText.split('')));

  const startIso = normalizeIsoInput_(raw.startIso);
  const endIso = normalizeIsoInput_(raw.endIso);
  if (startIso && endIso && new Date(startIso) >= new Date(endIso)) {
    throw new Error('La data d\'inici ha de ser anterior a la data de fi.');
  }

  const manualState = String(raw.manualState || 'auto').toLowerCase();
  if (['auto', 'open', 'closed'].indexOf(manualState) === -1) {
    throw new Error('Mode de control manual desconegut.');
  }

  const shuffleQuestions = normalizeBooleanInput_(raw.shuffleQuestions);
  const shuffleAnswers = normalizeBooleanInput_(raw.shuffleAnswers);
  const enforceFullscreen = normalizeBooleanInput_(raw.enforceFullscreen);
  let gradeMax = Number(raw.gradeMax);
  if (!Number.isFinite(gradeMax) || gradeMax <= 0) { gradeMax = 10; }
  let passThreshold = Number(raw.passThreshold);
  if (!Number.isFinite(passThreshold) || passThreshold < 0) { passThreshold = 5; }
  if (passThreshold > gradeMax) { passThreshold = gradeMax; }

  return {
    examName: examName,
    nQuestions: nQuestions,
    optionsString: uniqueOptions.join(''),
    startIso: startIso,
    endIso: endIso,
    manualState: manualState,
    shuffleQuestions: shuffleQuestions,
    shuffleAnswers: shuffleAnswers,
    enforceFullscreen: enforceFullscreen,
    gradeMax: gradeMax,
    passThreshold: passThreshold
  };
}


function writeKey_(examId, keyArray) {
  const keyJson = JSON.stringify(keyArray);
  upsertKeyRow_(examId, keyJson);
}

function normalizeKeyInput_(raw, config) {
  const text = String(raw || '').trim();
  if (!text) {
    throw new Error('La clau no pot estar buida.');
  }
  let keyArray;
  if (text.startsWith('[')) {
    keyArray = parseKey_(text, config.nQuestions, config.options);
  } else {
    const cleaned = text.replace(/\s+/g, '').toUpperCase();
    if (cleaned.length !== config.nQuestions) {
      throw new Error('La clau ha de contenir exactament ' + config.nQuestions + ' lletres.');
    }
    keyArray = cleaned.split('');
    keyArray.forEach(option => {
      if (config.options.indexOf(option) === -1) {
        throw new Error('Resposta de la clau invàlida: ' + option);
      }
    });
  }
  return keyArray;
}

function normalizeIsoString_(value) {
  if (!value) {
    return '';
  }
  if (value instanceof Date) {
    return formatDateWithOffset_(value);
  }
  const str = String(value).trim();
  if (!str) {
    return '';
  }
  if (hasTimezoneMarker_(str)) {
    return ensureColonInOffset_(str);
  }
  const parsed = new Date(str);
  if (isNaN(parsed.getTime())) {
    return str;
  }
  return formatDateWithOffset_(parsed);
}

function normalizeIsoInput_(value) {
  if (!value) {
    return '';
  }
  const str = String(value).trim();
  if (!str) {
    return '';
  }
  if (hasTimezoneMarker_(str)) {
    return ensureColonInOffset_(str);
  }
  const parsed = new Date(str);
  if (isNaN(parsed.getTime())) {
    throw new Error('Format de data i hora invàlid. Utilitza ISO 8601.');
  }
  return formatDateWithOffset_(parsed);
}

function normalizeBooleanInput_(value) {
  if (value === true) {
    return true;
  }
  if (value === false || value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  const text = String(value).trim().toLowerCase();
  if (!text) {
    return false;
  }
  return ['true', '1', 'yes', 'y', 'si'].indexOf(text) !== -1;
}

function formatDateWithOffset_(date) {
  const padTwo = num => String(Math.trunc(Math.abs(num))).padStart(2, '0');
  const pad = num => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHours = padTwo(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetMins = padTwo(Math.abs(offsetMinutes) % 60);
  return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + sign + offsetHours + ':' + offsetMins;
}

function hasTimezoneMarker_(str) {
  return /([+-]\d{2}:?\d{2}|Z)$/.test(str);
}

function ensureColonInOffset_(str) {
  return str.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
}

function getSubmissionStatsForExam_(examId) {
  const rows = getExamSheetValues_('Submissions', SHEET_HEADERS.Submissions, examId);
  let total = 0;
  let latest = null;
  rows.forEach(row => {
    if (!sameExamId_(row[1], examId)) {
      return;
    }
    total++;
    const timestamp = row[0] instanceof Date ? row[0] : new Date(row[0]);
    if (timestamp instanceof Date && !isNaN(timestamp.getTime())) {
      if (!latest || timestamp > latest) {
        latest = timestamp;
      }
    }
  });

  return {
    total: total,
    lastTimestamp: latest
      ? Utilities.formatDate(latest, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss')
      : ''
  };
}

function generateExamId_() {
  ensureSheets_();
  const rawStored = ensureSettingValue_(SETTINGS_KEYS.LAST_EXAM_ID, 0);
  let lastId = parseInt(rawStored, 10);
  if (!Number.isFinite(lastId)) {
    lastId = 0;
  }

  let candidate = lastId + 1;
  while (examIdExists_(String(candidate))) {
    candidate++;
  }

  setSettingValue_(SETTINGS_KEYS.LAST_EXAM_ID, candidate);
  return String(candidate);
}

function buildExamStatus_(config, now, lang) {
  const start = config.startIso ? new Date(config.startIso) : null;
  const end = config.endIso ? new Date(config.endIso) : null;
  const manual = config.manualState || 'auto';
  const tz = Session.getScriptTimeZone() || 'Europe/Madrid';
  const tx = i18n_(normalizeLang_(lang));

  if (manual === 'open') {
    return buildManualStatus_(true, tx);
  }
  if (manual === 'closed') {
    return buildManualStatus_(false, tx);
  }

  const windowText = formatWindowText_(start, end, tz, tx);
  if (!start && !end) {
    return {
      isOpen: false,
      label: tx.statusClosed,
      message: tx.msgNoSchedule,
      blockingMessage: tx.blockNoSchedule
    };
  }
  if (start && now < start) {
    return {
      isOpen: false,
      label: tx.statusPending,
      message: tx.msgOpensAt + ' ' + formatDateForStatus_(start, tz) + (end ? '. ' + tx.msgClosesAt + ' ' + formatDateForStatus_(end, tz) : '') + '.',
      blockingMessage: tx.blockNotOpen
    };
  }
  if (end && now > end) {
    return {
      isOpen: false,
      label: tx.statusFinished,
      message: tx.msgFinishedAt + ' ' + formatDateForStatus_(end, tz) + '.',
      blockingMessage: tx.blockFinished
    };
  }
  return {
    isOpen: true,
    label: tx.statusOpen,
    message: windowText ? tx.msgOpen + ' ' + windowText + '.' : tx.msgOpen,
    blockingMessage: ''
  };
}

function buildManualStatus_(isOpen, tx) {
  if (isOpen) {
    return {
      isOpen: true,
      label: tx.statusOpenManual,
      message: '',
      blockingMessage: ''
    };
  }
  return {
    isOpen: false,
    label: tx.statusClosedManual,
    message: tx.msgManualClosed,
    blockingMessage: tx.blockManualClosed
  };
}

function buildExamLabel_(item) {
  const namePart = item.examName ? item.examName + ' (' + item.examId + ')' : item.examId;
  const parts = [namePart, item.nQuestions + ' preguntes'];
  if (item.status && item.status.label) {
    parts.push(item.status.label);
  }
  return parts.join(' · ');
}

function formatDateForStatus_(date, tz) {
  return Utilities.formatDate(date, tz, 'dd/MM/yyyy HH:mm');
}

function formatWindowText_(start, end, tz, tx) {
  if (start && end) {
    return tx.availableFrom + ' ' + formatDateForStatus_(start, tz) + ' ' + tx.to + ' ' + formatDateForStatus_(end, tz);
  }
  if (start) {
    return tx.availableFromDate + ' ' + formatDateForStatus_(start, tz);
  }
  if (end) {
    return tx.availableUntil + ' ' + formatDateForStatus_(end, tz);
  }
  return '';
}

function promptExamId_(message) {
  const configs = getAllExamConfigs_();
  if (!configs.length) {
    SpreadsheetApp.getUi().alert('No hi ha exàmens configurats.');
    return '';
  }
  if (configs.length === 1) {
    return configs[0].examId;
  }
  const list = configs.map(cfg => cfg.examId + ' (' + cfg.nQuestions + ' preg.)').join('\n');
  const response = SpreadsheetApp.getUi().prompt(
    'Selecciona examen',
    message + '\n\n' + list,
    SpreadsheetApp.getUi().ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== SpreadsheetApp.getUi().Button.OK) {
    return '';
  }
  const examId = response.getResponseText().trim();
  if (!examId) {
    return '';
  }
  try {
    getExamConfig_(examId);
    return examId;
  } catch (err) {
    SpreadsheetApp.getUi().alert(err.message);
    return '';
  }
}

function getBaseUrl_() {
  try {
    const serviceUrl = ScriptApp.getService().getUrl();
    if (serviceUrl) {
      return serviceUrl;
    }
  } catch (err) {
    // ignore errors, fallback below
  }
  try {
    const deployments = ScriptApp.getProjectDeployments();
    const webAppDeployment = deployments.find(dep => dep.getType() === ScriptApp.DeploymentType.WEB_APP);
    if (webAppDeployment) {
      return webAppDeployment.getUrl();
    }
  } catch (err) {
    // ignore errors, fallback below
  }
  return '';
}

// --- Planificador d'obertura/tancament ---

function updateAllScheduleTriggers_() {
  ensureSheets_();
  const configs = getAllExamConfigs_();
  // Neteja triggers anteriors d'aquesta funció
  clearSchedulerTriggers_();

  const now = new Date();
  configs.forEach(cfg => {
    const examId = cfg.examId;
    const startIso = cfg.startIso || '';
    const endIso = cfg.endIso || '';

    // Desa l'horari actual a Settings i reinicia banderes si canvien
    const openAtKey = 'schedule_open_at:' + examId;
    const storedOpenAt = ensureSettingValue_(openAtKey, '');
    if (String(storedOpenAt || '') !== String(startIso || '')) {
      setSettingValue_('schedule_open_done_ts:' + examId, '');
      setSettingValue_(openAtKey, startIso || '');
    }
    const closeAtKey = 'schedule_close_at:' + examId;
    const storedCloseAt = ensureSettingValue_(closeAtKey, '');
    if (String(storedCloseAt || '') !== String(endIso || '')) {
      setSettingValue_('schedule_close_done_ts:' + examId, '');
      setSettingValue_(closeAtKey, endIso || '');
    }

    // Programa triggers puntuals per als esdeveniments futurs que no s'hagin processat
    if (startIso) {
      const start = new Date(startIso);
      const done = ensureSettingValue_('schedule_open_done_ts:' + examId, '');
      if (start instanceof Date && !isNaN(start.getTime()) && start > now && String(done || '') !== String(startIso)) {
        ScriptApp.newTrigger('runSchedulerTick').timeBased().at(start).create();
      }
    }
    if (endIso) {
      const end = new Date(endIso);
      const doneC = ensureSettingValue_('schedule_close_done_ts:' + examId, '');
      if (end instanceof Date && !isNaN(end.getTime()) && end > now && String(doneC || '') !== String(endIso)) {
        ScriptApp.newTrigger('runSchedulerTick').timeBased().at(end).create();
      }
    }
  });
}

function clearSchedulerTriggers_() {
  const triggers = ScriptApp.getProjectTriggers() || [];
  triggers.forEach(tr => {
    try {
      if (tr.getHandlerFunction && tr.getHandlerFunction() === 'runSchedulerTick') {
        ScriptApp.deleteTrigger(tr);
      }
    } catch (err) {
      // ignora
    }
  });
}

// Executat per triggers puntuals per sincronitzar l'estat amb l'horari
function runSchedulerTick() {
  ensureSheets_();
  const now = new Date();
  const configs = getAllExamConfigs_();
  configs.forEach(cfg => {
    try { applyScheduledTransitionsIfDue_(cfg, now); } catch (e) {}
  });
}

// Aplica transicions programades (inici/fi) per a un examen concret si correspon en aquest moment.
// Retorna true si s'ha canviat alguna cosa (p.ex. passar a 'auto' i marcar com processat).
function applyScheduledTransitionsIfDue_(cfg, now) {
  let changed = false;
  const examId = cfg.examId;
  const manualChangedStr = ensureSettingValue_('manual_changed_ts:' + examId, '');
  const manualChangedTs = manualChangedStr ? new Date(manualChangedStr).getTime() : 0;

  // Obertura: si ja s'ha arribat a l'hora d'inici i l'últim canvi manual va ser abans (o no n'hi ha), forcem 'auto'
  if (cfg.startIso) {
    const start = new Date(cfg.startIso);
    if (start instanceof Date && !isNaN(start.getTime())) {
      if (now.getTime() >= start.getTime()) {
        if (!manualChangedTs || manualChangedTs <= start.getTime()) {
          // només si no està ja en 'auto'
          if (cfg.manualState !== 'auto') {
            setManualStateForExam_(examId, 'auto');
            changed = true;
          }
        }
        setSettingValue_('schedule_open_done_ts:' + examId, cfg.startIso);
      }
    }
  }

  // Tancament: si ja s'ha arribat a l'hora de fi i l'últim canvi manual va ser abans (o no n'hi ha), forcem 'auto'
  if (cfg.endIso) {
    const end = new Date(cfg.endIso);
    if (end instanceof Date && !isNaN(end.getTime())) {
      if (now.getTime() >= end.getTime()) {
        if (!manualChangedTs || manualChangedTs <= end.getTime()) {
          if (cfg.manualState !== 'auto') {
            setManualStateForExam_(examId, 'auto');
            changed = true;
          }
        }
        setSettingValue_('schedule_close_done_ts:' + examId, cfg.endIso);
      }
    }
  }

  return changed;
}

function setManualStateForExam_(examId, manualState) {
  const sheet = getSheet_(SHEET_NAMES.CONFIG);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (sameExamId_(values[i][0], examId)) {
      sheet.getRange(i + 1, CONFIG_COLUMNS.MANUAL_STATE).setValue(manualState);
      return true;
    }
  }
  return false;
}
