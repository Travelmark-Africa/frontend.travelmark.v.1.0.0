import { Helmet } from 'react-helmet-async';

const DefaultSEO = () => {
  return (
    <Helmet>
      <title>DHDealz | Your Ultimate Online Shopping Destination</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta
        name='description'
        content='DHDealz - Your premier online shopping destination in Rwanda. Discover amazing deals on electronics, fashion, home goods, and more. Shop with confidence with secure payments and fast delivery. Find the best prices and exclusive offers today!'
      />
      <meta
        name='keywords'
        content="DHDealz, online shopping Rwanda, ecommerce Rwanda, online marketplace, shopping deals, 
        electronics store, fashion store, home appliances, mobile phones, laptops, tablets, 
        women's fashion, men's fashion, kid's clothing, home decor, kitchen appliances, 
        beauty products, skincare, makeup, sports equipment, fitness gear, 
        books, stationery, office supplies, groceries, household items, 
        furniture, automotive parts, toys, games, baby products, 
        jewelry, watches, accessories, shoes, bags, 
        best deals, discounts, sale, clearance, special offers, promotional deals, 
        fast delivery, secure shopping, online payment, cash on delivery, 
        product reviews, customer ratings, price comparison, 
        new arrivals, trending products, popular items, 
        free shipping, return policy, customer service, 
        wishlist, shopping cart, track order, 
        brand products, authentic items, warranty, 
        seasonal sales, holiday deals, flash sales, 
        local products, international brands, 
        gift cards, reward points, loyalty program"
      />

      {/* Open Graph Tags */}
      <meta property='og:title' content='DHDealz | Your Ultimate Online Shopping Destination' />
      <meta
        property='og:description'
        content='Discover amazing deals on electronics, fashion, home goods, and more. Shop with confidence with secure payments and fast delivery.'
      />
      <meta property='og:type' content='website' />
      <meta property='og:image' content='/favicon.png' />
      <meta property='og:site_name' content='DHDealz' />
      <meta property='og:locale' content='en_RW' />

      {/* Twitter Card Tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content='DHDealz | Your Ultimate Online Shopping Destination' />
      <meta
        name='twitter:description'
        content='Discover amazing deals on electronics, fashion, home goods, and more. Shop with confidence with secure payments and fast delivery.'
      />
      <meta name='twitter:image' content='/favicon.png' />

      {/* Additional SEO Meta Tags */}
      <meta name='robots' content='index, follow' />
      <meta name='author' content='DHDealz' />
      <meta name='theme-color' content='#ffffff' />
      <meta name='rating' content='general' />
      <meta name='revisit-after' content='7 days' />
      <meta name='language' content='English' />

      {/* Mobile App Tags */}
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='DHDealz' />
      <meta name='application-name' content='DHDealz' />
      <meta name='mobile-web-app-capable' content='yes' />

      {/* Canonical URL - Update this dynamically if needed */}
      <link rel='canonical' href='https://dhdealz.com' />

      {/* Additional Links */}
      <link rel='icon' href='/favicon.png' />
      <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
    </Helmet>
  );
};

export default DefaultSEO;
