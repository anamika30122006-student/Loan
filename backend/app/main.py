import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routers import auth, schemes, eligibility, kyc, documents, risk, applications, admin, notifications

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JanDhan LoanSaathi API",
    description="Backend REST API service for AI-Powered Micro Entrepreneur Loan Assistance Platform",
    version="1.0.0"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(schemes.router)
app.include_router(eligibility.router)
app.include_router(kyc.router)
app.include_router(documents.router)
app.include_router(risk.router)
app.include_router(applications.router)
app.include_router(admin.router)
app.include_router(notifications.router)

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "JanDhan LoanSaathi FastAPI Backend",
        "version": "1.0.0"
    }

# Mount Pure HTML/CSS/JS Frontend Directory
frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
