import os

SECRET_KEY = os.getenv("SECRET_KEY", "jandhan-loansaathi-secret-key-2026-secure-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 Hours

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./jandhan_loans.db")
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)
