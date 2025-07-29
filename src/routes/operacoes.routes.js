import { cadastroOperacoes, pegarOperacoes } from "../controllers/operacoes.controllers.js";
import { Router } from "express";
import { validacaoSchema } from "../middlewares/validateSchema.middleware.js";
import { transacaoSchema } from "../schemas/operacoes.schema.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const operacoesRouter = Router();

operacoesRouter.use(autenticar)
operacoesRouter.post("/operacoes", validacaoSchema(transacaoSchema), cadastroOperacoes);
operacoesRouter.get("/operacoes", pegarOperacoes);

export default operacoesRouter;