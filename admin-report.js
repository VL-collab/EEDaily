const ADMIN_STORE_KEY = 'electricalDailyAdminFiles';
const REPORT_FONT = 'Microsoft JhengHei';
const adminState = {
  files: [],
  importNotes: [],
  status: '',
  anchor: '',
  calendarMonth: '',
  periodType: 'weekly',
  lang: 'zh',
  busy: false
};

const reportText = {
  zh: {
    weekly: '週報',
    biweekly: '雙週報',
    monthly: '月報',
    title: '地盤電力工程',
    period: '報告期間',
    prepared: '本報告由每日 Excel 或專檔彙整，資料留在本機。',
    files: '日報份數',
    reportedDays: '有日報日數',
    missingDays: '未有日報',
    daytimeTotal: '日間開工人日',
    daytimeAverage: '平均日間開工人數',
    peak: '高峰開工人數',
    otDays: 'OT 日數',
    otPeople: 'OT 人數合計',
    otHours: 'OT 人時數',
    none: '無',
    noReport: '無日報',
    daytime: '日間',
    ot: '超時工作',
    site: '地盤名稱',
    contract: '項目編號',
    contractor: '承建商',
    date: '日期',
    weekday: '星期',
    headcount: '日間開工人數',
    otHead: 'OT 人數',
    people: '人',
    summary: '摘要',
    manpower: '開工人數',
    categories: '工作範疇',
    progress: '工程進度變化',
    events: '事項紀錄',
    staff: '辦公室人員',
    daily: '每日內容',
    charts: '圖表',
    noteTitle: '讀數說明',
    note: '日間開工人日只加總沒有 OT 標記的日報，避免與超時工作人數重疊。同一日若有多份 OT 日報，代表多於一段超時工作，人數會分開列出；完全相同的 OT 時段只保留較新檔案。工作範疇的涉及人數按地點人數記入每一個相關工種，不可把各工種人數相加當作總開工人數。',
    category: '工種大類',
    involved: '日間涉及人數',
    otInvolved: 'OT 涉及人數',
    task: '工序',
    startPct: '期初 %',
    endPct: '期末 %',
    change: '增減（百分點）',
    location: '工作地點',
    workers: '人數',
    trades: '工種',
    remark: '備註',
    kind: '類型',
    detail: '內容',
    file: '檔案',
    role: '職位',
    name: '姓名',
    weather: '天氣',
    signature: '已簽署',
    yes: '是',
    no: '否',
    material: '物料',
    mosi: 'MOSI',
    inspection: '其他檢查',
    injury: '工傷',
    obstacle: '阻礙',
    warning: '警告時段',
    stop: '停工',
    otSession: '超時時段',
    chartPeople: '每日開工人數',
    chartCategory: '工作範疇涉及人數',
    chartProgress: '工序完成百分比變化',
    from: '由',
    to: '至',
    point: '個百分點'
  },
  en: {
    weekly: 'Weekly Report',
    biweekly: 'Bi-weekly Report',
    monthly: 'Monthly Report',
    title: 'Electrical Site Works',
    period: 'Report period',
    prepared: 'Compiled locally from daily Word or Excel files. The data stays on this device.',
    files: 'Daily files',
    reportedDays: 'Days with a report',
    missingDays: 'Days without a report',
    daytimeTotal: 'Daytime man-days',
    daytimeAverage: 'Average daytime headcount',
    peak: 'Peak daytime headcount',
    otDays: 'OT days',
    otPeople: 'OT headcount total',
    otHours: 'OT person-hours',
    none: 'Nil',
    noReport: 'No daily report',
    daytime: 'Daytime',
    ot: 'Overtime',
    site: 'Site',
    contract: 'Contract No.',
    contractor: 'Contractor',
    date: 'Date',
    weekday: 'Weekday',
    headcount: 'Daytime headcount',
    otHead: 'OT headcount',
    people: 'persons',
    summary: 'Summary',
    manpower: 'Headcount',
    categories: 'Work categories',
    progress: 'Progress movement',
    events: 'Event register',
    staff: 'Office staff',
    daily: 'Daily records',
    charts: 'Charts',
    noteTitle: 'How the figures are counted',
    note: 'Daytime man-days add only daily files that are not marked OT, so overtime crews are not mixed into the daytime total. More than one OT file on the same date means more than one overtime session. An identical OT session keeps the newer file only. Category headcount is the location headcount recorded against each trade; do not add trades together to recreate the site total.',
    category: 'Trade category',
    involved: 'Daytime involved',
    otInvolved: 'OT involved',
    task: 'Activity',
    startPct: 'Opening %',
    endPct: 'Closing %',
    change: 'Change (points)',
    location: 'Location',
    workers: 'Headcount',
    trades: 'Trades',
    remark: 'Remark',
    kind: 'Type',
    detail: 'Detail',
    file: 'File',
    role: 'Role',
    name: 'Name',
    weather: 'Weather',
    signature: 'Signed',
    yes: 'Yes',
    no: 'No',
    material: 'Material',
    mosi: 'MOSI',
    inspection: 'Other inspection',
    injury: 'Injury',
    obstacle: 'Obstruction',
    warning: 'Warning period',
    stop: 'Work suspension',
    otSession: 'OT session',
    chartPeople: 'Daily headcount',
    chartCategory: 'Involved headcount by trade',
    chartProgress: 'Progress change',
    from: 'from',
    to: 'to',
    point: 'points'
  }
};

function reportLabel(lang, key) {
  return (reportText[lang] || reportText.zh)[key] || key;
}

