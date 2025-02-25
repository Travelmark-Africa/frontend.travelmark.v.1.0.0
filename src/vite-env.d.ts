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
  id: string;
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
  price: number;
  tag?: string;
  countryId?: string;
  images: string[];
  currencyId: string;
  createdAt: Date;
  updatedAt: Date;
  country: {
    code: string;
  };
  bookings?: Booking[];
  reviews: { rating: number }[];
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

interface Activity {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TripPlan {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  objective?: string;
  location: string;
  startDate?: Date;
  endDate?: Date;
  numberOfTravelers: number;
  status?: 'PLANNING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  budget?: number;
  currencyId: string;
  needAccommodation: 'YES' | 'NO';
  accommodationDetails?: string;
  needTransportation: 'YES' | 'NO';
  transportationDetails?: string;
  activities: string[];
  contactPerson: string;
  contactEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
}
