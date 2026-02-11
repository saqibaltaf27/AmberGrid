import type { Request, Response } from "express";
import db from '../db/database.js';
import { v4 as uuid } from "uuid";
import { calculateSystemHealthScore } from "../services/riskEngine.js";

export const createInfrastructure = (req: Request, res: Response) => {
    try{
        const id = uuid();
        const {
            name,
            purchaseDate,
            hardwareId,
            type = "Unknown",
            firmwareVersion = "",
            criticality =1,
            redundancy = 0,
            supportStatus = "Active",
            powerConsumption = 100,
            location = "Unknown",
            lastMaintenance = purchaseDate,
            vendor = "Unknown"
        } = req.body;
        const score = calculateSystemHealthScore({
            purchaseDate,
            criticality,
            redundancy,
            supportStatus,
            powerConsumption,
            lastMaintenance
        });
        db.prepare(`
            Insert Into infrastructure 
            (id, name, type, purchaseDate,firmwareVersion, criticality, redundancy, 
            supportStatus, powerConsumption, location, lastMaintenance, vendor, hardwareId, createdAt)
            Values(@id, @name, @type, @purchaseDate, 
            @firmwareVersion, @criticality, @redundancy, @supportStatus, @powerConsumption, @location,
            @lastMaintenance, @vendor, @hardwareId, @createdAt)
            `).run({
                id,
                name,
                type,
                purchaseDate,
                firmwareVersion,
                criticality,
                redundancy,
                supportStatus,
                powerConsumption,
                location,
                lastMaintenance,
                vendor,
                hardwareId,
                createdAt: new Date().toISOString()
            })

        res.json({ id, score });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getAllInfrastructure = (_: Request, res: Response) => {
    const rows = db.prepare('Select * from infrastructure').all();
    res.json(rows);
};
