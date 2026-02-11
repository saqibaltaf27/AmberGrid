import { useState } from "react";
import { api } from "../services/api";
import dayjs from "dayjs";
import { saveOffline } from "../offline/indexedDB";

type AuditFormData = {
  name: string;
  purchaseDate: string;
  hardwareId: string;
  type?: string;
  vendor?: string;
  firmwareVersion?: string;
  criticality?: number;
};

export default function AuditForm() {
  const [form, setForm] = useState<AuditFormData>({
    name: "",
    purchaseDate: "",
    hardwareId: "",
    type: "",
    vendor: "",
    firmwareVersion: "",
    criticality: 1
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name) return "Name is required";
    if (!form.purchaseDate) return "Purchase date is required";
    if (dayjs(form.purchaseDate).isAfter(dayjs())) return "Purchase date cannot be in the future";
    if (!form.hardwareId) return "Hardware ID is required";
    if (form.criticality! < 1 || form.criticality! > 5) return "Criticality must be 1-5";
    return "";
  };

  const submit = async () => {
    const err = validate();
    if (err) return setError(err);
    setError("");
    setLoading(true);
    try {
      await api.post("/infrastructure/create-infrastructure", form);
      alert("Saved Successfully!");
      setForm({ name: "", purchaseDate: "", hardwareId: "", type: "", vendor: "", firmwareVersion: "", criticality: 1 });
    } catch {
      await saveOffline(form);
      alert("Offline Mode - Saved Locally");
    } finally { setLoading(false); }
  };

  return (
    <div className="card">
      <h2>Infrastructure Audit</h2>

      <div className="form-row">
        <div>
          <label>Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label>Purchase Date</label>
          <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Hardware ID</label>
          <input value={form.hardwareId} onChange={e => setForm({ ...form, hardwareId: e.target.value })} />
        </div>
        <div>
          <label>Type</label>
          <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Vendor</label>
          <input value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} />
        </div>
        <div>
          <label>Firmware Version</label>
          <input value={form.firmwareVersion} onChange={e => setForm({ ...form, firmwareVersion: e.target.value })} />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Criticality (1-5)</label>
          <input type="number" min={1} max={5} value={form.criticality} onChange={e => setForm({ ...form, criticality: Number(e.target.value) })} />
        </div>
      </div>

      <button onClick={submit} disabled={loading}>{loading ? "Saving..." : "Submit"}</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}