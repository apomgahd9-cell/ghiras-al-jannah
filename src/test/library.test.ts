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
    expect(allDhikr.length).toBeGreaterThanOrEqual(15);
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
      expect(d.status).toBeDefined();
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
      if (s.bookName === 'القرآن الكريم') {
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

  it('published dhikr with needs_review status are not marked verified', () => {
    for (const d of getAllDhikr()) {
      if (d.status === 'needs_review') {
        expect(d.virtueType).not.toBe('established');
      }
    }
  });

  it('weak dhikr are not published', () => {
    for (const d of DHIKR_LIST) {
      if (d.status === 'weak') {
        expect(d.published).toBe(false);
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
      const isQuranic = s.bookName === 'القرآن الكريم';
      expect(s.hadithText !== undefined || isQuranic).toBe(true);
    }
  });

  it('every source has a gradingRef', () => {
    for (const s of SOURCES) {
      expect(s.gradingRef).toBeDefined();
      expect(s.gradingRef!.length).toBeGreaterThan(0);
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
  it('getDhikrCount matches published list', () => {
    expect(getDhikrCount()).toBe(DHIKR_LIST.filter((d) => d.published).length);
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
  it('each source is referenced by at least one dhikr', () => {
    const referencedSources = new Set<string>();
    for (const d of DHIKR_LIST) {
      for (const sid of d.sourceIds) {
        referencedSources.add(sid);
      }
    }
    for (const s of SOURCES) {
      expect(referencedSources.has(s.id)).toBe(true);
    }
  });

  it('virtueType does not use hadith grade values', () => {
    const validVirtueTypes = ['established', 'general', 'explanation', 'weak'];
    for (const d of DHIKR_LIST) {
      expect(validVirtueTypes).toContain(d.virtueType);
    }
  });
});
