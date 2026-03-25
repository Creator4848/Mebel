from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routers import auth, courses, public, enrollments, admin, payments

app = FastAPI(
    title="MebelAkademiya API",
    version="1.0.0",
    description="O'zbekistondagi #1 Mebel Akademiyasi backend API",
)

@app.on_event("startup")
def startup_event():
    from app.database import Base, engine, SessionLocal
    from app import models
    from app.auth import hash_password
    
    # Create tables safely
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database table creation error: {e}")
        
    db = SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.role == models.UserRole.admin).first()
        if not admin:
            admin = models.User(
                name="MebelAkademiya Admin",
                email="admin@mebelakademiya.uz",
                role=models.UserRole.admin,
            )
            db.add(admin)
        admin.phone = "+998889884848"
        admin.password_hash = hash_password("Grant2tatu")
        db.commit()
    except Exception as e:
        print(f"Startup admin setup error: {e}")
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    return {"status": "ok"}
