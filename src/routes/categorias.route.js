import { Router } from "express";
import { getCategorias } from "../controller/categorias.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, getCategorias);

export default router;
