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
  const [tileImages, setTileImages] = useState({});
  
  useEffect(() => {
    fetchHomeData();
  }, []);
  
  const fetchHomeData = async () => {
    try {
      const [galleryRes, testimonialsRes, productsRes, settingsRes] = await Promise.all([
        axios.get(`${API}/gallery?type=video`),
        axios.get(`${API}/testimonials`),
        axios.get(`${API}/products?featured=true`),
        axios.get(`${API}/settings/public`)
      ]);
      
      setGallery(galleryRes.data.slice(0, 3));
      setTestimonials(testimonialsRes.data.slice(0, 3));
      setFeaturedProducts(productsRes.data.slice(0, 4));
      setTileImages({
        trousseau_packing: settingsRes.data.tile_trousseau,
        gift_hampers: settingsRes.data.tile_gift_hampers,
        bouquets: settingsRes.data.tile_bouquets,
        return_gifts: settingsRes.data.tile_return_gifts,
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    { name: 'Trousseau Packing', icon: Package, color: 'from-maroon-400 to-maroon-600', category: 'trousseau_packing', image: '/uploads/Image1.jpeg' },
    { name: 'Gift Hampers', icon: Gift, color: 'from-maroon-600 to-gold-400', category: 'gift_hampers', image: '/uploads/Image2.jpeg' },
    { name: 'Bouquets', icon: Flower2, color: 'from-maroon-500 to-gold-400', category: 'bouquets', image: '/uploads/Image3.jpeg' },
    { name: 'Return Gifts', icon: ShoppingBag, color: 'from-gold-400 to-maroon-600', category: 'return_gifts', image: '/uploads/Image4.jpeg' },
  ].map(c => ({ ...c, image: tileImages[c.category] || c.image }));
  
  return (
    <div className="animate-fadeIn" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-bold mb-6 animate-slideIn">
                <span className="block text-3xl md:text-4xl mb-1">Celebrate With</span>
                <span className="block text-5xl md:text-6xl gradient-text">Welcome Bells</span>
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
              <div className="aspect-square bg-gradient-to-br from-gold-100 to-gold-200 rounded-full opacity-20 absolute inset-0 animate-pulse"></div>
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gradient-to-br from-maroon-500 to-maroon-600 rounded-2xl shadow-xl overflow-hidden p-3">
                <img src="/uploads/Image1.jpeg" alt="Tile 1" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-maroon-500 to-maroon-600 rounded-2xl shadow-xl overflow-hidden mt-8 p-3">
                <img src="/uploads/Image2.jpeg" alt="Tile 2" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-maroon-500 to-gold-400 rounded-2xl shadow-xl overflow-hidden -mt-8 p-3">
                <img src="/uploads/Image3.jpeg" alt="Tile 3" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-gold-400 to-maroon-600 rounded-2xl shadow-xl overflow-hidden p-3">
                <img src="/uploads/Image4.jpeg" alt="Tile 4" className="w-full h-full object-cover rounded-xl" />
              </div>
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
                className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
              <div className={`bg-gradient-to-br ${category.color} p-3`}>
                <div className="aspect-square overflow-hidden rounded-xl">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="p-4 bg-gold-100">
                <div className={`bg-gradient-to-r ${category.color} p-3 rounded-xl inline-block mb-3`}>
                <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-maroon-600 transition-colors">
                {category.name}
                </h3>
              </div>
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
                  {item.type === 'video' ? (
                    <video 
                      src={item.url}
                      className="w-full h-full object-cover"
                      controls
                      onError={(e) => {
                        console.error('Video load error:', item.url);
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={item.url} 
                      alt={item.title || 'Gallery item'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
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
                    <div className="aspect-square bg-gradient-to-br from-gold-100 to-gold-200 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <span className="category-badge">{product.category.replace('_', ' ')}</span>
                      <h3 className="text-lg font-bold mt-2 mb-1">{product.name}</h3>
                      <p className="text-2xl font-bold text-maroon-600">₹{product.price}</p>
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
                  <p className="font-semibold text-maroon-600">- {testimonial.customer_name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-maroon-500 to-maroon-600" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make Your Event Special?</h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Book our services today and let us create beautiful memories for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" data-testid="cta-book-button">
              <button className="bg-white text-maroon-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300">
                Book Now
              </button>
            </Link>
            <Link to="/contact" data-testid="cta-contact-button">
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-maroon-600 font-bold py-4 px-8 rounded-lg transition-all duration-300">
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