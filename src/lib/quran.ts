// نص القرآن عبر alquran.cloud مع قائمة سور محلية دائماً متاحة
export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz?: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

const API_BASE = "https://api.alquran.cloud/v1";

export const SURAH_NAMES_AR: Record<number, string> = {
  1: "الفاتحة",
  2: "البقرة",
  3: "آل عمران",
  4: "النساء",
  5: "المائدة",
  6: "الأنعام",
  7: "الأعراف",
  8: "الأنفال",
  9: "التوبة",
  10: "يونس",
  11: "هود",
  12: "يوسف",
  13: "الرعد",
  14: "إبراهيم",
  15: "الحجر",
  16: "النحل",
  17: "الإسراء",
  18: "الكهف",
  19: "مريم",
  20: "طه",
  21: "الأنبياء",
  22: "الحج",
  23: "المؤمنون",
  24: "النور",
  25: "الفرقان",
  26: "الشعراء",
  27: "النمل",
  28: "القصص",
  29: "العنكبوت",
  30: "الروم",
  31: "لقمان",
  32: "السجدة",
  33: "الأحزاب",
  34: "سبأ",
  35: "فاطر",
  36: "يس",
  37: "الصافات",
  38: "ص",
  39: "الزمر",
  40: "غافر",
  41: "فصلت",
  42: "الشورى",
  43: "الزخرف",
  44: "الدخان",
  45: "الجاثية",
  46: "الأحقاف",
  47: "محمد",
  48: "الفتح",
  49: "الحجرات",
  50: "ق",
  51: "الذاريات",
  52: "الطور",
  53: "النجم",
  54: "القمر",
  55: "الرحمن",
  56: "الواقعة",
  57: "الحديد",
  58: "المجادلة",
  59: "الحشر",
  60: "الممتحنة",
  61: "الصف",
  62: "الجمعة",
  63: "المنافقون",
  64: "التغابن",
  65: "الطلاق",
  66: "التحريم",
  67: "الملك",
  68: "القلم",
  69: "الحاقة",
  70: "المعارج",
  71: "نوح",
  72: "الجن",
  73: "المزمل",
  74: "المدثر",
  75: "القيامة",
  76: "الإنسان",
  77: "المرسلات",
  78: "النبأ",
  79: "النازعات",
  80: "عبس",
  81: "التكوير",
  82: "الانفطار",
  83: "المطففين",
  84: "الانشقاق",
  85: "البروج",
  86: "الطارق",
  87: "الأعلى",
  88: "الغاشية",
  89: "الفجر",
  90: "البلد",
  91: "الشمس",
  92: "الليل",
  93: "الضحى",
  94: "الشرح",
  95: "التين",
  96: "العلق",
  97: "القدر",
  98: "البينة",
  99: "الزلزلة",
  100: "العاديات",
  101: "القارعة",
  102: "التكاثر",
  103: "العصر",
  104: "الهمزة",
  105: "الفيل",
  106: "قريش",
  107: "الماعون",
  108: "الكوثر",
  109: "الكافرون",
  110: "النصر",
  111: "المسد",
  112: "الإخلاص",
  113: "الفلق",
  114: "الناس"
};

