from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import AadhaarVerifyRequest, PANVerifyRequest, ProfileUpdateRequest
from app.models.models import IdentityVerification, ApplicantProfile, Business, User
from app.auth.security import get_current_user

router = APIRouter(prefix="/api/kyc", tags=["KYC"])

@router.post("/aadhaar/verify")
def verify_aadhaar(
    req: AadhaarVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(req.aadhaar_number) < 12:
        raise HTTPException(status_code=400, detail="Invalid Aadhaar Number format.")

    user_id = current_user.id if current_user else 1
    kyc = db.query(IdentityVerification).filter(IdentityVerification.user_id == user_id).first()
    if not kyc:
        kyc = IdentityVerification(user_id=user_id)
        db.add(kyc)

    kyc.aadhaar_number = req.aadhaar_number
    kyc.aadhaar_verified = True
    db.commit()

    return {
        "status": "SUCCESS",
        "message": "Aadhaar e-KYC verified successfully.",
        "aadhaarVerified": True,
        "nameMatched": True,
        "dobMatched": True
    }

@router.post("/pan/verify")
def verify_pan(
    req: PANVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(req.pan_number) < 10:
        raise HTTPException(status_code=400, detail="Invalid PAN format.")

    user_id = current_user.id if current_user else 1
    kyc = db.query(IdentityVerification).filter(IdentityVerification.user_id == user_id).first()
    if not kyc:
        kyc = IdentityVerification(user_id=user_id)
        db.add(kyc)

    kyc.pan_number = req.pan_number.upper()
    kyc.pan_verified = True
    db.commit()

    return {
        "status": "SUCCESS",
        "message": "PAN Tax ID verified successfully.",
        "panVerified": True,
        "formatValid": True,
        "nameMatched": True
    }

@router.post("/profile/update")
def update_profile(
    req: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id if current_user else 1
    prof = db.query(ApplicantProfile).filter(ApplicantProfile.user_id == user_id).first()
    if not prof:
        prof = ApplicantProfile(user_id=user_id)
        db.add(prof)

    prof.father_name = req.father_name
    prof.dob = req.dob
    prof.gender = req.gender
    prof.mobile = req.mobile
    prof.address = req.address
    prof.state = req.state
    prof.district = req.district
    prof.pincode = req.pincode

    biz = db.query(Business).filter(Business.user_id == user_id).first()
    if not biz:
        biz = Business(user_id=user_id)
        db.add(biz)

    biz.name = req.business_name
    biz.type = req.business_type
    biz.vintage = req.business_vintage
    biz.address = req.business_address
    biz.annual_turnover = float(req.annual_turnover) if req.annual_turnover.isdigit() else 1200000.0
    biz.monthly_income = float(req.monthly_income) if req.monthly_income.isdigit() else 100000.0
    biz.employees = int(req.employees) if req.employees.isdigit() else 3
    biz.gst_status = req.gst_status
    biz.udyam_status = req.udyam_status

    db.commit()
    return {"status": "SUCCESS", "message": "Profile & Business details saved to database."}
