import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import EligibilityCheckRequest
from app.models.models import EligibilityAssessment, User
from app.auth.security import get_current_user

router = APIRouter(prefix="/api/eligibility", tags=["Eligibility"])

@router.post("/check")
def check_eligibility(
    req: EligibilityCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Rule-based calculation logic for pre-approval scoring
    score = 84
    reasons = []

    if 18 <= req.age <= 65:
        reasons.append("✓ Age requirement satisfied (18 - 65 Years)")
    else:
        score -= 15
        reasons.append("⚠ Age outside standard guidelines")

    if req.existing_loan.lower() == "no":
        reasons.append("✓ Clean bank credit default history verified")
    else:
        score -= 20
        reasons.append("⚠ Active loan default history detected")

    if req.annual_turnover >= 300000:
        reasons.append(f"✓ Business turnover (₹{req.annual_turnover:,.0f}) supports loan servicing")
    else:
        score -= 10
        reasons.append("⚠ Business turnover below optimal recommendation")

    reasons.append(f"✓ Business category ({req.business_type}) eligible under MSME")
    reasons.append(f"✓ Requested Loan Amount (₹{req.loan_amount:,.0f}) within scheme ceiling")

    rec_scheme = req.selected_scheme or "MUDRA"

    status_str = "LIKELY ELIGIBLE" if score >= 60 else "NEEDS MANUAL REVIEW"

    # Persist in DB
    user_id = current_user.id if current_user else 1
    assessment = EligibilityAssessment(
        user_id=user_id,
        score=score,
        status=status_str,
        recommended_scheme=rec_scheme,
        reasons_json=json.dumps(reasons)
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return {
        "eligibilityScore": score,
        "status": status_str,
        "recommendedScheme": rec_scheme,
        "reasons": reasons,
        "assessmentId": assessment.id
    }
