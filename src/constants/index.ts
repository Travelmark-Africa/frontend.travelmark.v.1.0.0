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
} from 'lucide-react';
import {
  team,
  conference,
  norken,
  tourism,
  aboutImage1,
  aboutImage2,
  aboutImage3,
  afp,
  icca,
  meetingsAfrica,
  nepad,
  rcb,
  unt,
} from '@/assets';

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

// Project Cards
export const cards = [
  {
    category: 'Event Consulting',
    title: 'Africa Energy Expo – Powering Partnerships for a Sustainable Future',
    image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753729758/energy_awxxim.png',
    textColor: 'text-white',
  },
  {
    category: 'High-Level Convenings',
    title: 'International Health Ministerial Summit Rwanda',
    image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753730919/ihms_pxivnk.png',
    textColor: 'text-white',
  },
  {
    category: 'Agribusiness & Development',
    title: "Agro-Food Rwanda Project – Showcasing Africa's Food Security Innovations",
    image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753731827/images_1_byjdeg.png',
    textColor: 'text-white',
  },
];

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

// Why Choose Us Section - Features
export const features = [
  {
    id: 1,
    iconName: 'Award',
    title: 'Deep Regional Expertise',
    description:
      'With teams across Africa, we bring localized knowledge, cultural fluency, and regional market insights into every project we deliver.',
  },
  {
    id: 2,
    iconName: 'Calendar',
    title: 'Tailored Strategies',
    description:
      'No one-size-fits-all. Every country, institution, or event gets a custom roadmap based on its unique goals, audience, and strengths.',
  },
  {
    id: 3,
    iconName: 'Users',
    title: 'Reliable Local Networks',
    description:
      'We work with vetted vendors, suppliers, and facilitators in every region—ensuring quality delivery with zero guesswork or delays.',
  },
  {
    id: 4,
    iconName: 'Star',
    title: 'End-to-End Execution',
    description:
      'From strategy and planning to on-site coordination and post-event review—we stay with you every step of the journey.',
  },
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

// Partners
export const partners = [
  { id: 1, name: 'Rwanda Convention Bureau (RCB)', logo: rcb, website: 'https://rcb.rw' },
  { id: 2, name: 'Africa Tourism Partners', logo: afp, website: 'https://africatourismpartners.com' },
  { id: 3, name: 'UNWTO', logo: unt, website: 'https://www.unwto.org' },
  { id: 4, name: 'ICCA', logo: icca, website: 'https://www.iccaworld.org' },
  { id: 6, name: 'NEPAD (AUDA)', logo: nepad, website: 'https://www.nepad.org' },
  { id: 7, name: 'Meetings Africa', logo: meetingsAfrica, website: 'https://www.meetingsafrica.co.za' },
];

// Regions
export const regions = [
  { name: 'North Africa', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'West Africa', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'East Africa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Central Africa', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Southern Africa', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

// Team Members
export const teamMembers = [
  { id: 1, name: 'Yves Gahonzire', position: 'CEO & Co-Founder', image: team },
  { id: 2, name: 'Yves Gahonzire', position: 'CEO & Co-Founder', image: team },
  { id: 3, name: 'Yves Gahonzire', position: 'CEO & Co-Founder', image: team },
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

// FAQs
export const faqs = [
  {
    question: 'What services does TravelMark Africa offer?',
    answer:
      'We specialize in three core areas: Event Consultation, MICE (Meetings, Incentives, Conferences & Exhibitions) Consultation, and Destination Marketing. Each service is tailored to meet the unique needs of our clients across Africa.',
  },
  {
    question: 'What is MICE consultation?',
    answer:
      'MICE stands for Meetings, Incentives, Conferences, and Exhibitions. Our MICE services involve strategic planning, stakeholder engagement, destination marketing, and seamless event execution to support corporate and institutional gatherings.',
  },
  {
    question: 'Do you only operate in Rwanda?',
    answer:
      'While we are based in Kigali, Rwanda, TravelMark Africa operates across the continent. We have partnered with various organizations to deliver events and consultations throughout Africa.',
  },
  {
    question: 'Can you assist with international conferences?',
    answer:
      'Yes. We provide full-scale support for international events, including government and ministerial summits, business expos, and industry-specific gatherings.',
  },
  {
    question: 'How early should I contact you to plan an event?',
    answer:
      'For the best results, we recommend reaching out at least 4–6 weeks before your planned event. However, we can accommodate shorter timelines depending on the scope.',
  },
  {
    question: 'Do you help with marketing my event?',
    answer:
      'Yes. Through our Destination Marketing service, we help you position your event for maximum visibility and attendance, including digital campaigns and stakeholder outreach.',
  },
];

// Portfolio
export const projects = [
  {
    id: 1,
    title: 'Africa Energy Expo',
    subtitle: 'Powering Partnerships for a Sustainable Future',
    description:
      "Led strategic advisory and event operations for Africa's flagship energy conference, fostering investment dialogue in renewable energy, oil & gas, and clean technologies.",
    category: 'Event Consulting',
    impact: '500+ Delegates',
    location: 'Kigali, Rwanda',
    year: '2024',
    color: 'bg-gradient-to-br from-orange-50 to-red-100',
    accent: 'text-orange-600',
    iconName: 'Globe',
    image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753729758/energy_awxxim.png',
  },
  {
    id: 2,
    title: 'International Health Ministerial Summit',
    subtitle: 'Strengthening Health Systems Through Dialogue',
    description:
      'Convened over 45 health ministers and sector leaders for a high-level summit on healthcare innovation, policy reform, and cross-border collaboration.',
    category: 'Ministerial Summit',
    impact: '45+ Ministers',
    location: 'Kigali, Rwanda',
    year: '2024',
    color: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    accent: 'text-blue-600',
    iconName: 'Users',
    image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753730919/ihms_pxivnk.png',
  },
  {
    id: 3,
    title: 'Agro-Food Rwanda Project',
    subtitle: 'Scaling Agri-Tech and Food Security Solutions',
    description:
      'Curated a multi-stakeholder initiative spotlighting innovations in agri-processing, food supply chains, and sustainable farming across regional ecosystems.',
    category: 'Development Initiative',
    impact: '200+ Stakeholders',
    location: 'Multiple Regions',
    year: '2024',
    color: 'bg-gradient-to-br from-green-50 to-emerald-100',
    accent: 'text-green-600',
    iconName: 'Award',
    image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753731827/images_1_byjdeg.png',
  },
];

// Routes to hide navbar/footer
export const hideFooterOrNavbarRoutes = ['/auth/login', '/dashboard'];

// Dashboard Nav links
export const navLinks = [
  { href: '/dashboard/settings', label: 'Company Settings', iconName: 'Settings' },
  { href: '/dashboard/services', label: 'Services', iconName: 'ClipboardList' },
  { href: '/dashboard/uniqueness', label: 'Why Choose Us', iconName: 'Star' },
  { href: '/dashboard/portfolio', label: 'Portfolio', iconName: 'Briefcase' },
  { href: '/dashboard/partners', label: 'Partners', iconName: 'Handshake' },
  { href: '/dashboard/presence', label: 'Global Presence', iconName: 'Globe' },
  { href: '/dashboard/team', label: 'Our Team', iconName: 'Users' },
  { href: '/dashboard/contacts', label: 'Contacts', iconName: 'Phone' },
  { href: '/dashboard/account-settings', label: 'Account Settings', iconName: 'UserCog' },
];

// Services constants
export const SERVICE_CATEGORIES = [
  'Event Planning',
  'Consulting',
  'Digital Services',
  'Marketing',
  'Training',
  'Other',
] as const;

export const SERVICE_ICONS = [
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
  };

  return icons[iconName] || Settings;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