/** قائمة محلية كاملة — لا تعتمد على الشبكة لعرض الفهرس */
export const LOCAL_SURAHS: SurahMeta[] = [
  { number: 1, name: "الفاتحة", englishName: "Surah1", englishNameTranslation: "", numberOfAyahs: 7, revelationType: "Meccan" as const },
  { number: 2, name: "البقرة", englishName: "Surah2", englishNameTranslation: "", numberOfAyahs: 286, revelationType: "Medinan" as const },
  { number: 3, name: "آل عمران", englishName: "Surah3", englishNameTranslation: "", numberOfAyahs: 200, revelationType: "Medinan" as const },
  { number: 4, name: "النساء", englishName: "Surah4", englishNameTranslation: "", numberOfAyahs: 176, revelationType: "Medinan" as const },
  { number: 5, name: "المائدة", englishName: "Surah5", englishNameTranslation: "", numberOfAyahs: 120, revelationType: "Medinan" as const },
  { number: 6, name: "الأنعام", englishName: "Surah6", englishNameTranslation: "", numberOfAyahs: 165, revelationType: "Meccan" as const },
  { number: 7, name: "الأعراف", englishName: "Surah7", englishNameTranslation: "", numberOfAyahs: 206, revelationType: "Meccan" as const },
  { number: 8, name: "الأنفال", englishName: "Surah8", englishNameTranslation: "", numberOfAyahs: 75, revelationType: "Medinan" as const },
  { number: 9, name: "التوبة", englishName: "Surah9", englishNameTranslation: "", numberOfAyahs: 129, revelationType: "Medinan" as const },
  { number: 10, name: "يونس", englishName: "Surah10", englishNameTranslation: "", numberOfAyahs: 109, revelationType: "Meccan" as const },
  { number: 11, name: "هود", englishName: "Surah11", englishNameTranslation: "", numberOfAyahs: 123, revelationType: "Meccan" as const },
  { number: 12, name: "يوسف", englishName: "Surah12", englishNameTranslation: "", numberOfAyahs: 111, revelationType: "Meccan" as const },
  { number: 13, name: "الرعد", englishName: "Surah13", englishNameTranslation: "", numberOfAyahs: 43, revelationType: "Meccan" as const },
  { number: 14, name: "إبراهيم", englishName: "Surah14", englishNameTranslation: "", numberOfAyahs: 52, revelationType: "Meccan" as const },
  { number: 15, name: "الحجر", englishName: "Surah15", englishNameTranslation: "", numberOfAyahs: 99, revelationType: "Meccan" as const },
  { number: 16, name: "النحل", englishName: "Surah16", englishNameTranslation: "", numberOfAyahs: 128, revelationType: "Meccan" as const },
  { number: 17, name: "الإسراء", englishName: "Surah17", englishNameTranslation: "", numberOfAyahs: 111, revelationType: "Meccan" as const },
  { number: 18, name: "الكهف", englishName: "Surah18", englishNameTranslation: "", numberOfAyahs: 110, revelationType: "Meccan" as const },
  { number: 19, name: "مريم", englishName: "Surah19", englishNameTranslation: "", numberOfAyahs: 98, revelationType: "Meccan" as const },
  { number: 20, name: "طه", englishName: "Surah20", englishNameTranslation: "", numberOfAyahs: 135, revelationType: "Meccan" as const },
  { number: 21, name: "الأنبياء", englishName: "Surah21", englishNameTranslation: "", numberOfAyahs: 112, revelationType: "Meccan" as const },
  { number: 22, name: "الحج", englishName: "Surah22", englishNameTranslation: "", numberOfAyahs: 78, revelationType: "Medinan" as const },
  { number: 23, name: "المؤمنون", englishName: "Surah23", englishNameTranslation: "", numberOfAyahs: 118, revelationType: "Meccan" as const },
  { number: 24, name: "النور", englishName: "Surah24", englishNameTranslation: "", numberOfAyahs: 64, revelationType: "Medinan" as const },
  { number: 25, name: "الفرقان", englishName: "Surah25", englishNameTranslation: "", numberOfAyahs: 77, revelationType: "Meccan" as const },
  { number: 26, name: "الشعراء", englishName: "Surah26", englishNameTranslation: "", numberOfAyahs: 227, revelationType: "Meccan" as const },
  { number: 27, name: "النمل", englishName: "Surah27", englishNameTranslation: "", numberOfAyahs: 93, revelationType: "Meccan" as const },
  { number: 28, name: "القصص", englishName: "Surah28", englishNameTranslation: "", numberOfAyahs: 88, revelationType: "Meccan" as const },
  { number: 29, name: "العنكبوت", englishName: "Surah29", englishNameTranslation: "", numberOfAyahs: 69, revelationType: "Meccan" as const },
  { number: 30, name: "الروم", englishName: "Surah30", englishNameTranslation: "", numberOfAyahs: 60, revelationType: "Meccan" as const },
  { number: 31, name: "لقمان", englishName: "Surah31", englishNameTranslation: "", numberOfAyahs: 34, revelationType: "Meccan" as const },
  { number: 32, name: "السجدة", englishName: "Surah32", englishNameTranslation: "", numberOfAyahs: 30, revelationType: "Meccan" as const },
  { number: 33, name: "الأحزاب", englishName: "Surah33", englishNameTranslation: "", numberOfAyahs: 73, revelationType: "Medinan" as const },
  { number: 34, name: "سبأ", englishName: "Surah34", englishNameTranslation: "", numberOfAyahs: 54, revelationType: "Meccan" as const },
  { number: 35, name: "فاطر", englishName: "Surah35", englishNameTranslation: "", numberOfAyahs: 45, revelationType: "Meccan" as const },
  { number: 36, name: "يس", englishName: "Surah36", englishNameTranslation: "", numberOfAyahs: 83, revelationType: "Meccan" as const },
  { number: 37, name: "الصافات", englishName: "Surah37", englishNameTranslation: "", numberOfAyahs: 182, revelationType: "Meccan" as const },
  { number: 38, name: "ص", englishName: "Surah38", englishNameTranslation: "", numberOfAyahs: 88, revelationType: "Meccan" as const },
  { number: 39, name: "الزمر", englishName: "Surah39", englishNameTranslation: "", numberOfAyahs: 75, revelationType: "Meccan" as const },
  { number: 40, name: "غافر", englishName: "Surah40", englishNameTranslation: "", numberOfAyahs: 85, revelationType: "Meccan" as const },
  { number: 41, name: "فصلت", englishName: "Surah41", englishNameTranslation: "", numberOfAyahs: 54, revelationType: "Meccan" as const },
  { number: 42, name: "الشورى", englishName: "Surah42", englishNameTranslation: "", numberOfAyahs: 53, revelationType: "Meccan" as const },
  { number: 43, name: "الزخرف", englishName: "Surah43", englishNameTranslation: "", numberOfAyahs: 89, revelationType: "Meccan" as const },
  { number: 44, name: "الدخان", englishName: "Surah44", englishNameTranslation: "", numberOfAyahs: 59, revelationType: "Meccan" as const },
  { number: 45, name: "الجاثية", englishName: "Surah45", englishNameTranslation: "", numberOfAyahs: 37, revelationType: "Meccan" as const },
  { number: 46, name: "الأحقاف", englishName: "Surah46", englishNameTranslation: "", numberOfAyahs: 35, revelationType: "Meccan" as const },
  { number: 47, name: "محمد", englishName: "Surah47", englishNameTranslation: "", numberOfAyahs: 38, revelationType: "Medinan" as const },
  { number: 48, name: "الفتح", englishName: "Surah48", englishNameTranslation: "", numberOfAyahs: 29, revelationType: "Medinan" as const },
  { number: 49, name: "الحجرات", englishName: "Surah49", englishNameTranslation: "", numberOfAyahs: 18, revelationType: "Medinan" as const },
  { number: 50, name: "ق", englishName: "Surah50", englishNameTranslation: "", numberOfAyahs: 45, revelationType: "Meccan" as const },
  { number: 51, name: "الذاريات", englishName: "Surah51", englishNameTranslation: "", numberOfAyahs: 60, revelationType: "Meccan" as const },
  { number: 52, name: "الطور", englishName: "Surah52", englishNameTranslation: "", numberOfAyahs: 49, revelationType: "Meccan" as const },
  { number: 53, name: "النجم", englishName: "Surah53", englishNameTranslation: "", numberOfAyahs: 62, revelationType: "Meccan" as const },
  { number: 54, name: "القمر", englishName: "Surah54", englishNameTranslation: "", numberOfAyahs: 55, revelationType: "Meccan" as const },
  { number: 55, name: "الرحمن", englishName: "Surah55", englishNameTranslation: "", numberOfAyahs: 78, revelationType: "Medinan" as const },
  { number: 56, name: "الواقعة", englishName: "Surah56", englishNameTranslation: "", numberOfAyahs: 96, revelationType: "Meccan" as const },
  { number: 57, name: "الحديد", englishName: "Surah57", englishNameTranslation: "", numberOfAyahs: 29, revelationType: "Medinan" as const },
  { number: 58, name: "المجادلة", englishName: "Surah58", englishNameTranslation: "", numberOfAyahs: 22, revelationType: "Medinan" as const },
  { number: 59, name: "الحشر", englishName: "Surah59", englishNameTranslation: "", numberOfAyahs: 24, revelationType: "Medinan" as const },
  { number: 60, name: "الممتحنة", englishName: "Surah60", englishNameTranslation: "", numberOfAyahs: 13, revelationType: "Medinan" as const },
  { number: 61, name: "الصف", englishName: "Surah61", englishNameTranslation: "", numberOfAyahs: 14, revelationType: "Medinan" as const },
  { number: 62, name: "الجمعة", englishName: "Surah62", englishNameTranslation: "", numberOfAyahs: 11, revelationType: "Medinan" as const },
  { number: 63, name: "المنافقون", englishName: "Surah63", englishNameTranslation: "", numberOfAyahs: 11, revelationType: "Medinan" as const },
  { number: 64, name: "التغابن", englishName: "Surah64", englishNameTranslation: "", numberOfAyahs: 18, revelationType: "Medinan" as const },
  { number: 65, name: "الطلاق", englishName: "Surah65", englishNameTranslation: "", numberOfAyahs: 12, revelationType: "Medinan" as const },
  { number: 66, name: "التحريم", englishName: "Surah66", englishNameTranslation: "", numberOfAyahs: 12, revelationType: "Medinan" as const },
  { number: 67, name: "الملك", englishName: "Surah67", englishNameTranslation: "", numberOfAyahs: 30, revelationType: "Meccan" as const },
  { number: 68, name: "القلم", englishName: "Surah68", englishNameTranslation: "", numberOfAyahs: 52, revelationType: "Meccan" as const },
  { number: 69, name: "الحاقة", englishName: "Surah69", englishNameTranslation: "", numberOfAyahs: 52, revelationType: "Meccan" as const },
  { number: 70, name: "المعارج", englishName: "Surah70", englishNameTranslation: "", numberOfAyahs: 44, revelationType: "Meccan" as const },
  { number: 71, name: "نوح", englishName: "Surah71", englishNameTranslation: "", numberOfAyahs: 28, revelationType: "Meccan" as const },
  { number: 72, name: "الجن", englishName: "Surah72", englishNameTranslation: "", numberOfAyahs: 28, revelationType: "Meccan" as const },
  { number: 73, name: "المزمل", englishName: "Surah73", englishNameTranslation: "", numberOfAyahs: 20, revelationType: "Meccan" as const },
  { number: 74, name: "المدثر", englishName: "Surah74", englishNameTranslation: "", numberOfAyahs: 56, revelationType: "Meccan" as const },
  { number: 75, name: "القيامة", englishName: "Surah75", englishNameTranslation: "", numberOfAyahs: 40, revelationType: "Meccan" as const },
  { number: 76, name: "الإنسان", englishName: "Surah76", englishNameTranslation: "", numberOfAyahs: 31, revelationType: "Medinan" as const },
  { number: 77, name: "المرسلات", englishName: "Surah77", englishNameTranslation: "", numberOfAyahs: 50, revelationType: "Meccan" as const },
  { number: 78, name: "النبأ", englishName: "Surah78", englishNameTranslation: "", numberOfAyahs: 40, revelationType: "Meccan" as const },
  { number: 79, name: "النازعات", englishName: "Surah79", englishNameTranslation: "", numberOfAyahs: 46, revelationType: "Meccan" as const },
  { number: 80, name: "عبس", englishName: "Surah80", englishNameTranslation: "", numberOfAyahs: 42, revelationType: "Meccan" as const },
  { number: 81, name: "التكوير", englishName: "Surah81", englishNameTranslation: "", numberOfAyahs: 29, revelationType: "Meccan" as const },
  { number: 82, name: "الانفطار", englishName: "Surah82", englishNameTranslation: "", numberOfAyahs: 19, revelationType: "Meccan" as const },
  { number: 83, name: "المطففين", englishName: "Surah83", englishNameTranslation: "", numberOfAyahs: 36, revelationType: "Meccan" as const },
  { number: 84, name: "الانشقاق", englishName: "Surah84", englishNameTranslation: "", numberOfAyahs: 25, revelationType: "Meccan" as const },
  { number: 85, name: "البروج", englishName: "Surah85", englishNameTranslation: "", numberOfAyahs: 22, revelationType: "Meccan" as const },
  { number: 86, name: "الطارق", englishName: "Surah86", englishNameTranslation: "", numberOfAyahs: 17, revelationType: "Meccan" as const },
  { number: 87, name: "الأعلى", englishName: "Surah87", englishNameTranslation: "", numberOfAyahs: 19, revelationType: "Meccan" as const },
  { number: 88, name: "الغاشية", englishName: "Surah88", englishNameTranslation: "", numberOfAyahs: 26, revelationType: "Meccan" as const },
  { number: 89, name: "الفجر", englishName: "Surah89", englishNameTranslation: "", numberOfAyahs: 30, revelationType: "Meccan" as const },
  { number: 90, name: "البلد", englishName: "Surah90", englishNameTranslation: "", numberOfAyahs: 20, revelationType: "Meccan" as const },
  { number: 91, name: "الشمس", englishName: "Surah91", englishNameTranslation: "", numberOfAyahs: 15, revelationType: "Meccan" as const },
  { number: 92, name: "الليل", englishName: "Surah92", englishNameTranslation: "", numberOfAyahs: 21, revelationType: "Meccan" as const },
  { number: 93, name: "الضحى", englishName: "Surah93", englishNameTranslation: "", numberOfAyahs: 11, revelationType: "Meccan" as const },
  { number: 94, name: "الشرح", englishName: "Surah94", englishNameTranslation: "", numberOfAyahs: 8, revelationType: "Meccan" as const },
  { number: 95, name: "التين", englishName: "Surah95", englishNameTranslation: "", numberOfAyahs: 8, revelationType: "Meccan" as const },
  { number: 96, name: "العلق", englishName: "Surah96", englishNameTranslation: "", numberOfAyahs: 19, revelationType: "Meccan" as const },
  { number: 97, name: "القدر", englishName: "Surah97", englishNameTranslation: "", numberOfAyahs: 5, revelationType: "Meccan" as const },
  { number: 98, name: "البينة", englishName: "Surah98", englishNameTranslation: "", numberOfAyahs: 8, revelationType: "Medinan" as const },
  { number: 99, name: "الزلزلة", englishName: "Surah99", englishNameTranslation: "", numberOfAyahs: 8, revelationType: "Medinan" as const },
  { number: 100, name: "العاديات", englishName: "Surah100", englishNameTranslation: "", numberOfAyahs: 11, revelationType: "Meccan" as const },
  { number: 101, name: "القارعة", englishName: "Surah101", englishNameTranslation: "", numberOfAyahs: 11, revelationType: "Meccan" as const },
  { number: 102, name: "التكاثر", englishName: "Surah102", englishNameTranslation: "", numberOfAyahs: 8, revelationType: "Meccan" as const },
  { number: 103, name: "العصر", englishName: "Surah103", englishNameTranslation: "", numberOfAyahs: 3, revelationType: "Meccan" as const },
  { number: 104, name: "الهمزة", englishName: "Surah104", englishNameTranslation: "", numberOfAyahs: 9, revelationType: "Meccan" as const },
  { number: 105, name: "الفيل", englishName: "Surah105", englishNameTranslation: "", numberOfAyahs: 5, revelationType: "Meccan" as const },
  { number: 106, name: "قريش", englishName: "Surah106", englishNameTranslation: "", numberOfAyahs: 4, revelationType: "Meccan" as const },
  { number: 107, name: "الماعون", englishName: "Surah107", englishNameTranslation: "", numberOfAyahs: 7, revelationType: "Meccan" as const },
  { number: 108, name: "الكوثر", englishName: "Surah108", englishNameTranslation: "", numberOfAyahs: 3, revelationType: "Meccan" as const },
  { number: 109, name: "الكافرون", englishName: "Surah109", englishNameTranslation: "", numberOfAyahs: 6, revelationType: "Meccan" as const },
  { number: 110, name: "النصر", englishName: "Surah110", englishNameTranslation: "", numberOfAyahs: 3, revelationType: "Medinan" as const },
  { number: 111, name: "المسد", englishName: "Surah111", englishNameTranslation: "", numberOfAyahs: 5, revelationType: "Meccan" as const },
  { number: 112, name: "الإخلاص", englishName: "Surah112", englishNameTranslation: "", numberOfAyahs: 4, revelationType: "Meccan" as const },
  { number: 113, name: "الفلق", englishName: "Surah113", englishNameTranslation: "", numberOfAyahs: 5, revelationType: "Meccan" as const },
  { number: 114, name: "الناس", englishName: "Surah114", englishNameTranslation: "", numberOfAyahs: 6, revelationType: "Meccan" as const },
];

