#!/usr/bin/env python3
"""Seed script to populate the database with sample data"""
import asyncio
import sys
sys.path.insert(0, '/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'test_database')

async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌱 Starting database seeding...")
    
    # Sample Products
    products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Premium Trousseau Box",
            "category": "trousseau_packing",
            "description": "Elegant trousseau packing with gold accents and premium silk wrapping. Perfect for traditional weddings.",
            "price": 2500.00,
            "images": [],
            "stock": 15,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Traditional Seer Varisai Set",
            "category": "seer_varisai_plates",
            "description": "Complete seer varisai plate set with traditional items beautifully arranged for auspicious occasions.",
            "price": 3500.00,
            "images": [],
            "stock": 10,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Luxury Gift Hamper",
            "category": "gift_hampers",
            "description": "Curated luxury hamper with dry fruits, chocolates, and premium gifts. Perfect for corporate gifting.",
            "price": 1800.00,
            "images": [],
            "stock": 25,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Rose & Lily Bouquet",
            "category": "bouquets",
            "description": "Fresh roses and lilies arranged in elegant wrapping. Perfect for special occasions.",
            "price": 1200.00,
            "images": [],
            "stock": 20,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Premium Return Gift Box",
            "category": "return_gifts",
            "description": "Elegant return gift boxes with personalized chocolates and mini gifts for wedding guests.",
            "price": 150.00,
            "images": [],
            "stock": 100,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Deluxe Trousseau Collection",
            "category": "trousseau_packing",
            "description": "Complete trousseau packing service with multiple boxes and premium decorations.",
            "price": 5500.00,
            "images": [],
            "stock": 8,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Festival Gift Hamper",
            "category": "gift_hampers",
            "description": "Special festival hamper with traditional sweets, dry fruits, and decorative items.",
            "price": 1500.00,
            "images": [],
            "stock": 30,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Mixed Flower Bouquet",
            "category": "bouquets",
            "description": "Beautiful mixed flower arrangement with seasonal blooms and greenery.",
            "price": 800.00,
            "images": [],
            "stock": 15,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    
    # Clear existing products
    await db.products.delete_many({})
    await db.products.insert_many(products)
    print(f"✅ Added {len(products)} products")
    
    # Sample Testimonials
    testimonials = [
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Priya Sharma",
            "rating": 5,
            "review": "Absolutely loved the trousseau packing! The attention to detail was incredible. Highly recommend Welcome Bells for all your gifting needs.",
            "date": datetime.now(timezone.utc).isoformat(),
            "approved": True
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Rajesh Kumar",
            "rating": 5,
            "review": "The seer varisai plates were beautifully arranged. Our family was so impressed with the traditional presentation. Thank you!",
            "date": datetime.now(timezone.utc).isoformat(),
            "approved": True
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Anita Desai",
            "rating": 5,
            "review": "Best gift hampers in Chennai! The quality and presentation exceeded our expectations. Will definitely order again.",
            "date": datetime.now(timezone.utc).isoformat(),
            "approved": True
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Vikram Patel",
            "rating": 4,
            "review": "Great service and beautiful bouquets. The flowers were fresh and lasted for days. Very satisfied!",
            "date": datetime.now(timezone.utc).isoformat(),
            "approved": True
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Meera Iyer",
            "rating": 5,
            "review": "The return gifts for our wedding were perfect! All our guests loved them. Thank you Welcome Bells for making our day special!",
            "date": datetime.now(timezone.utc).isoformat(),
            "approved": True
        },
    ]
    
    # Clear existing testimonials
    await db.testimonials.delete_many({})
    await db.testimonials.insert_many(testimonials)
    print(f"✅ Added {len(testimonials)} testimonials")
    
    # Sample Gallery Items (placeholder - admin can upload real images later)
    gallery = [
        {
            "id": str(uuid.uuid4()),
            "type": "image",
            "url": "https://placeholder-url.com/gallery1.jpg",
            "category": "trousseau_packing",
            "title": "Elegant Trousseau Setup",
            "uploaded_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "type": "image",
            "url": "https://placeholder-url.com/gallery2.jpg",
            "category": "gift_hampers",
            "title": "Premium Gift Hamper",
            "uploaded_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "type": "video",
            "url": "https://placeholder-url.com/video1.mp4",
            "category": "bouquets",
            "title": "Bouquet Showcase",
            "uploaded_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    
    # Clear existing gallery
    await db.gallery.delete_many({})
    await db.gallery.insert_many(gallery)
    print(f"✅ Added {len(gallery)} gallery items")
    
    print("\n🎉 Database seeding completed successfully!")
    print("\n📊 Summary:")
    print(f"   • Products: {len(products)}")
    print(f"   • Testimonials: {len(testimonials)}")
    print(f"   • Gallery Items: {len(gallery)}")
    print("\n✨ Your Welcome Bells website is ready to use!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
