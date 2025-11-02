from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from pydantic import BaseModel

class Script(Base):
    __tablename__ = "scripts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    prompt = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class ScriptCreate(BaseModel):
    prompt: str
    title: str | None = None

class ScriptResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    prompt: str | None
    created_at: str
    
    class Config:
        from_attributes = True
