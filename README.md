# Welcome Bells - Business Website

A comprehensive e-commerce and booking platform for Welcome Bells, specializing in Trousseau Packing, Gift Hampers, Bouquets, Return Gifts, and Seer Varisai Plates.

## 🌟 Features

### Public Website
- **Home Page**: Hero section with video gallery and featured products
- **Products Catalog**: Browse products by categories with filtering
- **Gallery**: View portfolio of past work (images and videos)
- **About Us**: Learn about Welcome Bells business
- **Testimonials**: Customer reviews and ratings
- **Contact**: WhatsApp integration, call buttons, and contact form
- **Shopping Cart**: Add products, manage quantities
- **Booking System**: Book services with date selection and calendar blocking
- **Checkout**: UPI QR code payment integration
- **Order Tracking**: Track delivery status with tracking ID

### Admin Panel
- **Dashboard**: Overview statistics (products, orders, bookings)
- **Products Management**: Add, edit, delete products
- **Orders Management**: View and update order status
- **Bookings Management**: Manage service bookings and dates
- **Gallery Management**: Upload and manage portfolio items
- **Testimonials**: Add and manage customer reviews
- **Settings**: Update business information and UPI details

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT tokens for admin
- **Password Hashing**: bcrypt
- **QR Code Generation**: qrcode library

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: Context API (Cart)

## 📁 Project Structure

```
/app/
├── backend/
│   ├── server.py           # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend configuration
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   ├── Gallery.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   └── admin/     # Admin pages
│   │   └── components/    # Reusable components
│   ├── package.json
│   └── .env              # Frontend configuration
├── scripts/
│   └── seed_database.py   # Database seeding script
└── memory/
    └── test_credentials.md # Test credentials
```

## 🚀 Getting Started

### Prerequisites
- MongoDB running on localhost:27017
- Python 3.11+
- Node.js 18+
- Yarn package manager

### Installation

1. **Backend Setup**
```bash
cd /app/backend
pip install -r requirements.txt
```

2. **Frontend Setup**
```bash
cd /app/frontend
yarn install
```

3. **Seed Database** (Optional - adds sample data)
```bash
python3 /app/scripts/seed_database.py
```

### Running the Application

Services are managed via supervisor:

```bash
# Start all services
sudo supervisorctl start all

# Restart specific service
sudo supervisorctl restart backend
sudo supervisorctl restart frontend

# Check status
sudo supervisorctl status
```

### Access Points

- **Website**: https://welcome-bells.preview.emergentagent.com
- **Backend API**: https://welcome-bells.preview.emergentagent.com/api
- **Admin Panel**: https://welcome-bells.preview.emergentagent.com/admin/login

## 🔐 Admin Credentials

**Username**: admin  
**Password**: admin123

⚠️ **Important**: Change these credentials in production!

## 📋 API Endpoints

### Public Endpoints

#### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get single product
- `GET /api/products?category={category}` - Filter by category
- `GET /api/products?featured=true` - Get featured products

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/track/{tracking_id}` - Track order

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/available-dates` - Get booked dates

#### Gallery & Testimonials
- `GET /api/gallery` - Get gallery items
- `GET /api/testimonials` - Get testimonials

#### Other
- `POST /api/contact` - Submit contact form
- `GET /api/settings/public` - Get public settings
- `POST /api/generate-upi-qr` - Generate UPI QR code

### Admin Endpoints (Require Authentication)

#### Authentication
- `POST /api/admin/login` - Admin login

#### Products Management
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product

#### Orders Management
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/{id}/status` - Update order status

#### Bookings Management
- `GET /api/admin/bookings` - List all bookings
- `PUT /api/admin/bookings/{id}/status` - Update booking status

#### Gallery & Testimonials
- `POST /api/admin/gallery` - Add gallery item
- `DELETE /api/admin/gallery/{id}` - Delete gallery item
- `POST /api/admin/testimonials` - Add testimonial
- `PUT /api/admin/testimonials/{id}` - Update testimonial
- `DELETE /api/admin/testimonials/{id}` - Delete testimonial

#### Settings & Stats
- `PUT /api/admin/settings` - Update settings
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## 💳 Payment Integration

The application uses **UPI QR Code** payment system:

1. Customer completes checkout with order details
2. System generates UPI QR code with order amount
3. Customer scans QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.)
4. Admin verifies payment and updates order status

### Configure UPI Details

Update UPI ID in Admin Panel → Settings or directly in database:

```javascript
{
  "upi_id": "yourname@upi",
  "business_name": "Welcome Bells"
}
```

## 🎨 Design Theme

- **Primary Colors**: Pink (#ec4899) to Rose (#f43f5e)
- **Secondary**: Purple and Gold accents
- **Style**: Modern, elegant, Instagram-inspired
- **Target**: Wedding, gifting, and trousseau business

## 📱 Features Integration

### WhatsApp Integration
- Direct chat links throughout the site
- Configurable WhatsApp number in settings
- Format: `https://wa.me/{phone_number}`

### Google Calendar Integration
- Booking dates can be synced with Google Calendar
- Admin can manage bookings in calendar view

## 🛒 Product Categories

1. **Trousseau Packing** - Traditional wedding trousseau packaging
2. **Seer Varisai Plates** - Traditional Tamil wedding plates
3. **Gift Hampers** - Curated gift boxes for all occasions
4. **Return Gifts** - Wedding and party return gifts
5. **Bouquets** - Fresh and artificial flower arrangements

## 📦 Order Flow

1. **Browse Products** → Add to Cart
2. **Checkout** → Enter delivery details
3. **Payment** → Scan UPI QR code
4. **Confirmation** → Receive order number & tracking ID
5. **Track Order** → Monitor delivery status
6. **Delivery** → Receive products

## 🗓️ Booking Flow

1. **Select Service** → Choose service type
2. **Pick Date** → Calendar blocks already booked dates
3. **Enter Details** → Customer information
4. **Submit** → Receive booking confirmation
5. **Admin Confirmation** → Admin contacts for finalization

## 🔒 Security Features

- JWT-based admin authentication
- Password hashing with bcrypt
- Protected admin routes
- CORS configuration
- Input validation with Pydantic

## 🌐 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET_KEY=your-secret-key-here
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://welcome-bells.preview.emergentagent.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

## 📝 Sample Data

The seed script adds:
- 8 Products (4 featured)
- 5 Customer testimonials
- 3 Gallery items (placeholder)

Run: `python3 /app/scripts/seed_database.py`

## 🎯 Future Enhancements

- [ ] Real Instagram API integration for automatic gallery updates
- [ ] Email notifications for orders and bookings
- [ ] SMS notifications via Twilio
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Product image upload functionality
- [ ] Customer accounts and order history
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] WhatsApp bot integration
- [ ] Google Calendar API sync for bookings

## 🐛 Troubleshooting

### Backend not starting
```bash
tail -n 50 /var/log/supervisor/backend.err.log
```

### Frontend not compiling
```bash
tail -n 50 /var/log/supervisor/frontend.err.log
```

### Database connection issues
```bash
sudo supervisorctl status mongodb
```

## 📄 License

This project is built for Welcome Bells business.

## 👨‍💻 Support

For any issues or questions:
- Email: info@welcomebells.com
- Phone: +91 98765 43210
- WhatsApp: +91 98765 43210

---

**Built with ❤️ for Welcome Bells** 🎁
