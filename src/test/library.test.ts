import { describe, it, expect } from 'vitest';
import {
  getAllDhikr,
  getDhikrById,
  getAllSources,
  getSourceById,
  getAllCategories,
  getCategoryById,
  getDhikrByCategory,
  getCategoryCounts,
  searchDhikr,
  getDhikrCount,
  getSourceCount,
  getSourcesForDhikr,
  getGradeLabel,
  getStatusLabel,
  getDhikrByStatus,
  getVerifiedDhikr,
  getAllDhikrIncludingUnpublished,
  isDhikrEligibleForPublish,
} from '@/services/libraryDataService';
import { DHIKR_LIST } from '@/data/dhikr';
import { SOURCES, SOURCE_MAP } from '@/data/sources';
import { CATEGORIES } from '@/data/categories';
import type { Dhikr, DhikrStatus } from '@/types';

const VALID_CATEGORIES = CATEGORIES.map((c) => c.id);
const SOURCE_IDS = new Set(SOURCES.map((s) => s.id));

describe('Library data integrity', () => {
  it('all published dhikr have valid structure', () => {
    const allDhikr = getAllDhikr();
    expect(allDhikr.length).toBeGreaterThanOrEqual(10);
    for (const d of allDhikr) {
      expect(typeof d.id).toBe('string');
      expect(d.id.length).toBeGreaterThan(0);
      expect(typeof d.name).toBe('string');
      expect(d.name.length).toBeGreaterThan(0);
      expect(typeof d.arabicText).toBe('string');
      expect(d.arabicText.length).toBeGreaterThan(0);
      expect(typeof d.explanation).toBe('string');
      expect(d.explanation.length).toBeGreaterThan(0);
      expect(typeof d.virtue).toBe('string');
      expect(d.virtue.length).toBeGreaterThan(0);
      expect(Array.isArray(d.sourceIds)).toBe(true);
      expect(d.sourceIds.length).toBeGreaterThan(0);
      expect(VALID_CATEGORIES).toContain(d.category);
      expect(d.published).toBe(true);
      expect(d.status).toBe('verified');
    }
  });

  it('every published dhikr has at least one source', () => {
    for (const d of getAllDhikr()) {
      expect(d.sourceIds.length).toBeGreaterThanOrEqual(1);
      for (const sourceId of d.sourceIds) {
        expect(SOURCE_IDS.has(sourceId)).toBe(true);
      }
    }
  });

  it('every source referenced by any dhikr exists', () => {
    const allSources = new Set(SOURCES.map((s) => s.id));
    for (const d of DHIKR_LIST) {
      for (const sourceId of d.sourceIds) {
        expect(allSources.has(sourceId)).toBe(true);
      }
    }
  });

  it('no duplicate dhikr IDs', () => {
    const ids = DHIKR_LIST.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('no duplicate source IDs', () => {
    const ids = SOURCES.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('no duplicate hadith numbers within the same book', () => {
    const seen = new Set<string>();
    for (const s of SOURCES) {
      if (s.hadithNumber) {
        const key = `${s.bookName}-${s.hadithNumber}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });

  it('sources with hadithNumber have it as a string', () => {
    for (const s of SOURCES) {
      if (s.hadithNumber !== undefined) {
        expect(typeof s.hadithNumber).toBe('string');
        expect(s.hadithNumber.length).toBeGreaterThan(0);
      }
    }
  });

  it('quranic sources have surahName and verseNumber', () => {
    for (const s of SOURCES) {
      if (s.sourceType === 'quran') {
        expect(s.surahName).toBeDefined();
        expect(s.verseNumber).toBeDefined();
      }
    }
  });

  it('getDhikrById returns published dhikr', () => {
    const first = getAllDhikr()[0];
    const found = getDhikrById(first.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(first.id);
  });

  it('getDhikrById returns undefined for non-existent id', () => {
    expect(getDhikrById('non-existent-id')).toBeUndefined();
  });

  it('getSourceById returns source', () => {
    const first = SOURCES[0];
    const found = getSourceById(first.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(first.id);
  });

  it('getCategoryById returns category', () => {
    const first = CATEGORIES[0];
    const found = getCategoryById(first.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(first.id);
  });
});

describe('Dhikr status verification', () => {
  it('every dhikr has a valid status', () => {
    const validStatuses: DhikrStatus[] = ['verified', 'needs_review', 'weak', 'disputed'];
    for (const d of DHIKR_LIST) {
      expect(validStatuses).toContain(d.status);
    }
  });

  it('all published dhikr shown to user have status verified', () => {
    for (const d of getAllDhikr()) {
      expect(d.status).toBe('verified');
    }
  });

  it('weak dhikr are not published', () => {
    for (const d of DHIKR_LIST) {
      if (d.status === 'weak') {
        expect(d.published).toBe(false);
      }
    }
  });

  it('needs_review dhikr are not shown to user even if published flag is true', () => {
    for (const d of DHIKR_LIST) {
      if (d.status === 'needs_review' && d.published) {
        expect(getAllDhikr().find((x) => x.id === d.id)).toBeUndefined();
      }
    }
  });

  it('disputed dhikr are not shown to user', () => {
    for (const d of DHIKR_LIST) {
      if (d.status === 'disputed') {
        expect(getAllDhikr().find((x) => x.id === d.id)).toBeUndefined();
      }
    }
  });

  it('getDhikrByStatus returns correct results', () => {
    const verified = getDhikrByStatus('verified');
    for (const d of verified) {
      expect(d.status).toBe('verified');
    }
  });

  it('getVerifiedDhikr only returns published and verified', () => {
    const verified = getVerifiedDhikr();
    for (const d of verified) {
      expect(d.status).toBe('verified');
      expect(d.published).toBe(true);
    }
  });

  it('needs_review dhikr have statusNote explaining why', () => {
    for (const d of DHIKR_LIST) {
      if (d.status === 'needs_review') {
        expect(d.statusNote).toBeDefined();
        expect(d.statusNote!.length).toBeGreaterThan(10);
      }
    }
  });

  it('weak dhikr have statusNote explaining weakness', () => {
    for (const d of DHIKR_LIST) {
      if (d.status === 'weak') {
        expect(d.statusNote).toBeDefined();
        expect(d.statusNote!.length).toBeGreaterThan(10);
      }
    }
  });

  it('getStatusLabel returns Arabic labels', () => {
    expect(getStatusLabel('verified')).toBe('موثق');
    expect(getStatusLabel('needs_review')).toBe('يحتاج مراجعة');
    expect(getStatusLabel('weak')).toBe('ضعيف');
    expect(getStatusLabel('disputed')).toBe('مختلف فيه');
  });
});

describe('Source-hadith text integrity', () => {
  it('every source has either hadithText or is quranic', () => {
    for (const s of SOURCES) {
      const isQuranic = s.sourceType === 'quran';
      expect(s.hadithText !== undefined || isQuranic).toBe(true);
    }
  });

  it('every source has a gradingRef or note', () => {
    for (const s of SOURCES) {
      const hasRef = s.gradingRef !== undefined && s.gradingRef.length > 0;
      const hasNote = s.note !== undefined && s.note.length > 0;
      expect(hasRef || hasNote).toBe(true);
    }
  });

  it('sources with daif grade have a note explaining weakness', () => {
    for (const s of SOURCES) {
      if (s.grade === 'daif') {
        expect(s.note).toBeDefined();
      }
    }
  });
});

describe('Library categories', () => {
  it('getDhikrByCategory filters correctly', () => {
    const tasbihDhikr = getDhikrByCategory('tasbih_tahmid');
    for (const d of tasbihDhikr) {
      expect(d.category).toBe('tasbih_tahmid');
    }
  });

  it('getCategoryCounts returns correct counts', () => {
    const counts = getCategoryCounts();
    const totalFromCounts = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(totalFromCounts).toBe(getDhikrCount());
  });

  it('all categories in CATEGORIES are valid DhikrCategory values', () => {
    for (const c of CATEGORIES) {
      expect(VALID_CATEGORIES).toContain(c.id);
    }
  });
});

describe('Library search', () => {
  it('search with empty query returns all published', () => {
    expect(searchDhikr('').length).toBe(getDhikrCount());
  });

  it('search by name finds results', () => {
    const results = searchDhikr('سبحان');
    expect(results.length).toBeGreaterThan(0);
    for (const d of results) {
      const matches =
        d.name.includes('سبحان') ||
        d.arabicText.includes('سبحان') ||
        d.virtue.includes('سبحان');
      expect(matches).toBe(true);
    }
  });

  it('search by arabic text finds results', () => {
    const results = searchDhikr('الحمد لله');
    expect(results.length).toBeGreaterThan(0);
  });

  it('search with no matches returns empty', () => {
    expect(searchDhikr('كلمة غير موجودة تماما').length).toBe(0);
  });

  it('search is case-insensitive and trims whitespace', () => {
    const results = searchDhikr('  سبحان  ');
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('Library sources for dhikr', () => {
  it('getSourcesForDhikr returns Source objects', () => {
    const dhikr = getAllDhikr()[0];
    const sources = getSourcesForDhikr(dhikr);
    expect(sources.length).toBeGreaterThan(0);
    for (const s of sources) {
      expect(typeof s.bookName).toBe('string');
      expect(typeof s.grade).toBe('string');
    }
  });

  it('getSourcesForDhikr handles missing source gracefully', () => {
    const fakeDhikr: Dhikr = {
      id: 'fake',
      name: 'fake',
      arabicText: 'fake',
      explanation: 'fake',
      virtue: 'fake',
      virtueType: 'established',
      sourceIds: ['non-existent'],
      category: 'tasbih_tahmid',
      published: true,
      status: 'verified',
    };
    const sources = getSourcesForDhikr(fakeDhikr);
    expect(sources).toEqual([]);
  });
});

describe('Grade labels', () => {
  it('getGradeLabel returns Arabic label for sahih', () => {
    expect(getGradeLabel('sahih')).toBe('صحيح');
  });

  it('getGradeLabel returns Arabic label for hasan', () => {
    expect(getGradeLabel('hasan')).toBe('حسن');
  });

  it('getGradeLabel returns Arabic label for needs_review', () => {
    expect(getGradeLabel('needs_review')).toBe('يحتاج إلى مراجعة');
  });
});

describe('Library counts', () => {
  it('getDhikrCount matches published list (strict policy)', () => {
    expect(getDhikrCount()).toBe(getAllDhikr().length);
  });

  it('getSourceCount matches sources list', () => {
    expect(getSourceCount()).toBe(SOURCES.length);
  });

  it('unpublished dhikr exist in data but not in published list', () => {
    const all = getAllDhikrIncludingUnpublished();
    expect(all.length).toBeGreaterThan(getDhikrCount());
  });
});

describe('No source-hadith mismatch', () => {
  it('sources not referenced by any dhikr are still valid (available for future use)', () => {
    const referencedSources = new Set<string>();
    for (const d of DHIKR_LIST) {
      for (const sid of d.sourceIds) {
        referencedSources.add(sid);
      }
    }
    for (const s of SOURCES) {
      expect(SOURCE_MAP[s.id]).toBeDefined();
    }
  });

  it('virtueType does not use hadith grade values', () => {
    const validVirtueTypes = ['established', 'general', 'explanation', 'weak'];
    for (const d of DHIKR_LIST) {
      expect(validVirtueTypes).toContain(d.virtueType);
    }
  });
});

// ============ Mandatory tests per task requirements ============

describe('Publishing policy enforcement', () => {
  it('all dhikr shown via getAllDhikr have status verified', () => {
    for (const d of getAllDhikr()) {
      expect(d.status).toBe('verified');
      expect(d.published).toBe(true);
    }
  });

  it('no needs_review or weak or disputed dhikr is shown', () => {
    const shown = getAllDhikr();
    for (const d of shown) {
      expect(d.status).not.toBe('needs_review');
      expect(d.status).not.toBe('weak');
      expect(d.status).not.toBe('disputed');
    }
  });

  it('every shown dhikr has at least one existing source', () => {
    for (const d of getAllDhikr()) {
      expect(d.sourceIds.length).toBeGreaterThan(0);
      for (const sid of d.sourceIds) {
        expect(SOURCE_MAP[sid]).toBeDefined();
      }
    }
  });

  it('no shown dhikr references a weak or daif source', () => {
    for (const d of getAllDhikr()) {
      for (const sid of d.sourceIds) {
        const source = SOURCE_MAP[sid];
        if (source) {
          expect(source.grade).not.toBe('daif');
          expect(source.grade).not.toBe('maudu');
          expect(source.grade).not.toBe('needs_review');
        }
      }
    }
  });

  it('getDhikrById does not return non-verified dhikr even if published flag is true', () => {
    for (const d of DHIKR_LIST) {
      if (d.published && d.status !== 'verified') {
        expect(getDhikrById(d.id)).toBeUndefined();
      }
    }
  });

  it('no non-verified dhikr has published set to true', () => {
    for (const d of DHIKR_LIST) {
      if (d.status !== 'verified') {
        expect(d.published).toBe(false);
      }
    }
  });

  it('isDhikrEligibleForPublish rejects dhikr with missing sources', () => {
    const fakeDhikr: Dhikr = {
      id: 'test-missing',
      name: 'test',
      arabicText: 'test',
      explanation: 'test',
      virtue: 'test',
      virtueType: 'established',
      sourceIds: ['non-existent'],
      category: 'tasbih_tahmid',
      published: true,
      status: 'verified',
    };
    expect(isDhikrEligibleForPublish(fakeDhikr)).toBe(false);
  });
});

describe('Corrected source links', () => {
  it('sadaqah-tutfi uses tirmidhi-2616 not tirmidhi-483', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'sadaqah-tutfi');
    expect(d).toBeDefined();
    expect(d!.sourceIds).toContain('tirmidhi-2616');
    expect(d!.sourceIds).not.toContain('tirmidhi-483');
  });

  it('birr-parents-rida uses tirmidhi-1899 not tirmidhi-2456', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'birr-parents-rida');
    expect(d).toBeDefined();
    expect(d!.sourceIds).toContain('tirmidhi-1899');
    expect(d!.sourceIds).not.toContain('tirmidhi-2456');
  });

  it('subhan-allah-azim-jannah uses tirmidhi-3464 not ahmad-8774', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'subhan-allah-azim-jannah');
    expect(d).toBeDefined();
    expect(d!.sourceIds).toContain('tirmidhi-3464');
    expect(d!.sourceIds).not.toContain('ahmad-8774');
  });

  it('luzum-istighfar uses abudawud-1518 and is weak/unpublished', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'luzum-istighfar');
    expect(d).toBeDefined();
    expect(d!.sourceIds).toContain('abudawud-1518');
    expect(d!.status).toBe('weak');
    expect(d!.published).toBe(false);
  });

  it('bismillah-alladhi uses abudawud-5088 not abudawud-5069', () => {
    const morning = DHIKR_LIST.find((x) => x.id === 'bismillah-alladhi-la-yadur-morning');
    expect(morning).toBeDefined();
    expect(morning!.sourceIds).toContain('abudawud-5088');
    expect(morning!.sourceIds).not.toContain('abudawud-5069');

    const evening = DHIKR_LIST.find((x) => x.id === 'bismillah-alladhi-la-yadur-evening');
    expect(evening).toBeDefined();
    expect(evening!.sourceIds).toContain('abudawud-5088');
    expect(evening!.sourceIds).not.toContain('abudawud-5069');
  });

  it('no orphaned old source IDs exist anywhere in dhikr data', () => {
    const oldIds = ['ahmad-8774', 'tirmidhi-2456', 'abudawud-5069', 'nawawi-istighfar-100', 'nawawi-luzum-istighfar'];
    for (const d of DHIKR_LIST) {
      for (const oldId of oldIds) {
        expect(d.sourceIds).not.toContain(oldId);
      }
    }
  });
});

describe('Sleep tasbih order and counts', () => {
  it('tasbih-sleep-33 has correct name order: 34+33+33', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'tasbih-sleep-33');
    expect(d).toBeDefined();
    expect(d!.name).toContain('34');
    expect(d!.name).toContain('33+33');
  });

  it('tasbih-sleep-33 arabicText starts with Allahu Akbar (34)', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'tasbih-sleep-33');
    expect(d).toBeDefined();
    expect(d!.arabicText).toContain('اللَّهُ أَكْبَرُ (34)');
    expect(d!.arabicText.indexOf('اللَّهُ أَكْبَرُ')).toBeLessThan(
      d!.arabicText.indexOf('سُبْحَانَ')
    );
    expect(d!.arabicText.indexOf('سُبْحَانَ')).toBeLessThan(
      d!.arabicText.indexOf('الْحَمْدُ')
    );
  });

  it('tasbih-sleep-33 virtue mentions Allahu Akbar 34 first', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'tasbih-sleep-33');
    expect(d).toBeDefined();
    expect(d!.virtue).toContain('الله أكبر أربعًا وثلاثين');
  });

  it('tasbih-sleep-33 countNote shows 34+33+33', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'tasbih-sleep-33');
    expect(d).toBeDefined();
    expect(d!.countNote).toContain('34');
    expect(d!.countNote).toContain('33');
  });

  it('tasbih-sleep-33 source is bukhari-3705', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'tasbih-sleep-33');
    expect(d).toBeDefined();
    expect(d!.sourceIds).toContain('bukhari-3705');
  });
});

describe('Quranic vs hadith source separation', () => {
  it('quranic sources have sourceType quran', () => {
    for (const s of SOURCES) {
      if (s.bookName === 'القرآن الكريم') {
        expect(s.sourceType).toBe('quran');
      }
    }
  });

  it('hadith sources have sourceType hadith', () => {
    for (const s of SOURCES) {
      if (s.bookName !== 'القرآن الكريم') {
        expect(s.sourceType).toBe('hadith');
      }
    }
  });

  it('quranic sources do not have hadith grading fields (scholar, narrator)', () => {
    for (const s of SOURCES) {
      if (s.sourceType === 'quran') {
        expect(s.scholar).toBeUndefined();
        expect(s.narrator).toBeUndefined();
      }
    }
  });

  it('no dhikr that only has quranic sources claims a hadith virtue as established without a hadith source', () => {
    for (const d of getAllDhikr()) {
      const sources = getSourcesForDhikr(d);
      const hasHadithSource = sources.some((s) => s.sourceType === 'hadith');
      const hasQuranSource = sources.some((s) => s.sourceType === 'quran');
      if (hasQuranSource && !hasHadithSource && d.virtueType === 'established') {
        const mentionsProphet = d.virtue.includes('النبي') || d.virtue.includes('رسول');
        expect(mentionsProphet).toBe(false);
      }
    }
  });
});

describe('Ayat al-Kursi publishing', () => {
  it('ayat-al-kursi morning is not published (needs_review)', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'ayat-al-kursi-morning');
    expect(d).toBeDefined();
    expect(d!.status).toBe('needs_review');
    expect(d!.published).toBe(false);
  });

  it('ayat-al-kursi evening is not published (needs_review)', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'ayat-al-kursi-evening');
    expect(d).toBeDefined();
    expect(d!.status).toBe('needs_review');
    expect(d!.published).toBe(false);
  });

  it('ayat-al-kursi sources are quranic (baqarah 255)', () => {
    const morning = DHIKR_LIST.find((x) => x.id === 'ayat-al-kursi-morning');
    expect(morning).toBeDefined();
    for (const sid of morning!.sourceIds) {
      const source = SOURCE_MAP[sid];
      expect(source).toBeDefined();
      expect(source!.sourceType).toBe('quran');
    }
  });
});

describe('Salat-nabi-morning-evening needs review', () => {
  it('salat-nabi-10-morning-evening is not published (needs_review)', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'salat-nabi-10-morning-evening');
    expect(d).toBeDefined();
    expect(d!.status).toBe('needs_review');
    expect(d!.published).toBe(false);
  });
});

describe('Astaghfirullah-100 needs review', () => {
  it('astaghfirullah-100 is needs_review due to formula mismatch', () => {
    const d = DHIKR_LIST.find((x) => x.id === 'astaghfirullah-100');
    expect(d).toBeDefined();
    expect(d!.status).toBe('needs_review');
    expect(d!.sourceIds).toContain('muslim-2702');
  });

  it('astaghfirullah-100 is not shown to user', () => {
    const shown = getAllDhikr().find((x) => x.id === 'astaghfirullah-100');
    expect(shown).toBeUndefined();
  });
});
