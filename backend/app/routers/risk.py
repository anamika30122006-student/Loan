import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import RiskAssessment

router = APIRouter(prefix="/api/risk", tags=["Risk Assessment"])

@router.get("/assess")
@router.post("/assess")
def assess_risk(app_id: str = "JLS-MUDRA-2026-08421", db: Session = Depends(get_db)):
    score_factors = [
        {"name": "Transaction History", "score": 85, "status": "Verified"},
        {"name": "Business Stability", "score": 78, "status": "Verified"},
        {"name": "Repayment Capacity", "score": 80, "status": "Verified"},
        {"name": "Utility Payments", "score": 72, "status": "Verified"},
        {"name": "Business Experience", "score": 88, "status": "Verified"},
        {"name": "Digital Footprint", "score": 74, "status": "Verified"}
    ]

    # Save or update risk record in DB
    existing = db.query(RiskAssessment).filter(RiskAssessment.application_id == app_id).first()
    if not existing:
        existing = RiskAssessment(
            application_id=app_id,
            risk_score=78,
            risk_grade="GOOD CREDITWORTHINESS",
            risk_level="Low Risk",
            factors_json=json.dumps(score_factors)
        )
        db.add(existing)
        db.commit()

    return {
        "riskScore": 78,
        "riskGrade": "GOOD CREDITWORTHINESS",
        "riskLevel": "Low Risk",
        "recommendedAmount": "₹5,00,000",
        "recommendedScheme": "MUDRA",
        "sanctionProbability": "94.8%",
        "scoreFactors": scoreFactors
    }
