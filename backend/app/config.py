import os

SECRET_KEY = os.getenv("SECRET_KEY", "jandhan-loansaathi-secret-key-2026-secure-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 Hours

IS_VERCEL = os.getenv("VERCEL") == "1" or os.getenv("VERCEL") is not None

if IS_VERCEL:
    default_db = "sqlite:////tmp/jandhan_loans.db"
    default_upload = "/tmp/uploads"
else:
    default_db = "sqlite:///./jandhan_loans.db"
    default_upload = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")

DATABASE_URL = os.getenv("DATABASE_URL", default_db)
UPLOAD_DIR = default_upload

os.makedirs(UPLOAD_DIR, exist_ok=True)

