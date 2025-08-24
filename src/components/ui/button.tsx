import React from 'react';
import { ChevronRight, Loader2, Heart } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const cn = (...classes: (string | boolean | undefined)[]): string => classes.filter(Boolean).join(' ');

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer group overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-white hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-secondary text-secondary bg-secondary/10 hover:bg-secondary hover:text-white',
        ghost: 'hover:bg-gray-200 hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        icon: 'hover:bg-gray-200 hover:text-accent-foreground',
      },
      size: {
        default: 'h-11 px-4 py-2 rounded-2xl',
        sm: 'h-9 rounded-2xl px-4 text-sm',
        lg: 'h-12 rounded-2xl px-6',
        icon: 'h-11 w-11 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  hideChevron?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      hideChevron = false,
      isLoading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || isLoading;

    // Don't show chevron for icon buttons or when explicitly hidden
    const shouldShowChevron = !hideChevron && !isLoading && size !== 'icon';

    const buttonContent = isLoading && loadingText ? loadingText : children;

    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} disabled={isDisabled} {...props}>
        {size === 'icon' ? (
          // For icon buttons, render content directly without wrapper
          <>{isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : buttonContent}</>
        ) : (
          // For other buttons, use the span wrapper for proper alignment
          <span className='flex items-center gap-2'>
            {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
            {buttonContent}
            {shouldShowChevron && (
              <ChevronRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110' />
            )}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

const ButtonDemo = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoading2, setIsLoading2] = React.useState(false);
  const [iconLoading, setIconLoading] = React.useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const handleLoadingDemo2 = () => {
    setIsLoading2(true);
    setTimeout(() => setIsLoading2(false), 2000);
  };

  const handleIconLoading = () => {
    setIconLoading(true);
    setTimeout(() => setIconLoading(false), 2000);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Button Component Demo</h1>
          <p className='text-gray-600'>Showcasing various button variants and states</p>
        </div>

        {/* Default Buttons */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Default Buttons</h2>
          <div className='flex flex-wrap gap-4'>
            <Button>Get Started</Button>
            <Button size='sm'>Small Button</Button>
            <Button size='lg'>Large Button</Button>
            <Button hideChevron>No Chevron</Button>
          </div>
        </div>

        {/* Variant Buttons */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Button Variants</h2>
          <div className='flex flex-wrap gap-4'>
            <Button variant='default'>Default</Button>
            <Button variant='destructive'>Destructive</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='link'>Link Button</Button>
          </div>
        </div>

        {/* Icon Buttons - Notice the less rounded borders */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Icon Buttons (Less Rounded)</h2>
          <div className='flex flex-wrap gap-4'>
            <Button size='icon'>
              <Heart className='w-4 h-4' />
            </Button>
            <Button size='icon' isLoading={iconLoading} onClick={handleIconLoading}>
              <Heart className='w-4 h-4' />
            </Button>
            <Button variant='outline' size='icon'>
              <Heart className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='icon'>
              <Heart className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Loading States */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Loading States</h2>
          <div className='flex flex-wrap gap-4'>
            <Button isLoading={isLoading} loadingText='Processing...' onClick={handleLoadingDemo}>
              Click to Load
            </Button>
            <Button isLoading={isLoading2} onClick={handleLoadingDemo2}>
              Loading without custom text
            </Button>
            <Button variant='outline' isLoading loadingText='Saving...'>
              Always Loading
            </Button>
            <Button variant='destructive' isLoading>
              Deleting...
            </Button>
          </div>
        </div>

        {/* Disabled States */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-800'>Disabled States</h2>
          <div className='flex flex-wrap gap-4'>
            <Button disabled>Disabled Default</Button>
            <Button variant='outline' disabled>
              Disabled Outline
            </Button>
            <Button variant='ghost' disabled>
              Disabled Ghost
            </Button>
            <Button variant='ghost' size='icon' disabled>
              <Heart className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo;
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
