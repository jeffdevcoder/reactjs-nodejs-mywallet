import cors from "cors";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import joi from "joi";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';
import express, { json } from "express";
import { MongoClient } from "mongodb";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());


if (process.env.NODE_ENV === "test") {
  mongoose.connect(process.env.DATABASE_URL_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db()
})
.catch(() => {
    console.log("Erro interno no banco de dados");
});

export default app;

function usuarioJaCadastrado(message) {
    const error = new Error(message);
    error.name = "UsuarioJaCadastradoError";
    return error;
};
  
function usuarioNaoEncontrado(message) {
    const error = new Error(message);
    error.name = "UsuarioNaoEncontradoError";
    return error;
};
  
function senhaIncorreta(message) {
    const error = new Error(message);
    error.name = "SenhaIncorretaError";
    return error;
};
  
function tokenInvalido(message) {
    const error = new Error(message);
    error.name = "TokenInvalidoError";
    return error;
};
  
function naoHaUsuarioEmSessoes(message) {
    const error = new Error(message);
    error.name = "NaoHaUsuarioEmSessoesError";
    return error;
};
 
function nenhumRegistroEncontrado(message) {
    const error = new Error(message);
    error.name = "NenhumRegistroEncontradoError";
    return error;
};
  
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha, confirmaSenha } = req.body;
  
    const usuarioSchema = joi.object({
      nome: joi.string().required(),
      email: joi.string().email().required(),
      senha: joi.string().required(),
      confirmaSenha: joi.string().valid(joi.ref("senha")).required()
    })
  
    const { error } = usuarioSchema.validate({ nome, email, senha, confirmaSenha }, { abortEarly: false });
  
    if (error) {
      const errosMensagens = error.details.map(err => err.message);
      return res.status(422).send(errosMensagens);
    }
  
    const senhaCriptografada = bcrypt.hashSync(senha, 10);
  
    try {
      const verificacaoUsuario = await db.collection("usuarios").findOne({ email });
      if (verificacaoUsuario) throw usuarioJaCadastrado("Usuário já cadastrado!");

      await db.collection("usuarios").insertOne({ nome, email, senha: senhaCriptografada });
      res.status(201).send("Usuário cadastrado com sucesso!");
    } catch (error) {
      if (error.name === "UsuarioJaCadastradoError") {
        return res.status(409).send(error.message)
      } else {
        res.status(500).send(error.message);
      }
    }
});
  
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;
  
    const usuarioSchema = joi.object({
      email: joi.string().email().required(),
      senha: joi.string().required()
    })
  
    const { error } = usuarioSchema.validate({ email, senha }, { abortEarly: false });
  
    if (error) {
      const errosMensagens = error.details.map(err => err.message);
      return res.status(422).send(errosMensagens);
    }
  
    try {
      const checarUsuario = await db.collection("usuarios").findOne({ email });
      if (!checarUsuario) throw usuarioNaoEncontrado("Email ou senha incorretos")
  
      const checarSenha = bcrypt.compareSync(senha, checarUsuario.senha);
      if (!checarSenha) throw senhaIncorreta("Email ou senha incorretos");
  
      const token = uuid();
  
      const sessao = await db.collection("sessoes").insertOne({ idUsuario: checarUsuario._id, token });
  
      return res.send(token);
    } catch (error) {
      if (error.name === "UsuarioNaoEncontradoError") {
        return res.status(400).send(error.message);
      } else if (error.name === "SenhaIncorretaError") {
        return res.status(400).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    }
});
  
app.post("/registros", async (req, res) => {
    const { valor, descricao, tipo } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");
  
    const registroSchema = joi.object({
      valor: joi.number().required(),
      descricao: joi.string().required(),
      tipo: joi.string().required(),
    });
  
    const { error } = registroSchema.validate({ valor, descricao, tipo }, { abortEarly: false });
  
    if (error) {
      const errosMensagens = error.details.map(err => err.message);
      return res.status(422).send(errosMensagens);
    }
  
    try {
      const usuarioSessao = await db.collection("sessoes").findOne({ token });
      if (!usuarioSessao) throw naoHaUsuarioEmSessoes("Token inválido");
  
      const usuario = await db.collection("usuarios").findOne({ _id: usuarioSessao.idUsuario });
      if (!usuario) throw usuarioNaoEncontrado("Usuário não encontrado");
  
      const registro = await db.collection("registros").insertOne({
        valor,
        descricao,
        tipo,
        data: dayjs().format("DD/MM"),
        idUsuario: usuarioSessao.idUsuario,
        nome: usuario.nome
      });
  
      const registros = await db.collection("registros").find({ idUsuario: registro.idUsuario }).toArray();
      if (!registros) throw nenhumRegistroEncontrado("Não existem registros para esse usuário!");
  
      res.send("Registro feito com sucesso");
    } catch (error) {
      if (error.name === "NaoHaUsuarioEmSessoesError") {
        res.status(401).send(error.message);
      } else if (error.name === "UsuarioNaoEncontradoError") {
        res.status(404).send(error.message);
      } else if (error.name === "NenhumRegistroEncontradoError") {
        res.send(error.message);
      } else {
        res.status(500).send("Ocorreu um erro no servidor!");
      }
    }
});
  
app.get("/registros", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
  
    try {
      const usuarioSessao = await db.collection("sessoes").findOne({ token });
      if (!usuarioSessao) throw tokenInvalido("Token inválido!");
  
      const usuario = await db.collection("usuarios").findOne({ _id: usuarioSessao.idUsuario });
      if (!usuario) throw usuarioNaoEncontrado("Usuário não encontrado!");
  
      const registros = await db.collection("registros").find({ idUsuario: usuario._id }).toArray();
  
      res.send(registros);
    } catch (error) {
      if (error.name === "TokenInvalidoError") {
        res.status(401).send(error.message);
      } else if (error.name === "UsuarioNaoEncontradoError") {
        res.status(404).send(error.message);
      } else {
        res.status(500).send("Algo deu errado no banco de dados!");
      }
    }
});
  
app.get("/usuario", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const usuarioSessao = await db.collection("sessoes").findOne({ token });
        if (!usuarioSessao) throw tokenInvalido("Token inválido!");

        const usuario = await db.collection("usuarios").findOne({ _id: usuarioSessao.idUsuario });
        if (!usuario) throw usuarioNaoEncontrado("Usuário não encontrado!");

        res.send(usuario);
    } catch (error) {
        if (error.name === "TokenInvalidoError") {
           res.status(401).send(error.message);
        } else if (error.name === "UsuarioNaoEncontradoError") {
           res.status(404).send(error.message);
        } else {
          res.status(500).send("Algo deu errado no banco de dados!");
        }
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Estou rodando na porta ${PORT}`));