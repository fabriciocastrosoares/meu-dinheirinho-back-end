import { apagarOperacao, cadastrarOperacao, editarOperacao, pegarOperacoes } from "../controllers/operacoes.controllers.js";
import { Router } from "express";
import { validacaoSchema } from "../middlewares/validateSchema.middleware.js";
import { transacaoSchema } from "../schemas/operacoes.schema.js";
import { autenticar } from "../middlewares/authValidate.middleware.js";

const operacoesRouter = Router();

operacoesRouter.use(autenticar);
operacoesRouter.post("/operacoes", validacaoSchema(transacaoSchema), cadastrarOperacao);
operacoesRouter.get("/operacoes", pegarOperacoes);
operacoesRouter.delete("/operacoes/:id", apagarOperacao);
operacoesRouter.put("/operacoes/:id", validacaoSchema(transacaoSchema), editarOperacao);


export default operacoesRouter;