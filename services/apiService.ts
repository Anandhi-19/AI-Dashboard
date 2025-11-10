import { AiQueryResponse, ExecuteSqlResponse, PredefinedWidget, FetchedWidgetData, DateRange } from '../types';
import { getMockDataForSql } from './mockDataService';

const API_BASE_URL = 'http://127.0.0.1:8000';

// --- Check backend availability ---
async function isBackendReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
    return res.ok;
  } catch {
    console.warn("Backend not reachable — using mock data.");
    return false;
  }
}

let useMockData = true; // Start with mock data until backend is confirmed
isBackendReachable().then(r => {
    if (r) {
        console.log("✅ Backend is reachable. Using live data.");
        useMockData = false;
    }
});

// --- AI Query Generation ---
export async function generateWidgetFromPrompt(prompt: string): Promise<AiQueryResponse | null> {
  if (useMockData) {
    console.log("⚙️ Using mock data for AI query generation.");
    const mockSql = "SELECT Department, ROUND(AVG(EfficiencyPercent),2) AS AvgEfficiency FROM GarmentPerformance GROUP BY Department ORDER BY AvgEfficiency DESC";
    const mockDataResponse = getMockDataForSql(mockSql);
    return {
      sql: mockSql,
      chart_type: "bar",
      title: `Mock response for: "${prompt}"`,
      data: mockDataResponse.data,
      columns: mockDataResponse.columns,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/ask-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: prompt }),
    });

    if (!res.ok) throw new Error(`AI query failed: ${res.statusText}`);
    
    const fullResponse = await res.json();
    const data = fullResponse.results || [];
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return {
        sql: fullResponse.sql,
        chart_type: fullResponse.chart_type,
        title: fullResponse.title,
        data: data,
        columns: columns,
    };

  } catch (err) {
    console.error("Error generating AI widget:", err);
    alert("⚠️ Failed to get AI response. Ensure backend is running.");
    return null;
  }
}

// --- SQL Execution ---
export async function executeSql(sql: string, dateRange?: DateRange): Promise<ExecuteSqlResponse | null> {
  if (useMockData) {
    console.log("⚙️ Using mock SQL data...");
    return getMockDataForSql(sql);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/execute-sql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sql, date_range: dateRange }),
    });

    if (!res.ok) throw new Error(`SQL execution failed: ${res.statusText}`);

    const result = await res.json();

    // ✅ Ensure both data & columns exist
    if (!result.data || result.data.length === 0) {
      console.warn("No data returned from SQL query.");
      return { data: [], columns: [] };
    }

    if (!result.columns) {
      result.columns = Object.keys(result.data[0]);
    }

    return result;
  } catch (err) {
    console.error("Error executing SQL:", err);
    alert("⚠️ Failed to execute SQL query. Falling back to mock data.");
    useMockData = true;
    return getMockDataForSql(sql);
  }
}

// --- Predefined Widgets ---
export async function fetchPredefinedWidgetData(widget: PredefinedWidget, dateRange?: DateRange): Promise<FetchedWidgetData | null> {
  const result = await executeSql(widget.sql, dateRange);
  if (result) {
    return {
      title: widget.title,
      chartType: widget.chart_type,
      sql: widget.sql,
      data: result.data,
      columns: result.columns,
    };
  }
  return null;
}