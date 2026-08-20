from app.database import engine, SessionLocal, Base
from app.models.models import User, ApplicantProfile, Business, LoanApplication, IdentityVerification, Notification, AuditLog
from app.auth.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Rahul Kumar Applicant
        rahul = db.query(User).filter(User.email == "rahul.kumar@shreegeneral.in").first()
        if not rahul:
            rahul = User(
                email="rahul.kumar@shreegeneral.in",
                hashed_password=get_password_hash("rahul123"),
                full_name="Rahul Kumar",
                role="APPLICANT"
            )
            db.add(rahul)
            db.commit()
            db.refresh(rahul)

            profile = ApplicantProfile(
                user_id=rahul.id,
                father_name="Ramesh Kumar",
                dob="1995-06-15",
                gender="Male",
                mobile="9876543210",
                address="Plot No. 42, Main Road, Lalpur",
                state="Jharkhand",
                district="Ranchi",
                pincode="834001"
            )
            db.add(profile)

            business = Business(
                user_id=rahul.id,
                name="Shree General Store",
                type="Retail",
                address="Shop 12, Commercial Complex, Lalpur Chowk, Ranchi",
                vintage="3 Years",
                annual_turnover=1200000.0,
                monthly_income=100000.0,
                employees=3,
                gst_status="Registered",
                udyam_status="Verified"
            )
            db.add(business)

            kyc = IdentityVerification(
                user_id=rahul.id,
                aadhaar_number="987654321098",
                aadhaar_verified=True,
                pan_number="ABCPK9876F",
                pan_verified=True
            )
            db.add(kyc)

            app = LoanApplication(
                id="JLS-MUDRA-2026-08421",
                user_id=rahul.id,
                scheme_id="MUDRA",
                loan_amount=500000.0,
                tenure_months=36,
                purpose="Business Expansion & Inventory Stocking",
                estimated_emi=16209.0,
                status="Under Review",
                submission_date="19 Aug 2026, 10:30 AM",
                last_updated="19 Aug 2026, 02:15 PM"
            )
            db.add(app)

            notif = Notification(
                user_id=rahul.id,
                title="Welcome to JanDhan LoanSaathi",
                message="Your MUDRA loan application JLS-MUDRA-2026-08421 is under review by partner bank."
            )
            db.add(notif)

            audit = AuditLog(
                user_id=rahul.id,
                action="Application Created",
                application_id="JLS-MUDRA-2026-08421",
                details="Initial application seed"
            )
            db.add(audit)

        # 2. Seed Admin User
        admin_user = db.query(User).filter(User.email == "admin@jandhan.gov.in").first()
        if not admin_user:
            admin_user = User(
                email="admin@jandhan.gov.in",
                hashed_password=get_password_hash("admin123"),
                full_name="Nodal Officer Ranchi",
                role="ADMIN"
            )
            db.add(admin_user)

        db.commit()
        print("Database seeded successfully with default Rahul Kumar & Admin accounts.")

    except Exception as e:
        print(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
