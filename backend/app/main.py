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

            # 3. Setup default admin
            admin_user = db.query(models.User).filter(models.User.role == models.UserRole.admin).first()
            if not admin_user:
                admin_user = models.User(
                    name="MebelAkademiya Admin",
                    email="admin@mebelakademiya.uz",
                    role=models.UserRole.admin,
                )
                db.add(admin_user)
            admin_user.phone = "+998889884848"
            admin_user.password_hash = hash_password("Grant2tatu")
            db.commit()
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