function adminNum(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = parseFloat(String(value == null ? '' : value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function adminRound1(value) {
  return Math.round(adminNum(value) * 10) / 10;
}

function adminIsYes(value) {
  const text = String(value || '').trim().toLowerCase();
  return text === '是' || text === 'yes' || text === 'y' || text === 'true' || text === '1';
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function adminDateString(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getUTCFullYear()}-${pad2(value.getUTCMonth() + 1)}-${pad2(value.getUTCDate())}`;
  }
  if (typeof value === 'number' && window.XLSX && XLSX.SSF && XLSX.SSF.parse_date_code) {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed && parsed.y) return `${parsed.y}-${pad2(parsed.m)}-${pad2(parsed.d)}`;
  }
  const text = String(value || '').trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  return '';
}

function addIsoDays(iso, days) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return '';
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + days));
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function mondayOf(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  const weekday = date.getUTCDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  return addIsoDays(iso, offset);
}

function eachIsoDate(start, end) {
  const dates = [];
  let cursor = start;
  while (cursor && end && cursor <= end && dates.length < 40) {
    dates.push(cursor);
    cursor = addIsoDays(cursor, 1);
  }
  return dates;
}

function weekdayIndex(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return 0;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))).getUTCDay();
}

function weekdayName(iso, lang) {
  const names = lang === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  return names[weekdayIndex(iso)] || '';
}

function parseExportedAt(value) {
  const text = String(value || '').trim();
  const match = text.match(/(\d{1,4})[\/.\-](\d{1,2})[\/.\-](\d{1,4})(?:\D+(\d{1,2}):(\d{2}))?/);
  if (!match) {
    const parsed = Date.parse(text);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  let year = Number(match[1]);
  let month = Number(match[2]);
  let day = Number(match[3]);
  if (year < 1000) {
    day = Number(match[1]);
    month = Number(match[2]);
    year = Number(match[3]);
  }
  return Date.UTC(year, month - 1, day, Number(match[4] || 0), Number(match[5] || 0));
}

function fileRecency(file) {
  return Math.max(parseExportedAt(file.summary && file.summary.exportedAt), file.fileModified || 0, file.importedAt || 0);
}

function splitAdminList(value) {
  return String(value || '').split(/[、,，]/).map(item => item.trim()).filter(Boolean);
}

function readSheetObjects(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: '' });
  if (!matrix.length) return [];
  const first = matrix[0].map(cell => String(cell || '').trim());
  const keyed = first.indexOf('date') >= 0 || first.indexOf('reportKey') >= 0;
  const header = keyed ? first : matrix[0].map(cell => String(cell || '').trim());
  const start = keyed ? 2 : 1;
  const rows = [];
  for (let index = start; index < matrix.length; index += 1) {
    const source = matrix[index] || [];
    if (source.every(cell => String(cell || '').trim() === '')) continue;
    const item = {};
    header.forEach((key, column) => {
      if (key) item[key] = source[column] == null ? '' : source[column];
    });
    if (String(item.date || '') === 'date' || String(item.date || '') === '記錄日期') continue;
    rows.push(item);
  }
  return rows;
}

function detectOt(record) {
  const summary = record.summary || {};
  if (adminIsYes(summary.nightShift)) return true;
  if (adminNum(summary.overtimePersonHours) > 0) return true;
  return (record.periods || []).some(period => String(period.start || '').trim() || String(period.end || '').trim() || adminNum(period.workers) > 0);
}

function parseDailyFile(file, buffer) {
  if (!window.XLSX) throw new Error('Excel 元件未載入。請確認 vendor 資料夾與程式放在一起。');
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetNames = workbook.SheetNames || [];
  if (sheetNames.some(name => name.startsWith('摘要') || name.startsWith('Summary'))) {
    throw new Error('這是已彙整的總報告，請改用每日 Excel 或專檔。');
  }
  const summaryRows = readSheetObjects(workbook, '彙總');
  if (!summaryRows.length) throw new Error('找不到「彙總」工作表。請使用本程式匯出的每日 Excel。');
  const summary = summaryRows[0];
  const date = adminDateString(summary.date);
  if (!date) throw new Error('彙總表沒有記錄日期。');
  const periods = readSheetObjects(workbook, '超時時段');
  const record = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: file.name,
    fileModified: file.lastModified || 0,
    importedAt: Date.now(),
    source: 'excel',
    date,
    contractNo: String(summary.contractNo || '').trim(),
    siteName: String(summary.siteName || '').trim(),
    contractorName: String(summary.contractorName || '').trim(),
    hasOt: false,
    summary,
    locations: readSheetObjects(workbook, '開工分佈'),
    trades: readSheetObjects(workbook, '工種明細'),
    progress: readSheetObjects(workbook, '施工進度').filter(item => String(item.title || '').trim()),
    periods,
    staff: readSheetObjects(workbook, '辦公室人員'),
    weatherRows: readSheetObjects(workbook, '天氣警告')
  };
  record.hasOt = detectOt(record);
  return record;
}

function adminYesNo(value) {
  return value ? '是' : '否';
}

function jsonWeatherKind(label) {
  if (typeof weatherKind === 'function') return weatherKind(label);
  const text = String(label || '');
  if (text.includes('風球')) return '風球';
  if (text.includes('警告') || text.includes('暴雨')) return '警告';
  return '天氣';
}

function jsonOfficeRole(item) {
  if (typeof officeStaffDisplayRole === 'function') return officeStaffDisplayRole(item);
  const custom = String(item && item.customRole || '').trim();
  return custom || String(item && item.role || '').trim();
}

function jsonLocationIsOt(item, night) {
  if (typeof locationMarkedOt === 'function') return locationMarkedOt(item, night);
  return !!(item && item.ot);
}

function parseDailyJson(file, text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error('不是有效的專檔。');
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('不是有效的專檔。');
  if (!data.date && !Array.isArray(data.locations) && !Array.isArray(data.workProgress)) {
    throw new Error('不是本程式匯出的日報專檔。');
  }
  const date = adminDateString(data.date);
  if (!date) throw new Error('專檔沒有記錄日期。');

  const night = !!data.nightShift;
  const locations = Array.isArray(data.locations) ? data.locations : [];
  const nightPeriods = night && Array.isArray(data.nightPeriods) ? data.nightPeriods : [];
  const totalHeadcount = data.totalHeadcount != null && String(data.totalHeadcount).trim() !== ''
    ? adminNum(data.totalHeadcount)
    : locations.reduce((sum, item) => sum + adminNum(item.workers), 0);
  const overtimeHeadcount = data.overtimeHeadcount != null && String(data.overtimeHeadcount).trim() !== ''
    ? adminNum(data.overtimeHeadcount)
    : locations.reduce((sum, item) => sum + (jsonLocationIsOt(item, night) ? adminNum(item.workers) : 0), 0);
  const overtimePersonHours = night && typeof nightPeriodsTotalMinutes === 'function'
    ? adminRound1(nightPeriodsTotalMinutes(nightPeriods) / 60)
    : 0;
  const material = data.materialDelivery || {};
  const mosi = (data.inspections && data.inspections.mosi) || {};
  const other = (data.inspections && data.inspections.other) || {};
  const injury = (data.safety && data.safety.injury) || {};
  const obstacle = (data.safety && data.safety.obstacles) || {};
  const weatherItems = Array.isArray(data.weatherArray) && data.weatherArray.length
    ? data.weatherArray
    : String(data.weather || '').split('、').map(item => item.trim()).filter(Boolean);

  const summary = {
    date,
    contractNo: String(data.contractNo || '').trim(),
    siteName: String(data.siteName || '').trim(),
    contractorName: String(data.contractorName || '').trim(),
    recorder: data.recorder || '',
    weather: data.weather || weatherItems.join('、'),
    warningStart: data.warningStart || '',
    warningEnd: data.warningEnd || '',
    stopWorkStart: data.stopWorkStart || '',
    stopWorkEnd: data.stopWorkEnd || '',
    nightShift: adminYesNo(night),
    nightShiftStart: night ? (data.nightShiftStart || '') : '',
    nightShiftEnd: night ? (data.nightShiftEnd || '') : '',
    totalHeadcount,
    overtimeHeadcount,
    overtimePersonHours,
    materialArrival: adminYesNo(material.hasArrival),
    materialDetails: material.details || '',
    hasMosi: adminYesNo(mosi.hasMosi),
    mosiItem: mosi.item || '',
    mosiResult: mosi.hasMosi ? (mosi.result || '') : '',
    hasOtherInspection: adminYesNo(other.hasOther),
    otherInspectionDetails: other.details || '',
    hasInjury: adminYesNo(injury.hasInjury),
    injuryDetails: injury.details || '',
    hasObstacle: adminYesNo(obstacle.hasObstacle),
    obstacleDetails: obstacle.details || '',
    hasSignature: adminYesNo(data.signatures && data.signatures.engineer),
    exportedAt: data.timestamp || data.savedAt || ''
  };
  const record = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: file.name,
    fileModified: file.lastModified || 0,
    importedAt: Date.now(),
    source: 'json',
    date,
    contractNo: summary.contractNo,
    siteName: summary.siteName,
    contractorName: summary.contractorName,
    hasOt: false,
    summary,
    locations: locations.map(item => ({
      location: item.location || '',
      workers: adminNum(item.workers),
      ot: adminYesNo(jsonLocationIsOt(item, night)),
      categories: Array.isArray(item.categories) ? item.categories.join('、') : String(item.categories || ''),
      subCategories: Array.isArray(item.subCategories) ? item.subCategories.join('、') : String(item.subCategories || item.subCategory || ''),
      remark: item.remark || ''
    })),
    trades: [],
    progress: (Array.isArray(data.workProgress) ? data.workProgress : [])
      .filter(item => String(item && item.title || '').trim())
      .map(item => ({ title: String(item.title).trim(), percent: adminNum(item.percent) })),
    periods: nightPeriods.map(item => {
      const numbers = typeof periodHourNumbers === 'function' ? periodHourNumbers(item) : { hours: '', personHours: '' };
      const crosses = typeof periodCrossesMidnight === 'function' && periodCrossesMidnight(item.start, item.end);
      return {
        start: item.start || '',
        end: item.end || '',
        workers: adminNum(item.workers),
        hours: numbers.hours,
        personHours: numbers.personHours,
        crossesMidnight: adminYesNo(crosses)
      };
    }),
    staff: (Array.isArray(data.officeStaff) ? data.officeStaff : []).flatMap(item => {
      const slots = Array.isArray(item.periods) && item.periods.length ? item.periods : [{}];
      return slots.map(period => ({
        role: item.role || '',
        customRole: item.customRole || '',
        displayRole: jsonOfficeRole(item),
        name: item.name || '',
        start: period.start || '',
        end: period.end || '',
        workCategories: Array.isArray(period.categories) ? period.categories.join('、') : '',
        workDetails: typeof formatOfficeWork === 'function' ? formatOfficeWork(period) : '',
        remarks: typeof officeRemarksText === 'function' ? officeRemarksText(period) : ''
      }));
    }),
    weatherRows: weatherItems.map(label => ({
      weatherLabel: label,
      weatherKind: jsonWeatherKind(label)
    }))
  };
  record.hasOt = detectOt(record);
  return record;
}

function readZipEntries(buffer) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const entries = [];
  let offset = 0;
  while (offset + 30 <= bytes.length && view.getUint32(offset, true) === 0x04034b50) {
    const method = view.getUint16(offset + 8, true);
    const compSize = view.getUint32(offset + 18, true);
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    const name = new TextDecoder().decode(bytes.subarray(nameStart, nameStart + nameLen));
    const dataStart = nameStart + nameLen + extraLen;
    entries.push({ name, method, data: bytes.subarray(dataStart, dataStart + compSize) });
    offset = dataStart + compSize;
  }
  return entries;
}

async function inflateZip(entry) {
  if (entry.method === 0) return entry.data;
  if (entry.method === 8 && typeof DecompressionStream === 'function') {
    const stream = new Blob([entry.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  throw new Error('這份 Word 的壓縮方式未能讀取。請用本程式匯出的每日 Word。');
}

function decodeQuotedPrintable(bytes) {
  const out = [];
  for (let index = 0; index < bytes.length; index += 1) {
    if (bytes[index] === 61 && (bytes[index + 1] === 10 || bytes[index + 1] === 13)) {
      index += bytes[index + 1] === 13 && bytes[index + 2] === 10 ? 2 : 1;
      continue;
    }
    if (bytes[index] === 61) {
      const hex = String.fromCharCode(bytes[index + 1] || 0, bytes[index + 2] || 0);
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        out.push(parseInt(hex, 16));
        index += 2;
        continue;
      }
    }
    out.push(bytes[index]);
  }
  return new TextDecoder('utf-8').decode(new Uint8Array(out));
}

function wordCellText(cell) {
  return String(cell.innerText || cell.textContent || '').replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').trim();
}

function wordRows(table) {
  return Array.from(table.querySelectorAll('tr')).filter(row => row.closest('table') === table).map(row => (
    Array.from(row.children).map(wordCellText)
  ));
}

function wordLabelMap(table) {
  const map = {};
  wordRows(table).forEach(cells => {
    for (let index = 0; index + 1 < cells.length; index += 2) {
      const label = cells[index].replace(/[：:]\s*$/, '').trim();
      if (label) map[label] = cells[index + 1];
    }
  });
  return map;
}

function wordPeople(value) {
  const match = String(value || '').match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function padClock(value) {
  const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : '';
}

function wordRange(value) {
  const text = String(value || '').trim();
  if (!text || text === '無' || text === '無停工' || text === '未設定') return ['', ''];
  const match = text.match(/(\d{1,2}:\d{2})\D+(\d{1,2}:\d{2})/);
  return match ? [padClock(match[1]), padClock(match[2])] : ['', ''];
}

async function parseDailyWord(file, buffer) {
  const entries = readZipEntries(buffer);
  const part = entries.find(entry => entry.name === 'word/afchunk.mht');
  if (!part) throw new Error('這不是每日 Word 日報。請使用本程式匯出的每日 Word，不要匯入已彙整的總報告。');
  const decoded = decodeQuotedPrintable(await inflateZip(part));
  const start = decoded.search(/<html[\s>]/i);
  const end = decoded.toLowerCase().indexOf('</html>');
  if (start < 0 || end < 0) throw new Error('每日 Word 的內容未能讀取。');
  const doc = new DOMParser().parseFromString(decoded.slice(start, end + 7), 'text/html');
  const tables = Array.from(doc.querySelectorAll('table')).filter(table => !table.parentElement.closest('table'));
  if (tables.length < 4) throw new Error('每日 Word 的表格不完整。');
  const info = wordLabelMap(tables[0]);
  const date = (String(info['記錄日期'] || '').match(/\d{4}-\d{2}-\d{2}/) || [])[0] || '';
  if (!date) throw new Error('Word 日報沒有記錄日期。');
  const night = Object.prototype.hasOwnProperty.call(info, '超時人數') || Object.prototype.hasOwnProperty.call(info, '超時工作時段');
  const [warningStart, warningEnd] = wordRange(info['警告時段']);
  const [stopStart, stopEnd] = wordRange(info['停工時段']);
  const locations = wordRows(tables[1]).slice(1).filter(cells => cells[0] && !cells[0].includes('工作地點')).map(cells => {
    const lines = String(cells[2] || '').split('\n').map(line => line.trim()).filter(Boolean);
    const remark = lines.filter(line => line.startsWith('備註')).map(line => line.replace(/^備註[:：]\s*/, '')).join(' ');
    const trades = lines.filter(line => !line.startsWith('備註')).map(line => line.replace(/^\(OT\)\s*/, ''));
    return {
      location: String(cells[0] || '').replace(/\s*\(OT\)\s*$/, '').trim(),
      workers: wordPeople(cells[1]),
      ot: adminYesNo(/\(OT\)/.test(cells[0] || '') || lines.some(line => line.startsWith('(OT)'))),
      categories: trades[0] || '',
      subCategories: trades[1] || '',
      remark
    };
  });
  const progress = wordRows(tables[2]).slice(1).filter(cells => cells[0] && !cells[0].includes('施工工序')).map(cells => ({
    title: cells[0],
    percent: adminNum(String(cells[1] || '').replace('%', ''))
  })).filter(item => item.title);
  const materialRows = wordRows(tables[3]);
  const materialText = materialRows[1] ? materialRows[1][0] : '';
  const inspectionText = materialRows[1] ? materialRows[1][1] : '';
  const mosiMatch = String(inspectionText || '').match(/MOSI 驗收[:：]\s*([^\n]*)/);
  const otherMatch = String(inspectionText || '').match(/工序檢查[:：]\s*([^\n]*)/);
  const bodyText = doc.body.innerText || '';
  const injuryMatch = bodyText.match(/工傷事故[:：]\s*([^\n]+)/);
  const obstacleMatch = bodyText.match(/進度受阻[:：]\s*([^\n]+)/);
  const injuryText = injuryMatch ? injuryMatch[1].trim() : '';
  const obstacleText = obstacleMatch ? obstacleMatch[1].trim() : '';
  const periodTable = tables[0].querySelector('table');
  const periods = periodTable ? wordRows(periodTable).filter(cells => /\d{1,2}:\d{2}/.test(cells[0] || '')).map(cells => {
    const range = wordRange(cells[0]);
    const workers = wordPeople(cells[1]);
    const personHours = adminNum(String(cells[2] || '').replace(/小時/g, ''));
    return {
      start: range[0],
      end: range[1],
      workers,
      hours: workers ? adminRound1(personHours / workers) : '',
      personHours,
      crossesMidnight: adminYesNo(range[1] && range[0] && range[1] <= range[0])
    };
  }) : [];
  const staffTable = tables[4];
  const staff = staffTable ? wordRows(staffTable).slice(1).filter(cells => cells[0] && cells[0] !== '職位' && !cells[0].includes('無')).map(cells => ({
    role: cells[0],
    displayRole: cells[0],
    name: cells[1] || ''
  })) : [];
  const weatherItems = String(info['當日天氣/警告'] || '').split('、').map(item => item.trim()).filter(Boolean);
  const totalHeadcount = wordPeople(info['總開工人數']);
  const overtimeHeadcount = night ? wordPeople(info['超時人數']) : 0;
  const summary = {
    date,
    contractNo: String(info['項目編號'] || '').trim(),
    siteName: String(info['地盤名稱'] || '').trim(),
    contractorName: String(info['承建商'] || '').trim(),
    recorder: String(info['填報人員'] || '').trim(),
    weather: weatherItems.join('、'),
    warningStart,
    warningEnd,
    stopWorkStart: stopStart,
    stopWorkEnd: stopEnd,
    nightShift: adminYesNo(night),
    nightShiftStart: periods[0] ? periods[0].start : '',
    nightShiftEnd: periods.length ? `${periods[periods.length - 1].end}${periods.some(item => item.crossesMidnight === '是') ? ' Overnight' : ''}` : '',
    totalHeadcount,
    overtimeHeadcount,
    overtimePersonHours: adminRound1(periods.reduce((sum, item) => sum + adminNum(item.personHours), 0)),
    materialArrival: adminYesNo(materialText && !materialText.includes('無物料')),
    materialDetails: materialText && !materialText.includes('無物料') ? materialText : '',
    hasMosi: adminYesNo(mosiMatch && mosiMatch[1].trim() && mosiMatch[1].trim() !== '無'),
    mosiItem: mosiMatch && mosiMatch[1].trim() !== '無' ? (mosiMatch[1].match(/^(.*?)\s*\[/) || [, mosiMatch[1]])[1].trim() : '',
    mosiResult: mosiMatch && /\[(.+)\]/.test(mosiMatch[1]) ? mosiMatch[1].match(/\[(.+)\]/)[1] : '',
    hasOtherInspection: adminYesNo(otherMatch && otherMatch[1].trim() && otherMatch[1].trim() !== '無'),
    otherInspectionDetails: otherMatch && otherMatch[1].trim() !== '無' ? otherMatch[1].trim() : '',
    hasInjury: adminYesNo(injuryText && !injuryText.includes('零工傷') && injuryText !== '無'),
    injuryDetails: injuryText && !injuryText.includes('零工傷') ? injuryText : '',
    hasObstacle: adminYesNo(obstacleText && !obstacleText.includes('無受阻')),
    obstacleDetails: obstacleText && !obstacleText.includes('無受阻') ? obstacleText : '',
    hasSignature: adminYesNo(!!doc.querySelector('img')),
    exportedAt: file.lastModified ? new Date(file.lastModified).toISOString() : ''
  };
  const record = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: file.name,
    fileModified: file.lastModified || 0,
    importedAt: Date.now(),
    source: 'word',
    date,
    contractNo: summary.contractNo,
    siteName: summary.siteName,
    contractorName: summary.contractorName,
    hasOt: false,
    summary,
    locations,
    trades: [],
    progress,
    periods,
    staff,
    weatherRows: weatherItems.map(label => ({ weatherLabel: label, weatherKind: jsonWeatherKind(label) }))
  };
  record.hasOt = detectOt(record);
  return record;
}

function readAdminUpload(file) {
  const name = String(file.name || '').toLowerCase();
  if (name.endsWith('.docx')) return file.arrayBuffer().then(buffer => parseDailyWord(file, buffer));
  if (name.endsWith('.xlsx')) return file.arrayBuffer().then(buffer => parseDailyFile(file, buffer));
  if (name.endsWith('.json')) return file.text().then(text => parseDailyJson(file, text));
  if (name.endsWith('.doc')) return Promise.reject(new Error('請使用 .docx 每日報告。舊式 .doc 未能讀取。'));
  return Promise.reject(new Error('請選擇每日 Word（.docx）或 Excel（.xlsx）。'));
}

function promptImportKind() {
  return new Promise(resolve => {
    const existing = document.getElementById('adminImportModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'adminImportModal';
    modal.className = 'fixed inset-0 bg-slate-950/60 z-[90] flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
        <h3 class="text-lg font-bold text-slate-900 mb-1">匯入每日報告</h3>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">選擇要匯入的格式。可一次選多份。</p>
        <div class="flex flex-col gap-2">
          <button type="button" data-kind="word" class="h-11 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black">匯入 Word</button>
          <button type="button" data-kind="excel" class="h-11 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black">匯入 Excel</button>
          <button type="button" data-kind="" class="h-11 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold">取消</button>
        </div>
      </div>
    `;
    let settled = false;
    const finish = (kind) => {
      if (settled) return;
      settled = true;
      modal.remove();
      resolve(kind);
    };
    modal.addEventListener('click', (event) => {
      const button = event.target.closest('[data-kind]');
      if (button) finish(button.getAttribute('data-kind'));
      else if (event.target === modal) finish('');
    });
    document.body.appendChild(modal);
  });
}

function otSignature(file) {
  const periods = (file.periods || [])
    .map(period => [String(period.start || '').trim(), String(period.end || '').trim(), String(adminNum(period.workers))].join('~'))
    .filter(item => item !== '~~0')
    .sort()
    .join('|');
  return periods || `file:${file.fileName}`;
}

function sortAdminFiles(a, b) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.hasOt !== b.hasOt) return a.hasOt ? 1 : -1;
  return String(a.fileName).localeCompare(String(b.fileName), 'zh-HK');
}

