import { lazy, ComponentType, LazyExoticComponent } from 'react';
import NProgress from 'nprogress';
import { format } from 'date-fns';
import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// truncate string texts
export const truncateString = (word: string, sliceNo: number) => {
  if (word.length > sliceNo) {
    return word.slice(0, sliceNo) + ' ...';
  }
  return word;
};

// get network status
export const getNetworkStatus = () => {
  return window.navigator.onLine;
};

export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const formatDateWithOrdinal = (dateInput: Date | string): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  return `${day}${ordinalSuffix} ${date.toLocaleDateString('en-US', options)}`;
};

export const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return 'N/A';

  const formatDateShort = (date: string) => format(new Date(date), 'MMM d, yyyy');

  const formattedStart = startDate ? formatDateShort(startDate) : 'N/A';
  const formattedEnd = endDate ? formatDateShort(endDate) : 'Ongoing';

  return `${formattedStart} - ${formattedEnd}`;
};

export const handleError = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data: { message: string; }; };
    toast.error(data.message || 'Something went wrong', {
      duration: 2000,
    });
  } else {
    toast.error('Something went wrong', {
      duration: 2000,
    });
  }
};

export const capitalizeInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => {
      // Capitalize the first letter of each word and make the rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export const formatPrice = (price: number, currency: string) => {
  const hasDecimal = price % 1 !== 0;

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  };

  return price.toLocaleString('en-US', options);
};

export const formatProductName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export function lazyLoad<T extends ComponentType>(
  importFunc: () => Promise<{ default: T; }>,
): LazyExoticComponent<T> {
  return lazy(() => {
    NProgress.start();
    return importFunc()
      .then((result) => {
        NProgress.done();
        return result;
      })
      .catch((error) => {
        NProgress.done();
        throw error;
      });
  });
}