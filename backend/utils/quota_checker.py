from datetime import date
from sqlalchemy.orm import Session
from models.user import User

def check_and_update_quota(user: User, db: Session) -> bool:
    """Check if user has quota remaining and update it"""
    today = date.today()
    
    # Reset quota if it's a new day
    if user.last_quota_reset != today:
        user.quota_used = 0
        user.last_quota_reset = today
        db.commit()
    
    # Check if user has quota remaining
    if user.quota_used >= user.daily_quota:
        return False
    
    # Update quota
    user.quota_used += 1
    db.commit()
    
    return True

def get_remaining_quota(user: User) -> int:
    """Get remaining quota for user"""
    today = date.today()
    
    # Reset quota if it's a new day
    if user.last_quota_reset != today:
        return user.daily_quota
    
    return user.daily_quota - user.quota_used