function mergeAdminFiles(existing, incoming) {
  const notes = [];
  const nonOt = new Map();
  const otGroups = new Map();
  existing.concat(incoming).forEach(file => {
    const dayKey = `${file.date}|${file.contractNo || ''}`;
    if (!file.hasOt) {
      const previous = nonOt.get(dayKey);
      if (!previous || fileRecency(file) >= fileRecency(previous)) {
        if (previous) notes.push(`同日一般日報保留較新檔案，略過：${previous.fileName}`);
        nonOt.set(dayKey, file);
      } else {
        notes.push(`同日一般日報保留較新檔案，略過：${file.fileName}`);
      }
      return;
    }
    const signature = `${dayKey}|${otSignature(file)}`;
    const previous = otGroups.get(signature);
    if (!previous || fileRecency(file) >= fileRecency(previous)) {
      if (previous) notes.push(`相同 OT 時段保留較新檔案，略過：${previous.fileName}`);
      otGroups.set(signature, file);
    } else {
      notes.push(`相同 OT 時段保留較新檔案，略過：${file.fileName}`);
    }
  });
  return {
    files: Array.from(nonOt.values()).concat(Array.from(otGroups.values())).sort(sortAdminFiles),
    notes
  };
}

function fileOtHours(file) {
  const fromPeriods = (file.periods || []).reduce((sum, period) => {
    const personHours = adminNum(period.personHours);
    if (personHours) return sum + personHours;
    return sum + adminNum(period.hours) * adminNum(period.workers);
  }, 0);
  if (fromPeriods) return fromPeriods;
  return adminNum(file.summary && file.summary.overtimePersonHours);
}

function collectEvents(file) {
  const summary = file.summary || {};
  const events = [];
  const push = (kind, text) => {
    const value = String(text || '').trim();
    if (value) events.push({ kind, text: value, fileName: file.fileName, date: file.date, ot: !!file.hasOt });
  };
  if (adminIsYes(summary.materialArrival)) push('material', summary.materialDetails || reportLabel('zh', 'material'));
  if (adminIsYes(summary.hasMosi)) push('mosi', [summary.mosiItem, summary.mosiResult].filter(Boolean).join(' · '));
  if (adminIsYes(summary.hasOtherInspection)) push('inspection', summary.otherInspectionDetails);
  if (adminIsYes(summary.hasInjury)) push('injury', summary.injuryDetails || reportLabel('zh', 'injury'));
  if (adminIsYes(summary.hasObstacle)) push('obstacle', summary.obstacleDetails || reportLabel('zh', 'obstacle'));
  if (summary.warningStart || summary.warningEnd) push('warning', `${summary.warningStart || '—'}–${summary.warningEnd || '—'}`);
  if (summary.stopWorkStart || summary.stopWorkEnd) push('stop', `${summary.stopWorkStart || '—'}–${summary.stopWorkEnd || '—'}`);
  (file.weatherRows || []).forEach(row => {
    if (row.weatherKind && row.weatherKind !== '天氣') push('weather', `${row.weatherLabel} (${row.weatherKind})`);
  });
  (file.periods || []).forEach(period => {
    if (String(period.start || '').trim() || String(period.end || '').trim() || adminNum(period.workers)) {
      events.push({
        kind: 'otSession',
        text: '',
        period,
        fileName: file.fileName,
        date: file.date,
        ot: true
      });
    }
  });
  return events;
}

function formatEvent(event, lang) {
  if (event.kind === 'otSession' && event.period) {
    const period = event.period;
    const hours = adminNum(period.personHours) || adminRound1(adminNum(period.hours) * adminNum(period.workers));
    return `${period.start || '—'}–${period.end || '—'} · ${adminNum(period.workers)} ${reportLabel(lang, 'people')} · ${adminRound1(hours)}`;
  }
  return event.text || '';
}

