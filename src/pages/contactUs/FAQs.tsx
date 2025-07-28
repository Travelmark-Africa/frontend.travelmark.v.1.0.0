import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What services does TravelMark Africa offer?',
    answer:
      'We specialize in three core areas: Event Consultation, MICE (Meetings, Incentives, Conferences & Exhibitions) Consultation, and Destination Marketing. Each service is tailored to meet the unique needs of our clients across Africa.',
  },
  {
    question: 'What is MICE consultation?',
    answer:
      'MICE stands for Meetings, Incentives, Conferences, and Exhibitions. Our MICE services involve strategic planning, stakeholder engagement, destination marketing, and seamless event execution to support corporate and institutional gatherings.',
  },
  {
    question: 'Do you only operate in Rwanda?',
    answer:
      'While we are based in Kigali, Rwanda, TravelMark Africa operates across the continent. We’ve partnered with various organizations to deliver events and consultations throughout Africa.',
  },
  {
    question: 'Can you assist with international conferences?',
    answer:
      'Yes. We provide full-scale support for international events, including government and ministerial summits, business expos, and industry-specific gatherings.',
  },
  {
    question: 'How early should I contact you to plan an event?',
    answer:
      'For the best results, we recommend reaching out at least 4–6 weeks before your planned event. However, we can accommodate shorter timelines depending on the scope.',
  },
  {
    question: 'Do you help with marketing my event?',
    answer:
      'Yes. Through our Destination Marketing service, we help you position your event for maximum visibility and attendance, including digital campaigns and stakeholder outreach.',
  },
];

const FAQs = () => {
  return (
    <div className='max-w-3xl mx-auto px-6 py-12'>
      <div className='mb-8'>
        <h6 className='font-bold mb-2 text-secondary'>FAQ</h6>
        <h4 className='text-4xl font-bold text-gray-800 mb-4 font-poppins'>Do you have any questions for us?</h4>
        <p className='text-gray-600 text-base leading-relaxed'>
          We’ve answered some of the most common questions about our services. If you have more questions, feel free to
          contact us directly.
        </p>
      </div>

      {faqs.length > 0 ? (
        <Accordion type='single' collapsible className='w-full'>
          {faqs.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className='border-t border-gray-200'>
              <AccordionTrigger className='text-xl font-medium py-4 font-poppins'>{item.question}</AccordionTrigger>
              <AccordionContent className='text-gray-600 text-[1.02rem] leading-[1.5] pb-4'>
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
          <p className='mt-1 text-sm text-gray-500'>Please contact us directly if your question isn’t answered here.</p>
        </div>
      )}
    </div>
  );
};

export default FAQs;
