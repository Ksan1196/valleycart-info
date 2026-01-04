from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import base64
from PIL import Image
from io import BytesIO

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user: AdminUser

class PageContentSection(BaseModel):
    section_id: str
    title: str
    content: str
    image_url: Optional[str] = None
    order: int = 0

class PageContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_name: str
    sections: List[PageContentSection]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PageContentUpdate(BaseModel):
    sections: List[PageContentSection]

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ImageUploadResponse(BaseModel):
    url: str

# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_jwt_token(user_id: str, email: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.admin_users.find_one({'id': payload['user_id']}, {'_id': 0, 'password_hash': 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Initialize default admin and content
async def initialize_data():
    # Check if admin exists
    admin_exists = await db.admin_users.find_one({'email': 'admin@valleycart.com'}, {'_id': 1})
    if not admin_exists:
        admin = AdminUser(
            email='admin@valleycart.com',
            name='Admin User'
        )
        admin_dict = admin.model_dump()
        admin_dict['password_hash'] = get_password_hash('admin123')
        admin_dict['created_at'] = admin_dict['created_at'].isoformat()
        await db.admin_users.insert_one(admin_dict)
        logger.info('Default admin created: admin@valleycart.com / admin123')
    
    # Initialize default page content
    pages_data = {
        'home': [
            {'section_id': 'hero', 'title': 'Valleycart Organics Private Limited', 'content': 'Organic Medicinal Mushrooms & Himalayan Natural Products', 'order': 0},
            {'section_id': 'intro', 'title': 'About Our Company', 'content': 'Valleycart Organics Private Limited is an Indian organic agribusiness company specializing in medicinal mushroom cultivation, Himalayan organic produce, and sustainable farming solutions.', 'order': 1},
            {'section_id': 'feature1', 'title': '100% Organic & Chemical-Free', 'content': 'All our products are grown using 100% organic methods without any synthetic chemicals or pesticides.', 'order': 2},
            {'section_id': 'feature2', 'title': 'Research-Backed Cultivation', 'content': 'Our cultivation methods are based on scientific research and controlled-environment farming techniques.', 'order': 3},
            {'section_id': 'feature3', 'title': 'Women-Led Rural Empowerment', 'content': 'We empower women farmers and self-help groups through training and guaranteed buy-back programs.', 'order': 4},
            {'section_id': 'feature4', 'title': 'Traceable Himalayan Sourcing', 'content': 'Complete traceability from farm to market, ensuring authenticity and quality.', 'order': 5},
            {'section_id': 'feature5', 'title': 'Sustainable & Scalable Farming Models', 'content': 'Environmentally responsible farming practices that can be scaled across communities.', 'order': 6},
        ],
        'about': [
            {'section_id': 'intro', 'title': 'About Valleycart Organics Private Limited', 'content': 'Valleycart Organics Private Limited is committed to building a sustainable organic agriculture ecosystem in India, with a strong focus on medicinal mushrooms and natural wellness products.', 'order': 0},
            {'section_id': 'story', 'title': 'Our Story', 'content': 'Inspired by the Himalayan region, we integrate traditional agricultural knowledge with modern controlled-environment farming to ensure purity, nutritional value, and consistency.', 'order': 1},
            {'section_id': 'mission', 'title': 'Mission', 'content': 'To produce high-quality organic and medicinal products while empowering rural communities through science-driven, sustainable agriculture.', 'order': 2},
            {'section_id': 'vision', 'title': 'Vision', 'content': 'To become a globally trusted supplier of Himalayan organic and medicinal produce, known for quality, transparency, and social impact.', 'order': 3},
        ],
        'research': [
            {'section_id': 'intro', 'title': 'Research-Driven Medicinal Mushroom Cultivation', 'content': 'Research and innovation form the backbone of Valleycart Organics.', 'order': 0},
            {'section_id': 'focus1', 'title': 'Controlled-Environment Cultivation', 'content': 'Advanced controlled-environment medicinal mushroom cultivation techniques.', 'order': 1},
            {'section_id': 'focus2', 'title': 'Quality Optimization', 'content': 'Organic yield and quality optimization through scientific methods.', 'order': 2},
            {'section_id': 'focus3', 'title': 'Nutritional Enhancement', 'content': 'Nutritional enhancement techniques to maximize health benefits.', 'order': 3},
            {'section_id': 'focus4', 'title': 'Standardized Protocols', 'content': 'Standardized organic farming protocols for consistent quality.', 'order': 4},
            {'section_id': 'focus5', 'title': 'Scalable Models', 'content': 'Scalable cultivation models for small growers and communities.', 'order': 5},
        ],
        'impact': [
            {'section_id': 'intro', 'title': 'Women Empowerment & Rural Impact', 'content': 'Social impact is at the core of Valleycart Organics.', 'order': 0},
            {'section_id': 'collaboration', 'title': 'SHG Collaboration', 'content': 'We actively collaborate with women-driven self-help groups (SHGs) and rural farmers to promote sustainable income generation.', 'order': 1},
            {'section_id': 'initiative1', 'title': 'Training Programs', 'content': 'Training women in medicinal mushroom cultivation techniques.', 'order': 2},
            {'section_id': 'initiative2', 'title': 'Technical Support', 'content': 'Providing organic raw materials and technical support to farmers.', 'order': 3},
            {'section_id': 'initiative3', 'title': 'Technology Transfer', 'content': 'Introducing improved cultivation technologies to rural communities.', 'order': 4},
            {'section_id': 'initiative4', 'title': 'Guaranteed Buy-Back', 'content': 'Guaranteed buy-back of produce ensuring stable income for farmers.', 'order': 5},
        ],
        'sustainability': [
            {'section_id': 'intro', 'title': 'Sustainable Himalayan Organic Farming', 'content': 'Valleycart Organics follows environmentally responsible farming practices inspired by the fragile Himalayan ecosystem.', 'order': 0},
            {'section_id': 'principle1', 'title': '100% Organic Inputs', 'content': 'Only certified organic inputs used in all farming operations.', 'order': 1},
            {'section_id': 'principle2', 'title': 'No Synthetic Chemicals', 'content': 'Zero synthetic chemicals or pesticides in our farming process.', 'order': 2},
            {'section_id': 'principle3', 'title': 'Biodiversity Conservation', 'content': 'Soil and biodiversity conservation through responsible farming.', 'order': 3},
            {'section_id': 'principle4', 'title': 'Low-Impact Farming', 'content': 'Low-impact, eco-friendly farming methods that preserve nature.', 'order': 4},
            {'section_id': 'principle5', 'title': 'Complete Traceability', 'content': 'Complete traceability from farm to market ensuring transparency.', 'order': 5},
        ],
        'brands': [
            {'section_id': 'intro', 'title': 'Our Brand – The Pahadi Bro', 'content': 'The Pahadi Bro is a consumer brand by Valleycart Organics that delivers authentic Himalayan organic products to modern markets.', 'order': 0},
            {'section_id': 'value1', 'title': 'Pure Sourcing', 'content': 'Pure and responsibly sourced natural products from the Himalayas.', 'order': 1},
            {'section_id': 'value2', 'title': 'Traditional Wisdom', 'content': 'Traditional Himalayan wisdom combined with modern practices.', 'order': 2},
            {'section_id': 'value3', 'title': 'Quality Standards', 'content': 'Modern quality and safety standards for consumer trust.', 'order': 3},
        ]
    }
    
    for page_name, sections in pages_data.items():
        existing = await db.page_contents.find_one({'page_name': page_name})
        if not existing:
            page_content = PageContent(
                page_name=page_name,
                sections=[PageContentSection(**section) for section in sections]
            )
            doc = page_content.model_dump()
            doc['updated_at'] = doc['updated_at'].isoformat()
            await db.page_contents.insert_one(doc)
            logger.info(f'Default content created for page: {page_name}')

