from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pyodbc
from pydantic import BaseModel

# --- Setup FastAPI app and router ---
app = FastAPI(title="AI SQL Dashboard")
router = APIRouter()

# --- CORS settings ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database connection ---
SERVER = r"PCFLAWFX01\BISTESTSERVER"
DATABASE = "ADD A NEW STYLE"
USERNAME = "sa"
PASSWORD = "sql@2022"
DRIVER = "ODBC Driver 17 for SQL Server"

CONNECTION_STRING = f"DRIVER={{{DRIVER}}};SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD}"

# --- Request Models ---
class QueryRequest(BaseModel):
    query: str

class AIRequest(BaseModel):
    question: str

# --- Root ---
@app.get("/")
def root():
    return {"message": "AI SQL Dashboard Backend is running"}




# --- AI SQL Endpoint ---
@app.post("/ask-ai")
async def ask_ai(req: AIRequest):
    question_raw = req.question
    question = question_raw.lower().strip()

    chart_type = "bar"
    sql = "SELECT TOP 100 * FROM GarmentPerformance"

    # --- Detect chart type ---
    if "pie" in question or "donut" in question:
        chart_type = "pie"
    elif "line" in question:
        chart_type = "line"
    elif "card" in question:
        chart_type = "card"
    elif "bar" in question or "column" in question:
        chart_type = "bar"

    # --- Detect intent ---
    if "department" in question and "efficiency" in question:
        sql = """
            SELECT  Department, 
                   AVG(EfficiencyPercent) AS AvgEfficiency
            FROM GarmentPerformance
            GROUP BY Department
            ORDER BY AvgEfficiency DESC
        """
    elif "employee" in question and "efficiency" in question:
        sql = """
            SELECT EmployeeName, 
                   AVG(EfficiencyPercent) AS AvgEfficiency
            FROM GarmentPerformance
            GROUP BY EmployeeName
            ORDER BY AvgEfficiency DESC
        """
    elif "production" in question and "defect" in question:
        sql = """
            SELECT Department,
                   SUM(ProductionUnits) AS TotalProduction,
                   SUM(DefectiveUnits) AS TotalDefects
            FROM GarmentPerformance
            GROUP BY Department
        """
    elif "total production" in question:
        sql = "SELECT SUM(ProductionUnits) AS TotalProduction FROM GarmentPerformance"
    elif "total defective" in question or "total defectiveunits" in question:
        sql = "SELECT SUM(DefectiveUnits) AS TotalDefectiveUnits FROM GarmentPerformance"
    elif "total efficiency" in question or "efficiencypercent" in question:
        sql = "SELECT AVG(EfficiencyPercent) AS AverageEfficiencyPercent FROM GarmentPerformance"
    elif "total salary" in question:
        sql = "SELECT SUM(Salary) AS TotalSalary FROM GarmentPerformance"
    elif "total bonus" in question:
        sql = "SELECT SUM(Bonus) AS TotalBonus FROM GarmentPerformance"
    elif "total output" in question or "totaloutputvalue" in question:
        sql = "SELECT SUM(TotalOutputValue) AS TotalOutputValue FROM GarmentPerformance"
    else:
        sql = "SELECT TOP 100 * FROM GarmentPerformance"

    # --- Execute SQL and compute summary ---
    try:
        with pyodbc.connect(CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            print(f"Executing SQL: {sql}")
            cursor.execute(sql)
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            data = [dict(zip(columns, row)) for row in rows]

            totals = {}
            summary_text = ""

            if data:
                # If single-row aggregate result (like SUM, AVG)
                if len(data) == 1:
                    row = data[0]
                    for k, v in row.items():
                        if isinstance(v, (int, float)):
                            totals[k] = round(v, 2)
                            summary_text = f"Show {k.replace('_', ' ')} in GarmentPerformance = {v:,}"
                else:
                    # Compute totals across numeric columns
                    numeric_cols = [
                        "ProductionUnits", "DefectiveUnits", "EfficiencyPercent",
                        "Salary", "Bonus", "TotalOutputValue"
                    ]
                    for col in numeric_cols:
                        values = [r[col] for r in data if col in r and isinstance(r[col], (int, float))]
                        if not values:
                            continue
                        if "percent" in col.lower():
                            totals[f"Average_{col}"] = round(sum(values) / len(values), 2)
                        else:
                            totals[f"Total_{col}"] = round(sum(values), 2)

                    parts = []
                    for k, v in totals.items():
                        label = k.replace("_", " ")
                        parts.append(f"{label} = {v:,}")
                    summary_text = " | ".join(parts)

    except Exception as e:
        print(f"SQL Execution Failed: {e}")
        data, totals, summary_text = [], {}, f"Error executing SQL: {e}"

    return {
        "sql": sql,
        "results": data,
        "totals": totals,
        "summary_text": summary_text,
        "chart_type": chart_type,
        "title": f"AI-generated: {question_raw}",
    }






# --- SQL Execution Endpoint (Optional, fallback) ---
@router.post("/execute-sql")
async def execute_sql(request: QueryRequest):
    try:
        with pyodbc.connect(CONNECTION_STRING) as conn:
            cursor = conn.cursor()
            cursor.execute(request.query)
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            data = [dict(zip(columns, row)) for row in rows]
            return {"data": data}
    except Exception as e:
        return {"data": [{"MockResponse": str(e)}]}

# --- Register router ---
app.include_router(router)
