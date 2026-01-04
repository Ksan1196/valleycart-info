import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-white" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-playfair text-2xl mb-4" data-testid="footer-title">
              Valleycart Organics
            </h3>
            <p className="text-white/80 mb-4">
              Organic Medicinal Mushrooms & Himalayan Natural Products
            </p>
            <p className="text-white/70 text-sm">
              Building a sustainable organic agriculture ecosystem in India.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <Link to="/about" className="block text-white/80 hover:text-white transition-colors" data-testid="footer-link-about">
                About Us
              </Link>
              <Link to="/research" className="block text-white/80 hover:text-white transition-colors" data-testid="footer-link-research">
                Research
              </Link>
              <Link to="/impact" className="block text-white/80 hover:text-white transition-colors" data-testid="footer-link-impact">
                Impact
              </Link>
              <Link to="/brands" className="block text-white/80 hover:text-white transition-colors" data-testid="footer-link-brands">
                Brands
              </Link>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2" data-testid="footer-email">
                <Mail size={18} className="mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm">work.manishkunwar@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2" data-testid="footer-phone">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm">+91-8077494941</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/70 text-sm">
          <p>&copy; {new Date().getFullYear()} Valleycart Organics Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
