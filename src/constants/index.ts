import { team } from '@/assets';
import {
  ShoppingCart,
  Tag,
  Shirt,
  Smartphone,
  Laptop,
  Tv,
  Headphones,
  Watch,
  Sofa,
  Bed,
  Package,
  Gift,
  Camera,
  Gamepad,
  Globe,
  Phone,
  CreditCard,
  ShoppingBag,
  FastForward,
  Car,
  Dumbbell,
  Star,
} from 'lucide-react';

// Icons for eCommerce categories
export const ecommerceIcons = [
  { name: 'Beauty & Fragrance', icon: Star },
  { name: 'Health & Nutrition', icon: FastForward },
  { name: 'Automotive', icon: Car },
  { name: 'Interior Design', icon: Sofa },
  { name: 'Sports & Fitness', icon: Dumbbell },
  { name: 'Fashion', icon: Shirt },
  { name: 'Electronics', icon: Smartphone },
  { name: 'Jewelry & Watches', icon: Watch },
  { name: 'Laptops', icon: Laptop },
  { name: 'Televisions', icon: Tv },
  { name: 'Headphones', icon: Headphones },
  { name: 'Furniture', icon: Sofa },
  { name: 'Bedding', icon: Bed },
  { name: 'Home Appliances', icon: Package },
  { name: 'Kitchenware', icon: Package },
  { name: 'Tools', icon: Package },
  { name: 'Bags', icon: ShoppingBag },
  { name: 'Shoes', icon: Tag },
  { name: 'Bicycles', icon: Package },
  { name: 'Books', icon: Tag },
  { name: 'Music', icon: Gamepad },
  { name: 'Gifts', icon: Gift },
  { name: 'Cameras', icon: Camera },
  { name: 'Video Games', icon: Gamepad },
  { name: 'Groceries', icon: Package },
  { name: 'Beverages', icon: Package },
  { name: 'Global', icon: Globe },
  { name: 'Contact', icon: Phone },
  { name: 'Payment', icon: CreditCard },
  { name: 'Shopping Cart', icon: ShoppingCart },
  { name: 'Discount', icon: Tag },
];

// routes
export const hideNavbarFooterRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/register',
  '/privacy-and-policy',
  '/dashboard',
  '/orders',
  '/addresses',
  '/settings',
];

// local storage constant
export const CURRENCY_STORAGE_KEY = 'dhdealz_preferredCurrency';

export const faqs = [
  {
    question: 'How do I track my order?',
    answer:
      'Once your order ships, you\'ll receive a tracking number via email. You can also track your order in real-time by logging into your account and visiting the "Order History" section.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer hassle-free returns within 30 days of delivery. Items must be unworn, with original tags attached. We provide free return shipping labels for all domestic orders.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes! We ship to over 50 countries worldwide. International shipping times typically range from 7-14 business days, depending on the destination.',
  },
  {
    question: 'How can I change or cancel my order?',
    answer:
      'Orders can be modified or cancelled within 1 hour of placement. Please contact our customer service team immediately for assistance with order changes.',
  },
];

export const teamMembers = [
  {
    id: 1,
    name: 'Yves Gahonzire',
    position: 'CEO & Co-Founder',
    image: team,
  },
  {
    id: 2,
    name: 'Yves Gahonzire',
    position: 'CEO & Co-Founder',
    image: team,
  },
  {
    id: 3,
    name: 'Yves Gahonzire',
    position: 'CEO & Co-Founder',
    image: team,
  },
];
