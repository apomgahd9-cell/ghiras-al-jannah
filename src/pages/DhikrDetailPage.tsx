import { useState, useEffect } from 'react';
import { ArrowRight, Heart, BookOpen, Play, Share2 } from 'lucide-react';
import {
  getDhikrById,
  getSourcesForDhikr,
  getCategoryById,
  getGradeLabel,
  getGradeCssClass,
  getStatusLabel,
  getStatusCssClass,
} from '@/services/libraryDataService';
import { isFavorite, toggleFavorite } from '@/services/favoritesStorage';
import type { Source } from '@/types';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';

interface DhikrDetailPageProps {
  dhikrId: string;
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export function DhikrDetailPage({ dhikrId, onBack, onNavigate }: DhikrDetailPageProps) {
  const dhikr = getDhikrById(dhikrId);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(dhikrId));
  }, [dhikrId]);

  if (!dhikr) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-8 text-center">
          <p className="text-cream-200/70 text-sm">لم يتم العثور على هذا الذكر</p>
          <button onClick={onBack} className="btn-primary mt-4">
            العودة للمكتبة
          </button>
        </div>
      </div>
    );
  }

  const sources = getSourcesForDhikr(dhikr);
  const category = getCategoryById(dhikr.category);

  const handleToggleFav = () => {
    toggleFavorite(dhikrId);
    setFavorite(isFavorite(dhikrId));
  };

  return (
    <div className="animate-fade-in min-h-screen">
      {/* Back bar */}
      <div className="sticky top-0 z-40 bg-forest-950/90 backdrop-blur-md border-b border-emerald-800/20 px-4 py-3 safe-top">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-cream-200/70 hover:text-cream-100 transition-colors"
            aria-label="العودة"
          >
            <ArrowRight size={20} />
            <span className="text-sm">المكتبة</span>
          </button>
          <button
            onClick={handleToggleFav}
            className={`p-2 rounded-lg transition-colors ${
              favorite
                ? 'text-gold-400 bg-gold-600/10'
                : 'text-cream-200/50 hover:text-cream-100'
            }`}
            aria-label={favorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-24 max-w-md mx-auto space-y-4">
        {/* Category + Status badges */}
        <div className="pt-3 flex items-center gap-2 flex-wrap">
          {category && (
            <span className="label-tag bg-emerald-900/40 text-emerald-300 border border-emerald-700/20">
              {category.name}
            </span>
          )}
          <span className={getStatusCssClass(dhikr.status)}>
            {getStatusLabel(dhikr.status)}
          </span>
        </div>

        {/* Status note */}
        {dhikr.statusNote && (
          <div className={`card p-4 ${dhikr.status === 'weak' ? 'border-red-800/30' : dhikr.status === 'needs_review' ? 'border-amber-800/30' : ''}`}>
            <p className={`text-xs leading-relaxed ${
              dhikr.status === 'weak' ? 'text-red-300/70' : dhikr.status === 'needs_review' ? 'text-amber-300/70' : 'text-gold-300/60'
            }`}>
              {dhikr.statusNote}
            </p>
          </div>
        )}

        {/* Name + text */}
        <div className="card-elevated p-6 animate-slide-up">
          <h1 className="text-xl font-bold gradient-text-gold mb-4 text-center">
            {dhikr.name}
          </h1>
          <div className="bg-forest-950/40 rounded-xl p-5">
            <p className="text-tashkeel text-xl text-cream-50 leading-loose text-center">
              {dhikr.tashkeelText ?? dhikr.arabicText}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <h2 className="section-title mb-3">الشرح</h2>
          <p className="text-sm text-cream-200/80 leading-relaxed">{dhikr.explanation}</p>
        </div>

        {/* Virtue */}
        <div className="card-gold p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-title mb-3">الفضل والثواب</h2>
          <p className="text-sm text-cream-100/90 leading-relaxed">{dhikr.virtue}</p>
        </div>

        {/* Count */}
        {dhikr.recommendedCount !== undefined && (
          <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between">
              <h2 className="section-title">العدد الوارد</h2>
              <span className="text-2xl font-bold gradient-text-gold">
                {dhikr.recommendedCount}
              </span>
            </div>
            {dhikr.countNote && (
              <p className="text-xs text-cream-200/50 mt-2">{dhikr.countNote}</p>
            )}
          </div>
        )}

        <OrnamentalDivider text="المصادر والتخريج" />

        {/* Sources */}
        <div className="space-y-2.5">
          {sources.map((source: Source) => (
            <div
              key={source.id}
              className="card p-4 animate-slide-up"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-emerald-400 shrink-0" size={18} />
                  <span className="text-sm font-semibold text-cream-100">
                    {source.bookName}
                  </span>
                </div>
                <span className={source.sourceType === 'quran' ? 'label-tag bg-gold-900/30 text-gold-300/80 border border-gold-700/20' : getGradeCssClass(source.grade)}>
                  {source.sourceType === 'quran' ? 'قرآن' : getGradeLabel(source.grade)}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-cream-200/60 pr-7">
                {source.hadithNumber && (
                  <p>رقم الحديث: {source.hadithNumber}</p>
                )}
                {source.surahName && source.verseNumber && (
                  <p>سورة {source.surahName} — الآية {source.verseNumber}</p>
                )}
                {source.narrator && <p>الراوي: {source.narrator}</p>}
                {source.sourceType === 'hadith' && source.gradingRef && (
                  <p className="text-emerald-300/50">مرجع التقييم: {source.gradingRef}</p>
                )}
                {source.hadithText && (
                  <div className="mt-2 bg-forest-950/40 rounded-lg p-3">
                    <p className="text-tashkeel text-sm text-cream-100/70 leading-relaxed">{source.hadithText}</p>
                  </div>
                )}
                {source.note && (
                  <p className="text-gold-300/60 mt-1">{source.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <OrnamentalDivider />
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('home')}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            <Play size={18} />
            <span>انتقال إلى العداد (قريبًا)</span>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleToggleFav}
              className={`btn-ghost flex items-center justify-center gap-2 ${
                favorite ? 'text-gold-400 border-gold-600/30' : ''
              }`}
            >
              <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
              <span>{favorite ? 'في المفضلة' : 'أضف للمفضلة'}</span>
            </button>
            <button
              className="btn-ghost flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              <span>مشاركة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
