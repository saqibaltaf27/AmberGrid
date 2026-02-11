import type { Database } from "better-sqlite3";
import BetterSqlite3 from "better-sqlite3";

const db: Database = new BetterSqlite3("ambergrid.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS infrastructure(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    purchaseDate TEXT NOT NULL,
    firmwareVersion TEXT,
    criticality INTEGER,
    redundancy INTEGER,
    supportStatus TEXT,
    powerConsumption INTEGER,
    location TEXT,
    lastMaintenance TEXT,
    vendor TEXT,
    hardwareId TEXT UNIQUE,
    createdAt TEXT
    );
`);

export default db;