function summaryHasOtHeadcount(file) {
  const value = file && file.summary ? file.summary.overtimeHeadcount : undefined;
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function fileOtPeople(file) {
  if (summaryHasOtHeadcount(file)) return adminNum(file.summary.overtimeHeadcount);
  return file.hasOt ? adminNum(file.summary && file.summary.totalHeadcount) : 0;
}

function fileNormalPeople(file) {
  if (!file.hasOt) return adminNum(file.summary && file.summary.totalHeadcount);
  if (!summaryHasOtHeadcount(file)) return 0;
  return Math.max(0, adminNum(file.summary.totalHeadcount) - adminNum(file.summary.overtimeHeadcount));
}

function locationRowIsOt(location) {
  if (!location || location.ot === undefined || location.ot === null || String(location.ot).trim() === '') return null;
  return adminIsYes(location.ot);
}

function buildDayRecord(date, files) {
  const daytimeFiles = files.filter(file => !file.hasOt).sort((a, b) => fileRecency(b) - fileRecency(a));
  const otFiles = files.filter(file => file.hasOt);
  const daytimeFile = daytimeFiles[0] || null;
  const newestOt = otFiles.slice().sort((a, b) => fileRecency(b) - fileRecency(a))[0] || null;
  const splitNormal = otFiles.reduce((sum, file) => sum + (summaryHasOtHeadcount(file) ? fileNormalPeople(file) : 0), 0);
  const daytimeHeadcount = daytimeFile
    ? adminNum(daytimeFile.summary.totalHeadcount)
    : (splitNormal > 0 ? splitNormal : null);
  const daytime = daytimeFile || (daytimeHeadcount != null ? newestOt : null);
  const main = daytimeFile || newestOt;
  return {
    date,
    files,
    daytime,
    otFiles,
    main,
    daytimeHeadcount,
    otHeadcount: otFiles.reduce((sum, file) => sum + fileOtPeople(file), 0),
    otPersonHours: adminRound1(otFiles.reduce((sum, file) => sum + fileOtHours(file), 0)),
    locations: main ? main.locations : [],
    progress: main ? main.progress : [],
    events: files.flatMap(collectEvents),
    summary: main ? main.summary : null
  };
}

function accumulateCategories(files, target) {
  files.forEach(file => {
    (file.locations || []).forEach(location => {
      const flagged = locationRowIsOt(location);
      const rowIsOt = flagged === null ? !!file.hasOt : flagged;
      const workers = adminNum(location.workers);
      const names = splitAdminList(location.categories);
      (names.length ? names : ['未分類']).forEach(name => {
        if (!target.has(name)) {
          target.set(name, { category: name, daytimeWorkers: 0, otWorkers: 0 });
        }
        const row = target.get(name);
        if (rowIsOt) row.otWorkers += workers;
        else row.daytimeWorkers += workers;
      });
    });
  });
}

function progressMovement(days) {
  const map = new Map();
  days.forEach(day => {
    (day.progress || []).forEach(item => {
      const title = String(item.title || '').trim();
      if (!title) return;
      if (!map.has(title)) map.set(title, []);
      map.get(title).push({ date: day.date, percent: adminNum(item.percent) });
    });
  });
  return Array.from(map.entries()).map(([title, points]) => {
    const first = points[0];
    const last = points[points.length - 1];
    return {
      title,
      startDate: first.date,
      endDate: last.date,
      start: first.percent,
      end: last.percent,
      change: adminRound1(last.percent - first.percent)
    };
  }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change) || a.title.localeCompare(b.title, 'zh-HK'));
}

function uniqueStaff(files) {
  const seen = new Set();
  const list = [];
  files.forEach(file => {
    (file.staff || []).forEach(item => {
      const role = String(item.displayRole || item.role || '').trim();
      const name = String(item.name || '').trim();
      if (!role && !name) return;
      const key = `${role}|${name}`;
      if (seen.has(key)) return;
      seen.add(key);
      list.push({ role, name });
    });
  });
  return list;
}

function analyzeContract(files, period) {
  const dates = eachIsoDate(period.start, period.end);
  const byDate = new Map();
  files.forEach(file => {
    if (!byDate.has(file.date)) byDate.set(file.date, []);
    byDate.get(file.date).push(file);
  });
  const days = dates.map(date => buildDayRecord(date, byDate.get(date) || []));
  const daytimeDays = days.filter(day => day.daytime);
  const totalDaytime = daytimeDays.reduce((sum, day) => sum + day.daytimeHeadcount, 0);
  const peak = daytimeDays.reduce((best, day) => day.daytimeHeadcount > best.value ? { value: day.daytimeHeadcount, date: day.date } : best, { value: 0, date: '' });
  const categories = new Map();
  accumulateCategories(files, categories);
  const cover = files.slice().sort((a, b) => fileRecency(b) - fileRecency(a))[0] || {};
  return {
    contractNo: cover.contractNo || '',
    siteName: Array.from(new Set(files.map(file => file.siteName).filter(Boolean))).join('、'),
    contractorName: Array.from(new Set(files.map(file => file.contractorName).filter(Boolean))).join('、'),
    days,
    files,
    totalDaytime,
    averageDaytime: daytimeDays.length ? adminRound1(totalDaytime / daytimeDays.length) : 0,
    peak,
    otPeople: days.reduce((sum, day) => sum + day.otHeadcount, 0),
    otHours: adminRound1(days.reduce((sum, day) => sum + day.otPersonHours, 0)),
    otDays: days.filter(day => day.otFiles.length).length,
    reportedDays: days.filter(day => day.files.length).length,
    missing: days.filter(day => !day.files.length).map(day => day.date),
    categories: Array.from(categories.values()).sort((a, b) => (b.daytimeWorkers + b.otWorkers) - (a.daytimeWorkers + a.otWorkers)),
    progress: progressMovement(days),
    events: days.flatMap(day => day.events),
    staff: uniqueStaff(files)
  };
}

function selectedAnchor() {
  if (adminState.anchor) return adminState.anchor;
  const dates = adminState.files.map(file => file.date).filter(Boolean).sort();
  if (dates.length) return dates[dates.length - 1];
  return typeof hongKongToday === 'function' ? hongKongToday() : '';
}

function currentPeriod() {
  const anchor = selectedAnchor();
  if (adminState.periodType === 'biweekly') {
    const weekStart = mondayOf(anchor);
    return { type: 'biweekly', anchor, start: addIsoDays(weekStart, -7), end: addIsoDays(weekStart, 6) };
  }
  if (adminState.periodType === 'monthly') {
    const match = /^(\d{4})-(\d{2})/.exec(anchor);
    const year = match ? Number(match[1]) : 2026;
    const month = match ? Number(match[2]) : 1;
    const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return { type: 'monthly', anchor, start: `${year}-${pad2(month)}-01`, end: `${year}-${pad2(month)}-${pad2(last)}` };
  }
  const start = mondayOf(anchor);
  return { type: 'weekly', anchor, start, end: addIsoDays(start, 6) };
}

function buildReportModel() {
  const period = currentPeriod();
  const included = adminState.files.filter(file => file.date >= period.start && file.date <= period.end);
  const keys = Array.from(new Set(included.map(file => file.contractNo || '')));
  return {
    period,
    included,
    lang: adminState.lang,
    contracts: keys.map(contractNo => analyzeContract(included.filter(file => (file.contractNo || '') === contractNo), period))
  };
}

function narrativeFor(contract, period, lang) {
  const t = key => reportLabel(lang, key);
  const missing = contract.missing.length ? contract.missing.join(lang === 'en' ? ', ' : '、') : t('none');
  const peak = contract.peak.date ? `${contract.peak.value} ${t('people')} (${contract.peak.date})` : t('none');
  const sentences = [
    lang === 'en'
      ? `${t(period.type)} ${period.start} ${t('to')} ${period.end}. Reports were filed on ${contract.reportedDays} day(s). Days without a report: ${missing}.`
      : `${t(period.type)}涵蓋 ${period.start} 至 ${period.end}。其中 ${contract.reportedDays} 日有日報。未有日報的日子：${missing}。`,
    lang === 'en'
      ? `Daytime man-days total ${contract.totalDaytime}. Average daytime headcount is ${contract.averageDaytime}. Peak daytime headcount is ${peak}.`
      : `日間開工人日合計 ${contract.totalDaytime}。平均每日 ${contract.averageDaytime} 人。高峰開工人數為 ${peak}。`,
    lang === 'en'
      ? `Overtime was recorded on ${contract.otDays} day(s), with OT headcount ${contract.otPeople} and ${contract.otHours} OT person-hours.`
      : `超時工作共 ${contract.otDays} 日，OT 人數合計 ${contract.otPeople}，OT 人時數 ${contract.otHours}。`
  ];
  contract.progress.slice(0, 3).forEach(item => {
    const sign = item.change > 0 ? '+' : '';
    sentences.push(lang === 'en'
      ? `${item.title}: ${item.start}% ${t('to')} ${item.end}% (${sign}${item.change} ${t('point')}).`
      : `${item.title}：由 ${formatAdminPercent(item.start)}% 至 ${formatAdminPercent(item.end)}%（${sign}${formatAdminPercent(item.change)} ${t('point')}）。`);
  });
  return sentences.join(lang === 'en' ? ' ' : '');
}

