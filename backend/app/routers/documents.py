import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import UPLOAD_DIR
from app.models.models import Document, User
from app.auth.security import get_current_user

router = APIRouter(prefix="/api/documents", tags=["Documents"])

DEFAULT_DOCS_LIST = [
  {
    "id": "aadhaar",
    "name": "Aadhaar Card",
    "description": "Front & Back clear copy of Aadhaar Card",
    "category": "Identity Proof",
    "status": "Verified",
    "fileName": "aadhaar_rahul_kumar_front_back.pdf",
    "fileSize": "1.2 MB",
    "confidence": "99%",
    "aiRemark": "Aadhaar number and photo cleanly validated with UIDAI demo vault."
  },
  {
    "id": "pan",
    "name": "PAN Card",
    "description": "Permanent Account Number Card copy",
    "category": "Tax ID",
    "status": "Verified",
    "fileName": "pan_card_rahul.pdf",
    "fileSize": "840 KB",
    "confidence": "98%",
    "aiRemark": "PAN format ABCPK9876F active & matched with IT database."
  },
  {
    "id": "bank_statement",
    "name": "Bank Statement",
    "description": "Last 6 Months Savings/Current Account statement",
    "category": "Financial Proof",
    "status": "Verified",
    "fileName": "sbi_bank_statement_6m.pdf",
    "fileSize": "3.4 MB",
    "confidence": "95%",
    "aiRemark": "Bank statement successfully detected, 6-month average balance ₹84,200."
  },
  {
    "id": "udyam",
    "name": "Udyam Registration",
    "description": "Ministry of MSME Udyam Certificate",
    "category": "Business Registration",
    "status": "Verified",
    "fileName": "udyam_registration_certificate.pdf",
    "fileSize": "910 KB",
    "confidence": "96%",
    "aiRemark": "Udyam ID UDYAM-JH-01-008742 verified against MSME Portal."
  },
  {
    "id": "gst",
    "name": "GST Certificate",
    "description": "GST Registration & latest 3B return file",
    "category": "Tax Proof",
    "status": "Needs Review",
    "fileName": "gst_certificate_2026.pdf",
    "fileSize": "1.8 MB",
    "confidence": "88%",
    "aiRemark": "GST certificate uploaded requires minor manual check on filing frequency."
  },
  {
    "id": "business_proof",
    "name": "Business Proof",
    "description": "Shop Establishment License or Commercial Electricity Bill",
    "category": "Establishment Proof",
    "status": "Verified",
    "fileName": "shop_license_ranchi_mc.pdf",
    "fileSize": "1.5 MB",
    "confidence": "94%",
    "aiRemark": "Ranchi Municipal Trade License valid till March 2027."
  },
  {
    "id": "income_proof",
    "name": "Income Proof / ITR",
    "description": "Income Tax Return or Sales Register extract",
    "category": "Financial Proof",
    "status": "Verified",
    "fileName": "itr_ack_ay2025_26.pdf",
    "fileSize": "1.1 MB",
    "confidence": "97%",
    "aiRemark": "ITR V filed with declared gross receipts ₹12.4 Lakhs."
  },
  {
    "id": "photo",
    "name": "Passport Photograph",
    "description": "Recent passport-sized photo of applicant",
    "category": "Biometric Proof",
    "status": "Verified",
    "fileName": "rahul_kumar_passport_photo.jpg",
    "fileSize": "450 KB",
    "confidence": "99%",
    "aiRemark": "Face match 99.2% consistent with Aadhaar photo."
  }
]

@router.get("")
def get_documents():
    return DEFAULT_DOCS_LIST

@router.post("/upload")
def upload_document(
    doc_id: str = Form(...),
    file: UploadFile = File(...)
):
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "status": "SUCCESS",
        "docId": doc_id,
        "fileName": file.filename,
        "fileSize": f"{(os.path.getsize(save_path) / 1024 / 1024):.1f} MB",
        "message": f"File {file.filename} uploaded and stored."
    }

@router.post("/verify-ai")
def verify_documents_ai():
    return {
        "status": "SUCCESS",
        "completenessScore": 92,
        "verificationStatus": "Mostly Verified",
        "verifiedCount": 7,
        "reviewCount": 1,
        "documents": DEFAULT_DOCS_LIST
    }
