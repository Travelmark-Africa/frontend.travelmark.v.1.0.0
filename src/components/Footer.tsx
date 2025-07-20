import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import Container from '@/components/Container';
import { logo2 } from '@/assets';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about-us' },
    { name: 'Services', href: '/our-services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact-us' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/travelmarkafrica' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/travelmarkafrica' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/travelmarkafrica' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/travelmarkafrica' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Left - Logo & Description */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center">
                <img src={logo2} alt="TravelMark Africa" className="h-8 w-auto" />
              </div>
              <p className="text-gray-400 text-base max-w-sm leading-relaxed">
                Your trusted partner for high-impact events, destination marketing, and MICE consultancy across Africa.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-3 text-secondary flex-shrink-0" />
                  <a href="tel:+250788357850" className="hover:text-white transition-colors">
                    +250 788 357 850
                  </a>
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-3 text-secondary flex-shrink-0" />
                  <a href="mailto:info@travelmark.africa" className="hover:text-white transition-colors">
                    info@travelmark.africa
                  </a>
                </div>
                <div className="flex items-start text-gray-400">
                  <MapPin className="h-4 w-4 mr-3 text-secondary flex-shrink-0 mt-0.5" />
                  <span>Kigali, Rwanda<br />Serving All of Africa</span>
                </div>
              </div>
            </div>

            {/* Newsletter & Social */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Stay Connected</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Get updates on Africa's top MICE and business events.
                </p>
                <form className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-4 pr-12 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent text-sm"
                    required
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary hover:bg-secondary/90 text-primary rounded-full p-2 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Follow Us</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-secondary transition-colors p-2 rounded-lg hover:bg-gray-800"
                        aria-label={social.name}
                      >
                        <IconComponent className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {currentYear} TravelMark Africa. All rights reserved.</p>
            <a href="/faq" className="hover:text-gray-400 transition-colors">FAQ</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;