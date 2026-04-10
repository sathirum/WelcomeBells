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
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-pink-600 to-rose-600 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">
              WB
            </div>
            <div>
              <h2 className="font-bold text-lg">Welcome Bells</h2>
              <p className="text-sm opacity-80">Admin Panel</p>
            </div>
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
          <Route path="/" element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
