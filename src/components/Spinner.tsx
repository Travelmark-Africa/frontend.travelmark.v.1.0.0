import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 20,
  className = 'animate-spin',
  color = 'currentColor',
  ...restProps
}) => {
  return <LoaderCircle size={size} className={cn('mr-2 animate-spin', className)} stroke={color} {...restProps} />;
};

export default Spinner;
