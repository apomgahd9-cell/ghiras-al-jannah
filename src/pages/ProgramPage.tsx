import { AppHeader } from '@/components/AppHeader';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import {
  Sun,
  Moon,
  BookOpen,
  Sunset,
  Star,
  HandHeart,
  BedDouble,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProgramItem {
  id: string;
  name: string;
  description: string;
  time: string;
  icon: LucideIcon;
}

const DEFAULT_PROGRAM: ProgramItem[] = [
  {
    id: 'morning',
    name: 'أذكار الصباح',
    description: 'أذكار الصباح بعد صلاة الفجر',
    time: 'بعد الفجر',
    icon: Sun,
  },
  {
    id: 'quran',
    name: 'قراءة القرآن',
    description: 'ورد يومي من كتاب الله',
    time: 'أي وقت',
    icon: BookOpen,
  },
  {
    id: 'prayers',
    name: 'المحافظة على الصلوات',
    description: 'الصلوات الخمس في وقتها',
    time: 'مواقيت الصلاة',
    icon: Star,
  },
  {
    id: 'adhkar_day',
    name: 'الأذكار خلال اليوم',
    description: 'التسبيح والاستغفار والصلاة على النبي',
    time: 'خلال اليوم',
    icon: Sunset,
  },
  {
    id: 'evening',
    name: 'أذكار المساء',
    description: 'أذكار المساء بعد صلاة العصر',
    time: 'بعد العصر',
    icon: Moon,
  },
  {
    id: 'charity',
    name: 'أعمال الخير',
    description: 'صدقة، صلة رحم، إحسان',
    time: 'أي وقت',
    icon: HandHeart,
  },
  {
    id: 'sleep',
    name: 'أذكار النوم',
    description: 'أذكار النوم قبل النوم',
    time: 'قبل النوم',
    icon: BedDouble,
  },
];

export function ProgramPage() {
  return (
    <div className="animate-fade-in">
      <AppHeader title="البرنامج اليومي" subtitle="جدول عباداتك وأعمالك" />
      <div className="px-4 pb-24 space-y-4">
        {/* تقدم اليوم */}
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">إنجاز اليوم</h2>
            <span className="text-sm text-cream-200/60">0 / 7</span>
          </div>
          <div className="w-full bg-forest-950/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-l from-emerald-500 to-gold-400 h-full rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        <OrnamentalDivider text="المهام اليومية" />

        {/* قائمة المهام */}
        <div className="space-y-2.5">
          {DEFAULT_PROGRAM.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="card p-4 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-900/40 flex items-center justify-center shrink-0">
                  <Icon className="text-emerald-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-cream-100">{item.name}</h3>
                  <p className="text-xs text-cream-200/50 mt-0.5">{item.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[10px] text-gold-300/60 bg-gold-900/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {item.time}
                  </span>
                  <span className="w-5 h-5 rounded-full border-2 border-emerald-700/50" />
                </div>
              </div>
            );
          })}
        </div>

        <OrnamentalDivider />

        <div className="card p-5 text-center">
          <p className="text-sm text-cream-200/60 leading-relaxed">
            سيتم تفعيل المهام والتتبع والتخصيص في مرحلة قادمة.
            لا تُسجَّل أي عبادة إلا بعد تأكيدك لها.
          </p>
        </div>
      </div>
    </div>
  );
}
