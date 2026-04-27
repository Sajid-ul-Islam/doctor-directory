from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import pandas as pd
import os
import csv
from datetime import datetime
import requests

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

class Suggestion(BaseModel):
    doctorName: str
    suggestedPhone: str = ""
    suggestedEmail: str = ""
    suggestedLocation: str = ""
    comments: str = ""

def sync_to_google_sheet(data: dict):
    webhook_url = os.getenv("GOOGLE_SHEET_WEBHOOK_URL")
    if not webhook_url: return
    try:
        requests.post(webhook_url, json=data, timeout=5)
    except Exception as e:
        print(f"Google Sheets sync failed: {e}")

@app.post("/api/suggest-edit")
def suggest_edit(suggestion: Suggestion, background_tasks: BackgroundTasks):
    try:
        file_path = os.path.join(os.path.dirname(__file__), "data", "suggestions.csv")
        file_exists = os.path.exists(file_path)
        
        with open(file_path, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["Timestamp", "DoctorName", "Phone", "Email", "Location", "Comments"])
            
            writer.writerow([
                datetime.now().isoformat(),
                suggestion.doctorName,
                suggestion.suggestedPhone,
                suggestion.suggestedEmail,
                suggestion.suggestedLocation,
                suggestion.comments
            ])
            
        # Send to Google Sheets in the background so the UI doesn't hang
        background_tasks.add_task(sync_to_google_sheet, suggestion.dict())
        
        return {"status": "success", "message": "Suggestion saved."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))