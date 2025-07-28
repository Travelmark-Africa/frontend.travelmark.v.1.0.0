import React from 'react';
import { ChevronRight } from 'lucide-react';
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
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 py-2 rounded-2xl',
        sm: 'h-9 rounded-2xl px-4 text-xs',
        lg: 'h-12 rounded-2xl px-6 rounded-2xl',
        icon: 'h-11 w-11 rounded-2xl',
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, hideChevron = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        <span className='flex items-center gap-2'>
          {children}
          {!hideChevron && (
            <ChevronRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110' />
          )}
        </span>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

const ButtonDemo = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center'>
      <div className='space-y-6'>
        <Button>Get Started</Button>
        <Button size='lg'>Large Action</Button>
        <Button hideChevron>No Arrow</Button>
      </div>
    </div>
  );
};

export default ButtonDemo;
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
