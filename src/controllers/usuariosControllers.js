import { cadastroSchema, db, loginSchema } from "../app.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';


export async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    const validation = cadastroSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const usuario = await db.collection("usuarios").findOne({ email })
        if (usuario) return res.status(409).send("E-mail já cadastrado")

        const hash = bcrypt.hashSync(senha, 10);

        await db.collection("usuarios").insertOne({ nome, email, senha: hash });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function login(req, res) {
    const { email, senha } = req.body;

    const validation = loginSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const usuario = await db.collection("usuarios").findOne({ email });
        if (!usuario) return res.status(404).send("E-mail não cadastrado");

        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaCorreta) return res.status(401).send("Senha incorreta");

        const token = uuid();
        await db.collection("sessoes").insertOne({ token, idUsuario: usuario._id });
        res.status(200).send(token);
    } catch (err) {
        res.status(500).send(err.message);
    }

}