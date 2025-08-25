import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetFAQsQuery } from '@/hooks/useFAQs';
import { MessageCircle } from 'lucide-react';

const FAQs: React.FC = () => {
  const { data: faqsData, isLoading, isError, error } = useGetFAQsQuery();

  // Sort FAQs by creation date (newest first) or keep original order
  const faqs =
    faqsData?.data?.sort((a, b) => {
      return new Date(a.$createdAt || '').getTime() - new Date(b.$createdAt || '').getTime();
    }) || [];

  if (isLoading) {
    return (
      <div className='max-w-3xl mx-auto px-6 py-12'>
        <div className='mb-8'>
          <h6 className='font-bold mb-2 text-secondary'>FAQ</h6>
          <h4 className='text-4xl font-bold text-gray-800 mb-4 font-poppins'>Do you have any questions for us?</h4>
          <p className='text-gray-600 text-base leading-relaxed'>
            We've answered some of the most common questions about our services. If you have more questions, feel free
            to contact us directly.
          </p>
        </div>

        <div className='space-y-0'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='border-t border-gray-200 py-4'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-4' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='max-w-3xl mx-auto px-6 py-12'>
        <div className='mb-8'>
          <h6 className='font-bold mb-2 text-secondary'>FAQ</h6>
          <h4 className='text-4xl font-bold text-gray-800 mb-4 font-poppins'>Do you have any questions for us?</h4>
          <p className='text-gray-600 text-base leading-relaxed'>
            We've answered some of the most common questions about our services. If you have more questions, feel free
            to contact us directly.
          </p>
        </div>

        <div className='text-center py-8'>
          <div className='mb-4'>
            <MessageCircle className='w-12 h-12 mx-auto text-red-400' />
          </div>
          <h4 className='text-lg font-bold text-gray-900'>Error Loading FAQs</h4>
          <p className='mt-1 text-sm text-gray-500'>
            {error instanceof Error ? error.message : 'Unable to load FAQs at this time. Please contact us directly.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto px-6 py-12'>
      <div className='mb-8'>
        <h6 className='font-bold mb-2 text-secondary'>FAQ</h6>
        <h4 className='text-4xl font-bold text-gray-800 mb-4 font-poppins'>Do you have any questions for us?</h4>
        <p className='text-gray-600 text-base leading-relaxed'>
          We've answered some of the most common questions about our services. If you have more questions, feel free to
          contact us directly.
        </p>
      </div>

      {faqs.length > 0 ? (
        <Accordion type='single' collapsible className='w-full'>
          {faqs.map((item, index) => (
            <AccordionItem
              key={item.$id || index}
              value={`item-${item.$id || index}`}
              className='border-t border-gray-200'
            >
              <AccordionTrigger className='text-lg py-4 font-poppins text-primary/90! font-semibold no-underline!'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='text-primary text-[1.02rem] leading-[1.5] pb-4'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className='text-center py-8'>
          <div className='mb-4'>
            <MessageCircle className='w-12 h-12 mx-auto text-gray-400' />
          </div>
          <h4 className='text-lg font-bold text-gray-900'>No FAQs Available</h4>
          <p className='mt-1 text-sm text-gray-500'>Please contact us directly if your question isn't answered here.</p>
        </div>
      )}
    </div>
  );
};

export default FAQs;
