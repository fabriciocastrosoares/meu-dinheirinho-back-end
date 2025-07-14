import { Router } from "express";
import { cadastrarUsuario, login } from "../controllers/usuarios.controllers.js";
import { validacaoSchema } from "../middlewares/validateSchema.middleware.js";
import { cadastroSchema, loginSchema } from "../schemas/usuarios.schema.js";

const usuariosRouter = Router();

usuariosRouter.post("/cadastro", validacaoSchema(cadastroSchema), cadastrarUsuario);
usuariosRouter.post("/login", validacaoSchema(loginSchema), login);

export default usuariosRouter;
