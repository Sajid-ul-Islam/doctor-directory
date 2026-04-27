import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
import os
import re
from dotenv import load_dotenv

# Load credentials from the .env file
load_dotenv()
WP_USER = os.getenv("WP_USERNAME")
WP_PASS = os.getenv("WP_PASSWORD") # Use an Application Password here

# The standard WordPress REST API endpoint for posts
# Added ?per_page=100 to grab maximum records in one request
API_URL = "https://normaldeliverybd.com/wp-json/wp/v2/posts?per_page=100"

def extract_doctor_details(text):
    """Extracts Degrees, Medical College, and Workplace from raw text."""
    if not text: return "", "", ""
    
    # 1. Extract Degrees
    found_degrees = []
    for deg in ["MBBS", "FCPS", "MCPS", "DGO", "MS", "MD", "FRCOG", "BCS"]:
        if re.search(rf'\b{deg}\b', text, re.IGNORECASE):
            found_degrees.append(deg)
            
    # 2. Extract Medical College
    college = ""
    college_match = re.search(r'([A-Za-z\s]+(?:Medical College|মেডিকেল কলেজ))', text, re.IGNORECASE)
    if college_match:
        college = college_match.group(1).strip()
        
    # 3. Extract Current Employment / Hospital
    employment = ""
    emp_match = re.search(r'([A-Za-z\s]+(?:Hospital|Clinic|Medical Center|হাসপাতাল|ক্লিনিক))', text, re.IGNORECASE)
    if emp_match:
        employment = emp_match.group(1).strip()
        
    return ", ".join(found_degrees), college, employment

def clean_whatsapp(phone):
    """Cleans phone numbers into international format for WhatsApp."""
    if not phone: return ""
    num = re.sub(r'\D', '', str(phone))
    if num.startswith('01'):
        num = '88' + num
    return num if len(num) >= 11 else ""

def fetch_wp_data():
    print("Fetching data from WordPress...")
    try:
        # Pass the credentials using HTTP Basic Auth
        response = requests.get(API_URL, auth=(WP_USER, WP_PASS), timeout=10)
        response.raise_for_status()
        
        # The API returns clean JSON data
        posts = response.json()
        wp_records = []
        
        for post in posts:
            # 1. Extract Name (Title)
            raw_title = post.get('title', {}).get('rendered', '')
            name = BeautifulSoup(raw_title, 'html.parser').get_text().strip()
            
            # 2. Extract Phone and Email from Content
            content = post.get('content', {}).get('rendered', '')
            soup = BeautifulSoup(content, 'html.parser')
            text = soup.get_text()
            
            phone_match = re.search(r"(?:\+88|01)[0-9\-\s]{9,13}", text)
            phone = phone_match.group(0).strip() if phone_match else None
            
            emails = [a['href'].replace('mailto:', '') for a in soup.find_all('a', href=True) if 'mailto:' in a['href']]
            email = emails[0] if emails else None
            
            degrees, college, employment = extract_doctor_details(text)
            
            if name:
                wp_records.append({"Name": name, "Phone": phone, "Email": email, 
                                   "Degrees": degrees, "MedicalCollege": college, "CurrentEmployment": employment})
                
        print(f"Successfully parsed {len(wp_records)} records from WordPress.")
        return wp_records
        
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch data: {e}")
        return []

# Replace this with your actual Google Sheet CSV export URL
SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1C2TSME8WcmcRpGXkKbGAkBgXS_7VAmSSCg6WfiJh_O8/export?format=csv&gid=799451496"
DATA_DIR = os.path.dirname(__file__)
ENRICHED_CSV_PATH = os.path.join(DATA_DIR, "data", "enriched.csv")

