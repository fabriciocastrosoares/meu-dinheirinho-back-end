import { db } from "../database/database.connection.js";


export async function cadastroOperacoes(req, res) {
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
            data: new Date().toLocaleDateString("pt-BR", {day: "2-digit", month: "2-digit"}),
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
        const transacoes = await db.collection("transacoes").find({ usuarioId: sessao.idUsuario }).toArray();

        res.send(transacoes);
    } catch (err) {
        res.status(500).send(err.message);
    }

};