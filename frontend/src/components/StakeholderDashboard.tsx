import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { api } from "../services/api";

type StakeholderData = {
  name: string;
  financialRisk: number;
  score: number;
};

export default function StakeholderDashboard() {
  const [data, setData] = useState<StakeholderData[]>([]);

  useEffect(() => {
    api.get("/infrastructure/get-infrastructure")
      .then(res => {
        const chartData = res.data.map((item: any) => ({
          name: item.name,
          financialRisk: item.score * 1000,
          score: item.score
        }));
        setData(chartData);
      })
      .catch(err => console.error(err));
  }, []);

  const getColor = (score: number) => {
    if (score >= 70) return "#f87171"; // red
    if (score >= 50) return "#facc15"; // yellow
    return "#4ade80"; // green
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Stakeholder Dashboard</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value}`} />
          <Bar dataKey="financialRisk">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}