def scrape_doctor_info(name):
    """Scrapes web for missing phone or email using directory insights."""
    if not name or pd.isna(name):
        return None, None, "", "", ""
    
    try:
        query = requests.utils.quote(str(name))
        url = f"https://normaldeliverybd.com/?s={query}"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Bot'}
        
        # Short timeout so we don't hang the build
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract phone using regex
        text = soup.get_text()
        phone_match = re.search(r"(?:\+88|01)[0-9\-\s]{9,13}", text)
        scraped_phone = phone_match.group(0).strip() if phone_match else None
        
        # Extract email
        emails = [a['href'].replace('mailto:', '') for a in soup.find_all('a', href=True) if 'mailto:' in a['href']]
        scraped_email = emails[0] if emails else None
        
        degrees, college, employment = extract_doctor_details(text)
        
        time.sleep(0.5) # Polite delay
        return scraped_phone, scraped_email, degrees, college, employment
    except Exception as e:
        print(f"Error scraping info for {name}: {e}")
        return None, None, "", "", ""

def get_comparable(val):
    """Normalizes strings for reliable duplicate matching."""
    if pd.isna(val) or not val: 
        return ""
    # Remove non-alphanumeric chars for robust phone/email matching
    return re.sub(r'[^a-zA-Z0-9@.]', '', str(val)).lower()

def merge_rows(r1, r2):
    """Merges two doctor records into one, intelligently combining fields."""
    merged = {}
    all_keys = set(r1.keys()).union(r2.keys())
    
    for k in all_keys:
        v1, v2 = r1.get(k), r2.get(k)
        
        # Normalize empties
        if pd.isna(v1) or str(v1).strip() == "": v1 = None
        if pd.isna(v2) or str(v2).strip() == "": v2 = None
        
        if v1 is not None and v2 is not None:
            str_v1, str_v2 = str(v1).strip(), str(v2).strip()
            if str_v1.lower() == str_v2.lower():
                merged[k] = v1
            else:
                # Concatenate subjective text fields if they differ
                if k in ["Feedback", "Vbac", "Purdah", "Interventions", "Presence", "Degrees"]:
                    merged[k] = f"{str_v1} | {str_v2}"
                # For standard fields, keep the longer one (e.g., better address)
                else:
                    merged[k] = v1 if len(str_v1) >= len(str_v2) else v2
        else:
            merged[k] = v1 if v1 is not None else v2
            
    return merged

def analyze_sentiment(text):
    if not text or pd.isna(text): return 0
    pos_words = ["ভালো", "চমৎকার", "আস্থাশীল", "সফল", "ধন্যবাদ", "good", "great", "excellent", "safe", "সন্তুষ্ট"]
    neg_words = ["খারাপ", "অসন্তুষ্ট", "ব্যথা", "bad", "unhappy", "pain", "সমস্যা"]
    
    score = 0
    text_lower = str(text).lower()
    for pw in pos_words:
        if pw in text_lower: score += 1
    for nw in neg_words:
        if nw in text_lower: score -= 1
    return score

