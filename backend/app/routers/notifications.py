from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Notification, Feedback, User
from app.schemas.schemas import GrievanceRequest
from app.auth.security import get_current_user

router = APIRouter(prefix="/api", tags=["Notifications & Grievance"])

@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id if current_user else 1
    notifs = db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    if not notifs:
        return [
            {
                "id": 1,
                "title": "Welcome to JanDhan LoanSaathi",
                "message": "Explore government-backed loan schemes and check eligibility with AI.",
                "is_read": False,
                "created_at": "Just now"
            }
        ]

    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at.strftime("%d %b, %H:%M")
        } for n in notifs
    ]

@router.post("/grievance")
def submit_grievance(
    req: GrievanceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    feedback = Feedback(
        user_id=user_id,
        name=req.name,
        app_id=req.app_id,
        issue_type=req.issue_type,
        message=req.message
    )
    db.add(feedback)
    db.commit()

    return {
        "status": "SUCCESS",
        "ticketId": f"TKT-{feedback.id:06d}",
        "message": "Support ticket created successfully. District Resource Person will contact you."
    }