async function fetchJson(url: string, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

export async function getAllSurahs(): Promise<SurahMeta[]> {
  try {
    const data = await fetchJson(`${API_BASE}/surah`);
    const list = data.data as SurahMeta[];
    if (Array.isArray(list) && list.length >= 114) return list;
  } catch (e) {
    console.error("getAllSurahs fallback", e);
  }
  return LOCAL_SURAHS;
}

export async function getSurah(surahNumber: number): Promise<SurahDetail | null> {
  if (surahNumber < 1 || surahNumber > 114) return null;
  try {
    const data = await fetchJson(`${API_BASE}/surah/${surahNumber}`);
    const d = data.data as SurahDetail;
    if (d?.ayahs?.length) return d;
  } catch (e) {
    console.error(`getSurah ${surahNumber}`, e);
  }
  // لا نُرجع null للصفحة — نُرجع هيكل فارغ ليحمّل العميل
  const meta = LOCAL_SURAHS.find((s) => s.number === surahNumber)!;
  return {
    number: meta.number,
    name: meta.name,
    englishName: meta.englishName,
    englishNameTranslation: meta.englishNameTranslation,
    revelationType: meta.revelationType,
    numberOfAyahs: meta.numberOfAyahs,
    ayahs: [],
  };
}

export async function getAyah(surahNumber: number, ayahNumber: number) {
  try {
    const data = await fetchJson(`${API_BASE}/ayah/${surahNumber}:${ayahNumber}`);
    return data.data;
  } catch {
    return null;
  }
}

export function getSurahMeta(n: number) {
  return LOCAL_SURAHS.find((s) => s.number === n) || null;
}


export const RECITERS = [
  { id: "ar.alafasy", name: "مشاري العفاسي" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط مرتل" },
  { id: "ar.husary", name: "محمود خليل الحصري" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي" },
  { id: "ar.shaatree", name: "أبو بكر الشاطري" },
  { id: "ar.hudhaify", name: "علي الحذيفي" },
] as const;
