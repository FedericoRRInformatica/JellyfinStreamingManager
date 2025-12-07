
from fastapi import FastAPI
from app.routes.output import router as output_router

app = FastAPI(title="JSManager API")

@app.get("/")
def health():
    return {"ok": True, "app": "JellyfinStreamingManager"}

# M3U/XMLTV demo
app.include_router(output_router)
