import sys
import os

# Set UTF-8 encoding for Windows console output
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add backend directory to sys.path so app module can be loaded from root
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    import uvicorn

    print("=" * 70)
    print("JanDhan LoanSaathi | Digital Loan Assistance Platform")
    print("Backend: Python (FastAPI + SQLite)")
    print("Frontend: Pure HTML5 + CSS3 + Vanilla JavaScript")
    print("=" * 70)

    # Seed Database on Start
    try:
        from app.seed import seed_db
        seed_db()
    except Exception as e:
        print(f"Seed Note: {e}")

    print("\nStarting Server at: http://localhost:8000")
    print("Open http://localhost:8000 in your browser to access the application.\n")

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
