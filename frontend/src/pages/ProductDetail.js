import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProduct();
  }, [id]);
  
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} x ${product.name} added to cart!`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/products')}
          data-testid="back-button"
          className="flex items-center space-x-2 text-gray-600 hover:text-maroon-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-gold-100 to-gold-200 rounded-3xl shadow-2xl overflow-hidden">
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
          </div>
          
          {/* Product Info */}
          <div>
            <span className="category-badge" data-testid="product-category">
              {product.category.replace(/_/g, ' ')}
            </span>
            <h1 className="text-4xl font-bold mt-4 mb-4 text-gray-800" data-testid="product-detail-name">
              {product.name}
            </h1>
            <p className="text-4xl font-bold text-maroon-600 mb-6" data-testid="product-detail-price">
              ₹{product.price}
            </p>
            
            <div className="bg-gray-50 p-6 rounded-2xl mb-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mb-6">
              <Package size={20} className="text-gray-600" />
              <span className="text-gray-600" data-testid="product-stock">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            
            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="decrease-quantity"
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                      data-testid="quantity-input"
                      className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg font-bold text-xl"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      data-testid="increase-quantity"
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  data-testid="add-to-cart-detail"
                  className="w-full bg-gradient-to-r from-maroon-500 to-maroon-600 hover:from-maroon-600 hover:to-maroon-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg"
                >
                  <ShoppingCart size={24} />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    navigate('/checkout');
                  }}
                  data-testid="buy-now-button"
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>
            )}
            
            {product.stock === 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                This product is currently out of stock.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;