from fastapi import FastAPI
from routers import scorecards, mappings, scoring, ai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="iSense Scorecard API",
    description="Backend API for iSense Scorecard Management, Mapping and AI Import",
    version="1.0.0"
)

# Enable CORS for local testing with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(scorecards.router)
app.include_router(mappings.router)
app.include_router(scoring.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "iSense Scorecard API is running"}
