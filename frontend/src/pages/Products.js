import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Filter } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'trousseau_packing', label: 'Trousseau Packing' },
    { value: 'seer_varisai_plates', label: 'Seer Varisai Plates' },
    { value: 'gift_hampers', label: 'Gift Hampers' },
    { value: 'return_gifts', label: 'Return Gifts' },
    { value: 'bouquets', label: 'Bouquets' },
  ];
  
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    fetchProducts();
  }, [searchParams]);
  
  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterProducts = () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  };
  
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product, 1);
    // Show a simple alert or toast notification
    alert(`${product.name} added to cart!`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12" data-testid="products-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text" data-testid="products-title">Our Products</h1>
          <p className="text-xl text-gray-600">Explore our beautiful collection of gifts and trousseau items</p>
        </div>
        
        {/* Category Filter */}
        <div className="mb-8 flex items-center justify-center flex-wrap gap-3" data-testid="category-filter">
          <div className="flex items-center text-gray-600 mr-2">
            <Filter size={20} className="mr-2" />
            <span className="font-semibold">Filter:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              data-testid={`filter-${category.value}`}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20" data-testid="no-products">
            <p className="text-2xl text-gray-500">No products found in this category.</p>
            <p className="text-gray-400 mt-2">Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card bg-white rounded-2xl shadow-lg overflow-hidden" data-testid={`product-card-${product.id}`}>
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-rose-200 relative overflow-hidden">
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
                    {product.featured && (
                      <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                        Featured
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <Link to={`/products/${product.id}`}>
                    <span className="category-badge">{product.category.replace(/_/g, ' ')}</span>
                    <h3 className="text-lg font-bold mt-2 mb-2 hover:text-pink-600 transition-colors" data-testid="product-name">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-pink-600" data-testid="product-price">
                      ₹{product.price}
                    </p>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      data-testid={`add-to-cart-${product.id}`}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300"
                    >
                      <ShoppingCart size={18} />
                      <span>Add</span>
                    </button>
                  </div>
                  {product.stock > 0 && product.stock < 10 && (
                    <p className="text-xs text-orange-600 mt-2">Only {product.stock} left!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;