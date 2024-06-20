import cors from "cors";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import joi from "joi";
import dayjs from "dayjs";
import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';
import express, { json } from "express";
import { 
  usuarioJaCadastrado, 
  usuarioNaoEncontrado, 
  senhaIncorreta, 
  tokenInvalido,
  naoHaUsuarioEmSessoes,
  nenhumRegistroEncontrado
} from "./errors/functionsErrors.js";
import { registroSchema, sessaoSchema, usuarioSchema } from "./schemas/schemas.js";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

const DATABASE_URL = process.env.NODE_ENV === "test" ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

const Usuario = mongoose.Schema("Usuario", usuarioSchema);
const Sessao = mongoose.Schema("Sessao", sessaoSchema);
const Registro = mongoose.Schema("Registro", registroSchema);

(async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexão com o banco de dados estabelecida!");
    
  } catch (error) {
    console.error("Erro na conexão com o banco de dados:", error);
  }
})();
  
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
      const verificacaoUsuario = await Usuario.findOne({ email });
      if (verificacaoUsuario) throw usuarioJaCadastrado("Usuário já cadastrado!");

      await Usuario.create({ nome, email, senha: senhaCriptografada });
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
      const checarUsuario = await Usuario.findOne({ email });
      if (!checarUsuario) throw usuarioNaoEncontrado("Email ou senha incorretos");

      const checarSenha = bcrypt.compareSync(senha, checarUsuario.senha);
      if (!checarSenha) throw senhaIncorreta("Email ou senha incorretos");

      const token = uuid();

      await Sessao.create({ idUsuario: checarUsuario._id, token });

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
      const usuarioSessao = await Sessao.findOne({ token });
      if (!usuarioSessao) throw naoHaUsuarioEmSessoes("Token inválido");

      const usuario = await Usuario.findOne({ _id: usuarioSessao.idUsuario });
      if (!usuario) throw usuarioNaoEncontrado("Usuário não encontrado");

      await Registro.create({
        valor,
        descricao,
        tipo,
        data: dayjs().format("DD/MM"),
        idUsuario: usuarioSessao.idUsuario,
        nome: usuario.nome
      });

      const registros = await Registro.find({ idUsuario: usuarioSessao.idUsuario });
      if (!registros || registros.length === 0) throw nenhumRegistroEncontrado("Não existem registros para esse usuário!");

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
      const usuarioSessao = await Sessao.findOne({ token });
      if (!usuarioSessao) throw tokenInvalido("Token inválido!");

      const usuario = await Usuario.findOne({ _id: usuarioSessao.idUsuario });
      if (!usuario) throw usuarioNaoEncontrado("Usuário não encontrado!");

      const registros = await Registro.find({ idUsuario: usuario._id });

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
      const usuarioSessao = await Sessao.findOne({ token });
      if (!usuarioSessao) throw tokenInvalido("Token inválido!");
  
      const usuario = await Usuario.findOne({ _id: usuarioSessao.idUsuario });
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

export default app;
