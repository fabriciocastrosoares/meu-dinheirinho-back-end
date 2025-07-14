import { Router } from "express";
import operacoesRouter from "./operacoes.routes.js";
import usuariosRouter from "./usuarios.routes.js";

const router = Router();
router.use(usuariosRouter);
router.use(operacoesRouter);

export default router;
