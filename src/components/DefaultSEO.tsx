import { Helmet } from 'react-helmet-async';

const DefaultSEO = () => {
  return (
    <Helmet>
      <title>Travelmark | Unforgettable Tours Across Africa and Beyond</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta
        name='description'
        content='Embark on unforgettable adventures with Travelmark. Explore Rwanda, East Africa, and other top global destinations with our personalized tours and safaris.'
      />
      <meta
        name='keywords'
        content='African tours, Rwanda travel, East Africa safaris, global travel experiences, gorilla trekking, Serengeti safaris, Maasai Mara adventures, Victoria Falls tours, Nile River cruises, Zanzibar beach holidays, cultural experiences, wildlife expeditions, luxury lodges, sustainable tourism, travel consultancy, custom itineraries, international travel packages, world heritage sites, adventure travel, exotic destinations'
      />

      {/* Open Graph Tags */}
      <meta property='og:title' content='Travelmark | Unforgettable Tours Across Africa and Beyond' />
      <meta
        property='og:description'
        content='Join Travelmark for exclusive tours across Africa and other top destinations worldwide. Experience gorilla trekking, wildlife safaris, and cultural journeys tailored to your interests.'
      />
      <meta property='og:type' content='website' />
      <meta property='og:image' content='/favicon.png' />
      <meta property='og:site_name' content='Travelmark' />
      <meta property='og:locale' content='en_US' />

      {/* Twitter Card Tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content='Travelmark | Unforgettable Tours Across Africa and Beyond' />
      <meta
        name='twitter:description'
        content='Discover the beauty of Africa and beyond with Travelmark. Personalized tours and safaris across Rwanda, East Africa, and other top global destinations.'
      />
      <meta name='twitter:image' content='/favicon.png' />

      {/* Additional SEO Meta Tags */}
      <meta name='robots' content='index, follow' />
      <meta name='author' content='Travelmark' />
      <meta name='theme-color' content='#ffffff' />
      <meta name='rating' content='general' />
      <meta name='revisit-after' content='7 days' />
      <meta name='language' content='English' />

      {/* Mobile App Tags */}
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Travelmark' />
      <meta name='application-name' content='Travelmark' />
      <meta name='mobile-web-app-capable' content='yes' />

      {/* Canonical URL */}
      <link rel='canonical' href='https://travelmark.com' />

      {/* Additional Links */}
      <link rel='icon' href='/favicon.png' />
      <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
    </Helmet>
  );
};

export default DefaultSEO;
