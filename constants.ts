
import { PredefinedWidget } from './types';
import { CardIcon, BarChartIcon, LineChartIcon, PieChartIcon, StackedBarChartIcon, HorizontalBarChartIcon, DonutChartIcon, AreaChartIcon, RadarChartIcon, FunnelChartIcon, RadialBarChartIcon } from './components/icons';

export const PREDEFINED_WIDGETS: PredefinedWidget[] = [
    {
        "id": "1",
        "title": "Total Production Units",
        "chart_type": "card",
        "sql": "SELECT SUM(ProductionUnits) AS TotalProduction FROM GarmentPerformance",
        "icon": CardIcon
    },
    {
        "id": "2",
        "title": "Average Efficiency by Department",
        "chart_type": "bar",
        "sql": "SELECT Department, ROUND(AVG(EfficiencyPercent),2) AS AvgEfficiency FROM GarmentPerformance GROUP BY Department ORDER BY AvgEfficiency DESC",
        "icon": BarChartIcon
    },
    {
        "id": "3",
        "title": "Monthly Production Trend",
        "chart_type": "line",
        "sql": "SELECT Month, SUM(ProductionUnits) AS TotalUnits FROM GarmentPerformance GROUP BY Month ORDER BY MIN(CONVERT(date, '01-' + Month, 106))",
        "icon": LineChartIcon
    },
    {
        "id": "4",
        "title": "Defective vs Good Units",
        "chart_type": "pie",
        "sql": "SELECT 'Defective Units' AS Category, SUM(DefectiveUnits) AS Count FROM GarmentPerformance UNION ALL SELECT 'Good Units', SUM(ProductionUnits - DefectiveUnits) FROM GarmentPerformance",
        "icon": PieChartIcon
    },
    {
        "id": "5",
        "title": "Top 5 Employees by Efficiency",
        "chart_type": "horizontalBar",
        "sql": "SELECT TOP 5 EmployeeName, ROUND(AVG(EfficiencyPercent),2) AS Efficiency FROM GarmentPerformance GROUP BY EmployeeName ORDER BY Efficiency DESC",
        "icon": HorizontalBarChartIcon
    },
    {
        "id": "6",
        "title": "Department-wise Output Value",
        "chart_type": "stackedBar",
        "sql": "SELECT Department, SUM(TotalOutputValue) AS OutputValue, SUM(Bonus) AS TotalBonus FROM GarmentPerformance GROUP BY Department",
        "icon": StackedBarChartIcon
    },
    {
        "id": "7",
        "title": "Average Salary and Bonus Trend",
        "chart_type": "line",
        "sql": "SELECT Month, AVG(Salary) AS AvgSalary, AVG(Bonus) AS AvgBonus FROM GarmentPerformance GROUP BY Month ORDER BY MIN(CONVERT(date, '01-' + Month, 106))",
        "icon": LineChartIcon
    },
    {
        "id": "8",
        "title": "Device Usage Breakdown",
        "chart_type": "donut",
        "sql": "SELECT Device, Users FROM DeviceUsage",
        "icon": DonutChartIcon
    },
    {
        "id": "9",
        "title": "Monthly Website Traffic",
        "chart_type": "area",
        "sql": "SELECT Month, Visitors, PageViews FROM WebsiteTraffic ORDER BY MonthID",
        "icon": AreaChartIcon
    },
    {
        "id": "10",
        "title": "Player Skill Comparison",
        "chart_type": "radar",
        "sql": "SELECT Skill, PlayerA, PlayerB FROM PlayerSkills",
        "icon": RadarChartIcon
    },
    {
        "id": "11",
        "title": "Sales Funnel Stages",
        "chart_type": "funnel",
        "sql": "SELECT Stage, Value FROM SalesFunnel ORDER BY StageOrder",
        "icon": FunnelChartIcon
    },
    {
        "id": "12",
        "title": "Quarterly Goal Completion",
        "chart_type": "radialBar",
        "sql": "SELECT Quarter, Percentage FROM QuarterlyGoals",
        "icon": RadialBarChartIcon
    }
];