import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = cva('relative w-full rounded-lg border p-4 text-sm transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background text-foreground border-gray-200',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    },
    size: {
      sm: 'p-2 text-xs',
      md: 'p-4 text-sm',
      lg: 'p-6 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const iconMap = {
  default: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

interface AlertProps extends React.ComponentProps<'div'>, VariantProps<typeof alertVariants> {
  title?: string;
  showIcon?: boolean;
  closable?: boolean;
  banner?: boolean;
  action?: React.ReactNode;
  afterClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'default',
      size,
      title,
      showIcon = true,
      closable = true,
      banner = false,
      action,
      afterClose,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(true);
    const [isClosing, setIsClosing] = React.useState(false);

    const Icon = iconMap[variant as keyof typeof iconMap];

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        setVisible(false);
        afterClose?.();
      }, 300);
    };

    if (!visible) return null;

    return (
      <div
        ref={ref}
        role='alert'
        className={cn(
          alertVariants({ variant, size }),
          banner && 'rounded-none w-full',
          isClosing && 'opacity-0 scale-95',
          'flex items-center gap-3',
          className
        )}
        {...props}
      >
        {showIcon && (
          <div className='flex-shrink-0 mt-0.5'>
            <Icon className={cn('h-5 w-5', size === 'sm' && 'h-4 w-4', size === 'lg' && 'h-6 w-6')} />
          </div>
        )}

        <div className='flex-1 min-w-0'>
          {title && <div className='font-medium leading-5 mb-1'>{title}</div>}
          <div className='text-muted-foreground leading-5'>{children}</div>
        </div>

        <div className='flex-shrink-0 flex items-start gap-2 ml-2'>
          {action}
          {closable && (
            <button
              onClick={handleClose}
              className='opacity-70 hover:opacity-100 transition-opacity focus:outline-none cursor-pointer'
              aria-label='Close'
              type='button'
            >
              <X className={cn('h-4 w-4', size === 'sm' && 'h-3 w-3', size === 'lg' && 'h-5 w-5')} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
