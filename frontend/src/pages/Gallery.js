import React, { useEffect, useState } from 'react';
import { Filter, Play } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const types = [
    { value: 'all', label: 'All Media' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
  ];
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'trousseau_packing', label: 'Trousseau' },
    { value: 'gift_hampers', label: 'Gift Hampers' },
    { value: 'bouquets', label: 'Bouquets' },
    { value: 'return_gifts', label: 'Return Gifts' },
  ];
  
  useEffect(() => {
    fetchGallery();
  }, []);
  
  useEffect(() => {
    filterGallery();
  }, [gallery, selectedType, selectedCategory]);
  
  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setGallery(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterGallery = () => {
    let filtered = gallery;
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredGallery(filtered);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12" data-testid="gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text" data-testid="gallery-title">Our Gallery</h1>
          <p className="text-xl text-gray-600">Explore our beautiful creations and past projects</p>
        </div>
        
        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Type Filter */}
          <div className="flex items-center justify-center flex-wrap gap-3">
            <span className="text-gray-600 font-semibold">Type:</span>
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                data-testid={`type-filter-${type.value}`}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedType === type.value
                    ? 'bg-gradient-to-r from-maroon-500 to-maroon-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gold-100 border border-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center justify-center flex-wrap gap-3">
            <span className="text-gray-600 font-semibold">Category:</span>
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                data-testid={`category-filter-${category.value}`}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-maroon-500 to-maroon-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gold-100 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Gallery Grid */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-20" data-testid="no-gallery-items">
            <p className="text-2xl text-gray-500">No gallery items found.</p>
            <p className="text-gray-400 mt-2">Check back soon for new additions!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="gallery-grid">
            {filteredGallery.map((item) => (
              <div key={item.id} className="group relative aspect-square bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl shadow-lg overflow-hidden cursor-pointer" data-testid={`gallery-item-${item.id}`}>
                {/* Display Image or Video */}
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', item.url);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
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
                )}
                
                {/* Play icon overlay for videos */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-white bg-opacity-80 rounded-full p-4 group-hover:bg-opacity-100 transition-all">
                      <Play size={32} className="text-maroon-600" />
                    </div>
                  </div>
                )}
                
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-semibold">{item.title || 'Gallery Item'}</p>
                  {item.category && (
                    <p className="text-white text-sm opacity-80">{item.category.replace(/_/g, ' ')}</p>
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

export default Gallery;