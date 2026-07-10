from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime
import zipfile
import io
import secrets
import string


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Generate a secure random slug for download URL (high entropy)
def generate_secure_slug():
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(32))

# Store the secure download slug
DOWNLOAD_SLUG = generate_secure_slug()
logger_setup = logging.getLogger(__name__)
logger_setup.info(f"Download slug generated: {DOWNLOAD_SLUG}")

@api_router.get("/download-info")
async def get_download_info():
    """Returns the secure download slug for the source code"""
    return {"slug": DOWNLOAD_SLUG}

@api_router.get("/download-source/{slug}")
async def download_source_code(slug: str):
    """Download the complete source code as a zip file"""
    # Verify the slug matches
    if slug != DOWNLOAD_SLUG:
        return {"error": "Invalid download link"}
    
    # Create a zip file in memory
    zip_buffer = io.BytesIO()
    
    # Directories to include
    frontend_dir = Path("/app/frontend")
    backend_dir = Path("/app/backend")
    
    # Files/folders to exclude
    exclude_patterns = {
        'node_modules', '.git', '__pycache__', '.metro-cache', 
        '.expo', '.cache', '*.pyc', '.env', 'dist', 'build'
    }
    
    def should_exclude(path: Path) -> bool:
        for pattern in exclude_patterns:
            if pattern.startswith('*'):
                if path.suffix == pattern[1:]:
                    return True
            elif pattern in path.parts:
                return True
        return False
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Add frontend files
        for file_path in frontend_dir.rglob('*'):
            if file_path.is_file() and not should_exclude(file_path):
                arcname = f"islamic-app/frontend/{file_path.relative_to(frontend_dir)}"
                try:
                    zip_file.write(file_path, arcname)
                except Exception as e:
                    logger.warning(f"Could not add {file_path}: {e}")
        
        # Add backend files
        for file_path in backend_dir.rglob('*'):
            if file_path.is_file() and not should_exclude(file_path):
                arcname = f"islamic-app/backend/{file_path.relative_to(backend_dir)}"
                try:
                    zip_file.write(file_path, arcname)
                except Exception as e:
                    logger.warning(f"Could not add {file_path}: {e}")
        
        # Add a README
        readme_content = """# Islamic App - Code Source

## Structure du projet

- `/frontend` - Application Expo React Native
- `/backend` - API FastAPI avec MongoDB

## Installation

### Frontend
```bash
cd frontend
yarn install
yarn start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

## Fonctionnalités

- Horaires de prière (GPS + sélection de ville)
- Lecture du Coran avec traduction
- Podcasts et histoires islamiques
- Calendrier islamique
- Hadiths du jour
- Multi-langue (FR, EN, AR)

Développé avec ❤️
"""
        zip_file.writestr("islamic-app/README.md", readme_content)
    
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=islamic-app-source.zip"
        }
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
