# 🏛 JanDhan LoanSaathi | AI-Powered Micro Entrepreneur Loan Platform

An end-to-end digital credit assistance and application platform built specifically for Indian Micro Entrepreneurs (MUDRA, PMFME, PMEGP, CMEGP loan schemes).

## 🛠 Technology Stack

- **Frontend**: Pure HTML5, CSS3, & Vanilla JavaScript (No React, Node, or frontend frameworks)
- **Backend**: Python 3 (FastAPI, SQLAlchemy, Pydantic, Uvicorn)
- **Database**: SQLite (`jandhan_loans.db`)

---

## 📁 Project Structure

```
loan/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── auth/             # JWT Authentication & Passlib security
│   │   ├── models/           # SQLAlchemy Database Models
│   │   ├── routers/          # REST API Controllers (Eligibility, KYC, Applications, Admin, etc.)
│   │   ├── schemas/          # Pydantic Schemas
│   │   ├── config.py         # App Configuration
│   │   ├── database.py       # SQLite Database Session
│   │   ├── main.py           # FastAPI Main Application & Static File Mounting
│   │   └── seed.py           # Demo Data Seeder (Rahul Kumar & Admin)
│   ├── requirements.txt      # Python Dependencies
│   └── uploads/              # Uploaded Borrower Documents
├── frontend/                 # Pure HTML/CSS/JS Frontend
│   ├── css/
│   │   └── style.css         # Modern Tricolor & Glassmorphism Styling
│   ├── js/
│   │   └── app.js            # SPA Navigation, Form Handling & API Client
│   ├── favicon.svg
│   └── index.html            # Complete Single Page Application HTML
├── run.py                    # One-Click Python Launcher Script
└── README.md
```

---

## 🚀 How to Run the Application

### 1. Install Dependencies
Make sure Python 3.8+ is installed on your system. Run:
```bash
pip install -r backend/requirements.txt
```

### 2. Launch the Application
Run the launcher script:
```bash
python run.py
```

### 3. Open in Browser
Visit **[http://localhost:8000](http://localhost:8000)** in your web browser!

---

## ✨ Features Included

1. **Pure HTML/CSS/JS Frontend**: Clean, fast, and light UI with responsive grid, step-by-step loan wizard, and micro-animations.
2. **FastAPI Python Backend**: REST API for loan eligibility checks, Aadhaar/PAN verification, document handling, risk scoring, and application tracking.
3. **Demo Data Ready**: Pre-seeded with **Rahul Kumar (Shree General Store)** demo enterprise and **Nodal Officer Admin** portal.
