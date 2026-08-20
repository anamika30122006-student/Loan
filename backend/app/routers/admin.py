import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import LoanApplication, Notification, AuditLog, User
from app.auth.security import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

ADMIN_STATS_DATA = {
    "totalApplications": 12480,
    "pendingReview": 1284,
    "approved": 8920,
    "rejected": 624,
    "documentsPending": 1032,
    "totalDisbursedAmount": "₹446.2 Crore",
    "averageProcessingTime": "3.2 Days",
    "schemeBreakdown": [
        {"name": "MUDRA", "count": 6420, "amount": "₹248 Cr", "color": "#1e3a8a"},
        {"name": "PMEGP", "count": 2840, "amount": "₹120 Cr", "color": "#f97316"},
        {"name": "PMFME", "count": 1860, "amount": "₹54 Cr", "color": "#10b981"},
        {"name": "CMEGP", "count": 1360, "amount": "₹24.2 Cr", "color": "#8b5cf6"}
    ],
    "riskDistribution": [
        {"category": "Low Risk (75-100)", "percentage": 65, "count": 8112, "fill": "#10b981"},
        {"category": "Moderate Risk (50-74)", "percentage": 28, "count": 3494, "fill": "#f59e0b"},
        {"category": "High Risk (<50)", "percentage": 7, "count": 874, "fill": "#ef4444"}
    ],
    "monthlyTrends": [
        {"month": "Jan", "applications": 850, "approved": 680, "amount": 28},
        {"month": "Feb", "applications": 940, "approved": 750, "amount": 32},
        {"month": "Mar", "applications": 1120, "approved": 910, "amount": 41},
        {"month": "Apr", "applications": 1050, "approved": 840, "amount": 38},
        {"month": "May", "applications": 1300, "approved": 1080, "amount": 48},
        {"month": "Jun", "applications": 1480, "approved": 1210, "amount": 56},
        {"month": "Jul", "applications": 1620, "approved": 1350, "amount": 62},
        {"month": "Aug", "applications": 1750, "approved": 1420, "amount": 68}
    ]
}

@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)):
    # Fetch recent DB applications
    db_apps = db.query(LoanApplication).all()
    recent = []

    for app in db_apps:
        user = db.query(User).filter(User.id == app.user_id).first()
        recent.append({
            "id": app.id,
            "applicant": user.full_name if user else "Rahul Kumar",
            "business": "Shree General Store",
            "scheme": app.scheme_id,
            "amount": f"₹{app.loan_amount:,.0f}",
            "riskScore": 78,
            "status": app.status,
            "date": app.submission_date or "19 Aug 2026",
            "state": "Jharkhand",
            "district": "Ranchi"
        })

    if not recent:
        recent = [
            {
                "id": "JLS-MUDRA-2026-08421",
                "applicant": "Rahul Kumar",
                "business": "Shree General Store",
                "scheme": "MUDRA",
                "amount": "₹5,00,000",
                "riskScore": 78,
                "status": "Under Review",
                "date": "19 Aug 2026",
                "state": "Jharkhand",
                "district": "Ranchi"
            },
            {
                "id": "JLS-PMFME-2026-07912",
                "applicant": "Sunita Devi",
                "business": "Maheshwari Pickle & Spices",
                "scheme": "PMFME",
                "amount": "₹7,50,000",
                "riskScore": 86,
                "status": "Approved",
                "date": "19 Aug 2026",
                "state": "Bihar",
                "district": "Patna"
            }
        ]

    stats = ADMIN_STATS_DATA.copy()
    stats["recentApplications"] = recent
    return stats

@router.post("/applications/{app_id}/approve")
def approve_application(app_id: str, db: Session = Depends(get_db)):
    app = db.query(LoanApplication).filter(LoanApplication.id == app_id).first()
    now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")

    if app:
        app.status = "Approved"
        app.last_updated = now_str
        user_id = app.user_id
    else:
        user_id = 1

    # Add notification for applicant
    notif = Notification(
        user_id=user_id,
        title="🎉 Loan Application Approved!",
        message=f"Your loan application {app_id} has been approved by the Nodal Bank Officer."
    )
    db.add(notif)

    # Log Audit Trail
    audit = AuditLog(
        user_id=user_id,
        action="Application Approved by Bank Nodal Officer",
        application_id=app_id,
        details="In-Principle Sanction Letter Issued"
    )
    db.add(audit)
    db.commit()

    return {"status": "SUCCESS", "currentStatus": "Approved", "lastUpdated": now_str}

@router.post("/applications/{app_id}/disburse")
def disburse_application(app_id: str, db: Session = Depends(get_db)):
    app = db.query(LoanApplication).filter(LoanApplication.id == app_id).first()
    now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")
    txn_ref = "TXN-" + str(random.randint(100000000, 999999999))

    if app:
        app.status = "Disbursed"
        app.last_updated = now_str
        app.transaction_ref = txn_ref
        user_id = app.user_id
    else:
        user_id = 1

    # Add notification for applicant
    notif = Notification(
        user_id=user_id,
        title="💰 Loan Disbursed to Bank Account!",
        message=f"Loan amount for {app_id} has been transferred. Transaction Ref: {txn_ref}"
    )
    db.add(notif)

    # Log Audit Trail
    audit = AuditLog(
        user_id=user_id,
        action="Loan Amount Disbursed via NEFT",
        application_id=app_id,
        details=f"Txn Ref: {txn_ref}"
    )
    db.add(audit)
    db.commit()

    return {
        "status": "SUCCESS",
        "currentStatus": "Disbursed",
        "lastUpdated": now_str,
        "transactionRef": txn_ref
    }
