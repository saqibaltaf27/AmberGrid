import AuditForm from "./components/AuditForm";
import RoadmapTimeline from "./components/RoadmapTimeline";
import StakeholderDashboard from "./components/StakeholderDashboard";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>AmberGrid Architect</h1>
      <AuditForm />
      <RoadmapTimeline />
      <StakeholderDashboard />
    </div>
  );
}

export default App;