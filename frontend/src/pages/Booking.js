import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Booking = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    //email: '',
    service: 'trousseau_packing',
    date: '',
    notes: ''
  });
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const services = [
    { value: 'trousseau_packing', label: 'Trousseau Packing' },
    { value: 'seer_varisai_plates', label: 'Seer Varisai Plates' },
    { value: 'gift_hampers', label: 'Gift Hampers' },
    { value: 'return_gifts', label: 'Return Gifts' },
    { value: 'bouquets', label: 'Bouquets' },
    { value: 'custom', label: 'Custom Service' },
  ];
  
  useEffect(() => {
    fetchBookedDates();
  }, []);
  
  const fetchBookedDates = async () => {
    try {
      const response = await axios.get(`${API}/bookings/available-dates`);
      setBookedDates(response.data.booked_dates || []);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const isDateBooked = (date) => {
    return bookedDates.includes(date);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isDateBooked(formData.date)) {
      alert('This date is already booked. Please select another date.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/bookings`, formData);
      setSuccess(true);
      alert(`Booking confirmed! Your booking number is: ${response.data.booking_number}`);
      setFormData({
        customer_name: '',
        phone: '',
        //email: '',
        service: 'trousseau_packing',
        date: '',
        notes: ''
      });
      fetchBookedDates();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error response:', error.response);
      console.error('API URL:', `${API}/bookings`);
      console.error('Form data:', formData);
      
      if (error.response && error.response.status === 400) {
        alert('This date is already booked. Please select another date.');
      } else {
        // Properly extract error message
        let errorMsg = 'Failed to create booking. Please try again.';
        
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
        
        alert(`Failed to create booking: ${errorMsg}\n\nPlease check console for details.`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Get min date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  return (
    <div className="min-h-screen py-12" data-testid="booking-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text" data-testid="booking-title">Book Our Service</h1>
          <p className="text-xl text-gray-600">Reserve your date for our premium gifting services</p>
        </div>
        
        <div className="glass p-8 md:p-12 rounded-3xl shadow-xl">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" data-testid="booking-success">
              Booking confirmed! We'll contact you soon.
            </div>
          )}
          
          <form onSubmit={handleSubmit} data-testid="booking-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="customer_name" className="block text-gray-700 font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  data-testid="booking-name-input"
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
                  data-testid="booking-phone-input"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="service" className="block text-gray-700 font-semibold mb-2">
                Service Type *
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                data-testid="booking-service-select"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {services.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
                Delivery Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  data-testid="booking-date-input"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={24} />
              </div>
              {formData.date && isDateBooked(formData.date) && (
                <p className="text-red-600 mt-2 text-sm" data-testid="date-booked-warning">This date is already booked. Please select another date.</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-gray-700 font-semibold mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                data-testid="booking-notes-input"
                placeholder="Any special requirements or preferences..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading || (formData.date && isDateBooked(formData.date))}
              data-testid="booking-submit-button"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After booking, our team will contact you to confirm details and discuss pricing based on your requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;