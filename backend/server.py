from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import qrcode
import io
import base64
from enum import Enum
import shutil
import cloudinary
import cloudinary.uploader


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours



# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()


# ==================== ENUMS ====================
class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ProductCategory(str, Enum):
    TROUSSEAU = "trousseau_packing"
    SEER_VARISAI = "seer_varisai_plates"
    GIFT_HAMPERS = "gift_hampers"
    RETURN_GIFTS = "return_gifts"
    BOUQUETS = "bouquets"


class GalleryType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"


# ==================== MODELS ====================
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: ProductCategory
    description: str
    price: float
    images: List[str] = []
    stock: int = 0
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    name: str
    category: ProductCategory
    description: str
    price: float
    images: List[str] = []
    stock: int = 0
    featured: bool = False


class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=lambda: f"WB{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:6].upper()}")
    customer_name: str
    phone: str
    email: Optional[EmailStr] = None
    items: List[OrderItem]
    total: float
    payment_status: str = "pending"
    delivery_status: OrderStatus = OrderStatus.PENDING
    tracking_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    address: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    email: Optional[EmailStr] = None
    items: List[OrderItem]
    total: float
    address: str
    notes: Optional[str] = None


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_number: str = Field(default_factory=lambda: f"BK{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:6].upper()}")
    customer_name: str
    phone: str
    email: Optional[EmailStr] = None
    service: str
    date: str  # YYYY-MM-DD format
    status: BookingStatus = BookingStatus.PENDING
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BookingCreate(BaseModel):
    customer_name: str
    phone: str
    email: Optional[EmailStr] = None
    service: str
    date: str
    notes: Optional[str] = None


class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: GalleryType
    url: str
    category: Optional[ProductCategory] = None
    title: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GalleryCreate(BaseModel):
    type: GalleryType
    url: str
    category: Optional[ProductCategory] = None
    title: Optional[str] = None


class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    rating: int = Field(ge=1, le=5)
    review: str
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    approved: bool = True


class TestimonialCreate(BaseModel):
    customer_name: str
    rating: int = Field(ge=1, le=5)
    review: str
    approved: bool = True


class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "settings"
    upi_id: str = "welcomebells@upi"
    business_name: str = "Welcome Bells"
    phone: str = "+91 7904067684"
    email: str = "info@welcomebells.com"
    address: str = "Chennai, Tamil Nadu"
    whatsapp_number: str = "+917904067684"
    about_us: str = "Welcome to Welcome Bells - Your trusted partner for Trousseau Packing, Gift Hampers, and more!"


class SettingsUpdate(BaseModel):
    upi_id: Optional[str] = None
    business_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    whatsapp_number: Optional[str] = None
    about_us: Optional[str] = None


class Admin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str


class AdminLogin(BaseModel):
    username: str
    password: str