def run_pipeline():
    print("Fetching Google Sheet...")
    df = pd.read_csv(SHEET_CSV_URL)
    
    # 1. Map columns to unified standard
    col_mapping = {
        "ডাক্তারের নাম:": "Name", "Doctor Name": "Name",
        "আপনার জেলা:": "District", "ডাক্তারের চেম্বার এড্রেস:": "Address", "Location": "Address",
        "ফোন নাম্বার": "Phone", "ইমেইল": "Email", "vbac": "Vbac", "purdah": "Purdah",
        "উনি কি ভিব্যাক(সিজারের পর নরমাল ডেলিভারি)  করান? ": "Vbac",
        "আপনার উল্লিখিত ডাক্তার কি পর্দার ব্যাপারে সহযোগী?": "Purdah",
        "এই ডাক্তার কি মেডিকেল হস্তক্ষেপ (নিয়মমাফিক সব মাকে পিটোসিন, এপিসিওটমি দেয়া) সহ নরমাল ডেলিভারি করান নাকি আপডেটেড গাইডলাইন অনুযায়ী শুধু প্রয়োজন হলেই এসব ব্যবহার করেন? ": "Interventions",
        "interventions": "Interventions", "presence": "Presence",
        "আপনার নরমাল ডেলিভারির সময় কি ডাক্তার নিজে উপস্থিত ছিলেন? সব রোগীর ক্ষেত্রেই কি থাকেন?": "Presence",
        "আপনার উল্লিখিত ডাক্তার সম্পর্কে আপনার ফিডব্যাক:": "Feedback"
    }
    
    df.rename(columns={k: v for k, v in col_mapping.items() if k in df.columns}, inplace=True)
    raw_records = df.to_dict('records')
    
    # --- Inject WordPress Data ---
    wp_records = fetch_wp_data()
    raw_records.extend(wp_records)
    # -----------------------------
    
    merged_records = []
    
    print("Processing and Deduplicating records...")
    for row in raw_records:
        name = row.get("Name", "")
        if pd.isna(name) or str(name).strip() == "":
            continue
            
        phone, email = row.get("Phone"), row.get("Email")
        
        # 2. Scrape if missing
        s_phone, s_email, s_deg, s_col, s_emp = scrape_doctor_info(name)
        if s_phone and (pd.isna(phone) or str(phone).strip() == ""): row["Phone"] = s_phone
        if s_email and (pd.isna(email) or str(email).strip() == ""): row["Email"] = s_email
        if s_deg: row["Degrees"] = s_deg
        if s_col: row["MedicalCollege"] = s_col
        if s_emp: row["CurrentEmployment"] = s_emp
            
        # 3. Find matching existing record for Deduplication
        r_name_comp, r_phone_comp, r_email_comp = get_comparable(name), get_comparable(row.get("Phone")), get_comparable(row.get("Email"))
        
        matched_idx = -1
        for i, existing in enumerate(merged_records):
            e_name_comp = get_comparable(existing.get("Name"))
            e_phone_comp = get_comparable(existing.get("Phone"))
            e_email_comp = get_comparable(existing.get("Email"))
            
            # Merge condition: Same Phone, Same Email, or strictly Same Name
            if (r_phone_comp and e_phone_comp and r_phone_comp == e_phone_comp) or \
               (r_email_comp and e_email_comp and r_email_comp == e_email_comp) or \
               (r_name_comp and e_name_comp and r_name_comp == e_name_comp):
                matched_idx = i
                break
                
        if matched_idx != -1:
            merged_records[matched_idx] = merge_rows(merged_records[matched_idx], row)
        else:
            merged_records.append(row)

    print("Formatting final dataset...")
    # 4. Format strictly to the Frontend 'Doctor' Interface
    final_data = []
    for rec in merged_records:
        district = str(rec.get("District", "")).strip() if pd.notna(rec.get("District")) else ""
        address = str(rec.get("Address", "")).strip() if pd.notna(rec.get("Address")) else ""
        
        feedback = rec.get("Feedback")
        if pd.isna(feedback) or str(feedback).strip() == "":
            feedback = rec.get("Presence", "")
            
        doc = {
            "Name": str(rec.get("Name")).strip(),
            "Specialty": "Obstetrics & Gynecology",
            "Location": ", ".join(filter(None, [district, address, rec.get("CurrentEmployment", "")])),
            "Phone": rec.get("Phone", ""),
            "Email": rec.get("Email", ""),
            "Vbac": rec.get("Vbac", "No info"),
            "Purdah": rec.get("Purdah", "No info"),
            "Interventions": rec.get("Interventions", "No info"),
            "Presence": rec.get("Presence", "No info"),
            "Feedback": feedback,
            "Degrees": rec.get("Degrees", ""),
            "MedicalCollege": rec.get("MedicalCollege", ""),
            "WhatsApp": clean_whatsapp(rec.get("Phone", ""))
        }
        doc["SentimentScore"] = analyze_sentiment(doc["Feedback"])
        
        # Clean up missing data values
        for k, v in doc.items():
            if pd.isna(v) or str(v).lower() == "nan" or str(v).strip() == "":
                doc[k] = "" if k in ["Phone", "Email", "Location", "WhatsApp", "Degrees", "MedicalCollege"] else "No info"
                
        final_data.append(doc)
        
    print(f"Saving {len(final_data)} enriched records...")
    enriched_df = pd.DataFrame(final_data)
    os.makedirs(os.path.dirname(ENRICHED_CSV_PATH), exist_ok=True)
    enriched_df.to_csv(ENRICHED_CSV_PATH, index=False)
    print("Data enrichment complete.")

if __name__ == "__main__":
    # Uncomment the lines below if you want to test ONLY the WP parsing in your terminal:
    # import pprint
    # pprint.pprint(fetch_wp_data())
    
    run_pipeline()