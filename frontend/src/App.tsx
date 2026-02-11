import AuditForm from "./components/AuditForm.js";
import RoadmapTimeline from "./components/RoadMapTimeline.js";
import StakeholderDashboard from "./components/StakeholderDashboard.js";

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