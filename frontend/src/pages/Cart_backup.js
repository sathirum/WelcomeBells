import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-12" data-testid="cart-page">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-4xl font-bold mb-4 text-gray-800" data-testid="empty-cart-message">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">Add some beautiful items to your cart!</p>
          <Link to="/products" data-testid="continue-shopping-button">
            <button className="btn-primary">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12" data-testid="cart-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gradient-text" data-testid="cart-title">Shopping Cart</h1>
          <button
            onClick={clearCart}
            data-testid="clear-cart-button"
            className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-2"
          >
            <Trash2 size={18} />
            <span>Clear Cart</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6" data-testid={`cart-item-${item.id}`}>
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-200 rounded-lg flex-shrink-0"></div>
                  
                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link to={`/products/${item.id}`} className="hover:text-pink-600">
                      <h3 className="font-bold text-lg mb-1" data-testid="cart-item-name">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">{item.category?.replace(/_/g, ' ')}</p>
                    <p className="text-xl font-bold text-pink-600" data-testid="cart-item-price">₹{item.price}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      data-testid={`decrease-quantity-${item.id}`}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
                    >
                      <Minus size={16} className="mx-auto" />
                    </button>
                    <span className="w-12 text-center font-bold" data-testid={`cart-item-quantity-${item.id}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      data-testid={`increase-quantity-${item.id}`}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
                    >
                      <Plus size={16} className="mx-auto" />
                    </button>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                    <p className="text-xl font-bold" data-testid={`cart-item-subtotal-${item.id}`}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    data-testid={`remove-item-${item.id}`}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-2xl shadow-xl sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600" data-testid="cart-total">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                data-testid="proceed-to-checkout-button"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg mb-3"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>
              
              <Link to="/products">
                <button className="w-full bg-white text-pink-600 border-2 border-pink-500 hover:bg-pink-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;