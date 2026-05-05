## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate.bat cho command prompt
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup Environment Variables `.env`:
   ```env
   GEMINI_API_KEY="your_api_key"
   DATABASE_URL="your_db_url"
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. Generate dependencies:
   ```bash
   pip freeze > requirements.txt
   ```
5 run sv: 
py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
