import {
  LayoutDashboard,
  MessageSquare,
  Search,
  Library,
  Bell,
  BarChart3,
  KeyRound,
  Settings,
  Users,
  Cpu,
  Mail,
  ShieldCheck,
  Cog,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: 'notifications';
};

export const appNav: NavItem[] = [
  { label: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'محادثة جديدة', href: '/chat/new', icon: MessageSquare },
  { label: 'البحث', href: '/search', icon: Search },
  { label: 'المكتبة', href: '/library', icon: Library },
  { label: 'الإشعارات', href: '/notifications', icon: Bell, badge: 'notifications' },
  { label: 'الاستهلاك', href: '/usage', icon: BarChart3 },
  { label: 'مفاتيح API', href: '/api-keys', icon: KeyRound },
  { label: 'الإعدادات', href: '/settings', icon: Settings },
];

export const adminNav: NavItem[] = [
  { label: 'نظرة عامة', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'المستخدمون', href: '/admin/users', icon: Users },
  { label: 'الاستهلاك', href: '/admin/usage', icon: BarChart3 },
  { label: 'النماذج', href: '/admin/models', icon: Cpu },
  { label: 'رسائل التواصل', href: '/admin/contact', icon: Mail },
  { label: 'الإشعارات', href: '/admin/notifications', icon: Bell },
  { label: 'سجلات الأمان', href: '/admin/security-logs', icon: ShieldCheck },
  { label: 'إعدادات النظام', href: '/admin/system', icon: Cog },
];

export const marketingNav = [
  { label: 'الرئيسية', href: '/' },
  { label: 'من نحن', href: '/about' },
  { label: 'الخدمات', href: '/services' },
  { label: 'الأسئلة الشائعة', href: '/faq' },
  { label: 'تواصل معنا', href: '/contact' },
] as const;