# Auth endpoints
@api_router.post('/auth/register', response_model=AdminUser)
async def register_admin(user_data: AdminUserCreate):
    existing = await db.admin_users.find_one({'email': user_data.email}, {'_id': 1})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    
    admin = AdminUser(email=user_data.email, name=user_data.name)
    admin_dict = admin.model_dump()
    admin_dict['password_hash'] = get_password_hash(user_data.password)
    admin_dict['created_at'] = admin_dict['created_at'].isoformat()
    
    await db.admin_users.insert_one(admin_dict)
    return admin

@api_router.post('/auth/login', response_model=TokenResponse)
async def login_admin(credentials: AdminLogin):
    user = await db.admin_users.find_one({'email': credentials.email})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    
    token = create_jwt_token(user['id'], user['email'])
    user_data = AdminUser(**{k: v for k, v in user.items() if k != 'password_hash'})
    return TokenResponse(token=token, user=user_data)

@api_router.get('/auth/me', response_model=AdminUser)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return AdminUser(**current_user)

# Content endpoints
@api_router.get('/content', response_model=List[PageContent])
async def get_all_content():
    contents = await db.page_contents.find({}, {'_id': 0}).limit(100).to_list(None)
    for content in contents:
        if isinstance(content.get('updated_at'), str):
            content['updated_at'] = datetime.fromisoformat(content['updated_at'])
    return contents

