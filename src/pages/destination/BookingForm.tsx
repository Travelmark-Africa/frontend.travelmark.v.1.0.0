import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar as CalendarIcon, Info, Loader2, User, Mail } from 'lucide-react';
import { formatPrice, handleError } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert } from '@/components/ui/alert';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateBookingMutation, useGetCurrentUserQuery } from '@/redux/api/apiSlice';
import { toast } from 'sonner';
import AuthDialog from '@/components/AuthDialog';

interface BookingFormProps {
  destination: Destination;
}

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  startDate: Date | null;
  endDate: Date | null;
  numberOfTravelers: number;
  specialRequests: string;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
};

const BookingForm: React.FC<BookingFormProps> = ({ destination }) => {
  const [totalPrice, setTotalPrice] = useState<number>(destination.price);
  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    refetch,
  } = useGetCurrentUserQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [formComplete, setFormComplete] = useState(false);

  const userId = currentUser?.data?.id;
  const isLoading = isSubmitting || isLoadingUser;
  const isLoggedIn = !!userId;

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      startDate: null,
      endDate: null,
      numberOfTravelers: 1,
      specialRequests: '',
      paymentStatus: 'UNPAID',
    },
    mode: 'onChange',
  });

  const numberOfTravelers = watch('numberOfTravelers');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const phone = watch('phone');

  useEffect(() => {
    const hasRequiredFields = !!phone && !!startDate && !!endDate;
    setFormComplete(hasRequiredFields);
  }, [phone, startDate, endDate]);

  useEffect(() => {
    if (currentUser?.data) {
      setValue('fullName', currentUser.data.name || '');
      setValue('email', currentUser.data.email || '');
      trigger(['fullName', 'email']);
    } else {
      setValue('fullName', '');
      setValue('email', '');
    }
  }, [currentUser, setValue, trigger]);

  useEffect(() => {
    if (destination.price > 0) {
      setTotalPrice(destination.price * numberOfTravelers);
    }
  }, [destination.price, numberOfTravelers]);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!userId) {
        setAuthMode('login');
        setShouldAutoSubmit(true);
        return;
      }

      try {
        const res = await createBooking({
          userId,
          destinationId: destination.id,
          startDate: data.startDate,
          endDate: data.endDate,
          totalPrice,
          currency: destination?.currency?.code,
          status: 'PENDING',
          priceStatus: destination.price > 0 ? 'FIXED' : 'TO_BE_DETERMINED',
          numberOfTravelers: data.numberOfTravelers,
          specialRequests: data.specialRequests,
          paymentStatus: data.paymentStatus,
        }).unwrap();

        if (res?.ok) {
          toast.success(res.message);
          setBookingSuccess(true);
          reset();

          setTimeout(() => {
            setBookingSuccess(false);
          }, 10000);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        handleError(error);
      }
    },
    [createBooking, destination, totalPrice, userId, reset]
  );

  useEffect(() => {
    if (shouldAutoSubmit && isLoggedIn) {
      handleSubmit(onSubmit)();
      setShouldAutoSubmit(false);
    }
  }, [shouldAutoSubmit, isLoggedIn, handleSubmit, onSubmit]);

  useEffect(() => {
    const checkUserSession = async () => {
      if (!currentUser?.data && !isLoadingUser) {
        await refetch();
      }
    };

    checkUserSession();
  }, [currentUser, isLoadingUser, refetch]);

  useEffect(() => {
    if (!isLoggedIn && isDirty) {
      reset({
        fullName: '',
        email: '',
        phone: '',
        startDate: null,
        endDate: null,
        numberOfTravelers: 1,
        specialRequests: '',
        paymentStatus: 'UNPAID',
      });
    }
  }, [isLoggedIn, isDirty, reset]);

  return (
    <Card className='w-full shadow-none mb-16'>
      {bookingSuccess && (
        <Alert variant='success' className='bg-green-50 border-green-200'>
          Your trip has been booked successfully. You will receive an invoice via email shortly to process your payment.
        </Alert>
      )}

      <CardHeader>
        <CardTitle>Book Your Trip</CardTitle>
        {destination.price > 0 ? (
          <CardDescription className='text-xl font-bold text-orange-600'>
            {destination?.currency?.code && formatPrice(totalPrice, destination?.currency?.code)}
            <span className='text-sm font-normal text-gray-500 ml-2'>per person</span>
          </CardDescription>
        ) : (
          <CardDescription>Please fill out this form to book your trip</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <form id='booking-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='fullName' className='flex items-center justify-between'>
                  Full Name
                  {isLoggedIn && <span className='text-xs text-green-600'>Auto-filled</span>}
                </Label>
                <div className='relative'>
                  <Input
                    id='fullName'
                    {...register('fullName')}
                    placeholder={isLoggedIn ? 'Your profile name' : 'Will be filled after login'}
                    disabled={true}
                    className='pl-9'
                  />
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                </div>
              </div>

              <div>
                <Label htmlFor='email' className='flex items-center justify-between'>
                  Email
                  {isLoggedIn && <span className='text-xs text-green-600'>Auto-filled</span>}
                </Label>
                <div className='relative'>
                  <Input
                    id='email'
                    type='email'
                    {...register('email')}
                    placeholder={isLoggedIn ? 'Your profile email' : 'Will be filled after login'}
                    disabled={true}
                    className='pl-9'
                  />
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input
                  id='phone'
                  type='tel'
                  {...register('phone', { required: 'Phone number is required' })}
                  placeholder='+250 786 266 073'
                />
                {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
              </div>

              <div>
                <Label htmlFor='numberOfTravelers' className='flex items-center'>
                  Number of Travelers
                  {destination?.price !== 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='w-4 h-4 ml-1 text-gray-400' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Price is per person</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <Controller
                  control={control}
                  name='numberOfTravelers'
                  render={({ field }) => (
                    <Input
                      type='number'
                      className='mt-2'
                      min={1}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  )}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label>Start Date</Label>
                <Controller
                  control={control}
                  name='startDate'
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full justify-start text-left font-normal rounded-md shadow-none py-5 hover:bg-white focus:ring-1 focus:ring-offset-1 focus:ring-ring/30',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {field.value ? format(field.value, 'PPP') : <span>Select start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.startDate && <p className='text-red-500 text-sm mt-1'>{errors.startDate.message}</p>}
              </div>

              <div>
                <Label>End Date</Label>
                <Controller
                  control={control}
                  name='endDate'
                  rules={{ required: 'End date is required' }}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full justify-start text-left font-normal rounded-md shadow-none py-5 hover:bg-white focus:ring-1 focus:ring-offset-1 focus:ring-ring/30',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {field.value ? format(field.value, 'PPP') : <span>Select end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={date => {
                            return date < new Date() || (startDate ? date < startDate : false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.endDate && <p className='text-red-500 text-sm mt-1'>{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor='specialRequests'>Special Requests</Label>
              <Textarea
                id='specialRequests'
                {...register('specialRequests')}
                placeholder='Any special requirements or requests for your trip?'
                className='mt-1'
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className='flex flex-col'>
        <Button type='submit' form='booking-form' className='w-full flex items-center h-10' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isLoading
            ? 'Processing...'
            : isLoggedIn
            ? 'Book Trip'
            : formComplete
            ? 'Login to Complete Booking'
            : 'Complete Form and Login to Book'}
        </Button>
        <p className='text-xs text-gray-500 mt-3 text-center'>
          {isLoggedIn
            ? 'Once your booking is submitted, you will receive an invoice via email to process your payment.'
            : 'After logging in, your name and email will be automatically filled from your account.'}
        </p>
      </CardFooter>

      {authMode && (
        <AuthDialog
          isOpen={true}
          onClose={() => setAuthMode(null)}
          mode={authMode}
          onSuccess={() => {
            if (shouldAutoSubmit) {
              handleSubmit(onSubmit)();
            }
          }}
        />
      )}
    </Card>
  );
};

export default BookingForm;
