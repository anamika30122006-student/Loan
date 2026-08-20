import sys
import os
import shutil

# Add backend directory to sys.path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure database exists in /tmp for Vercel Serverless environment
tmp_db_path = "/tmp/jandhan_loans.db"
source_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "jandhan_loans.db")

if not os.path.exists(tmp_db_path):
    try:
        if os.path.exists(source_db_path):
            shutil.copy2(source_db_path, tmp_db_path)
        else:
            from app.seed import seed_db
            seed_db()
    except Exception as e:
        print(f"DB Prep Note: {e}")

from app.main import app
