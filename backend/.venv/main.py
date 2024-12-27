from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId

# Initialize FastAPI
app = FastAPI()

# MongoDB Client setup
client = AsyncIOMotorClient("mongodb://localhost:27017")  # Adjust if using a cloud DB
db = client.wedding_planning  # Database name (adjust as needed)
bookings_collection = db["bookings"]  # Access the 'bookings' collection

# CORS middleware for frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify frontend URL here
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods like GET, POST, etc.
    allow_headers=["*"],  # Allows all headers
)

# Helper function to convert MongoDB _id to string id
def convert_id(data):
    if isinstance(data, dict) and "_id" in data:
        data["id"] = str(data["_id"])  # Add 'id' field
        del data["_id"]  # Remove MongoDB-specific '_id'
    return data

# Pydantic Models for the collections
class Booking(BaseModel):
    id: str
    customerName: str
    date: str
    venue: str
    services: List[str]

    class Config:
        json_encoders = {
            ObjectId: str  # Convert ObjectId to string when serializing
        }

class Vendor(BaseModel):
    name: str
    category: str
    contact: str
    availableDates: List[str]

class Client(BaseModel):
    name: str
    email: str
    phone: str
    address: str

class Service(BaseModel):
    name: str
    description: str
    price: float

# Routes for Bookings
@app.get("/api/bookings")
async def get_bookings():
    # Fetch all bookings (without pagination)
    bookings = await bookings_collection.find().to_list(100)  # Adjust the limit as needed
    return [convert_id(booking) for booking in bookings]

@app.post("/api/bookings", response_model=Booking)
async def create_booking(booking: Booking):
    booking_dict = booking.dict(exclude={"id"})  # Exclude id if provided
    booking_dict["_id"] = ObjectId()  # Generate MongoDB ObjectId

    # Insert into the database
    new_booking = await bookings_collection.insert_one(booking_dict)
    created_booking = await bookings_collection.find_one({"_id": new_booking.inserted_id})
    
    return convert_id(created_booking)

@app.delete("/api/bookings/{booking_id}")
async def delete_booking(booking_id: str):
    # Convert the string booking_id to ObjectId
    try:
        booking_id_obj = ObjectId(booking_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = await bookings_collection.delete_one({"_id": booking_id_obj})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking deleted successfully"}

@app.put("/api/bookings/{booking_id}", response_model=Booking)
async def update_booking(booking_id: str, booking: Booking):
    # Convert string ID to ObjectId
    try:
        booking_id_obj = ObjectId(booking_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    # Perform the update
    updated_booking = await bookings_collection.find_one_and_update(
        {"_id": booking_id_obj},
        {"$set": booking.dict(exclude={"id"})},  # Exclude immutable fields
        return_document=True
    )

    if not updated_booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Convert _id to string before returning
    updated_booking["id"] = str(updated_booking["_id"])
    return updated_booking

# Routes for Vendors
@app.get("/api/vendors", response_model=List[Vendor])
async def get_vendors():
    vendors_collection = db.vendors
    vendors = await vendors_collection.find().to_list(100)
    # Convert _id to id for each vendor
    return [convert_id(vendor) for vendor in vendors]

@app.post("/api/vendors", response_model=Vendor)
async def create_vendor(vendor: Vendor):
    vendors_collection = db.vendors
    new_vendor = await vendors_collection.insert_one(vendor.dict())
    created_vendor = await vendors_collection.find_one({"_id": new_vendor.inserted_id})
    return convert_id(created_vendor)

# Routes for Clients
@app.get("/api/clients", response_model=List[Client])
async def get_clients():
    clients_collection = db.clients
    clients = await clients_collection.find().to_list(100)
    # Convert _id to id for each client
    return [convert_id(client) for client in clients]

@app.post("/api/clients", response_model=Client)
async def create_client(client: Client):
    clients_collection = db.clients
    new_client = await clients_collection.insert_one(client.dict())
    created_client = await clients_collection.find_one({"_id": new_client.inserted_id})
    return convert_id(created_client)

# Routes for Services
@app.get("/api/services", response_model=List[Service])
async def get_services():
    services_collection = db.services
    services = await services_collection.find().to_list(100)
    # Convert _id to id for each service
    return [convert_id(service) for service in services]

@app.post("/api/services", response_model=Service)
async def create_service(service: Service):
    services_collection = db.services
    new_service = await services_collection.insert_one(service.dict())
    created_service = await services_collection.find_one({"_id": new_service.inserted_id})
    return convert_id(created_service)
