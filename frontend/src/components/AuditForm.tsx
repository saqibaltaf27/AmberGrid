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
  redundancy?: number;
  supportStatus?: string;
  powerConsumption?: number;
  location?: string;
  lastMaintenance?: string;
};

export default function AuditForm() {
  const [form, setForm] = useState<AuditFormData>({
    name: "",
    purchaseDate: "",
    hardwareId: "",
    type: "Unknown",
    vendor: "Unknown",
    firmwareVersion: "",
    criticality: 1,
    redundancy: 0,
    supportStatus: "Active",
    powerConsumption: 100,
    location: "Unknown",
    lastMaintenance: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name) return "Name is required";
    if (!form.purchaseDate) return "Purchase date is required";
    if (dayjs(form.purchaseDate).isAfter(dayjs()))
      return "Purchase date cannot be in the future";
    if (!form.hardwareId) return "Hardware ID is required";
    if (form.criticality! < 1 || form.criticality! > 5)
      return "Criticality must be between 1-5";
    return "";
  };

  const submit = async () => {
    const err = validate();
    if (err) return setError(err);

    setError("");
    setLoading(true);

    // Ensure lastMaintenance defaults to purchaseDate
    if (!form.lastMaintenance) form.lastMaintenance = form.purchaseDate;

   