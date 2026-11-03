import { formatHijriDate, formatGregorianDate } from '@/utils/date';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="pt-5 pb-3 px-4 safe-top">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold gradient-text-gold truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-cream-200/60 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <div className="text-left shrink-0">
          <p className="text-xs text-gold-300/80 font-medium">{formatHijriDate()}</p>
          <p className="text-[11px] text-cream-200/45 mt-1">{formatGregorianDate()}</p>
        </div>
      </div>
    </header>
  );
}
