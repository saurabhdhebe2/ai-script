from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.sql import func
from database import Base
from pydantic import BaseModel, EmailStr

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    daily_quota = Column(Integer, default=5)
    quota_used = Column(Integer, default=0)
    last_quota_reset = Column(Date, server_default=func.current_date())

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str | None
    daily_quota: int
    quota_used: int
    
    class Config:
        from_attributes = True
