import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/redux/reducers/authSlice';
import { useDispatch } from 'react-redux';
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '@/hooks/useAuth';

const UserMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logout(user?.token));
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className='
            p-4
            md:py-1
            md:px-2
            border-[1px] 
            border-neutral-200 
            flex 
            flex-row 
            items-center 
            gap-3 
            rounded-full 
            cursor-pointer 
            hover:shadow-md 
            transition
          '
        >
          <Menu />

          <div className='hidden md:block'>
            <Avatar>
              <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[200px]' align='end' alignOffset={4} forceMount>
        {user ? (
          <>
            <DropdownMenuItem onClick={() => navigate('/trips')}>My trips</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/favorites')}>My favorites</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/reservations')}>My bookings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>Login</DropdownMenuItem>
            <DropdownMenuItem>Sign up</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
