import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db } from '../database/database.connection.js';

export async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
        const usuario = await db.collection("usuarios").findOne({ email })
        if (usuario) return res.status(409).send("E-mail já cadastrado")

        const hash = bcrypt.hashSync(senha, 10);

        await db.collection("usuarios").insertOne({ nome, email, senha: hash });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function login(req, res) {
    const { email, senha } = req.body;

    try {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (!usuario) return res.status(404).send("E-mail não cadastrado");

        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaCorreta) return res.status(401).send("Senha incorreta");

        const token = uuid();
        
        await db.collection("sessoes").insertOne({ token, idUsuario: usuario._id });

        const { senha: _, ...usuarioSemSenha } = usuario;

        res.status(200).send({
            usuario: usuarioSemSenha,
            token
        });
    } catch (err) {
        res.status(500).send(err.message);
    }

};
export async function logout(req, res) {
    const sessao = res.locals.sessao;

    try {
        const resultado = await db.collection("sessoes").deleteOne({ token: sessao.token });
        if (resultado.deletedCount === 0) {
            return res.status(400).send("Token não encontrado ou já removido.");
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
};



