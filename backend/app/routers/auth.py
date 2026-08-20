from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, ApplicantProfile, Business
from app.schemas.schemas import UserCreate, UserLogin, TokenResponse
from app.auth.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        role=user_in.role or "APPLICANT"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize Profile & Business
    profile = ApplicantProfile(user_id=new_user.id)
    business = Business(user_id=new_user.id)
    db.add(profile)
    db.add(business)
    db.commit()

    token = create_access_token({"sub": new_user.email, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "role": new_user.role
    }

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role
    }
