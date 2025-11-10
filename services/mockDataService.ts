
import { ExecuteSqlResponse } from '../types';

const mockData: Record<string, ExecuteSqlResponse> = {
  "SELECT SUM(ProductionUnits) AS TotalProduction FROM GarmentPerformance": {
    columns: ["TotalProduction"],
    data: [{ "TotalProduction": 61235 }]
  },
  "SELECT Department, ROUND(AVG(EfficiencyPercent),2) AS AvgEfficiency FROM GarmentPerformance GROUP BY Department ORDER BY AvgEfficiency DESC": {
    columns: ["Department", "AvgEfficiency"],
    data: [
      { "Department": "Sewing", "AvgEfficiency": 98.5 },
      { "Department": "Finishing", "AvgEfficiency": 97.2 },
      { "Department": "Cutting", "AvgEfficiency": 96.8 }
    ]
  },
  "SELECT Month, SUM(ProductionUnits) AS TotalUnits FROM GarmentPerformance GROUP BY Month ORDER BY MIN(CONVERT(date, '01-' + Month, 106))": {
    columns: ["Month", "TotalUnits"],
    data: [
      { "Month": "Jan-23", "TotalUnits": 18000 },
      { "Month": "Feb-23", "TotalUnits": 22000 },
      { "Month": "Mar-23", "TotalUnits": 21235 }
    ]
  },
  "SELECT 'Defective Units' AS Category, SUM(DefectiveUnits) AS Count FROM GarmentPerformance UNION ALL SELECT 'Good Units', SUM(ProductionUnits - DefectiveUnits) FROM GarmentPerformance": {
    columns: ["Category", "Count"],
    data: [
      { "Category": "Defective Units", "Count": 1530 },
      { "Category": "Good Units", "Count": 59705 }
    ]
  },
  "SELECT TOP 5 EmployeeName, ROUND(AVG(EfficiencyPercent),2) AS Efficiency FROM GarmentPerformance GROUP BY EmployeeName ORDER BY Efficiency DESC": {
    columns: ["EmployeeName", "Efficiency"],
    data: [
        { EmployeeName: "Alice", Efficiency: 99.8 },
        { EmployeeName: "Bob", Efficiency: 99.5 },
        { EmployeeName: "Charlie", Efficiency: 99.2 },
        { EmployeeName: "Diana", Efficiency: 98.9 },
        { EmployeeName: "Eve", Efficiency: 98.7 },
    ]
  },
  "SELECT Department, SUM(TotalOutputValue) AS OutputValue, SUM(Bonus) AS TotalBonus FROM GarmentPerformance GROUP BY Department": {
    columns: ["Department", "OutputValue", "TotalBonus"],
    data: [
      { "Department": "Sewing", "OutputValue": 350000, "TotalBonus": 35000 },
      { "Department": "Finishing", "OutputValue": 280000, "TotalBonus": 25000 },
      { "Department": "Cutting", "OutputValue": 150000, "TotalBonus": 12000 }
    ]
  },
  "SELECT Month, AVG(Salary) AS AvgSalary, AVG(Bonus) AS AvgBonus FROM GarmentPerformance GROUP BY Month ORDER BY MIN(CONVERT(date, '01-' + Month, 106))": {
    columns: ["Month", "AvgSalary", "AvgBonus"],
    data: [
      { "Month": "Jan-23", "AvgSalary": 3000, "AvgBonus": 300 },
      { "Month": "Feb-23", "AvgSalary": 3100, "AvgBonus": 320 },
      { "Month": "Mar-23", "AvgSalary": 3050, "AvgBonus": 310 }
    ]
  },
  "SELECT Device, Users FROM DeviceUsage": {
    columns: ["Device", "Users"],
    data: [
        { Device: "Desktop", Users: 4500 },
        { Device: "Mobile", Users: 3200 },
        { Device: "Tablet", Users: 1500 },
        { Device: "Other", Users: 500 }
    ]
  },
  "SELECT Month, Visitors, PageViews FROM WebsiteTraffic ORDER BY MonthID": {
    columns: ["Month", "Visitors", "PageViews"],
    data: [
        { Month: "Jan", Visitors: 12000, PageViews: 48000 },
        { Month: "Feb", Visitors: 15000, PageViews: 60000 },
        { Month: "Mar", Visitors: 18000, PageViews: 75000 },
        { Month: "Apr", Visitors: 17000, PageViews: 68000 }
    ]
  },
  "SELECT Skill, PlayerA, PlayerB FROM PlayerSkills": {
    columns: ["Skill", "PlayerA", "PlayerB"],
    data: [
        { Skill: 'Shooting', PlayerA: 90, PlayerB: 75 },
        { Skill: 'Dribbling', PlayerA: 85, PlayerB: 88 },
        { Skill: 'Passing', PlayerA: 80, PlayerB: 92 },
        { Skill: 'Defense', PlayerA: 70, PlayerB: 78 },
        { Skill: 'Stamina', PlayerA: 95, PlayerB: 85 }
    ]
  },
  "SELECT Stage, Value FROM SalesFunnel ORDER BY StageOrder": {
    columns: ["Stage", "Value"],
    data: [
      { Stage: 'Prospects', Value: 10000 },
      { Stage: 'Leads', Value: 8000 },
      { Stage: 'Opportunities', Value: 5000 },
      { Stage: 'Customers', Value: 2500 }
    ]
  },
  "SELECT Quarter, Percentage FROM QuarterlyGoals": {
    columns: ["Quarter", "Percentage"],
    data: [
        { Quarter: 'Q1', Percentage: 75 },
        { Quarter: 'Q2', Percentage: 50 },
        { Quarter: 'Q3', Percentage: 90 },
        { Quarter: 'Q4', Percentage: 65 }
    ]
  }
};

export function getMockDataForSql(sql: string): ExecuteSqlResponse {
  console.log(`Looking for mock data for SQL: ${sql}`);
  const data = mockData[sql.trim()];
  if (data) {
    return data;
  }
  // Generic fallback if no specific mock matches
  console.warn(`No specific mock data found for SQL. Returning generic data. SQL was: ${sql}`);
  return {
    columns: ['Category', 'Value'],
    data: [
      { Category: 'A', Value: Math.random() * 100 },
      { Category: 'B', Value: Math.random() * 100 },
      { Category: 'C', Value: Math.random() * 100 },
    ],
  };
}