import { AppHeader } from '@/components/AppHeader';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import { GardenPreview } from '@/components/GardenPreview';
import { Sprout, TreePine, Flower2, Droplets, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface GardenStage {
  id: string;
  name: string;
  description: string;
  threshold: number;
  icon: LucideIcon;
  unlocked: boolean;
}

const STAGES: GardenStage[] = [
  {
    id: 'seed',
    name: 'البذرة',
    description: 'بداية رحلتك — أول ذكر تنطق به',
    threshold: 0,
    icon: Sprout,
    unlocked: true,
  },
  {
    id: 'sprout',
    name: 'النبتة الصغيرة',
    description: 'بعد 10 أذكار أو مهام مكتملة',
    threshold: 10,
    icon: Sprout,
    unlocked: false,
  },
  {
    id: 'tree',
    name: 'الشجرة النامية',
    description: 'بعد 50 أذكار أو مهام مكتملة',
    threshold: 50,
    icon: TreePine,
    unlocked: false,
  },
  {
    id: 'flowers',
    name: 'تفتح الزهور',
    description: 'بعد 100 أذكار أو مهام مكتملة',
    threshold: 100,
    icon: Flower2,
    unlocked: false,
  },
  {
    id: 'fountain',
    name: 'النافورة والبركة',
    description: 'بعد 200 أذكار أو مهام مكتملة',
    threshold: 200,
    icon: Droplets,
    unlocked: false,
  },
];

export function GardenPage() {
  return (
    <div className="animate-fade-in">
      <AppHeader title="حديقتي" subtitle="حديقتك الافتراضية تنمو مع إنجازك" />
      <div className="px-4 pb-24 space-y-4">
        {/* معاينة الحديقة */}
        <div className="card-elevated p-4">
          <GardenPreview progress={0} />
        </div>

        {/* تنبيه رمزي */}
        <div className="card-gold p-4">
          <p className="text-xs text-cream-200/70 leading-relaxed text-center">
            الحديقة وسيلة تحفيزية ورمزية، وليست وصفًا للجنة أو ضمانًا للثواب.
            إنما هي تشجيعٌ على المداومة على الخير.
          </p>
        </div>

        <OrnamentalDivider text="مراحل النمو" />

        {/* مراحل النمو */}
        <div className="space-y-2.5">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                className={`card p-4 flex items-center gap-3 animate-slide-up ${
                  stage.unlocked ? 'border-emerald-600/30' : 'opacity-60'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    stage.unlocked
                      ? 'bg-emerald-900/50'
                      : 'bg-forest-950/60'
                  }`}
                >
                  {stage.unlocked ? (
                    <Icon className="text-emerald-400" size={22} />
                  ) : (
                    <Lock className="text-cream-200/30" size={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-cream-100">{stage.name}</h3>
                  <p className="text-xs text-cream-200/50 mt-0.5">{stage.description}</p>
                </div>
                {stage.unlocked && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded-full">
                    متاح
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <OrnamentalDivider />

        {/* إحصائيات */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold gradient-text-gold">0</p>
            <p className="text-xs text-cream-200/60 mt-1">إجمالي الأذكار</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold gradient-text-gold">0</p>
            <p className="text-xs text-cream-200/60 mt-1">المهام المكتملة</p>
          </div>
        </div>

        <div className="card p-5 text-center">
          <p className="text-sm text-cream-200/60 leading-relaxed">
            سيتم بناء الحديقة التفاعلية الكاملة في مرحلة قادمة،
            مع إمكانية الضغط على الأشجار وتفاصيل كل عنصر.
          </p>
        </div>
      </div>
    </div>
  );
}
