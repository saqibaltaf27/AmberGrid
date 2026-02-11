import { useEffect, useState } from "react";
import { api } from "../services/api";

type Infra = {
  id: string;
  name: string;
  purchaseDate: string;
  vendor: string;
  score: number;
};

export default function RoadmapTimeline() {
  const [infrastructure, setInfrastructure] = useState<Infra[]>([]);

  useEffect(() => {
    api.get("/infrastructure/get-infrastructure")
      .then(res => setInfrastructure(res.data))
      .catch(err => console.error(err));
  }, []);

  // Map risk score to a start month (1-12)
  const getStartMonth = (score: number) => Math.ceil((100 - score) / 8.33);

  // Map risk score to duration in months (higher risk → shorter duration)
  const getDuration = (score: number) => Math.max(1, Math.ceil((100 - score) / 20));

  // Map risk score to color
  const getColor = (score: number) => {
    if (score >= 70) return "#f87171"; // red
    if (score >= 50) return "#facc15"; // yellow
    return "#4ade80"; // green
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div style={{ overflowX: "auto", marginTop: 20 }}>
      <h2>Interactive Migration Roadmap</h2>
      <div style={{ display: "flex", minWidth: 1200 }}>
        {months.map(month => (
          <div
            key={month}
            style={{
              flex: "0 0 100px",
              border: "1px solid #334155",
              minHeight: 120,
              position: "relative",
              padding: 4
            }}
          >
            <div style={{ textAlign: "center", fontWeight: 600, marginBottom: 4 }}>
              Month {month}
            </div>
            {infrastructure
              .filter(i => {
                const start = getStartMonth(i.score);
                const duration = getDuration(i.score);
                return month >= start && month < start + duration;
              })
              .map(i => {
                const start = getStartMonth(i.score);
                const duration = getDuration(i.score);
                return (
                  <div
                    key={i.id}
                    title={`${i.name}\nVendor: ${i.vendor}\nPurchase: ${i.purchaseDate}\nRisk: ${i.score}`}
                    style={{
                      position: "absolute",
                      top: 20 + Math.random() * 80, // stagger bars vertically
                      left: 0,
                      width: `${duration * 100}px`,
                      backgroundColor: getColor(i.score),
                      padding: "2px 4px",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {i.name} ({i.score})
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}