import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useGetActivitiesQuery, useCreateTripPlanMutation } from '@/redux/api/apiSlice';

// Shadcn/ui components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, handleError } from '@/lib/utils';

// Custom components
import BlurImage from '@/components/BlurImage';

// Assets
import { hero2, logo2 } from '@/assets';

interface ValidationErrors {
  [key: string]: string | undefined;
}

// Utility functions
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const TripPlan: React.FC = () => {
  // State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TripPlan>({
    name: '',
    email: '',
    objective: '',
    location: '',
    startDate: undefined,
    endDate: undefined,
    numberOfTravelers: 1,
    budget: 0,
    needAccommodation: 'NO',
    accommodationDetails: '',
    needTransportation: 'NO',
    transportationDetails: '',
    contactPerson: '',
    contactEmail: '',
    activities: [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [confirmation, setConfirmation] = useState('');
  const { data: activities, isLoading: activitiesLoading } = useGetActivitiesQuery({});
  const [createTripPlan, { isLoading: isSubmitting }] = useCreateTripPlanMutation();

  const totalSteps = 6;

  // Validation
  const validateStep = (currentStep: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.objective) newErrors.objective = 'Travel objective is required';
        break;

      case 2:
        if (!formData.location) newErrors.location = 'Destination is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;

      case 3:
        if (!formData.numberOfTravelers) {
          newErrors.numberOfTravelers = 'Number of travelers is required';
        } else if (formData.numberOfTravelers < 1) {
          newErrors.numberOfTravelers = 'Must have at least 1 traveler';
        }
        if (!formData.budget) {
          newErrors.budget = 'Budget is required';
        } else if (formData.budget < 0) {
          newErrors.budget = 'Budget must be positive';
        }
        if (!formData.contactEmail) {
          newErrors.contactEmail = 'Contact Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.contactEmail = 'Invalid email format';
        }
        if (formData.contactPerson.length === 0) {
          newErrors.contactPerson = 'Contact Person is required';
        }
        break;

      case 4:
        if (!formData.needAccommodation) {
          newErrors.needAccommodation = 'Please select accommodation preference';
        } else if (formData.needAccommodation === 'YES' && !formData.accommodationDetails) {
          newErrors.accommodationDetails = 'Please provide accommodation details';
        }
        if (!formData.needTransportation) {
          newErrors.needTransportation = 'Please select transportation preference';
        } else if (formData.needTransportation === 'YES' && !formData.transportationDetails) {
          newErrors.transportationDetails = 'Please provide transportation details';
        }
        break;

      case 5:
        if (formData.activities.length === 0) {
          newErrors.activities = 'Please select at least one activity';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event Handlers
  const handleInputChange =
    (field: keyof TripPlan) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleDateChange = (field: 'startDate' | 'endDate') => (date: Date | undefined) => {
    setFormData({ ...formData, [field]: date });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleActivityToggle = (activityTitle: string) => {
    const isSelected = formData.activities.includes(activityTitle);
    if (isSelected) {
      setFormData({
        ...formData,
        activities: formData.activities.filter(title => title !== activityTitle),
      });
    } else {
      setFormData({
        ...formData,
        activities: [...formData.activities, activityTitle],
      });
    }
    if (errors.activities) {
      setErrors({ ...errors, activities: undefined });
    }
  };

  const handleNext = () => {
    if (validateStep(step) && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      try {
        const res = await createTripPlan(formData).unwrap();
        if (res.ok) {
          setConfirmation(res.message);
          setStep(6); // Move to the confirmation step
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  // Render Functions
  const renderActivitiesStep = () => {
    if (activitiesLoading) {
      return (
        <div className='space-y-4'>
          {[1, 2, 3].map((_, index) => (
            <div key={index} className='space-y-2'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-8 w-3/4' />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        <div className='flex flex-wrap gap-2 mt-2'>
          {activities?.data?.map((activity: Activity) => (
            <div
              key={activity.id}
              onClick={() => handleActivityToggle(activity.title)}
              className={cn(
                'flex items-center gap-2 border rounded-lg py-1 px-3 cursor-pointer',
                formData.activities.includes(activity.title)
                  ? 'bg-primary text-sm text-white border-primary'
                  : 'bg-gray-200 text-sm border-gray-400'
              )}
            >
              {formData.activities.includes(activity.title) && <Check className='h-4 w-4' />}
              <span>{activity.title}</span>
            </div>
          ))}
        </div>
        {errors.activities && <p className='text-[13px] text-red-500'>{errors.activities}</p>}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                className='bg-white'
                id='name'
                placeholder='John Doe'
                value={formData.name}
                onChange={handleInputChange('name')}
              />
              {errors.name && <p className='text-[13px] text-red-500'>{errors.name}</p>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                className='bg-white'
                id='email'
                type='email'
                placeholder='john.doe@example.com'
                value={formData.email}
                onChange={handleInputChange('email')}
              />
              {errors.email && <p className='text-[13px] text-red-500'>{errors.email}</p>}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='objective'>Travel Objective</Label>
              <Textarea
                className='bg-white'
                id='objective'
                rows={4}
                placeholder='Tell us about your dream trip...'
                value={formData.objective}
                onChange={handleInputChange('objective')}
              />
              {errors.objective && <p className='text-[13px] text-red-500'>{errors.objective}</p>}
            </div>
          </CardContent>
        );

      case 2:
        return (
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='location'>Destination</Label>
              <Input
                className='bg-white'
                id='location'
                placeholder='Where would you like to go?'
                value={formData.location}
                onChange={handleInputChange('location')}
              />
              {errors.location && <p className='text-[13px] text-red-500'>{errors.location}</p>}
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal rounded-md shadow-none py-5 hover:bg-white focus:ring-1 focus:ring-offset-1 focus:ring-ring/30',
                        !formData.startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.startDate ? format(formData.startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={formData.startDate}
                      onSelect={handleDateChange('startDate')}
                      disabled={date => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && <p className='text-[13px] text-red-500'>{errors.startDate}</p>}
              </div>
              <div className='space-y-2'>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal rounded-md shadow-none py-5 hover:bg-white focus:ring-1 focus:ring-offset-1 focus:ring-ring/30',
                        !formData.endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {formData.endDate ? format(formData.endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={formData.endDate}
                      onSelect={handleDateChange('endDate')}
                      disabled={date => date < (formData.startDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && <p className='text-[13px] text-red-500'>{errors.endDate}</p>}
              </div>
            </div>
          </CardContent>
        );

      case 3:
        return (
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='contactPerson'>Contact Person</Label>
                <Input
                  className='bg-white'
                  id='contactPerson'
                  placeholder='Somebody we can contact'
                  type='text'
                  value={formData.contactPerson}
                  onChange={handleInputChange('contactPerson')}
                />
                {errors.contactPerson && <p className='text-[13px] text-red-500'>{errors.contactPerson}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='contactEmail'>Contact Email</Label>
                <Input
                  className='bg-white'
                  id='contactEmail'
                  placeholder='Email for communication ...'
                  type='email'
                  value={formData.contactEmail}
                  onChange={handleInputChange('contactEmail')}
                />
                {errors.contactEmail && <p className='text-[13px] text-red-500'>{errors.contactEmail}</p>}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='numberOfTravelers'>Number of Travelers</Label>
                <Input
                  className='bg-white'
                  id='numberOfTravelers'
                  type='number'
                  min='1'
                  value={formData.numberOfTravelers}
                  onChange={handleInputChange('numberOfTravelers')}
                />
                {errors.numberOfTravelers && <p className='text-[13px] text-red-500'>{errors.numberOfTravelers}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='budget'>Budget (USD)</Label>
                <Input
                  className='bg-white'
                  id='budget'
                  type='number'
                  min='0'
                  step='100'
                  value={formData.budget}
                  onChange={handleInputChange('budget')}
                />
                {errors.budget && <p className='text-[13px] text-red-500'>{errors.budget}</p>}
              </div>
            </div>
          </CardContent>
        );

      case 4:
        return (
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Need Accommodation?</Label>
              <Select
                value={formData.needAccommodation}
                onValueChange={(value: 'YES' | 'NO') => {
                  setFormData({
                    ...formData,
                    needAccommodation: value,
                    accommodationDetails: value === 'NO' ? '' : formData.accommodationDetails,
                  });
                }}
              >
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder='Select option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='YES'>Yes</SelectItem>
                  <SelectItem value='NO'>No</SelectItem>
                </SelectContent>
              </Select>
              {errors.needAccommodation && <p className='text-[13px] text-red-500'>{errors.needAccommodation}</p>}
              {formData.needAccommodation === 'YES' && (
                <div className='mt-2'>
                  <Textarea
                    className='bg-white'
                    placeholder='Tell us your accommodation preferences...'
                    value={formData.accommodationDetails}
                    onChange={handleInputChange('accommodationDetails')}
                  />
                  {errors.accommodationDetails && (
                    <p className='text-[13px] text-red-500'>{errors.accommodationDetails}</p>
                  )}
                </div>
              )}
            </div>
            <div className='space-y-2'>
              <Label>Need Transportation?</Label>
              <Select
                value={formData.needTransportation}
                onValueChange={(value: 'YES' | 'NO') => {
                  setFormData({
                    ...formData,
                    needTransportation: value,
                    transportationDetails: value === 'NO' ? '' : formData.transportationDetails,
                  });
                }}
              >
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder='Select option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='YES'>Yes</SelectItem>
                  <SelectItem value='NO'>No</SelectItem>
                </SelectContent>
              </Select>
              {errors.needTransportation && <p className='text-[13px] text-red-500'>{errors.needTransportation}</p>}
              {formData.needTransportation === 'YES' && (
                <div className='mt-2'>
                  <Textarea
                    className='bg-white'
                    placeholder='Tell us your transportation needs...'
                    value={formData.transportationDetails}
                    onChange={handleInputChange('transportationDetails')}
                  />
                  {errors.transportationDetails && (
                    <p className='text-[13px] text-red-500'>{errors.transportationDetails}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        );

      case 5:
        return (
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Select Activities</Label>
              {renderActivitiesStep()}
            </div>
          </CardContent>
        );

      case 6:
        return (
          <CardContent className='space-y-4'>
            <div className='text-center'>
              <span className='text-5xl'>👍</span>
              <h4 className='text-2xl font-bold py-3 text-secondary'>Trip Plan Submitted Successfully!</h4>
              <p className='text-muted-foreground'>{confirmation} </p>
              <Button className='mt-4'>Login to access your dashboard</Button>
            </div>
          </CardContent>
        );

      default:
        return null;
    }
  };

  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 bg-primary/10'>
        <div className='relative w-full h-full'>
          <BlurImage src={hero2} alt='Beautiful destination hero image' className='object-cover w-full h-full' />
        </div>
      </div>

      {/* Overlay */}
      <div className='absolute inset-0 bg-foreground/40' />

      {/* Logo */}
      <Link to='/' className='absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50'>
        <div className='relative h-16 sm:h-24 md:h-28 w-[250px] sm:w-[280px] transition-transform hover:scale-105'>
          <img src={logo2} alt='Travelmark logo' className='object-contain w-full h-full' />
        </div>
      </Link>

      {/* Main Content */}
      <div className='relative min-h-screen flex items-center justify-center container px-4 py-20'>
        <Card className='w-full max-w-2xl bg-background/95 backdrop-blur'>
          <CardHeader>
            {step === totalSteps ? null : (
              <>
                <CardTitle className='font-semibold text-xl'>Plan Your Trip</CardTitle>
                <CardDescription className='text-sm'>
                  Step {step} of {totalSteps}
                </CardDescription>
              </>
            )}
          </CardHeader>

          {renderStep()}

          <CardFooter className='flex justify-between'>
            {Number(step) === Number(totalSteps) ? null : (
              <Button
                className='bg-primary/10 hover:bg-primary/20'
                variant='outline'
                onClick={handlePrevious}
                disabled={Number(step) === 1}
              >
                <ChevronLeft className='mr-2 h-4 w-4' />
                Previous
              </Button>
            )}

            {step === totalSteps - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className='flex items-center space-x-2'>
                    <Loader2 className='animate-spin' /> <span>Submitting...</span>
                  </span>
                ) : (
                  'Submit'
                )}
              </Button>
            ) : step === totalSteps ? null : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TripPlan;
