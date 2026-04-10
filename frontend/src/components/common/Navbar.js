import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();
  
  const cartCount = getCartCount();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Book Service', path: '/booking' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 glass shadow-md" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="nav-logo">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              WB
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Welcome Bells</h1>
              <p className="text-xs text-gray-600">Trousseau & Gifting</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                className={`font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Cart Icon */}
            <Link
              to="/cart"
              data-testid="nav-cart-button"
              className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-whatsapp-button"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              <Phone size={18} />
              <span className="font-medium">WhatsApp</span>
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2" data-testid="mobile-cart-button">
              <ShoppingCart size={24} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-button"
              className="text-gray-700 hover:text-pink-600"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 rounded-lg mb-1 ${
                  isActive(link.path)
                    ? 'bg-pink-100 text-pink-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-4 bg-green-500 text-white text-center rounded-lg mt-2"
            >
              Contact on WhatsApp
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;