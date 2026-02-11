import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { api } from "../services/api";

type StakeholderData = {
  id: string;
  name: string;
  financialRisk: number;
  score: number;
};

export default function StakeholderDashboard() {
  const [data, setData] = useState<StakeholderData[]>([]);

  const calculateScore = (item: any) => {
    let score = 0;
    if (item.purchaseDate) {
      const ageYears = new Date().getFullYear() - new Date(item.purchaseDate).getFullYear();
      score += ageYears > 7 ? 40 : 10;
    } else score += 10;

    score += (item.criticality ?? 1) * 4;
    score -= (item.redundancy ?? 0) * 5;
    if (item.supportStatus !== "Active") score += 15;

    return Math.min(Math.max(score, 0), 100);
  };

  useEffect(() => {
    api.get("/infrastructure/get-infrastructure")
      .then(res => {
        const chartData = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          financialRisk: calculateScore(item) * 1000,
          score: calculateScore(item),
        }));
        setData(chartData);
      })
      .catch(console.error);
  }, []);

  const getColor = (score: number) =>
    score >= 70 ? "#ef4444" : score >= 50 ? "#facc15" : "#22c55e";

  return (
    <div
      className="dashboard-card"
      style={{
        width: "100%",
        height: 400,
        backgroundColor: "#1e293b", // dark card background
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <h2
        className="dashboard-title"
        style={{ color: "#f1f5f9", marginBottom: 16 }}
      >
        Stakeholder Dashboard
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis
            dataKey="name"
            stroke="#e2e8f0"
            tick={{ fontSize: 12, fill: "#e2e8f0" }}
          />
          <YAxis stroke="#e2e8f0" tick={{ fontSize: 12, fill: "#e2e8f0" }} />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
            contentStyle={{ backgroundColor: "#334155", borderRadius: 8, color: "#f1f5f9" }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Bar dataKey="financialRisk" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.id} fill={getColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}