function formatAdminPercent(value) {
  const number = adminRound1(value);
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function niceAxisMax(value) {
  const number = Math.max(1, value);
  const power = Math.pow(10, Math.floor(Math.log10(number)));
  const step = power / 2;
  return Math.ceil(number / step) * step;
}

function drawGroupedBarChart(title, labels, seriesList) {
  const width = 1400;
  const height = 680;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#1B3A4B';
  ctx.font = `bold 32px ${REPORT_FONT}, sans-serif`;
  ctx.fillText(title, 48, 52);
  let legendX = 48;
  seriesList.forEach(series => {
    ctx.fillStyle = series.color;
    ctx.fillRect(legendX, 72, 18, 18);
    ctx.fillStyle = '#334155';
    ctx.font = `20px ${REPORT_FONT}, sans-serif`;
    ctx.fillText(series.name, legendX + 26, 88);
    legendX += ctx.measureText(series.name).width + 70;
  });
  const plot = { x: 90, y: 120, w: width - 150, h: 430 };
  const max = niceAxisMax(Math.max(1, ...seriesList.flatMap(series => series.values.map(adminNum))));
  ctx.strokeStyle = '#e2e8f0';
  ctx.fillStyle = '#64748b';
  ctx.font = `16px ${REPORT_FONT}, sans-serif`;
  for (let step = 0; step <= 4; step += 1) {
    const value = max * step / 4;
    const y = plot.y + plot.h - (plot.h * step / 4);
    ctx.beginPath();
    ctx.moveTo(plot.x, y);
    ctx.lineTo(plot.x + plot.w, y);
    ctx.stroke();
    ctx.fillText(String(adminRound1(value)), 16, y + 5);
  }
  const groupWidth = plot.w / Math.max(1, labels.length);
  const barWidth = Math.max(8, Math.min(36, (groupWidth - 18) / Math.max(1, seriesList.length)));
  labels.forEach((label, index) => {
    seriesList.forEach((series, seriesIndex) => {
      const value = adminNum(series.values[index]);
      const barHeight = (value / max) * plot.h;
      const x = plot.x + index * groupWidth + 10 + seriesIndex * barWidth;
      const y = plot.y + plot.h - barHeight;
      ctx.fillStyle = series.color;
      ctx.fillRect(x, y, Math.max(4, barWidth - 4), barHeight);
    });
    ctx.save();
    ctx.translate(plot.x + index * groupWidth + groupWidth / 2, plot.y + plot.h + 18);
    ctx.rotate(-0.7);
    ctx.fillStyle = '#334155';
    ctx.font = `16px ${REPORT_FONT}, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(label, 0, 0);
    ctx.restore();
  });
  return canvas.toDataURL('image/png');
}

function drawProgressChart(title, items, lang) {
  const rows = items.slice(0, 12);
  const width = 1400;
  const height = 150 + Math.max(1, rows.length) * 48;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#1B3A4B';
  ctx.font = `bold 32px ${REPORT_FONT}, sans-serif`;
  ctx.fillText(title, 40, 48);
  const left = 520;
  const right = width - 180;
  rows.forEach((item, index) => {
    const y = 100 + index * 48;
    ctx.fillStyle = '#334155';
    ctx.font = `16px ${REPORT_FONT}, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(item.title, 40, y + 6);
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    const xFor = percent => left + ((right - left) * Math.max(0, Math.min(100, percent)) / 100);
    ctx.strokeStyle = '#1B3A4B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xFor(item.start), y);
    ctx.lineTo(xFor(item.end), y);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(xFor(item.start), y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1B3A4B';
    ctx.beginPath();
    ctx.arc(xFor(item.end), y, 6, 0, Math.PI * 2);
    ctx.fill();
    const sign = item.change > 0 ? '+' : '';
    ctx.fillStyle = '#b45309';
    ctx.textAlign = 'left';
    ctx.fillText(`${sign}${formatAdminPercent(item.change)} ${reportLabel(lang, 'point')}`, right + 8, y + 6);
  });
  if (!rows.length) {
    ctx.fillStyle = '#64748b';
    ctx.font = `22px ${REPORT_FONT}, sans-serif`;
    ctx.fillText(reportLabel(lang, 'none'), 40, 110);
  }
  return canvas.toDataURL('image/png');
}

function chartSet(contract, lang) {
  const labels = contract.days.map(day => day.date.slice(5));
  const headcount = drawGroupedBarChart(reportLabel(lang, 'chartPeople'), labels, [
    { name: reportLabel(lang, 'daytime'), color: '#1B3A4B', values: contract.days.map(day => day.daytimeHeadcount || 0) },
    { name: reportLabel(lang, 'ot'), color: '#D97706', values: contract.days.map(day => day.otHeadcount || 0) }
  ]);
  const categories = contract.categories.slice(0, 10);
  const categoryChart = drawGroupedBarChart(reportLabel(lang, 'chartCategory'), categories.map(item => item.category), [
    { name: reportLabel(lang, 'involved'), color: '#1B3A4B', values: categories.map(item => item.daytimeWorkers) },
    { name: reportLabel(lang, 'otInvolved'), color: '#D97706', values: categories.map(item => item.otWorkers) }
  ]);
  const progress = drawProgressChart(reportLabel(lang, 'chartProgress'), contract.progress, lang);
  return { headcount, categoryChart, progress };
}

function docxRun(text, options = {}) {
  return new docx.TextRun({
    text: text == null ? '' : String(text),
    font: REPORT_FONT,
    size: options.size || 21,
    bold: !!options.bold,
    color: options.color || '1E293B'
  });
}

function docxParagraph(text, options = {}) {
  return new docx.Paragraph({
    spacing: { before: options.before || 0, after: options.after == null ? 80 : options.after },
    alignment: options.align || docx.AlignmentType.LEFT,
    children: Array.isArray(text) ? text : [docxRun(text, options)]
  });
}

function docxCell(text, width, options = {}) {
  const fill = options.fill || '';
  return new docx.TableCell({
    width: { size: width, type: docx.WidthType.DXA },
    shading: fill ? { fill } : undefined,
    margins: { top: 50, bottom: 50, left: 70, right: 70 },
    children: [new docx.Paragraph({
      children: [docxRun(text, {
        bold: options.bold,
        size: options.size || 18,
        color: options.color || (fill === '1B3A4B' ? 'FFFFFF' : '1E293B')
      })]
    })]
  });
}

function docxTable(widths, bodyRows) {
  return new docx.Table({
    width: { size: widths.reduce((sum, width) => sum + width, 0), type: docx.WidthType.DXA },
    columnWidths: widths,
    rows: bodyRows
  });
}

function docxHeaderRow(labels, widths) {
  return new docx.TableRow({
    tableHeader: true,
    cantSplit: true,
    children: labels.map((label, index) => docxCell(label, widths[index], { fill: '1B3A4B', bold: true, color: 'FFFFFF' }))
  });
}

function docxImage(dataUrl, width, height) {
  return new docx.Paragraph({
    spacing: { before: 120, after: 160 },
    children: [new docx.ImageRun({ data: dataUrl, transformation: { width, height } })]
  });
}

function signedText(summary, lang) {
  if (!summary) return reportLabel(lang, 'no');
  return adminIsYes(summary.hasSignature) ? reportLabel(lang, 'yes') : reportLabel(lang, 'no');
}

function buildWordSection(model, contract, charts) {
  const lang = model.lang;
  const t = key => reportLabel(lang, key);
  const colon = lang === 'en' ? ': ' : '：';
  const pageWidth = 10080;
  const children = [];
  children.push(docxParagraph(t('title'), { bold: true, size: 40, color: '1B3A4B', before: 0, after: 40 }));
  children.push(docxParagraph(t(model.period.type), { bold: true, size: 32, color: 'B45309', before: 0, after: 160 }));
  children.push(docxParagraph(`${contract.siteName || t('none')}`, { size: 24, before: 0, after: 40 }));
  children.push(docxParagraph(`${t('contract')}${colon}${contract.contractNo || t('none')}`, { size: 20, color: '475569', after: 40 }));
  children.push(docxParagraph(`${t('contractor')}${colon}${contract.contractorName || t('none')}`, { size: 20, color: '475569', after: 120 }));
  children.push(docxParagraph(narrativeFor(contract, model.period, lang), { size: 21, after: 160 }));

  const infoWidths = [2520, 2520, 2520, 2520];
  const metrics = [
    [t('period'), `${model.period.start} – ${model.period.end}`, t('files'), String(contract.files.length)],
    [t('reportedDays'), String(contract.reportedDays), t('missingDays'), String(contract.missing.length)],
    [t('daytimeTotal'), String(contract.totalDaytime), t('daytimeAverage'), String(contract.averageDaytime)],
    [t('peak'), contract.peak.date ? `${contract.peak.value} (${contract.peak.date})` : t('none'), t('otDays'), String(contract.otDays)],
    [t('otPeople'), String(contract.otPeople), t('otHours'), String(contract.otHours)]
  ];
  children.push(docxTable(infoWidths, metrics.map((row, index) => new docx.TableRow({
    cantSplit: true,
    children: row.map((value, cellIndex) => docxCell(value, infoWidths[cellIndex], {
      fill: index % 2 ? 'F8FAFC' : 'FFFFFF',
      bold: cellIndex % 2 === 0
    }))
  }))));

  children.push(docxParagraph(t('noteTitle'), { bold: true, size: 28, color: '1B3A4B', before: 280, after: 80 }));
  children.push(docxParagraph(t('note'), { size: 18, color: '475569' }));

  children.push(docxParagraph(t('charts'), { bold: true, size: 28, color: '1B3A4B', before: 300, after: 80 }));
  children.push(docxImage(charts.headcount, 620, 300));
  children.push(docxImage(charts.categoryChart, 620, 300));
  const progressRows = Math.max(1, Math.min(12, contract.progress.length));
  children.push(docxImage(charts.progress, 620, Math.round(620 * (150 + progressRows * 48) / 1400)));

  children.push(docxParagraph(t('manpower'), { bold: true, size: 28, color: '1B3A4B', before: 280, after: 80 }));
  const dayWidths = [1800, 1200, 1760, 1760, 1760, 1800];
  const dayRows = [docxHeaderRow([t('date'), t('weekday'), t('headcount'), t('otHead'), t('otHours'), t('weather')], dayWidths)];
  contract.days.forEach((day, index) => {
    const fill = index % 2 ? 'F8FAFC' : 'FFFFFF';
    dayRows.push(new docx.TableRow({
      cantSplit: true,
      children: [
        day.date,
        weekdayName(day.date, lang),
        day.daytimeHeadcount == null ? (day.files.length ? '—' : t('noReport')) : String(day.daytimeHeadcount),
        day.otFiles.length ? String(day.otHeadcount) : '—',
        day.otFiles.length ? String(day.otPersonHours) : '—',
        (day.summary && day.summary.weather) || '—'
      ].map((value, cellIndex) => docxCell(value, dayWidths[cellIndex], { fill }))
    }));
  });
  children.push(docxTable(dayWidths, dayRows));

  children.push(docxParagraph(t('categories'), { bold: true, size: 28, color: '1B3A4B', before: 300, after: 80 }));
  const catWidths = [5040, 2520, 2520];
  const catRows = [docxHeaderRow([t('category'), t('involved'), t('otInvolved')], catWidths)];
  (contract.categories.length ? contract.categories : [{ category: t('none'), daytimeWorkers: '', otWorkers: '' }]).forEach((item, index) => {
    const fill = index % 2 ? 'F8FAFC' : 'FFFFFF';
    catRows.push(new docx.TableRow({
      cantSplit: true,
      children: [item.category, item.daytimeWorkers, item.otWorkers].map((value, cellIndex) => docxCell(value, catWidths[cellIndex], { fill }))
    }));
  });
  children.push(docxTable(catWidths, catRows));

  children.push(docxParagraph(t('progress'), { bold: true, size: 28, color: '1B3A4B', before: 300, after: 80 }));
  const progWidths = [4320, 1440, 1440, 1440, 1440];
  const progRows = [docxHeaderRow([t('task'), t('startPct'), t('endPct'), t('change'), t('date')], progWidths)];
  (contract.progress.length ? contract.progress : [{ title: t('none'), start: '', end: '', change: '', endDate: '' }]).forEach((item, index) => {
    const fill = index % 2 ? 'F8FAFC' : 'FFFFFF';
    const sign = adminNum(item.change) > 0 ? '+' : '';
    progRows.push(new docx.TableRow({
      cantSplit: true,
      children: [
        item.title,
        item.start === '' ? '' : formatAdminPercent(item.start),
        item.end === '' ? '' : formatAdminPercent(item.end),
        item.change === '' ? '' : `${sign}${formatAdminPercent(item.change)}`,
        item.endDate || ''
      ].map((value, cellIndex) => docxCell(value, progWidths[cellIndex], { fill }))
    }));
  });
  children.push(docxTable(progWidths, progRows));

  children.push(docxParagraph(t('events'), { bold: true, size: 28, color: '1B3A4B', before: 300, after: 80 }));
  const eventWidths = [1600, 1600, 4880, 2000];
  const eventRows = [docxHeaderRow([t('date'), t('kind'), t('detail'), t('file')], eventWidths)];
  const eventSource = contract.events.length ? contract.events : [{ date: '', kind: 'none', text: t('none'), fileName: '' }];
  eventSource.forEach((event, index) => {
    const fill = index % 2 ? 'F8FAFC' : 'FFFFFF';
    eventRows.push(new docx.TableRow({
      cantSplit: true,
      children: [event.date, t(event.kind), formatEvent(event, lang), event.fileName].map((value, cellIndex) => docxCell(value, eventWidths[cellIndex], { fill }))
    }));
  });
  children.push(docxTable(eventWidths, eventRows));

  children.push(docxParagraph(t('staff'), { bold: true, size: 28, color: '1B3A4B', before: 300, after: 80 }));
  const staffWidths = [5040, 5040];
  const staffRows = [docxHeaderRow([t('role'), t('name')], staffWidths)];
  (contract.staff.length ? contract.staff : [{ role: t('none'), name: '' }]).forEach((item, index) => {
    const fill = index % 2 ? 'F8FAFC' : 'FFFFFF';
    staffRows.push(new docx.TableRow({
      cantSplit: true,
      children: [item.role, item.name].map((value, cellIndex) => docxCell(value, staffWidths[cellIndex], { fill }))
    }));
  });
  children.push(docxTable(staffWidths, staffRows));

  children.push(docxParagraph(t('daily'), { bold: true, size: 28, color: '1B3A4B', before: 320, after: 80 }));
  contract.days.forEach(day => {
    const head = day.daytimeHeadcount == null ? '—' : String(day.daytimeHeadcount);
    children.push(docxParagraph(`${day.date} ${weekdayName(day.date, lang)}    ${t('headcount')} ${head}    ${t('otHead')} ${day.otFiles.length ? day.otHeadcount : '—'}`, {
      bold: true,
      size: 22,
      color: '1B3A4B',
      before: 180,
      after: 60
    }));
    if (!day.files.length) {
      children.push(docxParagraph(t('noReport'), { color: '64748B' }));
      return;
    }
    const locationWidths = [3200, 1200, 2840, 2840];
    const locationRows = [docxHeaderRow([t('location'), t('workers'), t('trades'), t('remark')], locationWidths)];
    const locationSource = day.locations.length ? day.locations : [{ location: t('none'), workers: '', categories: '', subCategories: '', remark: '' }];
    locationSource.forEach((location, index) => {
      const fill = index % 2 ? 'F8FAFC' : 'FFFFFF';
      const ot = locationRowIsOt(location) === true;
      const trades = [location.categories, location.subCategories].filter(Boolean).join(' / ');
      const locationName = `${location.location || ''}${ot ? ' (OT)' : ''}`;
      const tradeText = ot && trades ? `(OT) ${trades}` : trades;
      locationRows.push(new docx.TableRow({
        cantSplit: true,
        children: [locationName, location.workers, tradeText, location.remark].map((value, cellIndex) => docxCell(value, locationWidths[cellIndex], { fill }))
      }));
    });
    children.push(docxTable(locationWidths, locationRows));
    if (day.progress.length) {
      children.push(docxParagraph(day.progress.map(item => `${item.title} ${formatAdminPercent(item.percent)}%`).join('    '), { size: 18, before: 60 }));
    }
    if (day.summary) {
      children.push(docxParagraph(`${t('weather')}${colon}${day.summary.weather || t('none')}    ${t('signature')}${colon}${signedText(day.summary, lang)}`, { size: 18, color: '475569', before: 40 }));
    }
    day.otFiles.forEach(file => {
      const sessions = (file.periods || []).map(period => formatEvent({ kind: 'otSession', period }, lang)).filter(Boolean).join(lang === 'en' ? '; ' : '；');
      children.push(docxParagraph(`OT · ${file.fileName} · ${fileOtPeople(file)} ${t('people')}${sessions ? ` · ${sessions}` : ''}`, { size: 18, before: 40 }));
    });
  });

  return {
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 800, bottom: 800, left: 720, right: 720, header: 400, footer: 400 }
      }
    },
    headers: {
      default: new docx.Header({
        children: [docxParagraph(`${contract.contractNo || ''}    ${t(model.period.type)}    ${model.period.start} – ${model.period.end}`, { size: 16, color: '64748B', after: 40 })]
      })
    },
    footers: {
      default: new docx.Footer({
        children: [new docx.Paragraph({
          alignment: docx.AlignmentType.RIGHT,
          children: [new docx.TextRun({ children: [docx.PageNumber.CURRENT], font: REPORT_FONT, size: 16, color: '64748B' })]
        })]
      })
    },
    children
  };
}

