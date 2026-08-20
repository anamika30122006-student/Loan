import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import ApplicationCreateRequest
from app.models.models import LoanApplication, User, Notification, AuditLog
from app.auth.security import get_current_user

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.post("/submit")
def submit_application(
    req: ApplicationCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id if current_user else 1
    random_code = random.randint(10000, 90000)
    app_id = f"JLS-{req.selected_scheme.upper()}-2026-{random_code}"
    submit_date = datetime.now().strftime("%d %b %Y, %I:%M %p")

    # Calculate EMI
    principal = req.loan_amount
    monthly_rate = 0.095 / 12
    months = req.tenure_months or 36
    emi = round((principal * monthly_rate * ((1 + monthly_rate)**months)) / (((1 + monthly_rate)**months) - 1))

    application = LoanApplication(
        id=app_id,
        user_id=user_id,
        scheme_id=req.selected_scheme,
        loan_amount=req.loan_amount,
        tenure_months=months,
        purpose=req.purpose,
        estimated_emi=emi,
        status="Under Review",
        submission_date=submit_date,
        last_updated=submit_date
    )
    db.add(application)

    # Add notification for user
    notif = Notification(
        user_id=user_id,
        title="Application Submitted Successfully",
        message=f"Your loan application {app_id} for {req.selected_scheme} (₹{req.loan_amount:,.0f}) is now Under Review."
    )
    db.add(notif)

    # Log Audit Trail
    audit = AuditLog(
        user_id=user_id,
        action="Application Created & Submitted",
        application_id=app_id,
        details=f"Scheme: {req.selected_scheme}, Amount: ₹{req.loan_amount:,.0f}"
    )
    db.add(audit)

    db.commit()

    return {
        "status": "SUCCESS",
        "applicationId": app_id,
        "submissionDate": submit_date,
        "estimatedEmi": emi,
        "currentStatus": "Under Review"
    }

@router.get("/{app_id}")
def get_application_by_id(app_id: str, db: Session = Depends(get_db)):
    app = db.query(LoanApplication).filter(LoanApplication.id == app_id).first()
    if not app:
        # Fallback to default demo application
        return {
            "applicationId": "JLS-MUDRA-2026-08421",
            "selectedScheme": "MUDRA",
            "loanAmount": 500000.0,
            "tenureMonths": 36,
            "purpose": "Business Expansion & Stocking",
            "estimatedEmi": 16209,
            "currentStatus": "Under Review",
            "submissionDate": "19 Aug 2026, 10:30 AM",
            "lastUpdated": "19 Aug 2026, 02:15 PM",
            "transactionRef": "TXN-984729184"
        }

    return {
        "applicationId": app.id,
        "selectedScheme": app.scheme_id,
        "loanAmount": app.loan_amount,
        "tenureMonths": app.tenure_months,
        "purpose": app.purpose,
        "estimatedEmi": app.estimated_emi,
        "currentStatus": app.status,
        "submissionDate": app.submission_date,
        "lastUpdated": app.last_updated,
        "transactionRef": app.transaction_ref
    }
