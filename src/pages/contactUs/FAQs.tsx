import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useGetFaqsQuery } from '@/redux/api/apiSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle } from 'lucide-react';
import Error from '@/components/Error';

const FAQSkeleton: React.FC = () => (
  <div className='space-y-4'>
    {[1, 2, 3].map(i => (
      <div key={i} className='space-y-2'>
        <Skeleton className='h-8 w-full' />
        <Skeleton className='h-24 w-full' />
      </div>
    ))}
  </div>
);

const EmptyFAQs: React.FC = () => (
  <div className='text-center py-8'>
    <div className='mb-4'>
      <MessageCircle className='w-12 h-12 mx-auto text-gray-400' />
    </div>
    <h4 className='text-lg font-bold text-gray-900'>No FAQs Available</h4>
    <p className='mt-1 text-sm text-gray-500'>
      Our FAQ section is currently being updated. Please contact us directly for any questions.
    </p>
  </div>
);

const FAQs = () => {
  const { data: faqs, isLoading: faqsLoading, error: faqsError } = useGetFaqsQuery({});

  return (
    <div className='max-w-3xl mx-auto px-6 py-32'>
      <div className='mb-8'>
        <h6 className='font-bold mb-2'>FAQ</h6>
        <h4 className='text-4xl font-bold text-gray-800 mb-4 font-poppins'>Do you have any questions for us?</h4>
        <p className='text-gray-600'>
          If there are questions about your African adventure or travel consultation, we're here to help. We will answer
          all your questions.
        </p>
      </div>

      {faqsError && <Error />}
      {faqsLoading ? (
        <FAQSkeleton />
      ) : faqs?.data && faqs.data.length > 0 ? (
        <Accordion type='single' collapsible className='w-full'>
          {faqs.data.map((item: FAQ, index: number) => (
            <AccordionItem key={index} value={`item-${index}`} className='border-t border-gray-200'>
              <AccordionTrigger className='text-xl font-medium py-4 font-poppins'>{item.question}</AccordionTrigger>
              <AccordionContent className='text-gray-600 text-[1.02rem] leading-[1.5] pb-4'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <EmptyFAQs />
      )}
    </div>
  );
};

export default FAQs;