class ContactMessage(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    message: str


class UPIQRRequest(BaseModel):
    order_number: str
    amount: float


class OrderStatusUpdate(BaseModel):
    delivery_status: OrderStatus


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


# ==================== HELPER FUNCTIONS ====================
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def generate_upi_qr(upi_id: str, amount: float, name: str) -> str:
    """Generate UPI QR code as base64 string"""
    upi_url = f"upi://pay?pa={upi_id}&pn={name}&am={amount}&cu=INR"
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(upi_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"


# ==================== INITIALIZATION ====================
async def initialize_admin():
    """Create default admin if doesn't exist"""
    admin_exists = await db.admins.find_one({"username": "admin"})
    if not admin_exists:
        default_admin = Admin(
            username="admin",
            password_hash=hash_password("admin123")  # Change this in production
        )
        await db.admins.insert_one(default_admin.model_dump())
        logger.info("Default admin created: username='admin', password='admin123'")


async def initialize_settings():
    """Create default settings if doesn't exist"""
    settings_exists = await db.settings.find_one({"id": "settings"})
    if not settings_exists:
        default_settings = Settings()
        await db.settings.insert_one(default_settings.model_dump())
        logger.info("Default settings created")


# ==================== PUBLIC ENDPOINTS ====================
@api_router.get("/")
async def root():
    return {"message": "Welcome Bells API"}


# Products
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[ProductCategory] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# Orders
@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate):
    order = Order(**order_input.model_dump())
    doc = order.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.orders.insert_one(doc)
    return order


@api_router.get("/orders/track/{tracking_id}")
async def track_order(tracking_id: str):
    order = await db.orders.find_one({"tracking_id": tracking_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Convert ISO strings back to datetime
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    if isinstance(order.get('updated_at'), str):
        order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    
    return order

# Admin Contact Messages
@api_router.get("/admin/contact-messages")
async def get_contact_messages(token_data: dict = Depends(verify_token)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return messages
    
# Bookings
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_input: BookingCreate):
    # Check if date is already booked
    existing_booking = await db.bookings.find_one({
        "date": booking_input.date,
        "status": {"$in": [BookingStatus.CONFIRMED, BookingStatus.PENDING]}
    })
    
    if existing_booking:
        raise HTTPException(status_code=400, detail="This date is already booked")
    
    booking = Booking(**booking_input.model_dump())
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    return booking


@api_router.get("/bookings/available-dates")
async def get_available_dates():
    """Get list of booked dates"""
    bookings = await db.bookings.find(
        {"status": {"$in": [BookingStatus.CONFIRMED, BookingStatus.PENDING]}},
        {"date": 1, "_id": 0}
    ).to_list(1000)
    
    booked_dates = [b["date"] for b in bookings]
    return {"booked_dates": booked_dates}


# Gallery
@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery(category: Optional[ProductCategory] = None, type: Optional[GalleryType] = None):
    query = {}
    if category:
        query["category"] = category
    if type:
        query["type"] = type
    
    gallery_items = await db.gallery.find(query, {"_id": 0}).sort("uploaded_at", -1).to_list(1000)
    
    for item in gallery_items:
        if isinstance(item.get('uploaded_at'), str):
            item['uploaded_at'] = datetime.fromisoformat(item['uploaded_at'])
    
    return gallery_items


# Testimonials
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({"approved": True}, {"_id": 0}).sort("date", -1).to_list(1000)
    
    for testimonial in testimonials:
        if isinstance(testimonial.get('date'), str):
            testimonial['date'] = datetime.fromisoformat(testimonial['date'])
    
    return testimonials


# Contact
@api_router.post("/contact")
async def submit_contact(contact: ContactMessage):
    # Store contact message
    doc = contact.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.contact_messages.insert_one(doc)
    return {"message": "Message received. We'll contact you soon!"}


# Settings (Public)
@api_router.get("/settings/public")
async def get_public_settings():
    settings = await db.settings.find_one({"id": "settings"}, {"_id": 0})
    if not settings:
        settings = Settings().model_dump()
    return settings


# Pydantic model for UPI QR request
class UPIQRRequest(BaseModel):
    order_number: str
    amount: float


# Generate UPI QR
@api_router.post("/generate-upi-qr")
async def generate_upi_qr_code(request: UPIQRRequest):
    try:
        settings = await db.settings.find_one({"id": "settings"})
        if not settings:
            settings = Settings().model_dump()
        
        qr_code = generate_upi_qr(settings['upi_id'], request.amount, settings['business_name'])
        return {
            "qr_code": qr_code,
            "upi_id": settings['upi_id'],
            "amount": request.amount
        }
    except Exception as e:
        logger.error(f"Error generating UPI QR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate QR code: {str(e)}")


# ==================== ADMIN ENDPOINTS ====================
@api_router.post("/admin/login")
async def admin_login(login: AdminLogin):
    admin = await db.admins.find_one({"username": login.username})
    if not admin or not verify_password(login.password, admin['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": admin['username'], "id": admin['id']})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": admin['username']
    }


# File Upload Endpoint
@api_router.post("/admin/upload")
async def upload_file(file: UploadFile = File(...), token_data: dict = Depends(verify_token)):
    """Upload image or video file to Cloudinary"""
    try:
        # Read file contents
        contents = await file.read()
        
        # Determine resource type
        resource_type = "video" if file.content_type and file.content_type.startswith("video") else "image"
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            contents,
            folder="welcomebells",
            resource_type=resource_type
        )
        
        file_url = result.get("secure_url")
        
        return {
            "success": True,
            "url": file_url,
            "filename": result.get("public_id")
        }
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="File upload failed")


# Admin Products
@api_router.post("/admin/products", response_model=Product)
async def create_product(product: ProductCreate, token_data: dict = Depends(verify_token)):
    new_product = Product(**product.model_dump())
    doc = new_product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.products.insert_one(doc)
    return new_product


@api_router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate, token_data: dict = Depends(verify_token)):
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.model_dump()
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated_product.get('created_at'), str):
        updated_product['created_at'] = datetime.fromisoformat(updated_product['created_at'])
    
    return updated_product


