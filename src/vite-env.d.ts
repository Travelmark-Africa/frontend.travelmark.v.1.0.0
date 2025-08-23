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
  [x: string]: Key | null | undefined;
  $id: string;
  serviceName: string;
  serviceTitle: string;
  serviceSummary: string;
  serviceDescription: string;
  category: string;
  iconIdentifier: string;
  mediaThumbnailUrl?: string;
  mediaThumbnailAlt?: string;
  mediaBannerUrl?: string;
  mediaBannerAlt?: string;
  subServicesJson?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface ServiceFormData {
  serviceName: string;
  serviceTitle: string;
  serviceSummary: string;
  serviceDescription: string;
  category: string;
  iconIdentifier: string;
  mediaThumbnailUrl: string;
  mediaThumbnailAlt: string;
  mediaBannerUrl: string;
  mediaBannerAlt: string;
  subServices: SubService[];
}

interface FAQ {
  $id?: string;
  question: string;
  answer: string;
  $createdAt?: string;
  $updatedAt?: string;
}

interface FAQFormData {
  question: string;
  answer: string;
}
