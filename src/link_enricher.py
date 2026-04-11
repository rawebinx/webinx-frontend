import requests
from bs4 import BeautifulSoup
import psycopg2
import os
import time

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db():
    return psycopg2.connect(DATABASE_URL)

# ----------------------------------
# Extract registration links
# ----------------------------------
def extract_registration_link(html):
    soup = BeautifulSoup(html, "html.parser")

    # Priority 1: Button links
    for a in soup.find_all("a", href=True):
        text = a.text.lower()
        if any(x in text for x in ["register", "sign up", "join", "book"]):
            return a["href"]

    # Priority 2: forms
    form = soup.find("form")
    if form and form.get("action"):
        return form["action"]

    return None

# ----------------------------------
# Search Google (basic)
# ----------------------------------
def search_google(title):
    query = title.replace(" ", "+") + "+webinar+register"
    url = f"https://www.google.com/search?q={query}"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    for a in soup.select("a"):
        href = a.get("href", "")
        if "http" in href and "google" not in href:
            return href

    return None

# ----------------------------------
# Process events
# ----------------------------------
def enrich_links():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, title
        FROM events
        WHERE url IS NULL
        LIMIT 50
    """)

    events = cur.fetchall()

    for event_id, title in events:
        try:
            print(f"Processing: {title}")

            link = search_google(title)

            if not link:
                continue

            page = requests.get(link, timeout=10)
            reg_link = extract_registration_link(page.text)

            final_link = reg_link if reg_link else link

            cur.execute("""
                UPDATE events
                SET url = %s
                WHERE id = %s
            """, (final_link, event_id))

            conn.commit()

            time.sleep(2)

        except Exception as e:
            print("Error:", e)
            continue

    cur.close()
    conn.close()

if __name__ == "__main__":
    enrich_links()
