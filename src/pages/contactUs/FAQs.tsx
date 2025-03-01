import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQs = () => {
  const faqItems = [
    {
      question: 'What makes Travelmark Africa different from other tour companies?',
      answer:
        'Travelmark Africa offers personalized itineraries with deep local knowledge of African destinations, particularly Rwanda and East Africa. Our guides are regional experts, and we emphasize authentic cultural experiences and sustainable tourism practices while maintaining luxury standards throughout your journey.',
    },
    {
      question: 'How do I plan my African safari with Travelmark Africa?',
      answer:
        "Planning your safari is simple. Contact our consultation team who will discuss your travel preferences, budget, and dream experiences. We'll create a custom itinerary highlighting the best wildlife viewing seasons, cultural events, and accommodations suited to your needs, with transparent pricing and comprehensive travel support.",
    },
    {
      question: 'Can I customize my travel experience with Travelmark Africa?',
      answer:
        "Absolutely! Customization is at the heart of what we do. Whether you're interested in gorilla trekking in Rwanda, exploring the Serengeti, relaxing on Zanzibar's beaches, or combining multiple destinations, our consultants will tailor every aspect of your journey to match your interests, pace, and accommodation preferences.",
    },
    {
      question: 'What safety measures does Travelmark Africa have in place?',
      answer:
        'Your safety is our priority. We provide 24/7 on-ground support, work with vetted accommodation and transportation providers, offer comprehensive pre-departure briefings, and maintain constant communication with local authorities regarding any regional developments. All our guides are first-aid certified and experienced in managing diverse travel situations.',
    },
    {
      question: 'Do I need special vaccinations for African travel?',
      answer:
        "Requirements vary by destination. Most East African countries require proof of Yellow Fever vaccination, and we recommend preventative measures for malaria. During your consultation, we'll provide current health requirements for your specific itinerary and timeline to prepare appropriately before departure.",
    },
  ];

  return (
    <div className='max-w-3xl mx-auto px-6 py-32'>
      <div className='mb-8'>
        <h6 className='font-bold mb-2'>FAQ</h6>
        <h4 className='text-4xl font-bold text-gray-800 mb-4'>Do you have any questions for us?</h4>
        <p className='text-gray-600'>
          If there are questions about your African adventure or travel consultation, we're here to help. We will answer
          all your questions.
        </p>
      </div>

      <Accordion type='single' collapsible className='w-full'>
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className='border-t border-gray-200'>
            <AccordionTrigger className='text-xl font-medium py-4 font-poppins'>{item.question}</AccordionTrigger>
            <AccordionContent className='text-gray-600 text-[1.02rem] leading-[1.5] pb-4'>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQs;
