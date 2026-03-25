import traceback

try:
    from app.main import app
except Exception as e:
    # If the main app fails to import (e.g. missing dependencies, bad configuration),
    # we catch the error here and serve a dummy FastAPI app that returns the stack trace.
    # This is crucial for debugging blind Vercel 500 Server Errors.
    error_msg = traceback.format_exc()
    print(f"CRITICAL BOOT ERROR:\n{error_msg}")
    
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    app = FastAPI()
    
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
    async def catch_all(path_name: str):
        return JSONResponse(
            status_code=500,
            content={
                "status": "critical_boot_error",
                "message": "The Python backend failed to initialize.",
                "traceback": error_msg.splitlines()
            }
        )

