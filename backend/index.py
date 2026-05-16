import os
import sys
import traceback
import json

# Add the backend directory to path so app resolves cleanly
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.main import app as _app

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
            error_response = {
                "detail": f"Server xatosi: {str(e)}",
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
    import sys, os, traceback, json
    error_detail = f"CRITICAL IMPORT CRASH: {str(e)}"
    error_body = json.dumps({"detail": error_detail, "traceback": traceback.format_exc()}).encode("utf-8")

    async def app(scope, receive, send):
        await send({
            "type": "http.response.start",
            "status": 500,
            "headers": [[b"content-type", b"application/json"]]
        })
        await send({
            "type": "http.response.body",
            "body": error_body
        })