const EN_GLOSSARY = [
  ['啟德住宅發展項目', 'Kai Tak Residential Development'],
  ['正常工作時間', 'Normal working hours'],
  ['供電切斷後跨夜埋線', 'Main switchboard termination after electrical isolation, carried out overnight'],
  ['天台電纜在日間吊運後補放', 'Roof cable laying after daytime hoisting'],
  ['天台主纜跨夜施放', 'Overnight laying of the roof main cable'],
  ['走廊燈具在收工後補裝', 'Corridor luminaire installation after normal working hours'],
  ['總掣櫃接線跨夜進行', 'Overnight termination at the main switchboard'],
  ['天台防雷銅帶跨夜焊接', 'Overnight welding of roof lightning-protection copper tape'],
  ['黃色暴雨期間露天及天台工作暫停，工人調往室內。', 'External and roof works were suspended during the amber rainstorm warning. Workers were redeployed indoors.'],
  ['雷暴警告生效時暫停天台工作。', 'Roof works were suspended while the thunderstorm warning was in force.'],
  ['三號風球期間暫停天台及棚架工作。', 'Roof and scaffold works were suspended during typhoon signal No. 3.'],
  ['電纜 4 卷、線槽 80 米運抵地盤，已點收。', '4 cable drums and 80 m of trunking were delivered and checked.'],
  ['燈具 60 套、插座 40 隻運抵，已核對送貨單。', '60 luminaires and 40 socket outlets were delivered. The delivery note was checked.'],
  ['安裝燈喉線槽等', 'Conduit and trunking'],
  ['ELV 系統', 'ELV system'],
  ['安裝MIMEP', 'MiMEP installation'],
  ['安裝DFMA', 'DfMA installation'],
  ['放線及放纜工程', 'Cabling'],
  ['設備及燈具安裝', 'Equipment and luminaires'],
  ['接地及測試工程', 'Earthing and testing'],
  ['拆改及臨時工程', 'Alteration and temporary works'],
  ['其他地盤工作', 'Other site works'],
  ['樓面暗喉', 'Floor concealed conduit'],
  ['間牆暗喉', 'Partition concealed conduit'],
  ['安裝明喉', 'Surface conduit'],
  ['安裝槽栖', 'Trunking brackets'],
  ['槽栖打碼', 'Bracket marking'],
  ['安裝線槽', 'Cable trunking'],
  ['安裝疏䇴', 'Cable tray'],
  ['穿細線', 'Final-circuit wiring'],
  ['穿支總', 'Sub-main cabling'],
  ['放Power Cable', 'Power cable laying'],
  ['裝頭埋蛇', 'Glanding and termination'],
  ['安裝掣箱', 'Distribution board installation'],
  ['安裝燈具', 'Luminaire installation'],
  ['安裝插座及電掣等', 'Socket outlet and switch installation'],
  ['安裝總掣箱', 'Main switchboard installation'],
  ['總掣箱埋線', 'Main switchboard termination'],
  ['安裝刀掣', 'Switch-fuse installation'],
  ['安裝出路牌等', 'Exit sign installation'],
  ['安裝EV充電座', 'EV charger installation'],
  ['內運MIMEP組件', 'MiMEP module delivery'],
  ['安裝MIMEP組件', 'MiMEP module installation'],
  ['改裝MIMEP組件', 'MiMEP module modification'],
  ['拆改MIMEP組件', 'MiMEP module dismantling'],
  ['內運DFMA組件', 'DfMA module delivery'],
  ['安裝DFMA組件', 'DfMA module installation'],
  ['改裝DFMA組件', 'DfMA module modification'],
  ['拆改DFMA組件', 'DfMA module dismantling'],
  ['安裝驗樓設備', 'Inspection equipment installation'],
  ['安裝一般設備', 'General equipment installation'],
  ['安裝中央系統', 'Central system installation'],
  ['拆改裝備', 'Equipment alteration'],
  ['安裝接地水線', 'Earthing conductor installation'],
  ['安裝銅帶', 'Copper tape installation'],
  ['拆改掣箱或刀掣', 'Distribution board or switch-fuse alteration'],
  ['拆改電掣面', 'Switch plate alteration'],
  ['臨時安裝（需註明）', 'Temporary installation (see remark)'],
  ['其他（需註明）', 'Others (see remark)'],
  ['其他 (需備註)', 'Others (see remark)'],
  ['執DEFECT', 'Defect rectification'],
  ['打電工作', 'Energisation'],
  ['全座暗喉', 'Block-wide concealed conduit'],
  ['線槽安裝', 'Cable trunking installation'],
  ['電力纜敷設', 'Power cable installation'],
  ['燈具安裝', 'Luminaire installation'],
  ['掣箱安裝', 'Distribution board installation'],
  ['晴天 (Fine)', 'Fine'],
  ['多雲 (Cloudy)', 'Cloudy'],
  ['微雨 (Light Rain)', 'Light rain'],
  ['大雨 / 暴雨 (Heavy Rain)', 'Heavy rain'],
  ['黃色暴雨 (Amber Rainstorm)', 'Amber rainstorm warning'],
  ['紅色暴雨 (Red Rainstorm)', 'Red rainstorm warning'],
  ['黑色暴雨 (Black Rainstorm)', 'Black rainstorm warning'],
  ['雷暴警告 (Thunderstorm Warning)', 'Thunderstorm warning'],
  ['冰雹警告 (Hail Warning)', 'Hail warning'],
  ['1 號風球 (T1)', 'Typhoon signal No. 1'],
  ['3 號風球 (T3)', 'Typhoon signal No. 3'],
  ['8 號或以上風球 (T8+)', 'Typhoon signal No. 8 or above'],
  ['進度 Site Walk', 'Progress site walk'],
  ['安全 Site Walk', 'Safety site walk'],
  ['360 拍攝記錄', '360-degree photo record'],
  ['工程管理', 'Project management'],
  ['安排工作', 'Work planning'],
  ['批核文件', 'Document approval'],
  ['當天無物料運抵地盤', 'No material delivered'],
  ['零工傷 (Nil)', 'Nil'],
  ['無受阻事項', 'No obstruction'],
  ['無停工', 'No work suspension'],
  ['分段超時工作', 'Split overtime'],
  ['住宅發展項目', 'Residential Development'],
  ['天花線槽放樣', 'Ceiling trunking setting-out'],
  ['主掣櫃底架', 'Main switchboard plinth'],
  ['間牆喉管', 'Partition conduit'],
  ['照明回路', 'Lighting circuit'],
  ['走廊線槽', 'Corridor trunking'],
  ['地庫水線', 'Basement earthing conductor'],
  ['室內明喉', 'Indoor surface conduit'],
  ['走廊插座', 'Corridor socket outlets'],
  ['單位暗喉', 'Flat concealed conduit'],
  ['泵房控制線', 'Pump room control wiring'],
  ['總掣櫃就位', 'Main switchboard positioning'],
  ['天花槽栖', 'Ceiling trunking brackets'],
  ['走廊燈', 'Corridor luminaires'],
  ['睡房暗喉', 'Bedroom concealed conduit'],
  ['電錶房刀掣', 'Meter room switch-fuse'],
  ['大堂線槽', 'Lobby trunking'],
  ['地庫支總', 'Basement sub-main'],
  ['廚房暗喉', 'Kitchen concealed conduit'],
  ['天台銅帶', 'Roof copper tape'],
  ['梯間明喉', 'Staircase surface conduit'],
  ['客廳暗喉', 'Living room concealed conduit'],
  ['房間插座', 'Room socket outlets'],
  ['電錶房收口', 'Meter room making good'],
  ['總掣房', 'Main Switch Room'],
  ['電錶房', 'Meter Room'],
  ['泵房', 'Pump Room'],
  ['分掣櫃', 'Sub-distribution board'],
  ['主掣櫃', 'Main switchboard'],
  ['總掣櫃', 'Main switchboard'],
  ['電力纜', 'Power cable'],
  ['清箱', 'Box clearing'],
  ['改穿線', 'Rewiring'],
  ['改喉', 'Conduit alteration'],
  ['拆喉', 'Conduit removal'],
  ['拆燈', 'Luminaire removal'],
  ['穿線', 'Cable pulling'],
  ['未指定細類', 'Unspecified sub-trade'],
  ['未指定地點', 'Unspecified location'],
  ['未分類', 'Unclassified'],
  ['跨夜', 'overnight'],
  ['翌日', 'the following day'],
  ['天台', 'Roof'],
  ['地庫', 'Basement'],
  ['走廊', 'corridor'],
  ['天花', 'ceiling'],
  ['大堂', 'lobby'],
  ['梯間', 'staircase'],
  ['睡房', 'bedroom'],
  ['客廳', 'living room'],
  ['廚房', 'kitchen'],
  ['室內', 'indoor'],
  ['露天', 'external area'],
  ['棚架', 'scaffold'],
  ['單位', 'flat'],
  ['A座', 'Block A'],
  ['B座', 'Block B'],
  ['C座', 'Block C'],
  ['合格', 'accepted'],
  ['備註', 'Remark'],
  ['電力管工', 'Electrical Foreman'],
  ['線槽打碼', 'Trunking marking'],
  ['啟德住宅', 'Kai Tak'],
  ['日間', 'daytime'],
  ['風球', 'typhoon signal'],
  ['警告', 'warning'],
  ['天氣', 'weather']
];
EN_GLOSSARY.sort((left, right) => right[0].length - left[0].length);

