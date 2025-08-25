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

export const formatPhoneForWhatsApp = (phone: string) => {
  return phone.replace(/[^\d+]/g, '');
};

export const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return 'N/A';

  const formatDateShort = (date: string) => format(new Date(date), 'MMM d, yyyy');

  const formattedStart = startDate ? formatDateShort(startDate) : 'N/A';
  const formattedEnd = endDate ? formatDateShort(endDate) : 'Ongoing';

  return `${formattedStart} - ${formattedEnd}`;
};

export const handleError = (error: unknown) => {
  let errorMessage = 'Something went wrong';

  if (typeof error === 'object' && error !== null && 'data' in error) {
    const { data } = error as { data: { message: string } };
    errorMessage = data.message || 'Something went wrong';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  toast.error(errorMessage, {
    duration: 2000,
  });
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

export function lazyLoad<T extends ComponentType>(importFunc: () => Promise<{ default: T }>): LazyExoticComponent<T> {
  return lazy(() => {
    NProgress.start();
    return importFunc()
      .then(result => {
        NProgress.done();
        return result;
      })
      .catch(error => {
        NProgress.done();
        throw error;
      });
  });
}

// Cloudinary utils
export interface ImageUploadStatus {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const uploadToCloudinary = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET!);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        reject({ description: 'Failed to upload image' });
      }
    });

    xhr.addEventListener('error', () => {
      reject({ description: 'Network error during upload' });
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

// Get relative time
export const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
