from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="APPLICANT") # APPLICANT | ADMIN
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("ApplicantProfile", back_populates="user", uselist=False)
    business = relationship("Business", back_populates="user", uselist=False)
    applications = relationship("LoanApplication", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class ApplicantProfile(Base):
    __tablename__ = "applicant_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    father_name = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    mobile = Column(String, nullable=True)
    address = Column(String, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    pincode = Column(String, nullable=True)

    user = relationship("User", back_populates="profile")

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String, nullable=True)
    type = Column(String, nullable=True)
    address = Column(String, nullable=True)
    vintage = Column(String, nullable=True)
    annual_turnover = Column(Float, nullable=True)
    monthly_income = Column(Float, nullable=True)
    employees = Column(Integer, default=1)
    gst_status = Column(String, default="Unregistered")
    udyam_status = Column(String, default="Pending")

    user = relationship("User", back_populates="business")

class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(String, primary_key=True, index=True) # e.g. JLS-MUDRA-2026-08421
    user_id = Column(Integer, ForeignKey("users.id"))
    scheme_id = Column(String, nullable=False) # MUDRA | PMFME | PMEGP | CMEGP
    loan_amount = Column(Float, nullable=False)
    tenure_months = Column(Integer, default=36)
    purpose = Column(String, nullable=True)
    estimated_emi = Column(Float, nullable=True)
    status = Column(String, default="Under Review") # Under Review | Approved | Disbursed | Rejected
    submission_date = Column(String, nullable=True)
    last_updated = Column(String, nullable=True)
    transaction_ref = Column(String, nullable=True)

    user = relationship("User", back_populates="applications")
    documents = relationship("Document", back_populates="application")

class IdentityVerification(Base):
    __tablename__ = "identity_verifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    aadhaar_number = Column(String, nullable=True)
    aadhaar_verified = Column(Boolean, default=False)
    pan_number = Column(String, nullable=True)
    pan_verified = Column(Boolean, default=False)

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("loan_applications.id"))
    doc_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    file_name = Column(String, nullable=True)
    file_path = Column(String, nullable=True)
    file_size = Column(String, nullable=True)
    status = Column(String, default="Verified") # Verified | Needs Review | Missing
    ai_remark = Column(String, nullable=True)

    application = relationship("LoanApplication", back_populates="documents")

class EligibilityAssessment(Base):
    __tablename__ = "eligibility_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer, default=84)
    status = Column(String, default="LIKELY ELIGIBLE")
    recommended_scheme = Column(String, default="MUDRA")
    reasons_json = Column(Text, nullable=True)

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(String, ForeignKey("loan_applications.id"))
    risk_score = Column(Integer, default=78)
    risk_grade = Column(String, default="GOOD CREDITWORTHINESS")
    risk_level = Column(String, default="Low Risk")
    factors_json = Column(Text, nullable=True)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    app_id = Column(String, nullable=True)
    issue_type = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String, nullable=False)
    application_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)
