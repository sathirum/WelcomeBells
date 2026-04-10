import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Package, Gift, Flower2, ShoppingBag } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchHomeData();
  }, []);
  
  const fetchHomeData = async () => {
    try {
      const [galleryRes, testimonialsRes, productsRes] = await Promise.all([
        axios.get(`${API}/gallery?type=video`),
        axios.get(`${API}/testimonials`),
        axios.get(`${API}/products?featured=true`)
      ]);
      
      setGallery(galleryRes.data.slice(0, 3));
      setTestimonials(testimonialsRes.data.slice(0, 3));
      setFeaturedProducts(productsRes.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    { name: 'Trousseau Packing', icon: Package, color: 'from-pink-400 to-rose-400', category: 'trousseau_packing' },
    { name: 'Gift Hampers', icon: Gift, color: 'from-purple-400 to-pink-400', category: 'gift_hampers' },
    { name: 'Bouquets', icon: Flower2, color: 'from-rose-400 to-pink-400', category: 'bouquets' },
    { name: 'Return Gifts', icon: ShoppingBag, color: 'from-pink-400 to-purple-400', category: 'return_gifts' },
  ];
  
  return (
    <div className="animate-fadeIn" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slideIn">
                Welcome to <span className="gradient-text">Welcome Bells</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Crafting beautiful moments with premium trousseau packing, elegant gift hampers, stunning bouquets, and memorable return gifts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products" data-testid="hero-shop-button">
                  <button className="btn-primary flex items-center justify-center space-x-2">
                    <span>Shop Now</span>
                    <ArrowRight size={20} />
                  </button>
                </Link>
                <Link to="/booking" data-testid="hero-book-button">
                  <button className="btn-secondary">
                    Book a Service
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-20 absolute inset-0 animate-pulse"></div>
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-xl"></div>
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl mt-8"></div>
                <div className="aspect-square bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl shadow-xl -mt-8"></div>
                <div className="aspect-square bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={index}
                  to={`/products?category=${category.category}`}
                  data-testid={`category-${category.category}`}
                  className="group p-8 rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                >
                  <div className={`bg-gradient-to-r ${category.color} p-4 rounded-xl inline-block mb-4`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Video Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-16" data-testid="video-gallery-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Our Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="aspect-video bg-gray-200 rounded-2xl shadow-lg overflow-hidden" data-testid="gallery-video-item">
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Video: {item.title || 'Gallery Item'}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/gallery" data-testid="view-gallery-button">
                <button className="btn-primary">View Full Gallery</button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white" data-testid="featured-products-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} data-testid={`featured-product-${product.id}`}>
                  <div className="product-card bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-pink-200 to-rose-200"></div>
                    <div className="p-4">
                      <span className="category-badge">{product.category.replace('_', ' ')}</span>
                      <h3 className="text-lg font-bold mt-2 mb-1">{product.name}</h3>
                      <p className="text-2xl font-bold text-pink-600">₹{product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16" data-testid="testimonials-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 gradient-text">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="glass p-6 rounded-2xl shadow-lg" data-testid="testimonial-card">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                  <p className="font-semibold text-pink-600">- {testimonial.customer_name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make Your Event Special?</h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Book our services today and let us create beautiful memories for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" data-testid="cta-book-button">
              <button className="bg-white text-pink-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300">
                Book Now
              </button>
            </Link>
            <Link to="/contact" data-testid="cta-contact-button">
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-pink-600 font-bold py-4 px-8 rounded-lg transition-all duration-300">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;