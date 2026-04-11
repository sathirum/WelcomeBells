import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import '@/App.css';

// Pages
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Gallery from '@/pages/Gallery';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Booking from '@/pages/Booking';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderTracking from '@/pages/OrderTracking';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Components
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App min-h-screen bg-gradient-to-br from-gold-100 via-white to-gold-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/products" element={<><Navbar /><Products /><Footer /></>} />
            <Route path="/products/:id" element={<><Navbar /><ProductDetail /><Footer /></>} />
            <Route path="/gallery" element={<><Navbar /><Gallery /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
            <Route path="/booking" element={<><Navbar /><Booking /><Footer /></>} />
            <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
            <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
            <Route path="/track-order" element={<><Navbar /><OrderTracking /><Footer /></>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;