import os
import sys
import traceback

# Add the api directory to the Python path so 'import app' works
# even when 'app' is inside the 'api' folder.
api_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(api_dir, '..')

if api_dir not in sys.path:
    sys.path.insert(0, api_dir)
if project_root not in sys.path:
    sys.path.insert(1, project_root)

try:
    # This will now find api/app/main.py as 'app.main'
    from app.main import app as _app

    # Vercel sends the full path including /api. We intercept the ASGI request
    # and strip the /api prefix so FastAPI's internal routing matches correctly.
    async def app(scope, receive, send):
        if scope["type"] in ["http", "websocket"]:
            path = scope.get("path", "")
            if path.startswith("/api"):
                new_scope = dict(scope)
                # Strip leading /api
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
    # Fallback to diagnostic app if import fails
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/{full_path:path}")
    async def diagnostic(full_path: str):
        return {
            "error": "Python backend failed to start with root structure",
            "exception": str(e),
            "traceback": traceback.format_exc(),
            "sys_path": sys.path,
            "cwd": os.getcwd()
        }
