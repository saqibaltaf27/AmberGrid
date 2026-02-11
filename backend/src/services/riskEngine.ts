import dayjs from "dayjs";

export interface RiskInput {
    purchaseDate: string;
    criticality: number;
    redundancy: number;
    supportStatus: string;
    powerConsumption: number;
    lastMaintenance: string;
}

export function calculateSystemHealthScore(data: RiskInput): number {
    let risk = 0;
    const age = dayjs().diff(dayjs(data.purchaseDate), "year");

    // Age Weight (40%)
    if (age > 10) risk += 40;
    else if (age > 7) risk += 30;
    else if (age > 5) risk += 20;
    else risk += 10;

    // Support Status (20%)
    if (data.supportStatus === "EOL") risk += 20;
    else if (data.supportStatus === "Limited") risk += 10;

    // Criticality (10%)
    risk += data.criticality*2;

    // Redundancy (10%)
    if (data.redundancy === 0) risk += 10;
    else if (data.redundancy === 1) risk += 5;

    // Power Consumption (10%)
    if (data.powerConsumption > 800) risk += 10;
    else if (data.powerConsumption > 500) risk += 5;

    // Maintenance (10%)
    const lastMaintYears = dayjs().diff(dayjs(data.lastMaintenance), "year");
    if (lastMaintYears > 2) risk += 10;

    return Math.min(100, risk);
}