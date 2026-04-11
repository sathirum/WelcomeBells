import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    //email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API}/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-12" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text" data-testid="contact-title">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with us. We'd love to hear from you!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Let's Connect</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Have questions about our products or services? Want to book a consultation? We're here to help!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <a href="tel:+917904067684" className="text-gray-600 hover:text-pink-600" data-testid="contact-phone">
                    +91 79040 67684
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <a href="mailto:info@welcomebells.com" className="text-gray-600 hover:text-pink-600" data-testid="contact-email">
                    info@welcomebells.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Location</h3>
                  <p className="text-gray-600" data-testid="contact-address">Chennai, Tamil Nadu</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-8 space-y-4">
              <a
                href="https://wa.me/917904067684?text=Hello%20Welcome%20Bells!%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                data-testid="whatsapp-button"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg"
              >
                Chat on WhatsApp
              </a>
              
              <a
                href="tel:+917904067684"
                data-testid="call-button"
                className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg"
              >
                Call Now
              </a>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="glass p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" data-testid="success-message">
                Thank you! We'll get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit} data-testid="contact-form">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-testid="contact-name-input"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
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
                  data-testid="contact-phone-input"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              

              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  data-testid="contact-message-input"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit-button"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;