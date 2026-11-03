import { DHIKR_LIST, DHIKR_MAP } from '@/data/dhikr';
import { SOURCES, SOURCE_MAP } from '@/data/sources';
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories';
import type { Dhikr, Source, Category, HadithGrade, DhikrStatus } from '@/types';

export function getAllDhikr(): Dhikr[] {
  return DHIKR_LIST.filter((d) => d.published);
}

export function getAllDhikrIncludingUnpublished(): Dhikr[] {
  return DHIKR_LIST;
}

export function getDhikrById(id: string): Dhikr | undefined {
  const dhikr = DHIKR_MAP[id];
  return dhikr?.published ? dhikr : undefined;
}

export function getAllSources(): Source[] {
  return SOURCES;
}

export function getSourceById(id: string): Source | undefined {
  return SOURCE_MAP[id];
}

export function getSourcesForDhikr(dhikr: Dhikr): Source[] {
  return dhikr.sourceIds
    .map((id) => SOURCE_MAP[id])
    .filter((s): s is Source => s !== undefined);
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORY_MAP[id];
}

export function getDhikrByCategory(categoryId: string): Dhikr[] {
  return getAllDhikr().filter((d) => d.category === categoryId);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const dhikr of getAllDhikr()) {
    counts[dhikr.category] = (counts[dhikr.category] ?? 0) + 1;
  }
  return counts;
}

export function searchDhikr(query: string): Dhikr[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getAllDhikr();
  return getAllDhikr().filter((d) => {
    const name = d.name.toLowerCase();
    const text = d.arabicText.toLowerCase();
    const virtue = d.virtue.toLowerCase();
    return (
      name.includes(normalized) ||
      text.includes(normalized) ||
      virtue.includes(normalized)
    );
  });
}

export function getDhikrCount(): number {
  return getAllDhikr().length;
}

export function getSourceCount(): number {
  return SOURCES.length;
}

export function getGradeLabel(grade: HadithGrade): string {
  const labels: Record<HadithGrade, string> = {
    sahih: 'صحيح',
    hasan: 'حسن',
    daif: 'ضعيف',
    maudu: 'موضوع',
    needs_review: 'يحتاج إلى مراجعة',
  };
  return labels[grade];
}

export function getGradeCssClass(grade: HadithGrade): string {
  const classes: Record<HadithGrade, string> = {
    sahih: 'label-sahih',
    hasan: 'label-hasan',
    daif: 'label-tag bg-red-900/40 text-red-300/80 border border-red-700/20',
    maudu: 'label-tag bg-red-900/50 text-red-300 border border-red-700/30',
    needs_review: 'label-general',
  };
  return classes[grade];
}

export function getStatusLabel(status: DhikrStatus): string {
  const labels: Record<DhikrStatus, string> = {
    verified: 'موثق',
    needs_review: 'يحتاج مراجعة',
    weak: 'ضعيف',
    disputed: 'مختلف فيه',
  };
  return labels[status];
}

export function getStatusCssClass(status: DhikrStatus): string {
  const classes: Record<DhikrStatus, string> = {
    verified: 'label-sahih',
    needs_review: 'label-tag bg-amber-900/40 text-amber-300/80 border border-amber-700/20',
    weak: 'label-tag bg-red-900/40 text-red-300/80 border border-red-700/20',
    disputed: 'label-tag bg-gold-900/30 text-gold-300/80 border border-gold-700/20',
  };
  return classes[status];
}

export function getDhikrByStatus(status: DhikrStatus): Dhikr[] {
  return DHIKR_LIST.filter((d) => d.status === status);
}

export function getVerifiedDhikr(): Dhikr[] {
  return getAllDhikr().filter((d) => d.status === 'verified');
}
