import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Calendar, Image, Star, 
  Settings, LogOut, Plus, Edit, Trash2, X 
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Helper to get auth headers
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

// Dashboard Home Component
const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/dashboard/stats`, getAuthHeaders());
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  return (
    <div data-testid="admin-dashboard-home">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-600 mb-2">Total Products</p>
            <p className="text-4xl font-bold text-pink-600">{stats.total_products}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-600 mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-blue-600">{stats.total_orders}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-600 mb-2">Total Bookings</p>
            <p className="text-4xl font-bold text-green-600">{stats.total_bookings}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-gray-600 mb-2">Pending Orders</p>
            <p className="text-4xl font-bold text-orange-600">{stats.pending_orders}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Products Management
const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'trousseau_packing',
    description: '',
    price: '',
    stock: '',
    featured: false
  });
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: []
      };
      
      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct.id}`, data, getAuthHeaders());
      } else {
        await axios.post(`${API}/admin/products`, data, getAuthHeaders());
      }
      
      fetchProducts();
      resetForm();
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`, getAuthHeaders());
      fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      featured: product.featured
    });
    setShowForm(true);
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'trousseau_packing',
      description: '',
      price: '',
      stock: '',
      featured: false
    });
    setEditingProduct(null);
    setShowForm(false);
  };
  
  return (
    <div data-testid="products-management">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <button
          onClick={() => setShowForm(true)}
          data-testid="add-product-button"
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={resetForm}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} data-testid="product-form">
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="trousseau_packing">Trousseau Packing</option>
                    <option value="seer_varisai_plates">Seer Varisai Plates</option>
                    <option value="gift_hampers">Gift Hampers</option>
                    <option value="return_gifts">Return Gifts</option>
                    <option value="bouquets">Bouquets</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">Featured Product</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <button type="submit" className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-bold">
                  {editingProduct ? 'Update' : 'Create'} Product
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-3 rounded-lg font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Featured</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4 font-semibold">{product.name}</td>
                <td className="px-6 py-4">{product.category.replace(/_/g, ' ')}</td>
                <td className="px-6 py-4">₹{product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.featured ? '⭐' : '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 mr-3">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Orders Management
const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/admin/orders`, getAuthHeaders());
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/admin/orders/${orderId}/status`, { delivery_status: newStatus }, getAuthHeaders());
      fetchOrders();
      alert('Order status updated!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };
  
  return (
    <div data-testid="orders-management">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Order #</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="px-6 py-4 font-mono">{order.order_number}</td>
                <td className="px-6 py-4">{order.customer_name}</td>
                <td className="px-6 py-4 font-bold">₹{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.delivery_status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.delivery_status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                    order.delivery_status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.delivery_status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.delivery_status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Bookings Management
const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API}/admin/bookings`, getAuthHeaders());
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  
  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`${API}/admin/bookings/${bookingId}/status`, { status: newStatus }, getAuthHeaders());
      fetchBookings();
      alert('Booking status updated!');
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };
  
  return (
    <div data-testid="bookings-management">
      <h1 className="text-3xl font-bold mb-6">Bookings Management</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Booking #</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Service</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} className="border-t">
                <td className="px-6 py-4 font-mono">{booking.booking_number}</td>
                <td className="px-6 py-4">{booking.customer_name}</td>
                <td className="px-6 py-4">{booking.service.replace(/_/g, ' ')}</td>
                <td className="px-6 py-4">{booking.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Gallery Management
const GalleryManagement = () => {
  const [gallery, setGallery] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'image',
    url: '',
    category: '',
    title: ''
  });
  
  useEffect(() => {
    fetchGallery();
  }, []);
  
  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setGallery(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/gallery`, formData, getAuthHeaders());
      fetchGallery();
      resetForm();
      alert('Gallery item added successfully!');
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Failed to add gallery item');
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API}/admin/gallery/${id}`, getAuthHeaders());
      fetchGallery();
      alert('Gallery item deleted!');
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item');
    }
  };
  
  const resetForm = () => {
    setFormData({ type: 'image', url: '', category: '', title: '' });
    setShowForm(false);
  };
  
  return (
    <div data-testid="gallery-management">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <button
          onClick={() => setShowForm(true)}
          data-testid="add-gallery-button"
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Media</span>
        </button>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Gallery Item</h2>
              <button onClick={resetForm}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Media Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Image/Video URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload your image/video to Instagram, Google Drive, or any image host, then paste the URL here
                  </p>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Gallery item title"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Category (Optional)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">No Category</option>
                    <option value="trousseau_packing">Trousseau Packing</option>
                    <option value="seer_varisai_plates">Seer Varisai Plates</option>
                    <option value="gift_hampers">Gift Hampers</option>
                    <option value="return_gifts">Return Gifts</option>
                    <option value="bouquets">Bouquets</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <button type="submit" className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-bold">
                  Add to Gallery
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-3 rounded-lg font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-pink-200 to-rose-200 relative">
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-80 rounded-full p-3">
                    <Image size={32} className="text-pink-600" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-semibold text-sm mb-1">{item.title || 'Untitled'}</p>
              <p className="text-xs text-gray-500 mb-2">{item.type}</p>
              {item.category && (
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                  {item.category.replace(/_/g, ' ')}
                </span>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="mt-3 w-full bg-red-100 text-red-600 hover:bg-red-200 py-2 rounded-lg text-sm font-semibold flex items-center justify-center space-x-1"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {gallery.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl">
          <Image size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500 mb-2">No gallery items yet</p>
          <p className="text-gray-400">Click "Add Media" to upload your first image or video</p>
        </div>
      )}
    </div>
  );
};

