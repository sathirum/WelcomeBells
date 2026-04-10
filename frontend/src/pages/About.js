import React from 'react';
import { Award, Heart, Users, Sparkles } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every item is crafted with care and attention to detail, ensuring your special moments are perfect.'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We use only the finest materials and products to create beautiful, lasting memories.'
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We work closely with you to bring your vision to life.'
    },
    {
      icon: Sparkles,
      title: 'Unique Designs',
      description: 'Each creation is uniquely designed to match your style and occasion perfectly.'
    }
  ];
  
  return (
    <div className="min-h-screen py-12" data-testid="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 gradient-text" data-testid="about-title">About Welcome Bells</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating beautiful moments and lasting memories through our passion for gifting and decoration
          </p>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Welcome Bells was born from a passion for making every occasion special. We believe that the art of gifting and presentation can transform ordinary moments into extraordinary memories.
              </p>
              <p>
                Specializing in trousseau packing, Seer Varisai plates, gift hampers, return gifts, and bouquets, we bring creativity, elegance, and personalization to every project we undertake.
              </p>
              <p>
                Our team of dedicated artisans works tirelessly to ensure that each item we create reflects the love and care you want to convey to your loved ones.
              </p>
              <p>
                Whether it's a wedding, festival, corporate event, or personal celebration, Welcome Bells is here to add that special touch that makes your event unforgettable.
              </p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="aspect-square bg-gradient-to-br from-pink-300 to-rose-300 rounded-3xl shadow-2xl"></div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 glass rounded-2xl" data-testid={`feature-${index}`}>
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Services Overview */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Trousseau Packing</h3>
              <p className="text-sm opacity-90">Elegant packaging for wedding trousseaus</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Seer Varisai Plates</h3>
              <p className="text-sm opacity-90">Traditional beautifully arranged plates</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Gift Hampers</h3>
              <p className="text-sm opacity-90">Curated hampers for all occasions</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Return Gifts</h3>
              <p className="text-sm opacity-90">Memorable gifts for your guests</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Bouquets</h3>
              <p className="text-sm opacity-90">Fresh and artificial flower arrangements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;