import { describe, it, expect } from 'vitest';
import {
  getTodayDateString,
  getNowTimestamp,
  formatArabicDate,
  generateId,
  gregorianToHijri,
  formatHijriDate,
  formatGregorianDate,
} from '@/utils/date';

describe('date utils', () => {
  it('getTodayDateString returns YYYY-MM-DD format', () => {
    const result = getTodayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('getNowTimestamp returns ISO string', () => {
    const result = getNowTimestamp();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('formatArabicDate returns Arabic day name', () => {
    const date = new Date(2026, 0, 1); // Thursday, Jan 1 2026
    const result = formatArabicDate(date);
    expect(result).toContain('الخميس');
    expect(result).toContain('يناير');
    expect(result).toContain('2026');
  });

  it('generateId returns unique strings', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(5);
  });
});

describe('Hijri date conversion', () => {
  it('gregorianToHijri returns valid hijri components', () => {
    const date = new Date(2026, 10, 2); // Nov 2, 2026
    const result = gregorianToHijri(date);
    expect(result.year).toBeGreaterThan(1440);
    expect(result.year).toBeLessThan(1500);
    expect(result.month).toBeGreaterThanOrEqual(1);
    expect(result.month).toBeLessThanOrEqual(12);
    expect(result.day).toBeGreaterThanOrEqual(1);
    expect(result.day).toBeLessThanOrEqual(30);
  });

  it('gregorianToHijri matches known date: Jan 1 2024 (Kuwaiti algorithm)', () => {
    const date = new Date(2024, 0, 1);
    const result = gregorianToHijri(date);
    // Kuwaiti arithmetic algorithm gives 21 Jumada al-Thani 1445
    // (Umm al-Qura calendar: 19 — the ~2 day offset is expected for this algorithm)
    expect(result.year).toBe(1445);
    expect(result.month).toBe(6); // Jumada al-Thani
    expect(result.day).toBe(21);
  });

  it('gregorianToHijri matches known date: July 7 2024', () => {
    const date = new Date(2024, 6, 7);
    const result = gregorianToHijri(date);
    // July 7, 2024 = 1 Muharram 1446 (approximate via Kuwaiti algorithm)
    expect(result.year).toBe(1446);
    expect(result.month).toBe(1);
    expect(result.day).toBe(1);
  });

  it('formatHijriDate includes Arabic month name and hijri year suffix', () => {
    const date = new Date(2024, 0, 1);
    const result = formatHijriDate(date);
    expect(result).toContain('هـ');
    expect(result).toContain('الإثنين'); // Jan 1 2024 is Monday
  });

  it('formatHijriDate uses correct Arabic day name', () => {
    const sunday = new Date(2026, 10, 1); // Nov 1, 2026 is Sunday
    const result = formatHijriDate(sunday);
    expect(result).toContain('الأحد');
  });

  it('formatGregorianDate returns formatted Arabic gregorian date', () => {
    const date = new Date(2026, 10, 2);
    const result = formatGregorianDate(date);
    expect(result).toContain('نوفمبر');
    expect(result).toContain('2026');
    expect(result).toContain('م');
  });
});
