import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'tasbih_tahmid',
    name: 'التسبيح والتحميد',
    description: 'تنزيه الله تعالى وحمده والثناء عليه',
    icon: 'Sparkles',
  },
  {
    id: 'tahlil_takbir',
    name: 'التهليل والتكبير',
    description: 'توحيد الله تعالى وتكبيره',
    icon: 'Star',
  },
  {
    id: 'istighfar_tawbah',
    name: 'الاستغفار والتوبة',
    description: 'طلب المغفرة والرجوع إلى الله',
    icon: 'RefreshCw',
  },
  {
    id: 'salat_nabi',
    name: 'الصلاة على النبي ﷺ',
    description: 'الصلاة والسلام على رسول الله',
    icon: 'Heart',
  },
  {
    id: 'morning',
    name: 'أذكار الصباح',
    description: 'ما يُقال في الصباح بعد صلاة الفجر',
    icon: 'Sunrise',
  },
  {
    id: 'evening',
    name: 'أذكار المساء',
    description: 'ما يُقال في المساء بعد صلاة العصر',
    icon: 'Sunset',
  },
  {
    id: 'sleep',
    name: 'أذكار النوم والاستيقاظ',
    description: 'ما يُقال عند النوم والاستيقاظ',
    icon: 'Moon',
  },
  {
    id: 'prayer_virtues',
    name: 'فضائل الصلاة',
    description: 'فضل المحافظة على الصلاة والصلوات الخمس',
    icon: 'Star',
  },
  {
    id: 'quran',
    name: 'قراءة القرآن',
    description: 'فضل قراءة القرآن الكريم وتدبره',
    icon: 'BookOpen',
  },
  {
    id: 'charity',
    name: 'الصدقة والإحسان',
    description: 'فضل الصدقة والإحسان إلى الناس',
    icon: 'HandHeart',
  },
  {
    id: 'parents',
    name: 'بر الوالدين',
    description: 'فضل بر الوالدين والإحسان إليهما',
    icon: 'Users',
  },
  {
    id: 'kinship',
    name: 'صلة الرحم',
    description: 'فضل صلة الأرحام والحفاظ عليها',
    icon: 'Users',
  },
  {
    id: 'paradise_deeds',
    name: 'أعمال تدخل الجنة',
    description: 'الأعمال التي ورد أنها تُدخل الجنة',
    icon: 'Home',
  },
  {
    id: 'dhikr_general',
    name: 'فضائل الذكر عمومًا',
    description: 'فضل ذكر الله تعالى والإكثار منه',
    icon: 'Sparkles',
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);
