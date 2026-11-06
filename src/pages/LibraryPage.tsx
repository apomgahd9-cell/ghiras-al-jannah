import { useState, useMemo } from 'react';
import { AppHeader } from '@/components/AppHeader';
import {
  Search,
  Heart,
  BookOpen,
  ChevronLeft,
  Filter,
  Sparkles,
  Star,
  RefreshCw,
  Sunrise,
  Sunset,
  Moon,
  HandHeart,
  Users,
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  searchDhikr,
  getCategoryCounts,
  getGradeLabel,
  getGradeCssClass,
  getSourcesForDhikr,
  getStatusLabel,
  getStatusCssClass,
} from '@/services/libraryDataService';
import { loadFavorites } from '@/services/favoritesStorage';
import { CATEGORIES } from '@/data/categories';
import type { DhikrCategory } from '@/types';

const ICON_MAP: Record<string, LucideIcon> = {};

ICON_MAP['Sparkles'] = Sparkles;
ICON_MAP['Star'] = Star;
ICON_MAP['RefreshCw'] = RefreshCw;
ICON_MAP['Heart'] = Heart;
ICON_MAP['Sunrise'] = Sunrise;
ICON_MAP['Sunset'] = Sunset;
ICON_MAP['Moon'] = Moon;
ICON_MAP['BookOpen'] = BookOpen;
ICON_MAP['HandHeart'] = HandHeart;
ICON_MAP['Users'] = Users;
ICON_MAP['Home'] = Home;

interface LibraryPageProps {
  onSelectDhikr: (id: string) => void;
}

type FilterMode = 'all' | 'favorites' | DhikrCategory;

export function LibraryPage({ onSelectDhikr }: LibraryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [showFilters, setShowFilters] = useState(false);

  const favorites = loadFavorites();
  const categoryCounts = useMemo(() => getCategoryCounts(), []);

  const filteredDhikr = useMemo(() => {
    let result = searchDhikr(searchQuery);
    if (filterMode === 'favorites') {
      result = result.filter((d) => favorites.includes(d.id));
    } else if (filterMode !== 'all') {
      result = result.filter((d) => d.category === filterMode);
    }
    return result;
  }, [searchQuery, filterMode, favorites]);

  return (
    <div className="animate-fade-in">
      <AppHeader title="المكتبة" subtitle="موسوعة الأذكار والأعمال الصالحة" />
      <div className="px-4 pb-24 space-y-4">
        {/* Info card */}
        <div className="card-gold p-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="text-gold-400 shrink-0" size={20} />
            <p className="text-sm text-cream-100/90 leading-relaxed">
              مكتبة موثوقة من الأذكار والأعمال الصالحة، مع ذكر المصدر ودرجة الحديث.
              المحتوى مراجَع وموثق.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-200/40"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن ذكر أو عمل صالح..."
            className="w-full bg-forest-950/60 border border-emerald-800/30 rounded-xl py-3 pr-10 pl-4 text-sm text-cream-50 placeholder:text-cream-200/30 focus:outline-none focus:border-emerald-600/50 transition-colors"
          />
        </div>

        {/* Filter toggles */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterMode === 'all'
                ? 'bg-emerald-600 text-cream-50'
                : 'bg-forest-950/60 text-cream-200/60 hover:text-cream-100'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterMode('favorites')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterMode === 'favorites'
                ? 'bg-gold-600 text-forest-950'
                : 'bg-forest-950/60 text-cream-200/60 hover:text-cream-100'
            }`}
          >
            <Heart size={14} fill={filterMode === 'favorites' ? 'currentColor' : 'none'} />
            المفضلة ({favorites.length})
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showFilters
                ? 'bg-emerald-800 text-cream-50'
                : 'bg-forest-950/60 text-cream-200/60 hover:text-cream-100'
            }`}
          >
            <Filter size={14} />
            التصنيفات
          </button>
        </div>

        {/* Category filters */}
        {showFilters && (
          <div className="card p-3 animate-slide-up">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => categoryCounts[c.id] > 0).map((cat) => {
                const Icon = ICON_MAP[cat.icon] ?? Sparkles;
                const isActive = filterMode === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilterMode(isActive ? 'all' : cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-cream-50'
                        : 'bg-forest-950/40 text-cream-200/60 hover:text-cream-100'
                    }`}
                  >
                    <Icon size={14} />
                    {cat.name}
                    <span className="text-[10px] opacity-60">({categoryCounts[cat.id]})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-xs text-cream-200/40 px-1">
          {filteredDhikr.length > 0
            ? `${filteredDhikr.length} نتيجة`
            : 'لا توجد نتائج'}
        </p>

        {/* Dhikr list */}
        <div className="space-y-2.5">
          {filteredDhikr.map((dhikr, idx) => {
            const sources = getSourcesForDhikr(dhikr);
            const primaryGrade = sources[0]?.grade ?? 'needs_review';
            const isFav = favorites.includes(dhikr.id);
            return (
              <button
                key={dhikr.id}
                onClick={() => onSelectDhikr(dhikr.id)}
                className="card p-4 w-full text-right hover:border-emerald-600/40 transition-colors animate-slide-up"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-cream-100 truncate">
                        {dhikr.name}
                      </h3>
                      {isFav && (
                        <Heart className="text-gold-400 shrink-0" size={14} fill="currentColor" />
                      )}
                    </div>
                    <p className="text-tashkeel text-base text-cream-200/70 line-clamp-1 leading-relaxed">
                      {dhikr.arabicText}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={getStatusCssClass(dhikr.status)}>
                        {getStatusLabel(dhikr.status)}
                      </span>
                      <span className={sources[0].sourceType === 'quran' ? 'label-tag bg-gold-900/30 text-gold-300/80 border border-gold-700/20' : getGradeCssClass(primaryGrade)}>
                        {sources[0].sourceType === 'quran' ? 'قرآن' : getGradeLabel(primaryGrade)}
                      </span>
                      {dhikr.recommendedCount !== undefined && (
                        <span className="text-[10px] text-gold-300/60 bg-gold-900/20 px-2 py-0.5 rounded-full">
                          ×{dhikr.recommendedCount}
                        </span>
                      )}
                      {sources.length > 0 && (
                        <span className="text-[10px] text-cream-200/40">
                          {sources[0].bookName}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronLeft className="text-cream-200/30 shrink-0 mt-1" size={18} />
                </div>
              </button>
            );
          })}
        </div>

        {filteredDhikr.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm text-cream-200/60">
              {filterMode === 'favorites'
                ? 'لا توجد أذكار في المفضلة بعد. أضف ذكرًا للمفضلة من صفحة التفاصيل.'
                : 'لا توجد نتائج مطابقة لبحثك'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
