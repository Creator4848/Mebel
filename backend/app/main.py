from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, courses, public, enrollments, admin, payments

app = FastAPI(
    title="MebelAkademiya API",
    version="1.0.0",
    description="O'zbekistondagi #1 Mebel Akademiyasi backend API",
)

@app.on_event("startup")
def startup_event():
    try:
        from app.database import Base, engine, SessionLocal
        from app import models
        from app.auth import hash_password
        from sqlalchemy import text
        
        # 1. Create tables if they don't exist
        if engine is None:
            print("WARNING: No DATABASE_URL configured, skipping table creation.")
            return
        Base.metadata.create_all(bind=engine)
        
        # 2. Check schema — if users table is outdated, drop all and recreate
        db = SessionLocal()
        try:
            try:
                db.execute(text(
                    "SELECT id, name, phone, email, password_hash, role, is_active, created_at "
                    "FROM users LIMIT 0;"
                ))
                db.rollback()
            except Exception:
                db.rollback()
                print("Schema mismatch — dropping and recreating all tables...")
                for tbl in ["payments", "enrollments", "users", "courses", "modules", "instructors", "plans"]:
                    db.execute(text(f"DROP TABLE IF EXISTS {tbl} CASCADE;"))
                db.commit()
                Base.metadata.create_all(bind=engine)

            # courses.youtube_link
            try:
                db.execute(text("ALTER TABLE courses ADD COLUMN IF NOT EXISTS youtube_link VARCHAR(500);"))
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"Course migration skipped: {e}")

            # users.username
            try:
                db.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;"))
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"Username migration skipped: {e}")

            # instructors.photo_url (add) + drop old emoji/avatar_color columns
            try:
                db.execute(text("ALTER TABLE instructors ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);"))
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"Instructor photo_url migration skipped: {e}")
            for col in ("emoji", "avatar_color"):
                try:
                    db.execute(text(f"ALTER TABLE instructors DROP COLUMN IF EXISTS {col};"))
                    db.commit()
                except Exception as e:
                    db.rollback()
                    print(f"Drop instructors.{col} skipped: {e}")

            # 3. Setup default admin — always ensure it exists with correct credentials
            admin_user = db.query(models.User).filter(
                models.User.username == "123123*"
            ).first()
            if not admin_user:
                # Also check by phone in case username was changed
                admin_user = db.query(models.User).filter(
                    models.User.phone == "+998931234567"
                ).first()
            if not admin_user:
                admin_user = models.User(
                    name="MebelAkademiya Admin",
                    email="admin@mebelakademiya.uz",
                    role=models.UserRole.admin,
                )
                db.add(admin_user)
            # Always keep credentials up to date
            admin_user.phone = "+998931234567"
            admin_user.username = "123123*"
            admin_user.password_hash = hash_password("123123*")
            admin_user.role = models.UserRole.admin
            admin_user.is_active = True
            db.commit()
            print("Admin user ensured: 123123* / +998931234567")
        finally:
            db.close()
            
    except Exception as e:
        print(f"Startup error: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(public.router)
app.include_router(enrollments.router)
app.include_router(admin.router)
app.include_router(payments.router)

@app.get("/", tags=["root"])
def root():
    return {"message": "MebelAkademiya API ishlayapti ✅"}

@app.get("/health", tags=["root"])
def health():
    import os
    raw = os.environ.get("DATABASE_URL", "")
    return {
        "status": "ok",
        "env_vars": {"DB": bool(settings.DATABASE_URL)},
        "raw_db_set": bool(raw),
        "raw_db_prefix": raw[:20] if raw else None,
    }
