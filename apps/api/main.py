from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contexts.form_design.router import router as design_router
from contexts.form_catalog.router import router as catalog_router

app = FastAPI(title="FormGen API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://localhost:4201",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(design_router)
app.include_router(catalog_router)


@app.get("/health")
def health():
    return {"status": "ok"}