function toEnglish(value) {
  let text = String(value == null ? '' : value);
  if (!/[\u4e00-\u9fff]/.test(text)) return text;
  EN_GLOSSARY.forEach(([zh, en]) => {
    if (text.includes(zh)) text = text.split(zh).join(en);
  });
  return text
    .replace(/、/g, ', ')
    .replace(/。/g, '. ')
    .replace(/：/g, ': ')
    .replace(/；/g, '; ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function localizeNode(value, key) {
  if (typeof value === 'string') {
    if (['name', 'contractNo', 'id', 'kind', 'source', 'lang', 'type', 'anchor', 'date', 'startDate', 'endDate'].includes(key)) return value;
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
    return toEnglish(value);
  }
  if (Array.isArray(value)) return value.map(item => localizeNode(item, key));
  if (value && typeof value === 'object') {
    const copy = {};
    Object.keys(value).forEach(child => {
      copy[child] = localizeNode(value[child], child);
    });
    return copy;
  }
  return value;
}

function localizeModel(model) {
  if (!model || model.lang !== 'en') return model;
  return localizeNode(model, '');
}

function reportBaseName(model) {
  const contracts = model.contracts.map(item => sanitizeFilePart(item.contractNo).replace(/\s+/g, '')).filter(Boolean);
  const project = contracts.length === 1 ? contracts[0] : (contracts.length > 1 ? (model.lang === 'en' ? 'multi-project' : '多項目') : (model.lang === 'en' ? 'no-contract' : '未填項目編號'));
  const kind = model.period.type || 'weekly';
  const stamp = typeof hongKongFileStamp === 'function' ? hongKongFileStamp(new Date()) : 'report';
  return `${stamp}-${project}-${kind}`;
}

async function exportAdminWord(model) {
  model = localizeModel(model);
  if (!window.docx || !docx.Document || !docx.Packer) throw new Error('Word 元件未載入。請確認 vendor 資料夾與程式放在一起。');
  const sections = model.contracts.map(contract => buildWordSection(model, contract, chartSet(contract, model.lang)));
  const document = new docx.Document({
    creator: '地盤電力工程每日記錄系統',
    title: reportLabel(model.lang, model.period.type),
    sections
  });
  const blob = await docx.Packer.toBlob(document);
  downloadAdminBlob(blob, `${reportBaseName(model)}.docx`);
  if (typeof alertModal === 'function') alertModal('Word 匯出成功', `已匯出報告：${reportBaseName(model)}.docx`);
}

function excelHeaderFill(cell) {
  cell.font = { name: REPORT_FONT, size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A4B' } };
  cell.alignment = { vertical: 'middle', wrapText: true };
}

function excelBody(cell, bold) {
  cell.font = { name: REPORT_FONT, size: 11, bold: !!bold, color: { argb: 'FF1E293B' } };
  cell.alignment = { vertical: 'middle', wrapText: true };
}

function writeExcelTable(sheet, headers, rows) {
  const headerRowNumber = sheet.rowCount + 1;
  sheet.addRow(headers);
  sheet.lastRow.eachCell(excelHeaderFill);
  sheet.lastRow.height = 22;
  rows.forEach((row, index) => {
    const added = sheet.addRow(row);
    added.eachCell(cell => {
      excelBody(cell);
      if (index % 2) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    });
  });
  sheet.views = [{ state: 'frozen', ySplit: headerRowNumber }];
  sheet.autoFilter = {
    from: { row: headerRowNumber, column: 1 },
    to: { row: headerRowNumber + rows.length, column: headers.length }
  };
  headers.forEach((header, index) => {
    const column = sheet.getColumn(index + 1);
    column.width = Math.max(column.width || 0, Math.min(42, Math.max(14, String(header).length + 8)));
  });
}

function addChartImage(workbook, sheet, dataUrl, row) {
  const imageId = workbook.addImage({
    base64: String(dataUrl).replace(/^data:image\/png;base64,/, ''),
    extension: 'png'
  });
  sheet.addImage(imageId, { tl: { col: 0, row }, ext: { width: 720, height: 320 } });
}

async function exportAdminExcel(model) {
  model = localizeModel(model);
  if (!window.ExcelJS) throw new Error('Excel 元件未載入。請確認 vendor 資料夾與程式放在一起。');
  const lang = model.lang;
  const t = key => reportLabel(lang, key);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = lang === 'en' ? 'Electrical Site Works Daily Log' : '地盤電力工程每日記錄系統';
  workbook.created = new Date();

  model.contracts.forEach((contract, contractIndex) => {
    const suffix = model.contracts.length > 1 ? ` ${contractIndex + 1}` : '';
    const charts = chartSet(contract, lang);
    const summary = workbook.addWorksheet(`${t('summary')}${suffix}`.slice(0, 31));
    summary.addRow([t('title'), t(model.period.type)]);
    summary.addRow([t('site'), contract.siteName]);
    summary.addRow([t('contract'), contract.contractNo]);
    summary.addRow([t('contractor'), contract.contractorName]);
    summary.addRow([t('period'), `${model.period.start} – ${model.period.end}`]);
    summary.addRow([]);
    writeExcelTable(summary, [t('kind'), t('detail')], [
      [t('files'), contract.files.length],
      [t('reportedDays'), contract.reportedDays],
      [t('missingDays'), contract.missing.join(lang === 'en' ? ', ' : '、') || t('none')],
      [t('daytimeTotal'), contract.totalDaytime],
      [t('daytimeAverage'), contract.averageDaytime],
      [t('peak'), contract.peak.date ? `${contract.peak.value} (${contract.peak.date})` : t('none')],
      [t('otDays'), contract.otDays],
      [t('otPeople'), contract.otPeople],
      [t('otHours'), contract.otHours]
    ]);
    summary.addRow([]);
    summary.addRow([narrativeFor(contract, model.period, lang)]);
    summary.addRow([t('note')]);
    summary.getColumn(1).width = 28;
    summary.getColumn(2).width = 88;
    summary.getRow(1).font = { name: REPORT_FONT, size: 16, bold: true, color: { argb: 'FF1B3A4B' } };

    const people = workbook.addWorksheet(`${t('manpower')}${suffix}`.slice(0, 31));
    writeExcelTable(people, [t('date'), t('weekday'), t('headcount'), t('otHead'), t('otHours'), t('weather'), t('file')], contract.days.map(day => [
      day.date,
      weekdayName(day.date, lang),
      day.daytimeHeadcount == null ? '' : day.daytimeHeadcount,
      day.otFiles.length ? day.otHeadcount : '',
      day.otFiles.length ? day.otPersonHours : '',
      (day.summary && day.summary.weather) || '',
      day.files.map(file => file.fileName).join(lang === 'en' ? '; ' : '；')
    ]));

    const categories = workbook.addWorksheet(`${t('categories')}${suffix}`.slice(0, 31));
    writeExcelTable(categories, [t('category'), t('involved'), t('otInvolved')], contract.categories.map(item => [item.category, item.daytimeWorkers, item.otWorkers]));

    const progress = workbook.addWorksheet(`${t('progress')}${suffix}`.slice(0, 31));
    writeExcelTable(progress, [t('task'), t('startPct'), t('endPct'), t('change'), t('date')], contract.progress.map(item => [
      item.title,
      item.start,
      item.end,
      item.change,
      `${item.startDate} – ${item.endDate}`
    ]));

    const events = workbook.addWorksheet(`${t('events')}${suffix}`.slice(0, 31));
    writeExcelTable(events, [t('date'), t('kind'), t('detail'), t('file')], contract.events.map(event => [
      event.date,
      t(event.kind),
      formatEvent(event, lang),
      event.fileName
    ]));

    const daily = workbook.addWorksheet(`${t('daily')}${suffix}`.slice(0, 31));
    const dailyRows = [];
    contract.days.forEach(day => {
      if (!day.files.length) {
        dailyRows.push([day.date, weekdayName(day.date, lang), t('noReport'), '', '', '', '', '']);
        return;
      }
      day.files.forEach(file => {
        const locations = (file.locations || []).map(item => {
          const mark = locationRowIsOt(item) === true ? '(OT) ' : '';
          return `${mark}${item.location || ''} ${adminNum(item.workers)}${reportLabel(lang, 'people')} ${mark}${item.categories || ''} ${item.subCategories || ''} ${item.remark || ''}`;
        }).join('\n');
        const progressText = (file.progress || []).map(item => `${item.title} ${formatAdminPercent(item.percent)}%`).join('\n');
        const eventText = collectEvents(file).map(event => `${t(event.kind)}：${formatEvent(event, lang)}`).join('\n');
        dailyRows.push([
          day.date,
          file.hasOt ? t('ot') : t('daytime'),
          file.fileName,
          summaryHasOtHeadcount(file) ? `${adminNum(file.summary.totalHeadcount)} / OT ${fileOtPeople(file)}` : adminNum(file.summary.totalHeadcount),
          locations,
          progressText,
          eventText,
          signedText(file.summary, lang)
        ]);
      });
    });
    writeExcelTable(daily, [t('date'), t('kind'), t('file'), t('workers'), t('location'), t('progress'), t('events'), t('signature')], dailyRows);
    daily.getColumn(5).width = 48;
    daily.getColumn(6).width = 36;
    daily.getColumn(7).width = 48;

    const chartSheet = workbook.addWorksheet(`${t('charts')}${suffix}`.slice(0, 31));
    chartSheet.addRow([t('chartPeople')]);
    chartSheet.addRow([t('chartCategory')]);
    chartSheet.addRow([t('chartProgress')]);
    addChartImage(workbook, chartSheet, charts.headcount, 3);
    addChartImage(workbook, chartSheet, charts.categoryChart, 22);
    addChartImage(workbook, chartSheet, charts.progress, 41);
    chartSheet.getColumn(1).width = 40;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadAdminBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${reportBaseName(model)}.xlsx`);
  if (typeof alertModal === 'function') alertModal('Excel 匯出成功', `已匯出報告：${reportBaseName(model)}.xlsx`);
}

function downloadAdminBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    link.remove();
  }, 800);
}

function persistAdminFiles() {
  try {
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(adminState.files));
  } catch (error) {
    console.error('管理者清單未能寫入本機', error);
  }
}

function restoreAdminFiles() {
  try {
    const raw = localStorage.getItem(ADMIN_STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    adminState.files = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    adminState.files = [];
  }
  const dates = adminState.files.map(file => file.date).filter(Boolean).sort();
  if (!adminState.anchor && dates.length) adminState.anchor = dates[dates.length - 1];
  if (!adminState.calendarMonth) adminState.calendarMonth = (adminState.anchor || dates[dates.length - 1] || '').slice(0, 7);
}

function refreshAdminView() {
  const count = document.getElementById('adminFileCount');
  const range = document.getElementById('adminDateRange');
  const otCount = document.getElementById('adminOtCount');
  const notes = document.getElementById('adminNotes');
  const list = document.getElementById('adminFileList');
  const periodLabel = document.getElementById('adminPeriodLabel');
  if (!count || !list) return;
  const dates = adminState.files.map(file => file.date).filter(Boolean).sort();
  count.textContent = String(adminState.files.length);
  if (otCount) otCount.textContent = String(adminState.files.filter(file => file.hasOt).length);
  if (range) range.textContent = dates.length ? `${dates[0]} 至 ${dates[dates.length - 1]}` : '尚未匯入';
  if (notes) notes.textContent = adminState.importNotes.concat(adminState.status ? [adminState.status] : []).join('\n');
  const period = currentPeriod();
  const included = adminState.files.filter(file => file.date >= period.start && file.date <= period.end);
  if (periodLabel && period.start) {
    const typeName = reportLabel('zh', period.type);
    periodLabel.textContent = `${typeName}：${period.start} 至 ${period.end}，期間內 ${included.length} 份日報。`;
  }
  document.querySelectorAll('input[name="adminPeriod"]').forEach(input => {
    input.checked = input.value === adminState.periodType;
  });
  document.querySelectorAll('input[name="adminLang"]').forEach(input => {
    input.checked = input.value === adminState.lang;
  });
  const sorted = adminState.files.slice().sort(sortAdminFiles);
  list.innerHTML = sorted.length ? sorted.map(file => `
    <li class="border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="font-bold text-sm text-slate-900 break-all">${escapeHtml(file.fileName)}</p>
        <p class="text-xs text-slate-500 mt-1">${escapeHtml(file.date)} · ${escapeHtml(file.contractNo || '未填項目編號')} · ${file.source === 'word' ? 'Word' : (file.source === 'json' ? '專檔' : 'Excel')} ${file.hasOt ? '<span class="admin-ot">OT</span>' : '<span class="text-slate-400">日間</span>'}</p>
      </div>
      <button type="button" data-action="remove" data-id="${escapeHtml(file.id)}" class="shrink-0 h-8 px-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50">移除</button>
    </li>
  `).join('') : '<li class="text-sm text-slate-500">尚未匯入檔案。按「新增日報」後可選擇 Word 或 Excel，並一次選擇多份。</li>';
  renderAdminCalendar(period);
}

function renderAdminCalendar(period) {
  const host = document.getElementById('adminCalendar');
  const title = document.getElementById('adminCalTitle');
  if (!host) return;
  const monthText = adminState.calendarMonth || (selectedAnchor() || '2026-01').slice(0, 7);
  adminState.calendarMonth = monthText;
  const [year, month] = monthText.split('-').map(Number);
  if (title) title.textContent = `${year}年${month}月`;
  const first = new Date(Date.UTC(year, month - 1, 1));
  const pad = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const byDate = new Map();
  adminState.files.forEach(file => {
    if (!byDate.has(file.date)) byDate.set(file.date, []);
    byDate.get(file.date).push(file);
  });
  const headers = ['一', '二', '三', '四', '五', '六', '日'].map(day => `<div class="text-center text-xs font-black text-slate-500">${day}</div>`).join('');
  let cells = '';
  for (let index = 0; index < pad; index += 1) cells += '<div></div>';
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-${pad2(month)}-${pad2(day)}`;
    const files = byDate.get(iso) || [];
    const classes = ['admin-day'];
    if (files.length) classes.push('has-report');
    if (period.start && iso >= period.start && iso <= period.end) classes.push('in-period');
    if (iso === adminState.anchor) classes.push('is-anchor');
    const ot = files.some(file => file.hasOt) ? '<span class="admin-ot">OT</span>' : '';
    const count = files.length > 1 ? `<span class="block text-[10px] font-bold opacity-70">${files.length} 份</span>` : '';
    cells += `<button type="button" data-action="pick-day" data-date="${iso}" class="${classes.join(' ')}"><span class="block text-sm font-black">${day}</span>${ot}${count}</button>`;
  }
  host.innerHTML = `<div class="admin-cal mb-2">${headers}</div><div class="admin-cal">${cells}</div>`;
}

function importAdminExcelFiles(event) {
  const input = event.target;
  const selected = Array.from(input.files || []);
  input.value = '';
  if (!selected.length) return;
  Promise.all(selected.map(file => readAdminUpload(file).then(
    record => ({ record }),
    error => ({ error, fileName: file.name })
  ))).then(items => {
    const parsed = [];
    const errors = [];
    items.forEach(item => {
      if (item.record) parsed.push(item.record);
      else errors.push(`${item.fileName}：${item.error && item.error.message ? item.error.message : item.error}`);
    });
    const merged = mergeAdminFiles(adminState.files, parsed);
    adminState.files = merged.files;
    adminState.importNotes = merged.notes.concat(errors);
    if (!adminState.anchor) {
      const dates = adminState.files.map(file => file.date).filter(Boolean).sort();
      adminState.anchor = dates[dates.length - 1] || '';
    }
    if (adminState.anchor) adminState.calendarMonth = adminState.anchor.slice(0, 7);
    persistAdminFiles();
    refreshAdminView();
    if (errors.length && typeof alertModal === 'function') {
      alertModal(parsed.length ? '部分檔案未匯入' : '未能匯入', errors.join('\n'));
    }
  }).catch(error => {
    if (typeof alertModal === 'function') alertModal('未能匯入', String(error.message || error));
  });
}

async function exportAdminReport(kind) {
  if (adminState.busy) return;
  const model = buildReportModel();
  if (!model.included.length) {
    if (typeof alertModal === 'function') alertModal('未能匯出', '所選期間內沒有日報。請匯入每日 Excel 或專檔，或在月曆另選日子。');
    return;
  }
  adminState.busy = true;
  adminState.status = kind === 'word' ? '正在產生 Word 報告…' : '正在產生 Excel 報告…';
  refreshAdminView();
  try {
    if (kind === 'word') await exportAdminWord(model);
    else await exportAdminExcel(model);
    adminState.status = '';
  } catch (error) {
    console.error(error);
    adminState.status = '';
    if (typeof alertModal === 'function') alertModal('匯出失敗', String(error.message || error));
  } finally {
    adminState.busy = false;
    refreshAdminView();
  }
}

function onAdminClick(event) {
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  const action = actionEl.getAttribute('data-action');
  if (action === 'add') {
    const input = document.getElementById('adminExcelInput');
    if (!input) return;
    promptImportKind().then(kind => {
      if (!kind) return;
      input.accept = kind === 'word'
        ? '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      input.click();
    });
  } else if (action === 'remove') {
    const id = actionEl.getAttribute('data-id');
    adminState.files = adminState.files.filter(file => file.id !== id);
    persistAdminFiles();
    refreshAdminView();
  } else if (action === 'prev-month' || action === 'next-month') {
    const [year, month] = (adminState.calendarMonth || selectedAnchor().slice(0, 7) || '2026-01').split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1 + (action === 'next-month' ? 1 : -1), 1));
    adminState.calendarMonth = `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}`;
    refreshAdminView();
  } else if (action === 'pick-day') {
    adminState.anchor = actionEl.getAttribute('data-date') || '';
    refreshAdminView();
  } else if (action === 'export-word') {
    exportAdminReport('word');
  } else if (action === 'export-excel') {
    exportAdminReport('excel');
  }
}

function onAdminChange(event) {
  if (event.target.name === 'adminPeriod') {
    adminState.periodType = event.target.value;
    refreshAdminView();
  }
  if (event.target.name === 'adminLang') {
    adminState.lang = event.target.value;
  }
}

const ADMIN_PASSWORD = 'Admin';

function promptAdminPassword() {
  return new Promise(resolve => {
    const existing = document.getElementById('adminPasswordModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'adminPasswordModal';
    modal.className = 'fixed inset-0 bg-slate-950/60 z-[90] flex items-center justify-center p-4';
    modal.innerHTML = `
      <form class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200" data-admin-password-form>
        <h3 class="text-lg font-bold text-slate-900 mb-1">進入管理者模式</h3>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">請輸入管理者密碼。</p>
        <input type="password" autocomplete="off" class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-amber-500" placeholder="密碼" data-admin-password>
        <p class="text-sm text-rose-600 mt-2 min-h-[1.25rem]" data-admin-password-error></p>
        <div class="flex gap-2 mt-3">
          <button type="button" data-answer="no" class="flex-1 h-11 bg-slate-200 hover:bg-slate-300 active:scale-95 font-bold text-slate-700 rounded-xl transition">取消</button>
          <button type="submit" class="flex-1 h-11 bg-amber-500 hover:bg-amber-600 active:scale-95 font-bold text-slate-950 rounded-xl transition">進入</button>
        </div>
      </form>
    `;
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      modal.remove();
      resolve(ok);
    };
    const form = modal.querySelector('[data-admin-password-form]');
    const input = modal.querySelector('[data-admin-password]');
    const error = modal.querySelector('[data-admin-password-error]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (input.value === ADMIN_PASSWORD) {
        finish(true);
        return;
      }
      error.textContent = '密碼不正確，請再試一次。';
      input.select();
      input.focus();
    });
    modal.querySelector('[data-answer="no"]').addEventListener('click', () => finish(false));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) finish(false);
    });
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') finish(false);
    });
    document.body.appendChild(modal);
    input.focus();
  });
}

