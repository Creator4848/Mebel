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
        
        # 2. Manual migrations for missing columns
        db = SessionLocal()
        try:
            # users.name
            try:
                db.execute(text("SELECT name FROM users LIMIT 1;"))
            except Exception:
                db.rollback()
                print("Adding missing column name to users...")
                db.execute(text("ALTER TABLE users ADD COLUMN name VARCHAR(200) NOT NULL DEFAULT '';"))
                db.commit()

            # courses.youtube_link
            try:
                db.execute(text("SELECT youtube_link FROM courses LIMIT 1;"))
            except Exception:
                db.rollback()
                print("Adding missing column youtube_link to courses...")
                db.execute(text("ALTER TABLE courses ADD COLUMN youtube_link VARCHAR(500);"))
                db.commit()

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
