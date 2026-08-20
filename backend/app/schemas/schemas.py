from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "APPLICANT"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    email: str
    role: str

class EligibilityCheckRequest(BaseModel):
    full_name: str
    mobile: str
    age: int
    state: str
    district: str
    business_type: str
    business_name: str
    business_vintage: str
    annual_turnover: float
    monthly_income: float
    existing_loan: str
    loan_amount: float
    loan_purpose: str
    selected_scheme: Optional[str] = "MUDRA"

class AadhaarVerifyRequest(BaseModel):
    aadhaar_number: str

class PANVerifyRequest(BaseModel):
    pan_number: str

class ProfileUpdateRequest(BaseModel):
    full_name: str
    father_name: str
    dob: str
    gender: str
    mobile: str
    email: str
    address: str
    state: str
    district: str
    pincode: str
    business_name: str
    business_type: str
    business_vintage: str
    business_address: str
    annual_turnover: str
    monthly_income: str
    employees: str
    gst_status: str
    udyam_status: str
    selected_scheme: str
    loan_amount: str
    repayment_tenure: str
    loan_purpose: str

class ApplicationCreateRequest(BaseModel):
    selected_scheme: str
    loan_amount: float
    tenure_months: int
    purpose: str
    full_name: str
    business_name: str

class GrievanceRequest(BaseModel):
    name: str
    app_id: Optional[str] = None
    issue_type: str
    message: str
