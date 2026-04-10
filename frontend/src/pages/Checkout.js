import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [qrData, setQrData] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (cart.length === 0 && step === 1) {
    navigate('/cart');
    return null;
  }
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create order data outside try block so it's accessible in catch
    const orderData = {
      ...formData,
      items: cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: getCartTotal()
    };
    
    try {
      const orderResponse = await axios.post(`${API}/orders`, orderData);
      setOrderNumber(orderResponse.data.order_number);
      setTrackingId(orderResponse.data.tracking_id);
      
      // Generate UPI QR code
      const qrResponse = await axios.post(`${API}/generate-upi-qr`, {
        order_number: orderResponse.data.order_number,
        amount: getCartTotal()
      });
      
      setQrData(qrResponse.data);
      setStep(2);
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error response:', error.response);
      console.error('API URL:', `${API}/orders`);
      console.error('Order data:', orderData);
      
      // Properly extract error message
      let errorMsg = 'Failed to create order. Please try again.';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else {
          errorMsg = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(`Failed to create order: ${errorMsg}\n\nPlease check console for details.`);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentComplete = () => {
    clearCart();
    setStep(3);
  };
  
  if (step === 3) {
    return (
      <div className="min-h-screen py-12" data-testid="order-success-page">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-4xl font-bold mb-4 text-gray-800" data-testid="order-success-title">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600 mb-6">Thank you for your order!</p>
          
          <div className="glass p-8 rounded-2xl mb-8">
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-bold" data-testid="order-number">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking ID:</span>
                <span className="font-bold" data-testid="tracking-id">{trackingId}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-pink-600 text-xl">₹{getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-8">
            We'll contact you soon to confirm your order. You can track your order using the tracking ID.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/track-order')}
              data-testid="track-order-button"
              className="btn-primary"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/products')}
              data-testid="continue-shopping-button-success"
              className="btn-secondary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12" data-testid="checkout-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4" data-testid="checkout-title">Checkout</h1>
          <div className="flex justify-center items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-semibold">Details</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-semibold">Payment</span>
            </div>
          </div>
        </div>
        
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="glass p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
                <form onSubmit={handleSubmitDetails} data-testid="checkout-form">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="customer_name" className="block text-gray-700 font-semibold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                        data-testid="checkout-name-input"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        data-testid="checkout-phone-input"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        data-testid="checkout-email-input"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        data-testid="checkout-address-input"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-gray-700 font-semibold mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        data-testid="checkout-notes-input"
                        placeholder="Any special instructions..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      ></textarea>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="proceed-to-payment-button"
                    className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass p-6 rounded-2xl shadow-xl sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && qrData && (
          <div className="max-w-2xl mx-auto">
            <div className="glass p-8 rounded-2xl shadow-xl text-center">
              <h2 className="text-2xl font-bold mb-6">Scan to Pay</h2>
              
              <div className="bg-white p-6 rounded-xl inline-block mb-6">
                <img src={qrData.qr_code} alt="UPI QR Code" className="w-64 h-64 mx-auto" data-testid="upi-qr-code" />
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">UPI ID:</p>
                <p className="font-mono font-bold text-lg" data-testid="upi-id">{qrData.upi_id}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Amount to Pay:</p>
                <p className="text-3xl font-bold text-pink-600" data-testid="payment-amount">₹{qrData.amount.toFixed(2)}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong><br />
                  1. Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.)<br />
                  2. Verify the amount and complete the payment<br />
                  3. Click "I've Completed Payment" below
                </p>
              </div>
              
              <button
                onClick={handlePaymentComplete}
                data-testid="payment-complete-button"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg"
              >
                I've Completed Payment
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                Note: Our team will verify your payment and contact you for confirmation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;