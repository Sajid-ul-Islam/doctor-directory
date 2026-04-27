import pandas as pd
import requests
from bs4 import BeautifulSoup
import urllib.robotparser
import time
import os
from urllib.parse import urlparse

# Replace this with your actual Google Sheet CSV export URL
SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1C2TSME8WcmcRpGXkKbGAkBgXS_7VAmSSCg6WfiJh_O8/export?format=csv&gid=799451496"
DATA_DIR = os.path.dirname(__file__)
ENRICHED_CSV_PATH = os.path.join(DATA_DIR, "data", "enriched.csv")

def can_fetch(url, user_agent="*"):
    parsed_url = urlparse(url)
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
    rp = urllib.robotparser.RobotFileParser()
    rp.set_url(f"{base_url}/robots.txt")
    try:
        rp.read()
        return rp.can_fetch(user_agent, url)
    except:
        return True # Default to True if robots.txt is missing/unreadable

def scrape_website(url):
    """Attempts to scrape email addresses from a given website."""
    if pd.isna(url) or not url:
        return None
        
    # Ensure the URL has a scheme
    if not url.startswith("http"):
        url = "https://" + url
        
    if can_fetch(url):
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Bot'}
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all mailto links
            emails = [a['href'].replace('mailto:', '') for a in soup.find_all('a', href=True) if 'mailto:' in a['href']]
            
            time.sleep(1) # Polite delay between requests
            return emails[0] if emails else None
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return None
    return None

def run_pipeline():
    df = pd.read_csv(SHEET_CSV_URL)
    
    if 'Email' not in df.columns:
        df['Email'] = None
        
    for index, row in df.iterrows():
        if pd.isna(row.get('Email')) or str(row.get('Email')).strip() == "":
            scraped_email = scrape_website(row.get('Website'))
            if scraped_email:
                df.at[index, 'Email'] = scraped_email
                
    os.makedirs(os.path.dirname(ENRICHED_CSV_PATH), exist_ok=True)
    df.to_csv(ENRICHED_CSV_PATH, index=False)