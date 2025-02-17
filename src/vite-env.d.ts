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

interface Role {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

interface User {
  id: number;
  roleId: number;
  name: string;
  email: string;
  password: string;
}

interface CurrentUser {
  id: number;
  roleId: number;
  name: string;
  token: string;
}

interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
}