// Testimonials Management
const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    review: '',
    approved: true
  });
  
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/testimonials`, formData, getAuthHeaders());
      fetchTestimonials();
      resetForm();
      alert('Testimonial added successfully!');
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Failed to add testimonial');
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await axios.delete(`${API}/admin/testimonials/${id}`, getAuthHeaders());
      fetchTestimonials();
      alert('Testimonial deleted!');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };
  
  const resetForm = () => {
    setFormData({ customer_name: '', rating: 5, review: '', approved: true });
    setShowForm(false);
  };
  
  return (
    <div data-testid="testimonials-management">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonials Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Testimonial</span>
        </button>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Testimonial</h2>
              <button onClick={resetForm}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Rating *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Review *</label>
                  <textarea
                    value={formData.review}
                    onChange={(e) => setFormData({...formData, review: e.target.value})}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <button type="submit" className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-bold">
                  Add Testimonial
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 py-3 rounded-lg font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
            <p className="font-semibold text-pink-600 mb-4">- {testimonial.customer_name}</p>
            <button
              onClick={() => handleDelete(testimonial.id)}
              className="w-full bg-red-100 text-red-600 hover:bg-red-200 py-2 rounded-lg text-sm font-semibold flex items-center justify-center space-x-1"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Settings Management
const SettingsManagement = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    upi_id: '',
    business_name: '',
    phone: '',
    email: '',
    address: '',
    whatsapp_number: '',
    about_us: ''
  });
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings/public`);
      setSettings(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/admin/settings`, formData, getAuthHeaders());
      alert('Settings updated successfully!');
      fetchSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };
  
  return (
    <div data-testid="settings-management">
      <h1 className="text-3xl font-bold mb-6">Business Settings</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Business Name</label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">UPI ID (for payments)</label>
              <input
                type="text"
                value={formData.upi_id}
                onChange={(e) => setFormData({...formData, upi_id: e.target.value})}
                placeholder="yourname@upi"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                  placeholder="+919876543210"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows="2"
                className="w-full px-4 py-2 border rounded-lg"
              ></textarea>
            </div>
            
            <div>
              <label className="block font-semibold mb-2">About Us</label>
              <textarea
                value={formData.about_us}
                onChange={(e) => setFormData({...formData, about_us: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg"
              ></textarea>
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-lg"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const savedUsername = localStorage.getItem('admin_username');
    
    if (!token) {
      navigate('/admin/login');
    } else {
      setUsername(savedUsername || 'Admin');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };
  
  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/gallery', icon: Image, label: 'Gallery' },
    { path: '/admin/testimonials', icon: Star, label: 'Testimonials' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-pink-600 to-rose-600 text-white">
        <div className="p-6">
          <div className="mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_welcome-bells/artifacts/ug291yyv_image.png" 
              alt="Welcome Bells Logo" 
              className="h-20 w-auto object-contain mb-2 bg-white rounded-lg p-2"
            />
            <p className="text-sm opacity-80 text-center">Admin Panel</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive ? 'bg-white text-pink-600' : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <button
            onClick={handleLogout}
            data-testid="logout-button"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all w-full mt-8"
          >
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-6">
          <p className="text-gray-600">Welcome back, <span className="font-semibold text-pink-600">{username}</span></p>
        </div>
        
        <Routes>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="bookings" element={<BookingsManagement />} />
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="testimonials" element={<TestimonialsManagement />} />
          <Route path="settings" element={<SettingsManagement />} />
          <Route path="/" element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
