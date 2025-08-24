import { ReactNode, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { navLinks, getIconComponent } from '@/constants';
import { logo1 } from '@/assets';
import { handleError } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

interface NavLink {
  href: string;
  label: string;
  iconName: string;
}

interface User {
  name: string;
  email?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActivePath = (href: string) => {
    const currentPath = location.pathname;
    const normalizedHref = href.startsWith('/') ? href : `/${href}`;
    if (normalizedHref === '/') return currentPath === '/';
    if (normalizedHref.includes('/newsletters')) {
      return currentPath.startsWith('/newsletters');
    }
    return currentPath.startsWith(normalizedHref);
  };

  const handleNavigation = (link: string) => {
    navigate(link);
  };

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);

    // Show loading toast
    const loadingToast = toast.loading('Logging out...');

    try {
      await logout();

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully');

      navigate('/auth/login');
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      handleError(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const SidebarContent = () => (
    <div className='flex flex-col h-full'>
      <nav className='flex-1 space-y-1 px-2'>
        {(navLinks as NavLink[]).map((link: NavLink) => {
          const IconComponent = getIconComponent(link.iconName);
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-500 ease-in-out ${
                isActivePath(link.href) ? 'text-secondary' : 'text-gray-600 hover:text-secondary'
              }`}
            >
              <span
                className={`transition-colors duration-200 ${
                  isActivePath(link.href) ? 'text-secondary' : 'text-gray-500 group-hover:text-secondary'
                }`}
              >
                <IconComponent className='w-5 h-5' />
              </span>
              <span className='truncate'>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Copyright Notice */}
      <div className='px-4 py-3 mt-4 border-t border-gray-100'>
        <p className='text-xs text-gray-500 text-center'>© {new Date().getFullYear()} Travelmark Africa</p>
      </div>
    </div>
  );

  return (
    <div className='flex h-screen w-full overflow-hidden bg-white'>
      {/* Desktop Sidebar */}
      <aside className='hidden md:flex flex-col w-[240px] lg:w-[280px] border-r border-gray-200 bg-white fixed h-full'>
        <div className='flex items-center py-4 px-6 mb-6'>
          <img src={logo1} alt='Travelmark Africa Logo' className='h-14 w-auto' />
        </div>

        <div className='flex-1 overflow-y-auto pb-2 flex flex-col'>
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className='flex flex-1 flex-col md:ml-[240px] lg:ml-[280px]'>
        {/* Top Navigation Bar */}
        <header className='flex h-[64px] items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6 sticky top-0 z-40 '>
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden text-gray-600 hover:text-primary/90 transition-colors duration-200 hover:bg-transparent'
              >
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[280px] p-0 bg-white'>
              <SheetHeader className='p-6 border-b border-gray-200'>
                <SheetTitle className='flex items-center'>
                  <img src={logo1} alt='Travelmark Africa Logo' className='h-10 w-auto' />
                </SheetTitle>
              </SheetHeader>
              <div className='py-4 flex-1 flex flex-col'>
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Page Title */}
          <div className='flex-1 hidden md:block'>
            <h6 className='text-base font-semibold text-primary'>Content Management System</h6>
          </div>
          <div className='flex-1 block md:hidden'>
            <h6 className='text-base font-semibold text-primary'>CMS</h6>
          </div>

          {/* User Menu */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Avatar className='h-8 w-8 bg-gray-100 text-gray-600 cursor-pointer'>
                <AvatarFallback>{(user as User)?.name?.[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px] border-gray-200'>
              <DropdownMenuLabel className='flex items-center gap-2'>
                <Avatar className='h-8 w-8 bg-gray-100 text-gray-600'>
                  <AvatarFallback>{(user as User)?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-gray-900'>{(user as User)?.name}</span>
                  <span className='text-xs text-gray-500'>Travelmark Africa</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className='bg-gray-200' />
              <DropdownMenuItem
                onClick={() => handleNavigation('/dashboard/account-settings')}
                className='text-gray-700 focus:bg-gray-100 focus:text-gray-900'
              >
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className='bg-gray-200' />
              <DropdownMenuItem
                className='text-red-600 focus:bg-red-50 focus:text-red-700'
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto bg-gray-50'>
          <div className='container mx-auto p-6 lg:p-8 max-w-7xl'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
