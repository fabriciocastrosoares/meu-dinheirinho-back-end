import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
import { cadastrarUsuario, login } from "./controllers/usuariosControllers.js";
import { cadstroOperacoes, pegarOperacoes } from "./controllers/operacoesControllers.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();


const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
    await mongoClient.connect();
    console.log("MongoDB conectado");
} catch {
    console.log(err.message);
}
export const db = mongoClient.db();

export const cadastroSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().min(3).required()
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().min(3).required()
});

export const transacaoSchema = joi.object({
    valor: joi.number().positive().precision(2).required(),
    descricao: joi.string().min(1).required()
});

app.post("/cadastro", cadastrarUsuario);

app.post("/login", login);

app.post("/operacoes/:tipo", cadstroOperacoes);

app.get("/operacoes", pegarOperacoes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


