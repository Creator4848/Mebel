import os
import sys
import traceback
import json

# Ensure the api directory is in the path
api_dir = os.path.dirname(os.path.abspath(__file__))
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from config import settings
    import auth, courses, public, enrollments, admin, payments

    # Internal FastAPI instance
    _app = FastAPI(
        title="MebelAkademiya API",
        version="1.0.0",
        description="O'zbekistondagi #1 Mebel Akademiyasi backend API",
    )

    @_app.on_event("startup")
    def startup_event():
        try:
            from database import Base, engine, SessionLocal
            import models
            from auth import hash_password
            
            # Create tables
            Base.metadata.create_all(bind=engine)
            
            # Setup default admin
            db = SessionLocal()
            try:
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

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include all routers
    _app.include_router(auth.router)
    _app.include_router(courses.router)
    _app.include_router(public.router)
    _app.include_router(enrollments.router)
    _app.include_router(admin.router)
    _app.include_router(payments.router)

    @_app.get("/", tags=["root"])
    def root():
        return {"message": "MebelAkademiya API ishlayapti ✅"}

    @_app.get("/health", tags=["root"])
    def health():
        return {"status": "ok", "env_vars": {"DB": bool(settings.DATABASE_URL)}}

    # The exported ASGI handler for Vercel
    async def app(scope, receive, send):
        try:
            if scope["type"] in ["http", "websocket"]:
                path = scope.get("path", "")
                if path.startswith("/api"):
                    new_scope = dict(scope)
                    new_path = path[4:] or "/"
                    new_scope["path"] = new_path
                    if "raw_path" in scope:
                        new_scope["raw_path"] = new_path.encode("utf-8")
                    await _app(new_scope, receive, send)
                else:
                    await _app(scope, receive, send)
            else:
                await _app(scope, receive, send)
        except Exception as e:
            # Reveal the TRUTH in the browser
            error_response = {
                "error": "RUNTIME_CRASH",
                "exception": str(e),
                "traceback": traceback.format_exc(),
                "path": scope.get("path", "")
            }
            await send({
                "type": "http.response.start",
                "status": 500,
                "headers": [[b"content-type", b"application/json"]]
            })
            await send({
                "type": "http.response.body",
                "body": json.dumps(error_response).encode("utf-8")
            })

except Exception as e:
    # Diagnostic fallback for import-time errors
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/{full_path:path}")
    async def diagnostic(full_path: str):
        return {
            "error": "IMPORT_TIME_CRASH",
            "exception": str(e),
            "traceback": traceback.format_exc(),
            "sys_path": sys.path
        }
