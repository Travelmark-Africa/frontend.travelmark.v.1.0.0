import {
  Award,
  Calendar,
  Users,
  Star,
  MapPin,
  Globe,
  Settings,
  ClipboardList,
  Briefcase,
  Handshake,
  Phone,
  UserCog,
  Lightbulb,
  Target,
  Zap,
  Trophy,
  Activity,
  Building,
  Compass,
  Heart,
  Shield,
  Rocket,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

// Routes to hide navbar/footer
export const hideFooterOrNavbarRoutes = ['/auth/login', '/dashboard'];

// Dashboard Nav links
export const navLinks = [
  { href: '/dashboard/company-settings', label: 'Company Settings', iconName: 'Settings' },
  { href: '/dashboard/services', label: 'Services', iconName: 'ClipboardList' },
  { href: '/dashboard/projects', label: 'Projects', iconName: 'Briefcase' },
  { href: '/dashboard/unique-selling-points', label: 'Unique Selling Points', iconName: 'Star' },
  { href: '/dashboard/partners', label: 'Partners', iconName: 'Handshake' },
  { href: '/dashboard/regions', label: 'Regions', iconName: 'Globe' },
  { href: '/dashboard/team', label: 'Team Members', iconName: 'Users' },
  { href: '/dashboard/contacts', label: 'Contacts', iconName: 'Phone' },
  { href: '/dashboard/subscribers', label: 'Subscribers', iconName: 'Users' },
  { href: '/dashboard/faqs', label: 'FAQs', iconName: 'HelpCircle' },
  { href: '/dashboard/account-settings', label: 'Account Settings', iconName: 'UserCog' },
];

// Services constants
export const CATEGORIES = [
  'Event Planning',
  'Digital Services',
  'Event Consulting',
  'Ministerial Summit',
  'Development Initiative',
  'Marketing',
  'Training',
  'Exhibition',
  'Other',
] as const;

export const ICONS = [
  'Settings',
  'Calendar',
  'Users',
  'Briefcase',
  'Globe',
  'Lightbulb',
  'Target',
  'Zap',
  'Trophy',
  'Star',
  'Activity',
  'Award',
  'Building',
  'Compass',
  'Heart',
  'Shield',
  'Rocket',
  'TrendingUp',
  'CheckCircle',
  'ArrowRight',
  'MapPin',
  'ClipboardList',
  'Handshake',
  'Phone',
  'UserCog',
  'HelpCircle',
] as const;

export const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Settings,
    Calendar,
    Users,
    Briefcase,
    Globe,
    Star,
    Award,
    MapPin,
    ClipboardList,
    Handshake,
    Phone,
    UserCog,
    Lightbulb,
    Target,
    Zap,
    Trophy,
    Activity,
    Building,
    Compass,
    Heart,
    Shield,
    Rocket,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    HelpCircle,
  };

  return icons[iconName] || Settings;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
