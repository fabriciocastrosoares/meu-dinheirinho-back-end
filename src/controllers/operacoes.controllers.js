import { ObjectId } from "mongodb";
import { db } from "../database/database.connection.js";


export async function cadastrarOperacao(req, res) {
    const { valor, descricao, tipo } = req.body;
    const sessao = res.locals.sessao;

    if (tipo !== "entrada" && tipo !== "saida") return res.status(422).send("Tipo de transação inválido. Deve ser 'entrada' ou 'saida'.");

    try {
        const usuario = await db.collection("usuarios").findOne({ _id: sessao.idUsuario });
        if (!usuario) return res.sendStatus(401);

        const novaTransacao = {
            valor,
            descricao,
            tipo,
            data: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
            usuarioId: sessao.idUsuario
        };

        await db.collection("transacoes").insertOne(novaTransacao);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function pegarOperacoes(req, res) {
    const sessao = res.locals.sessao;

    try {
        const transacoes = await db.collection("transacoes")
            .find({ usuarioId: sessao.idUsuario })
            .sort({ data: -1 })
            .toArray();

        res.send(transacoes);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

export async function apagarOperacao(req, res) {
    const { id } = req.params;
    try {
        const result = await db.collection("transacoes").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.sendStatus(404);
        res.sendStatus(204);

    } catch (err) {
        res.status(500).send(err.message);
    }

};

export async function editarOperacao(req, res) {
    const sessao = res.locals.sessao;
    const { id } = req.params;


    if (!ObjectId.isValid(id)) {
        return res.status(400).send("ID inválido");
    }

    try {
        const transacao = await db.collection("transacoes").findOne({ _id: new ObjectId(id) });
        if (!transacao) return res.status(404).send("Transação não encontrada!");

        const result = await db.collection("transacoes").updateOne({ _id: new ObjectId(id) }, { $set: req.body });
        if (result.matchedCount === 0) return res.sendStatus(404);
        res.sendStatus(204);

    } catch (err) {
        res.status(500).send(err.message);
    }
};

