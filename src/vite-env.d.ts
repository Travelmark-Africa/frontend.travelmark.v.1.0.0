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
