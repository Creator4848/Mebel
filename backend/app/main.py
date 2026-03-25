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
        
            from app.database import Base, engine
            # Create tables
            Base.metadata.create_all(bind=engine)

            # Manual migration check: Add youtube_link if missing
            from sqlalchemy import text
            try:
                db.execute(text("SELECT youtube_link FROM courses LIMIT 1;"))
            except Exception:
                db.rollback()
                print("Adding missing column youtube_link to courses...")
                db.execute(text("ALTER TABLE courses ADD COLUMN youtube_link VARCHAR(500);"))
                db.commit()

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
    return {"status": "ok", "env_vars": {"DB": bool(settings.DATABASE_URL)}}
