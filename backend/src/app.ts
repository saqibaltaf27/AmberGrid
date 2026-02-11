import express from "express";
import cors from "cors";
import infraRoutes from './routes/infrastructureRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/infrastructure', infraRoutes);

export default app;