@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, token_data: dict = Depends(verify_token)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# Admin Gallery
@api_router.post("/admin/gallery", response_model=GalleryItem)
async def create_gallery_item(gallery: GalleryCreate, token_data: dict = Depends(verify_token)):
    new_item = GalleryItem(**gallery.model_dump())
    doc = new_item.model_dump()
    doc['uploaded_at'] = doc['uploaded_at'].isoformat()
    
    await db.gallery.insert_one(doc)
    return new_item


@api_router.delete("/admin/gallery/{item_id}")
async def delete_gallery_item(item_id: str, token_data: dict = Depends(verify_token)):
    result = await db.gallery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Gallery item deleted successfully"}


# Admin Orders
@api_router.get("/admin/orders", response_model=List[Order])
async def get_all_orders(token_data: dict = Depends(verify_token)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
        if isinstance(order.get('updated_at'), str):
            order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    
    return orders


@api_router.put("/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, status_update: OrderStatusUpdate, token_data: dict = Depends(verify_token)):
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {
            "delivery_status": status_update.delivery_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Order status updated successfully"}


# Admin Bookings
@api_router.get("/admin/bookings", response_model=List[Booking])
async def get_all_bookings(token_data: dict = Depends(verify_token)):
    bookings = await db.bookings.find({}, {"_id": 0}).sort("date", -1).to_list(1000)
    
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings


@api_router.put("/admin/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status_update: BookingStatusUpdate, token_data: dict = Depends(verify_token)):
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": status_update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": "Booking status updated successfully"}


# Admin Testimonials
@api_router.post("/admin/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate, token_data: dict = Depends(verify_token)):
    new_testimonial = Testimonial(**testimonial.model_dump())
    doc = new_testimonial.model_dump()
    doc['date'] = doc['date'].isoformat()
    
    await db.testimonials.insert_one(doc)
    return new_testimonial


@api_router.put("/admin/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, testimonial: TestimonialCreate, token_data: dict = Depends(verify_token)):
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": testimonial.model_dump()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    return {"message": "Testimonial updated successfully"}


@api_router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, token_data: dict = Depends(verify_token)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}


# Admin Settings
@api_router.put("/admin/settings")
async def update_settings(settings_update: SettingsUpdate, token_data: dict = Depends(verify_token)):
    update_data = {k: v for k, v in settings_update.model_dump().items() if v is not None}
    
    await db.settings.update_one(
        {"id": "settings"},
        {"$set": update_data},
        upsert=True
    )
    
    return {"message": "Settings updated successfully"}


# Admin Dashboard Stats
@api_router.get("/admin/dashboard/stats")
async def get_dashboard_stats(token_data: dict = Depends(verify_token)):
    total_products = await db.products.count_documents({})
    total_orders = await db.orders.count_documents({})
    total_bookings = await db.bookings.count_documents({})
    pending_orders = await db.orders.count_documents({"delivery_status": OrderStatus.PENDING})
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_bookings": total_bookings,
        "pending_orders": pending_orders
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    await initialize_admin()
    await initialize_settings()
    logger.info("Welcome Bells API started successfully")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
