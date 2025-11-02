from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, scripts
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Script Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(scripts.router, prefix="/api/scripts", tags=["scripts"])

@app.get("/")
def read_root():
    return {"message": "AI Script Generator API"}
