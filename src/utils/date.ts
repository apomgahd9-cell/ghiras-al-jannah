const ARABIC_DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

const ARABIC_MONTHS_GREGORIAN = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const ARABIC_MONTHS_HIJRI = [
  'محرّم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوّال',
  'ذو القعدة',
  'ذو الحجة',
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNowTimestamp(): string {
  return new Date().toISOString();
}

export function formatArabicDate(date: Date = new Date()): string {
  const dayName = ARABIC_DAYS[date.getDay()];
  const day = date.getDate();
  const month = ARABIC_MONTHS_GREGORIAN[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}، ${day} ${month} ${year}`;
}

/**
 * Converts a Gregorian date to Hijri using the Kuwaiti algorithm.
 * This is an arithmetic approximation accurate to within one day.
 * For precise dates (e.g. religious observances), refer to official
 * Umm al-Qura calendar — this utility is for display purposes only.
 */
export function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  let jdn: number;
  if (gy > 1582 || (gy === 1582 && gm > 10) || (gy === 1582 && gm === 10 && gd > 15)) {
    jdn =
      Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4) +
      Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12) -
      Math.floor((3 * Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) / 4) +
      gd -
      32075;
  } else {
    jdn =
      367 * gy -
      Math.floor((7 * (gy + 5001 + Math.floor((gm - 9) / 7))) / 4) +
      Math.floor((275 * gm) / 9) +
      gd +
      1729777;
  }

  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);

  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;

  const hm = Math.floor((24 * l3) / 709);
  const hd = l3 - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;

  return { year: hy, month: hm, day: hd };
}

export function formatHijriDate(date: Date = new Date()): string {
  const { year, month, day } = gregorianToHijri(date);
  const dayName = ARABIC_DAYS[date.getDay()];
  const monthName = ARABIC_MONTHS_HIJRI[month - 1] ?? '';
  return `${dayName}، ${day} ${monthName} ${year} هـ`;
}

export function formatGregorianDate(date: Date = new Date()): string {
  const day = date.getDate();
  const month = ARABIC_MONTHS_GREGORIAN[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year} م`;
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
