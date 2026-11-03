import { AppHeader } from '@/components/AppHeader';
import { GardenPreview } from '@/components/GardenPreview';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import { Sprout, ListChecks, BookOpen, Play, TrendingUp } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const dailyProgress = 0;

  return (
    <div className="animate-fade-in">
      <AppHeader title="غِراس الجنة" subtitle="رحلتك اليوم" />
      <div className="px-4 space-y-4 pb-24">
        {/* بطاقة رسالة اليوم */}
        <div className="card-gold p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gold-300 text-sm font-semibold">رسالة اليوم</span>
          </div>
          <p className="text-cream-100 leading-relaxed text-sm text-balance">
            ازرع الخير في دنياك، وارجُ ثوابه في آخرتك. كل ذكر تذكره، وكل عمل صالح تقوم به،
            غرسةٌ تنمو في حديقتك.
          </p>
        </div>

        {/* بطاقة ذكر اليوم — العنصر الأهم */}
        <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">ذكر اليوم</h2>
            <span className="label-sahih">صحيح</span>
          </div>
          <div className="bg-forest-950/40 rounded-xl p-5 mb-4">
            <p className="text-tashkeel text-2xl text-cream-50 leading-loose text-center">
              سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-cream-200/80 leading-relaxed text-center">
              من قالها مائة مرة حُطَّت خطاياه وإن كانت مثل زبد البحر
            </p>
            <p className="text-xs text-gold-400/60 text-center">
              رواه البخاري ومسلم — متفق عليه
            </p>
          </div>
          <OrnamentalDivider />
          <div className="flex gap-3">
            <button
              className="btn-gold flex-1 flex items-center justify-center gap-2"
              onClick={() => onNavigate('library')}
            >
              <Play size={18} />
              <span>ابدأ العدّ</span>
            </button>
            <button
              className="btn-ghost flex items-center justify-center gap-2"
              onClick={() => onNavigate('library')}
            >
              <BookOpen size={18} />
              <span>المكتبة</span>
            </button>
          </div>
        </div>

        {/* بطاقة التقدم اليومي */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">تقدم اليوم</h2>
            <span className="text-sm text-cream-200/60">{dailyProgress}%</span>
          </div>
          <div className="w-full bg-forest-950/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-l from-emerald-500 to-gold-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
          <p className="text-sm text-cream-200/60 mt-3 text-center">
            لم تبدأ بعد — ابدأ رحلتك بالضغط على العدّ
          </p>
        </div>

        {/* اختصارات سريعة */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <button
            onClick={() => onNavigate('garden')}
            className="card p-4 flex flex-col items-center gap-2 hover:border-emerald-600/40 transition-colors"
          >
            <Sprout className="text-emerald-400" size={26} />
            <span className="text-xs text-cream-100 text-center">حديقتي</span>
          </button>
          <button
            onClick={() => onNavigate('program')}
            className="card p-4 flex flex-col items-center gap-2 hover:border-emerald-600/40 transition-colors"
          >
            <ListChecks className="text-emerald-400" size={26} />
            <span className="text-xs text-cream-100 text-center">البرنامج</span>
          </button>
          <button
            onClick={() => onNavigate('library')}
            className="card p-4 flex flex-col items-center gap-2 hover:border-emerald-600/40 transition-colors"
          >
            <BookOpen className="text-emerald-400" size={26} />
            <span className="text-xs text-cream-100 text-center">المكتبة</span>
          </button>
        </div>

        {/* معاينة الحديقة */}
        <div className="card p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">حديقتي</h2>
            <button
              onClick={() => onNavigate('garden')}
              className="text-xs text-gold-400/70 hover:text-gold-300 transition-colors"
            >
              عرض كامل
            </button>
          </div>
          <GardenPreview progress={dailyProgress} />
        </div>

        {/* مهام اليوم المتبقية */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-emerald-400" size={18} />
            <h2 className="section-title">مهام اليوم المتبقية</h2>
          </div>
          <div className="space-y-2.5">
            <TaskPreviewItem label="أذكار الصباح" />
            <TaskPreviewItem label="قراءة القرآن" />
            <TaskPreviewItem label="أذكار المساء" />
            <TaskPreviewItem label="أذكار النوم" />
          </div>
          <button
            onClick={() => onNavigate('program')}
            className="btn-outline-gold w-full mt-4"
          >
            عرض البرنامج الكامل
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskPreviewItem({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full border-2 border-emerald-700/50" />
        <span className="text-sm text-cream-100/90">{label}</span>
      </div>
      <span className="text-xs text-cream-200/40">بانتظارك</span>
    </div>
  );
}
