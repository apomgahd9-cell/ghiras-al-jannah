import { NAV_ITEMS } from '@/app/navConfig';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-forest-950/95 backdrop-blur-md border-t border-emerald-800/30 safe-bottom">
      <div className="flex justify-around items-stretch max-w-md mx-auto h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-200 ${
                isActive
                  ? 'text-gold-400'
                  : 'text-cream-200/50 hover:text-cream-100/80'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold-400 rounded-full" />
              )}
              <Icon
                size={22}
                className={isActive ? 'scale-110' : ''}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <span className={`text-[11px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
