import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/redux/reducers/authSlice';
import AuthDialog from '../AuthDialog';
import { LogIn } from 'lucide-react';

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  const handleLogout = () => {
    dispatch(logout(user?.token));
    window.location.assign('/');
  };

  const closeAuthDialog = () => setAuthMode(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='p-[2px] border border-primary/40 flex flex-row items-center rounded-full cursor-pointer hover:shadow-md transition'>
            <Avatar className='bg-primary text-white h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10'>
              <AvatarFallback className='text-xs sm:text-sm md:text-base'>
                {user?.name?.[0] || <LogIn size={16} />}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[200px]' align='end' alignOffset={4} forceMount>
          {user ? (
            <>
              <DropdownMenuItem onClick={() => navigate('/my-trip-plans')}>My trip plans</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/favorites')}>My favorite destinations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/my-bookings')}>My bookings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setAuthMode('login')}>Login</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAuthMode('signup')}>Sign up</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {authMode && <AuthDialog isOpen={true} onClose={closeAuthDialog} mode={authMode} />}
    </>
  );
};

export default UserMenu;
