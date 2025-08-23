import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/Container';
import { useState } from 'react';
import { handleError } from '@/lib/utils';
import { toast } from 'sonner';
import { useCreateMessageMutation, MessageFormData } from '@/hooks/useMessagesQuery';

const Hero = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<MessageFormData>();

  const createMessageMutation = useCreateMessageMutation();
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 120;

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);

    if (errors.message) {
      clearErrors('message');
    }
  };

  const onSubmit = async (data: MessageFormData) => {
    try {
      const result = await createMessageMutation.mutateAsync(data);
      if (result?.ok) {
        toast.success(result.message);
        reset();
        setWordCount(0);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className='pt-12 md:pt-24 bg-secondary/10 min-h-screen'>
      <Container>
        <div className='py-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            {/* Left Column */}
            <div className='space-y-8 flex flex-col justify-center'>
              <div>
                <h4 className='text-5xl font-bold mb-3'>Let's Work Together</h4>
                <p className='text-gray-600 mb-6'>
                  Whether you're planning a major summit, developing a MICE strategy, or exploring destination
                  marketing, our team is here to support you with insight, professionalism, and precision.
                </p>
                <div className='space-y-2'>
                  <p className='text-gray-700'>info@travelmarkafrica.com</p>
                  <p className='text-gray-700'>🇷🇼 0788 357 850</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Event Support */}
                <div className='space-y-2'>
                  <h4 className='font-bold text-md'>Event Support & Inquiries</h4>
                  <p className='text-gray-600 text-sm'>
                    Need help organizing your next conference, exhibition, or business event? Our consultants are ready
                    to advise and assist.
                  </p>
                </div>

                {/* Feedback */}
                <div className='space-y-2'>
                  <h4 className='font-bold text-md'>Feedback & Ideas</h4>
                  <p className='text-gray-600 text-sm'>
                    Your thoughts matter. We're constantly improving our services, and your suggestions help shape our
                    journey across Africa.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div>
              <Card className='overflow-hidden border-none shadow-xs rounded-xl bg-white/50 backdrop-blur-md'>
                <CardContent className='p-8'>
                  <h4 className='text-3xl font-bold mb-1'>Get in Touch</h4>
                  <p className='text-gray-600 mb-6'>
                    Reach out today to explore how we can collaborate — from high-level strategy to flawless execution.
                  </p>

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
                        placeholder="Briefly tell us about your event, challenge, or consultation request. We' ll respond promptly."
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

                    <div className='pt-2 w-full flex flex-col justify-center'>
                      <Button
                        type='submit'
                        size='sm'
                        disabled={createMessageMutation.isPending}
                        isLoading={createMessageMutation.isPending}
                        loadingText='Submitting...'
                        className='mx-auto px-10 flex justify-center items-center'
                      >
                        Submit
                      </Button>
                      <p className='text-center text-gray-500 text-xs mt-2'>
                        By contacting us, you agree to our{' '}
                        <a href='#' target='_blank' className='text-blue-700 font-medium'>
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
