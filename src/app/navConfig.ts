import { Home, BookOpen, Sprout, ListChecks, Settings } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'library', label: 'المكتبة', icon: BookOpen },
  { id: 'garden', label: 'حديقتي', icon: Sprout },
  { id: 'program', label: 'البرنامج', icon: ListChecks },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];
