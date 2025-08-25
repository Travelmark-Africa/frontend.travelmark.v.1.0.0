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
import { conference, norken, tourism, aboutImage1, aboutImage2, aboutImage3 } from '@/assets';

/********************************
 * Home Page
 ********************************/
// Hero Section
export const stepCards = [
  { id: '01', description: 'From concept to execution, we help design and deliver strategic, impactful events.' },
  {
    id: '02',
    description: 'We craft MICE plans, market destinations, and manage major business events across Africa.',
  },
  { id: '03', description: 'We empower local talent, foster global partnerships, and promote sustainable tourism.' },
];

// Contact Links
export const contactLinks = {
  calendly: 'https://calendly.com/travelmarkafrica/30min',
  whatsapp: 'https://wa.me/250788357850',
};

// Who We Are Section - Service cards
export const serviceCards = [
  {
    id: 1,
    image: aboutImage1,
    alt: 'Event consultation and planning',
    title: 'Event Consultation',
    description: 'From concept to coordination, we design experiences that reflect purpose and professionalism.',
  },
  {
    id: 2,
    image: aboutImage2,
    alt: 'MICE strategy and destination marketing',
    title: 'MICE Consultation',
    description: 'We support national and regional efforts to grow Meetings, Incentives, Conferences, and Exhibitions.',
  },
  {
    id: 3,
    image: aboutImage3,
    alt: 'Training session in Africa',
    title: 'Capacity & Sustainability',
    description: 'We train professionals, enable partnerships, and promote responsible growth in tourism.',
  },
];

// Who We Are Section - Stats
export const stats = [
  { id: 1, value: '5', label: 'African Regions Covered' },
  { id: 2, value: '10+', label: 'Events Led & Coordinated' },
  { id: 3, value: 'Global', label: 'Event Footprint' },
];

/********************************
 * About Us Page
 ********************************/
// Our Services
export const services = [
  {
    id: 1,
    title: 'Event Consultation Services',
    description:
      'Expert guidance in designing and implementing impactful events and conferences tailored to your unique objectives and strategic goals.',
    category: 'Event Planning',
    color: 'bg-gradient-to-br from-red-50 to-red-100',
    accent: 'text-red-600',
    iconName: 'Calendar',
  },
  {
    id: 2,
    title: 'MICE Consultation Services',
    description:
      'Helping countries and institutions establish or scale up their MICE capabilities to boost business tourism profile and economic development.',
    category: 'MICE Development',
    color: 'bg-gradient-to-br from-blue-50 to-blue-100',
    accent: 'text-blue-600',
    iconName: 'MapPin',
  },
  {
    id: 3,
    title: 'Capacity Building & Sustainability Support',
    description:
      'Strengthening the business tourism ecosystem through professional development, training programs and sustainable tourism practices.',
    category: 'Capacity Building',
    color: 'bg-gradient-to-br from-green-50 to-green-100',
    accent: 'text-green-600',
    iconName: 'Users',
  },
];

/********************************
 * Services Page
 ********************************/
export const servicesDetails = [
  {
    id: 1,
    title: 'Event Consultation',
    description:
      'We work with institutions, corporates, and development partners to design and execute impactful events, summits, and conferences. From concept to delivery, we ensure every event is purpose-driven, well-managed, and aligns with your organizational goals.',
    subServices: [
      {
        name: 'Event & Conference Concepts',
        detail:
          'We co-create strong themes, formats, agendas, and delivery frameworks tailored to your audience and outcomes.',
      },
      {
        name: 'Stakeholder Engagement',
        detail:
          'We facilitate engagement with relevant institutions, partners, sponsors, speakers, and attendees across sectors.',
      },
      {
        name: 'Sales Agent Services',
        detail:
          'We actively promote your event, drive ticketing and registration, and coordinate outreach to target participants.',
      },
    ],
    image: conference,
    imageAlt: 'Event consultation and conference planning',
  },
  {
    id: 2,
    title: 'MICE Strategy',
    description:
      'Our MICE (Meetings, Incentives, Conferences, and Exhibitions) service supports governments, bureaus, and institutions in positioning destinations for high-value business tourism. We build actionable MICE plans and help deliver standout events.',
    subServices: [
      {
        name: 'MICE Strategy Development',
        detail:
          'We develop national and city-level frameworks that outline how to grow and sustain MICE as an economic driver.',
      },
      {
        name: 'Destination Marketing',
        detail:
          'We promote countries, cities, and venues as competitive MICE hubs through content, campaigns, and partnerships.',
      },
      {
        name: 'Event Creation & Management',
        detail: 'We design, launch, and deliver high-quality events aligned with destination positioning strategies.',
      },
    ],
    image: tourism,
    imageAlt: 'MICE consultation and destination marketing',
  },
  {
    id: 3,
    title: 'Capacity & Sustainability',
    description:
      "We invest in people, partnerships, and practices to strengthen Africa's business tourism ecosystem. Our focus areas include training, research, partnerships, and promoting responsible, inclusive growth across the sector.",
    subServices: [
      {
        name: 'Capacity Building & Training',
        detail:
          'We deliver structured training for professionals in events, hospitality, tourism, and support sectors.',
      },
      {
        name: 'Business Matchmaking',
        detail: 'We create platforms for African businesses to meet international buyers, partners, and collaborators.',
      },
      {
        name: 'Research & Data Analysis',
        detail:
          'We generate insights and reports to inform policy, investment, and programming decisions in the sector.',
      },
      {
        name: 'Sustainable Tourism Practices',
        detail: 'We support eco-conscious policies, ethical supply chains, and green event management approaches.',
      },
    ],
    image: norken,
    imageAlt: 'Capacity building and sustainability training',
  },
];

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
