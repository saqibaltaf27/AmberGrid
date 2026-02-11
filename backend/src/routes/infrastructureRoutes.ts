import { Router } from "express";
import { createInfrastructure, getAllInfrastructure } from "../controllers/infrastructureController.js";

const router = Router();

router.post('/create-infrastructure', createInfrastructure);
router.get('/get-infrastructure', getAllInfrastructure);

export default router;