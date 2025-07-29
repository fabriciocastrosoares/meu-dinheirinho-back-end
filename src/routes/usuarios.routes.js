import { Router } from "express";
import { cadastrarUsuario, login, logout } from "../controllers/usuarios.controllers.js";
import { validacaoSchema } from "../middlewares/validateSchema.middleware.js";
import { cadastroSchema, loginSchema } from "../schemas/usuarios.schema.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const usuariosRouter = Router();

usuariosRouter.post("/cadastro", validacaoSchema(cadastroSchema), cadastrarUsuario);
usuariosRouter.post("/login", validacaoSchema(loginSchema), login);
usuariosRouter.post("/logout", autenticar, logout);

export default usuariosRouter;
