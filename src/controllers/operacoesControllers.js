import { db, transacaoSchema } from "../app.js";


export async function cadstroOperacoes(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const { tipo } = req.params;
    const { valor, descricao } = req.body;

    if (!token) return res.sendStatus(401);

    const validation = transacaoSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    if (tipo !== "entrada" && tipo !== "saida") return res.status(422).send("Tipo de transação inválido. Deve ser 'entrada' ou 'saida'.");


    try {
        const sessao = await db.collection("sessoes").findOne({ token });
        if (!sessao) return res.sendStatus(401);

        const usuario = await db.collection("usuarios").findOne({ _id: sessao.idUsuario });
        if (!usuario) return res.sendStatus(401);

        const novaTransacao = {
            valor,
            descricao,
            tipo,
            data: new Date().toLocaleDateString("pt-BR"),
            usuarioId: sessao.idUsuario
        };

        await db.collection("transacoes").insertOne(novaTransacao);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function pegarOperacoes (req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    try {
        const sessao = await db.collection("sessoes").findOne({ token });
        if (!sessao) return res.sendStatus(401);

         const transacoes = await db.collection("transacoes").find({  usuarioId: sessao.idUsuario }).toArray();
        
        res.send(transacoes);
    } catch (err) {
        res.status(500).send(err.message);
    }

}