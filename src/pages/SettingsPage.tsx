import { AppHeader } from '@/components/AppHeader';
import { OrnamentalDivider } from '@/components/OrnamentalDivider';
import {
  Vibrate,
  Volume2,
  Type,
  Sparkles,
  Download,
  Upload,
  Info,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SettingRowProps {
  icon: LucideIcon;
  label: string;
  description: string;
  iconColor: string;
  children: React.ReactNode;
}

function SettingRow({ icon: Icon, label, description, iconColor, children }: SettingRowProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-950/50 flex items-center justify-center shrink-0">
          <Icon className={iconColor} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-cream-100">{label}</h3>
          <p className="text-xs text-cream-200/50 mt-0.5 leading-relaxed">{description}</p>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-cream-200/60">{label}</span>
      <div
        className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
          enabled ? 'bg-emerald-600' : 'bg-forest-950/70 border border-emerald-900/40'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-cream-50 transition-all duration-200 ${
            enabled ? 'right-0.5' : 'right-[22px]'
          }`}
        />
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <AppHeader title="الإعدادات" subtitle="التخصيص والنسخ الاحتياطي" />
      <div className="px-4 pb-24 space-y-4">
        <OrnamentalDivider text="التفضيلات" />

        <SettingRow
          icon={Vibrate}
          label="الاهتزاز"
          description="اهتزاز خفيف عند الضغط على العداد"
          iconColor="text-emerald-400"
        >
          <ToggleSwitch enabled={true} label="تفعيل الاهتزاز" />
        </SettingRow>

        <SettingRow
          icon={Volume2}
          label="الصوت"
          description="صوت تنبيه عند إكمال الذكر"
          iconColor="text-emerald-400"
        >
          <ToggleSwitch enabled={false} label="تفعيل الصوت" />
        </SettingRow>

        <SettingRow
          icon={Type}
          label="حجم الخط"
          description="اختر حجم الخط المناسب للقراءة"
          iconColor="text-gold-400"
        >
          <div className="flex gap-2">
            {['صغير', 'متوسط', 'كبير'].map((size, idx) => (
              <button
                key={size}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  idx === 1
                    ? 'bg-emerald-600 text-cream-50'
                    : 'bg-forest-950/60 text-cream-200/60 hover:text-cream-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow
          icon={Sparkles}
          label="سرعة حركة الحديقة"
          description="تحكم في سرعة حركات الحديقة"
          iconColor="text-gold-400"
        >
          <div className="flex gap-2">
            {['إيقاف', 'بطيء', 'عادي'].map((speed, idx) => (
              <button
                key={speed}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  idx === 2
                    ? 'bg-emerald-600 text-cream-50'
                    : 'bg-forest-950/60 text-cream-200/60 hover:text-cream-100'
                }`}
              >
                {speed}
              </button>
            ))}
          </div>
        </SettingRow>

        <OrnamentalDivider text="النسخ الاحتياطي" />

        <div className="grid grid-cols-2 gap-3">
          <button className="card p-4 flex flex-col items-center gap-2 hover:border-gold-600/40 transition-colors">
            <Download className="text-gold-400" size={24} />
            <span className="text-xs text-cream-100">تصدير البيانات</span>
          </button>
          <button className="card p-4 flex flex-col items-center gap-2 hover:border-gold-600/40 transition-colors">
            <Upload className="text-gold-400" size={24} />
            <span className="text-xs text-cream-100">استعادة البيانات</span>
          </button>
        </div>

        <OrnamentalDivider text="حول التطبيق" />

        <div className="card p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-cream-100">الخصوصية</h3>
              <p className="text-xs text-cream-200/50 leading-relaxed">
                جميع بياناتك محفوظة على جهازك فقط. لا نجمع بيانات شخصية، ولا نرسل
                سجلاتك لأي جهة، ولا نستخدم إعلانات أو تتبعًا خفيًا.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-start gap-3">
            <Info className="text-gold-400 shrink-0 mt-0.5" size={20} />
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-cream-100">عن التطبيق</h3>
              <p className="text-xs text-cream-200/50 leading-relaxed">
                غِراس الجنة تطبيق إسلامي تحفيزي للمحافظة على الذكر والعبادات.
                المحتوى الديني قيد المراجعة والتوثيق.
              </p>
              <p className="text-xs text-cream-200/40">الإصدار 0.1.0</p>
            </div>
          </div>
        </div>

        <div className="text-center py-2">
          <p className="text-tashkeel text-base text-gold-300/60">
            ازرع الخير في دنياك
          </p>
          <p className="text-tashkeel text-base text-gold-300/60">
            وارجُ ثوابه في آخرتك
          </p>
        </div>
      </div>
    </div>
  );
}
