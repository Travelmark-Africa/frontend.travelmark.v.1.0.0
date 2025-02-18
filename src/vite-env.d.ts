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
interface Destination {
  id: string;
  name: string;
  description?: string;
  location?: string;
  price?: number;
  tag?: string;
  countryId: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  country?: Country;
  bookings?: Booking[];
  reviews?: Review[];
  favorites?: Favorite[];
}

interface Country {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  destinations?: Destination[];
}

interface Booking {
  id: string;
  userId: string;
  destinationId: string;
  startDate: Date;
  endDate: Date;
  totalPrice?: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  destination?: Destination;
}

interface Review {
  id: string;
  userId: string;
  destinationId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  destination?: Destination;
}

interface Favorite {
  id: string;
  userId: string;
  destinationId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  destination?: Destination;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  bookings?: Booking[];
  reviews?: Review[];
  favorites?: Favorite[];
}
