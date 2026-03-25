from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.app.config import settings

# Handle SQLAlchemy 1.4+ posgres:// vs postgresql:// scheme requirements
db_url = settings.DATABASE_URL
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

try:
    if not db_url:
        print("CRITICAL: DATABASE_URL is empty!")
        engine = None
    else:
        engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    print(f"CRITICAL: Failed to initialize database engine. Error: {e}")
    # Provide a dummy engine so the app can at least start and serve 500s instead of crashing
    engine = None
    SessionLocal = sessionmaker()
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
