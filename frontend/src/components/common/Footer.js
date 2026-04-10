import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_welcome-bells/artifacts/ug291yyv_image.png" 
                alt="Welcome Bells Logo" 
                className="h-24 w-auto object-contain mb-2"
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Creating beautiful memories with our premium trousseau packing, gift hampers, bouquets, and return gifts. Making every occasion special since our inception.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/welcome.bells" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors" data-testid="footer-instagram">
                <Instagram size={24} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors" data-testid="footer-facebook">
                <Facebook size={24} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-pink-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-pink-400 transition-colors">Products</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-pink-400 transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-pink-400 transition-colors">About Us</Link></li>
              <li><Link to="/booking" className="text-gray-300 hover:text-pink-400 transition-colors">Book Service</Link></li>
              <li><Link to="/track-order" className="text-gray-300 hover:text-pink-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-2">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <div>
                  <a href="tel:+919876543210" className="hover:text-pink-400 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={18} className="mt-1 flex-shrink-0" />
                <div>
                  <a href="mailto:info@welcomebells.com" className="hover:text-pink-400 transition-colors">
                    info@welcomebells.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <div>
                  <span>Chennai, Tamil Nadu</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center space-x-2">
            <span>Made with</span>
            <Heart size={16} className="text-pink-500 fill-current" />
            <span>by Welcome Bells Team</span>
          </p>
          <p className="mt-2 text-sm">
            © {new Date().getFullYear()} Welcome Bells. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;