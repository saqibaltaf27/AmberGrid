import { useEffect, useState } from "react";
import { api } from "../services/api";

type Infra = {
  id: string;
  name: string;
  purchaseDate: string;
  vendor?: string;
  criticality?: number;
  redundancy?: number;
  supportStatus?: string;
  score?: number;
};

export default function RoadmapTimeline() {
  const [infra, setInfra] = useState<Infra[]>([]);

  // Score calculation
  const calculateScore = (item: Infra) => {
    let score = 0;
    if (item.purchaseDate) {
      const age = new Date().getFullYear() - new Date(item.purchaseDate).getFullYear();
      score += age > 7 ? 40 : 10;
    } else score += 10;

    score += (item.criticality ?? 1) * 4;
    score -= (item.redundancy ?? 0) * 5;
    if (item.supportStatus !== "Active") score += 15;

    return Math.min(Math.max(score, 0), 100);
  };

  useEffect(() => {
    api.get("/infrastructure/get-infrastructure")
      .then(res => {
        const dataWithScore = res.data.map((item: Infra) => ({
          ...item,
          score: calculateScore(item),
        }));
        setInfra(dataWithScore);
      })
      .catch(console.error);
  }, []);

  const getStartMonth = (score: number) => Math.min(Math.max(Math.ceil((100 - score) / 8.33), 1), 12);
  const getDuration = (score: number) => Math.max(1, Math.ceil((100 - score) / 20));
  const getColor = (score: number) => (score >= 70 ? "#f87171" : score >= 50 ? "#facc15" : "#4ade80");

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Assign vertical positions to avoid overlap
  const monthMap: Record<number, Infra[]> = {};
  months.forEach(m => { monthMap[m] = []; });
  infra.forEach(item => {
    const start = getStartMonth(item.score ?? 50);
    const duration = getDuration(item.score ?? 50);
    for (let m = start; m < start + duration; m++) {
      if (monthMap[m]) monthMap[m].push(item);
    }
  });

  return (
    <div style={{ overflowX: "auto", marginTop: 20 }}>
      <h2>Interactive Migration Roadmap</h2>
      <div style={{ display: "flex", minWidth: 1200 }}>
        {months.map(month => (
          <div key={month} className="timeline-block">
            <h4>Month {month}</h4>
            <div style={{ position: "relative", height: `${monthMap[month].length * 28}px`, width: "100%" }}>
              {monthMap[month].map((item, idx) => (
                <div
                  key={item.id}
                  className="timeline-item"
                  title={`Name: ${item.name}\nVendor: ${item.vendor}\nPurchase: ${item.purchaseDate}\nRisk: ${item.score}`}
                  style={{
                    top: idx * 28,
                    left: 0,
                    width: `${getDuration(item.score ?? 50) * 100}px`,
                    backgroundColor: getColor(item.score ?? 50),
                    position: "absolute",
                  }}
                >
                  {item.name} ({item.score})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}