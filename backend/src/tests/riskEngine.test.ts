import { calculateSystemHealthScore } from "../services/riskEngine.js";

test("High risk hardware should score above 70", () => {
    const score = calculateSystemHealthScore({
        purchaseDate: "2010-01-01",
        criticality: 5,
        redundancy: 0,
        supportStatus: "EOL",
        powerConsumption: 1000,
        lastMaintenance: "2018-01-01"
    });

    expect(score).toBeGreaterThan(70);
});