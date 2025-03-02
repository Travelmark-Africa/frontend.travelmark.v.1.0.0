import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/Container';
import { useState } from 'react';
import { handleError } from '@/lib/utils';
import { toast } from 'sonner';
import { useCreateMessageMutation } from '@/redux/api/apiSlice';
import { Loader2 } from 'lucide-react';

// Define the form data type
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  subject: string;
  message: string;
};

const Hero = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>();

  const [createMessage, { isLoading: isSubmitting }] = useCreateMessageMutation();

  // State to track word count
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 120;

  // Handle textarea change to count words and clear error
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);

    // Clear the error for the message field when user types
    if (errors.message) {
      clearErrors('message');
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      const res = await createMessage(data).unwrap();
      if (res.ok) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='pt-12 md:pt-24 bg-blue-50 min-h-screen'>
      <Container>
        <div className='py-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            {/* Left Column: Contact Info */}
            <div className='space-y-8 flex flex-col justify-center'>
              <div>
                <h4 className='text-5xl font-bold mb-3'>Contact Us</h4>
                <p className='text-gray-600 mb-6'>
                  Email, call, or complete the form to learn how <br />
                  Travelmark can elevate your travel experience.
                </p>

                <div className='space-y-2'>
                  <p className='text-gray-700'>info@travelmarkafrica.com</p>
                  <p className='text-gray-700'>🇷🇼 0788 357 850</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Customer Support Box */}
                <div className='space-y-2'>
                  <h4 className='font-bold text-md'>
                    Customer <br /> Support
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    Our travel experts are available around the clock to address any concerns or queries you may have
                    about your bookings.
                  </p>
                </div>

                {/* Feedback Box */}
                <div className='space-y-2'>
                  <h4 className='font-bold text-md'>Feedback and Suggestions</h4>
                  <p className='text-gray-600 text-sm'>
                    We value your feedback and are continuously working to improve Travelmark. Your input helps us
                    create better travel experiences.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              <Card className='overflow-hidden border-none shadow-xs rounded-xl bg-white/50 backdrop-blur-md'>
                <CardContent className='p-8'>
                  <h4 className='text-3xl font-bold mb-1'>Get in Touch</h4>
                  <p className='text-gray-600 mb-6'>You can reach us anytime</p>

                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='flex flex-col'>
                        <Input
                          placeholder='First name'
                          {...register('firstName', { required: 'First name is required' })}
                          onChange={() => errors.firstName && clearErrors('firstName')}
                        />
                        {errors.firstName && (
                          <span className='text-red-500 text-sm mt-1'>{errors.firstName.message}</span>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <Input
                          placeholder='Last name'
                          {...register('lastName', { required: 'Last name is required' })}
                          onChange={() => errors.lastName && clearErrors('lastName')}
                        />
                        {errors.lastName && (
                          <span className='text-red-500 text-sm mt-1'>{errors.lastName.message}</span>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='flex flex-col'>
                        <Input
                          placeholder='Your email'
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          onChange={() => errors.email && clearErrors('email')}
                        />
                        {errors.email && <span className='text-red-500 text-sm mt-1'>{errors.email.message}</span>}
                      </div>
                      <div className='flex flex-col'>
                        <Input
                          placeholder='Phone number'
                          {...register('telephone', { required: 'Phone number is required' })}
                          onChange={() => errors.telephone && clearErrors('telephone')}
                        />
                        {errors.telephone && (
                          <span className='text-red-500 text-sm mt-1'>{errors.telephone.message}</span>
                        )}
                      </div>
                    </div>

                    <div className='flex flex-col'>
                      <Input
                        placeholder='Subject'
                        {...register('subject', { required: 'Subject is required' })}
                        onChange={() => errors.subject && clearErrors('subject')}
                      />
                      {errors.subject && <span className='text-red-500 text-sm mt-1'>{errors.subject.message}</span>}
                    </div>
                    <div className='flex flex-col'>
                      <Textarea
                        rows={6}
                        placeholder='How can we help with your travel plans?'
                        {...register('message', {
                          required: 'Message is required',
                          validate: value => {
                            const words = value.trim().split(/\s+/).filter(Boolean).length;
                            return words <= maxWords || 'Message exceeds the maximum word limit';
                          },
                        })}
                        onChange={handleTextareaChange}
                      />
                      <div
                        className={`text-right text-sm mt-1 ${
                          wordCount > maxWords ? 'text-red-500 animate-blink' : 'text-gray-400'
                        }`}
                      >
                        {wordCount}/{maxWords} words
                      </div>
                      {errors.message && <span className='text-red-500 text-sm mt-1'>{errors.message.message}</span>}
                    </div>

                    <div className='pt-2'>
                      <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='mx-auto px-20 flex justify-center items-center'
                      >
                        {isSubmitting && <Loader2 className='animate-spin' />}
                        {isSubmitting ? 'Submiting...' : 'Submit'}
                      </Button>
                      <p className='text-center text-gray-500 text-xs mt-2'>
                        By contacting us, you agree to our{' '}
                        <a href='#' target='_blank' className='text-gray-900 font-medium'>
                          Terms of service
                        </a>{' '}
                        and{' '}
                        <a href='#' target='_blank' className='text-gray-900 font-medium'>
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
