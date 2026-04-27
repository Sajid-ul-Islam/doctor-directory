from fastapi import FastAPI, HTTPException
import pandas as pd
import os

app = FastAPI()

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "enriched.csv")

@app.get("/api/companies")
def get_companies():
    if not os.path.exists(DATA_FILE):
        return []
    
    # fillna("") ensures JSON serialization doesn't break on NaN values
    df = pd.read_csv(DATA_FILE).fillna("")
    return df.to_dict(orient="records")

@app.post("/api/admin/refresh")
def refresh_data():
    try:
        from .scraper import run_pipeline
        run_pipeline()
        return {"status": "success", "message": "Data successfully refreshed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))