from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, date
from database import get_db
from models.user import User
from models.script import Script, ScriptCreate, ScriptResponse
from utils.jwt_handler import get_current_user
from utils.quota_checker import check_and_update_quota
from langgraph_flow import generate_script
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/generate", response_model=ScriptResponse)
async def create_script(
    script_data: ScriptCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new script using AI"""
    # Check quota
    if not check_and_update_quota(current_user, db):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Daily quota exceeded. Please try again tomorrow."
        )
    
    try:
        # Generate script using LangGraph
        result = await generate_script(script_data.prompt)
        
        if result.get("error"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate script: {result['error']}"
            )
        
        # Save to database
        title = script_data.title or f"Script - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        new_script = Script(
            user_id=current_user.id,
            title=title,
            content=result["script"],
            prompt=script_data.prompt
        )
        db.add(new_script)
        db.commit()
        db.refresh(new_script)
        
        return ScriptResponse(
            id=new_script.id,
            user_id=new_script.user_id,
            title=new_script.title,
            content=new_script.content,
            prompt=new_script.prompt,
            created_at=new_script.created_at.isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error generating script: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/", response_model=list[ScriptResponse])
def get_scripts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all scripts for the current user"""
    scripts = db.query(Script).filter(Script.user_id == current_user.id).order_by(Script.created_at.desc()).all()
    
    return [
        ScriptResponse(
            id=script.id,
            user_id=script.user_id,
            title=script.title,
            content=script.content,
            prompt=script.prompt,
            created_at=script.created_at.isoformat()
        )
        for script in scripts
    ]

@router.get("/{script_id}", response_model=ScriptResponse)
def get_script(
    script_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific script"""
    script = db.query(Script).filter(
        Script.id == script_id,
        Script.user_id == current_user.id
    ).first()
    
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Script not found"
        )
    
    return ScriptResponse(
        id=script.id,
        user_id=script.user_id,
        title=script.title,
        content=script.content,
        prompt=script.prompt,
        created_at=script.created_at.isoformat()
    )
