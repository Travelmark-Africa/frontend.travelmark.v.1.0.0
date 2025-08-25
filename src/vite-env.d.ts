/// <reference types="vite/client" />

interface RouteObject {
  path: string;
  element: React.ReactNode;
  authRequired?: boolean;
  requiredRoles?: string[];
}
type LoginFormInputs = {
  email: string;
  password: string;
};

type ForgotPasswordInputs = {
  email: string;
};

interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}
interface Feature {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  subject: string;
  message: string;
}

interface SubService {
  subServiceTitle: string;
  subServiceDescription: string;
}

interface Service {
  $id: string;
  homepageHeroStepDescriptionText: string;
  homepageCardTitleText: string;
  homepageCardDescriptionText: string;
  homepageCardThumbnailImageUrl?: string;
  homepageCardThumbnailImageAltText?: string;
  aboutPageServiceFullTitleText: string;
  aboutPageServiceFullDescriptionText: string;
  aboutPageServiceCategoryText: string;
  aboutPageServiceIconIdentifier: string;
  servicesPageFullTitleText: string;
  servicesPageFullDescriptionText: string;
  servicesPageBannerImageUrl?: string;
  servicesPageBannerImageAltText?: string;
  servicesPageSubServicesJson?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface ServiceFormData {
  homepageHeroStepDescriptionText: string;
  homepageCardTitleText: string;
  homepageCardDescriptionText: string;
  homepageCardThumbnailImageUrl: string;
  homepageCardThumbnailImageAltText: string;
  aboutPageServiceFullTitleText: string;
  aboutPageServiceFullDescriptionText: string;
  aboutPageServiceCategoryText: string;
  aboutPageServiceIconIdentifier: string;
  servicesPageFullTitleText: string;
  servicesPageFullDescriptionText: string;
  servicesPageBannerImageUrl: string;
  servicesPageBannerImageAltText: string;
  servicesPageSubServices: SubService[];
}

interface FAQ {
  $id: string;
  question: string;
  answer: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface FAQFormData {
  question: string;
  answer: string;
}

interface MessageFormData {
  $id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  subject: string;
  message: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface TeamMember {
  $id: string;
  fullName: string;
  email: string;
  position: string;
  bio?: string;
  profileImageUrl?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface TeamMemberFormData {
  fullName: string;
  email: string;
  position: string;
  bio: string;
  profileImageUrl: string;
}

interface Partner {
  $id: string;
  name: string;
  logo: string;
  website: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface PartnerFormData {
  name: string;
  logo: string;
  website: string;
}

interface SubscriptionFormData {
  email: string;
}

interface Subscription extends SubscriptionFormData {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface SubscriptionsResponse {
  data: Subscription[];
  total: number;
}

interface MutationResponse {
  ok: boolean;
  message: string;
  data: Subscription;
}

interface DeleteMutationResponse {
  ok: boolean;
  message: string;
}

interface Region {
  $id: string;
  name: string;
  description: string;
  image: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface RegionFormData {
  name: string;
  description: string;
  image: string;
}

interface USP {
  $id: string;
  title: string;
  description: string;
  iconName: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface USPFormData {
  title: string;
  description: string;
  iconName: string;
}

interface Project {
  $id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  impact: string;
  location: string;
  year: number;
  image: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface ProjectFormData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  impact: string;
  location: string;
  year: number;
  image: string;
}

interface CompanySettingsPayload {
  vision: string;
  mission: string;
  calendlyLink: string;
  phoneNumber: string;
  email: string;
  address: string;
  statistics: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}

interface CompanySettings {
  $id?: string;
  description: string;
  vision?: string;
  mission?: string;
  calendlyLink: string;
  phoneNumber: string;
  email: string;
  address: string;
  statistics: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface CompanySettingsFormData {
  vision: string;
  mission: string;
  calendlyLink: string;
  phoneNumber: string;
  email: string;
  address: string;
  statistics: Array<{ key: string; value: string }>;
  instagram: string;
  twitter: string;
  linkedin: string;
}

interface Statistic {
  id?: string | number;
  value: string;
  key: string;
}