function switchAppMode(mode) {
  const admin = document.getElementById('adminWorkspace');
  const alreadyAdmin = !!(admin && !admin.classList.contains('hidden'));
  if (mode === 'admin' && !alreadyAdmin) {
    promptAdminPassword().then(ok => {
      if (ok) applyAppMode('admin');
    });
    return;
  }
  applyAppMode(mode);
}

function applyAppMode(mode) {
  const showAdmin = mode === 'admin';
  const daily = document.getElementById('dailyWorkspace');
  const admin = document.getElementById('adminWorkspace');
  const tabDaily = document.getElementById('tabDaily');
  const tabAdmin = document.getElementById('tabAdmin');
  if (daily) daily.classList.toggle('hidden', showAdmin);
  if (admin) admin.classList.toggle('hidden', !showAdmin);
  document.querySelectorAll('.daily-only').forEach(node => node.classList.toggle('hidden', showAdmin));
  if (tabDaily) {
    tabDaily.className = showAdmin
      ? 'h-10 px-4 rounded-t-xl text-sm font-bold text-amber-100 hover:bg-slate-800'
      : 'h-10 px-4 rounded-t-xl text-sm font-black bg-amber-500 text-slate-950';
  }
  if (tabAdmin) {
    tabAdmin.className = showAdmin
      ? 'h-10 px-4 rounded-t-xl text-sm font-black bg-amber-500 text-slate-950'
      : 'h-10 px-4 rounded-t-xl text-sm font-bold text-amber-100 hover:bg-slate-800';
  }
  if (showAdmin) refreshAdminView();
  if (window.lucide) lucide.createIcons();
}

function bootAdmin() {
  restoreAdminFiles();
  const root = document.getElementById('adminWorkspace');
  const input = document.getElementById('adminExcelInput');
  if (root) {
    root.addEventListener('click', onAdminClick);
    root.addEventListener('change', onAdminChange);
  }
  if (input) input.addEventListener('change', importAdminExcelFiles);
  refreshAdminView();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootAdmin);
else bootAdmin();
