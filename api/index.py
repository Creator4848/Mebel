import os
import sys
import traceback
import json

# Add the root directory to the Python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

try:
    from backend.app.main import app as _app

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
            # THIS IS THE TRUTH-SEEKER: Return the real error to the browser
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