@api_router.get('/content/{page_name}', response_model=PageContent)
async def get_page_content(page_name: str):
    content = await db.page_contents.find_one({'page_name': page_name}, {'_id': 0})
    if not content:
        raise HTTPException(status_code=404, detail='Page content not found')
    if isinstance(content.get('updated_at'), str):
        content['updated_at'] = datetime.fromisoformat(content['updated_at'])
    return PageContent(**content)

@api_router.put('/content/{page_name}', response_model=PageContent)
async def update_page_content(page_name: str, update: PageContentUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.page_contents.find_one({'page_name': page_name}, {'_id': 0, 'id': 1})
    if not existing:
        raise HTTPException(status_code=404, detail='Page content not found')
    
    updated_content = PageContent(
        id=existing['id'],
        page_name=page_name,
        sections=update.sections
    )
    
    doc = updated_content.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.page_contents.update_one(
        {'page_name': page_name},
        {'$set': doc}
    )
    
    return updated_content

# Contact endpoints
@api_router.post('/contact', response_model=ContactSubmission)
async def submit_contact_form(submission: ContactSubmissionCreate):
    contact = ContactSubmission(**submission.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_submissions.insert_one(doc)
    return contact

@api_router.get('/contact', response_model=List[ContactSubmission])
async def get_contact_submissions(current_user: dict = Depends(get_current_user)):
    submissions = await db.contact_submissions.find({}, {'_id': 0}).sort('created_at', -1).limit(100).to_list(None)
    for submission in submissions:
        if isinstance(submission.get('created_at'), str):
            submission['created_at'] = datetime.fromisoformat(submission['created_at'])
    return submissions

# Image upload endpoint
@api_router.post('/upload', response_model=ImageUploadResponse)
async def upload_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail='File must be an image')
    
    # Read image
    contents = await file.read()
    img = Image.open(BytesIO(contents))
    
    # Resize if needed (max 1200px width)
    max_width = 1200
    if img.width > max_width:
        ratio = max_width / img.width
        new_size = (max_width, int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Convert to base64
    buffered = BytesIO()
    img_format = img.format or 'JPEG'
    img.save(buffered, format=img_format)
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    img_url = f"data:image/{img_format.lower()};base64,{img_base64}"
    
    return ImageUploadResponse(url=img_url)

# Include router
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
    await initialize_data()
    logger.info("Application started")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()