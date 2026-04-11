import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderTracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    
    try {
      const response = await axios.get(`${API}/orders/track/${trackingId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error tracking order:', error);
      if (error.response && error.response.status === 404) {
        setError('Order not found. Please check your tracking ID.');
      } else {
        setError('Failed to track order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package },
      { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
      { key: 'processing', label: 'Processing', icon: Package },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];
    
    const currentIndex = steps.findIndex(s => s.key === order?.delivery_status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };
  
  return (
    <div className="min-h-screen py-12" data-testid="order-tracking-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text" data-testid="tracking-title">Track Your Order</h1>
          <p className="text-xl text-gray-600">Enter your tracking ID to see order status</p>
        </div>
        
        {/* Search Form */}
        <div className="glass p-8 rounded-2xl shadow-xl mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4" data-testid="tracking-form">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              placeholder="Enter Tracking ID (e.g., AB12CD34)"
              required
              data-testid="tracking-id-input"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              data-testid="track-button"
              className="bg-gradient-to-r from-maroon-500 to-maroon-600 hover:from-maroon-600 hover:to-maroon-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <Search size={20} />
                  <span>Track</span>
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8" data-testid="tracking-error">
            {error}
          </div>
        )}
        
        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="glass p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Order Number</p>
                  <p className="font-bold" data-testid="order-number-display">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Tracking ID</p>
                  <p className="font-bold" data-testid="tracking-id-display">{order.tracking_id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Customer Name</p>
                  <p className="font-bold" data-testid="customer-name-display">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="font-bold text-maroon-600" data-testid="order-total-display">₹{order.total}</p>
                </div>
              </div>
            </div>
            
            {/* Status Timeline */}
            <div className="glass p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-8">Order Status</h2>
              <div className="relative">
                {getStatusSteps().map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-start mb-8 last:mb-0" data-testid={`status-step-${step.key}`}>
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-gradient-to-r from-maroon-500 to-maroon-600 text-white'
                            : 'bg-gray-300 text-gray-500'
                        }`}>
                          <Icon size={24} />
                        </div>
                        {index < getStatusSteps().length - 1 && (
                          <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                            step.completed ? 'bg-maroon-500' : 'bg-gray-300'
                          }`}></div>
                        )}
                      </div>
                      <div className="ml-6 flex-grow">
                        <h3 className={`font-bold text-lg ${
                          step.current ? 'text-maroon-600' : step.completed ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </h3>
                        {step.current && (
                          <p className="text-sm text-gray-600 mt-1">Current Status</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Items */}
            <div className="glass p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center" data-testid={`order-item-${index}`}>
                    <div>
                      <p className="font-semibold">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-maroon-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="glass p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
              <p className="text-gray-700" data-testid="delivery-address">{order.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;