import supertest from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const req = supertest(app);

let server;

beforeAll(async () => {
    server = app.listen(5001, () => {
        console.log("Servidor iniciado na porta 5001");
    });
});

afterEach(async () => {
    await mongoose.connection.collection("usuarios").deleteMany({});
    await new Promise((resolve) => server.close(resolve));
});

afterAll(async () => {
    await mongoose.connection.close();
});  

describe("POST /cadastro", () => {
    it("Deve retornar status 201 e mensagem de sucesso ao cadastrar um novo usuário", async () => {
        const usuario = {
            nome: "Jeff Gonçalves",
            email: `${uuid()}@gmail.com`,
            senha: "12345678",
            confirmaSenha: "12345678"
        };

        const res = await req.post("/cadastro").send(usuario);

        expect(res.status).toBe(201);
        expect(res.text).toBe("Usuário cadastrado com sucesso!");
    });

    it("Deve retornar status 422 e erros de validação ao enviar dados inválidos", async () => {
        const usuario = {
            nome: "",
            email: "email_invalido",
            senha: "12345678",
            confirmaSenha: "12345679",
        };

        const res = await req.post("/cadastro").send(usuario);

        expect(res.status).toBe(422);
        expect(res.text).toBe(
            "[\"\\\"nome\\\" is not allowed to be empty\",\"\\\"email\\\" must be a valid email\",\"\\\"confirmaSenha\\\" must be [ref:senha]\"]"
        );
    });

    it("Deve retornar status 409 se já existir um usuário cadastrado", async () => {
        const usuario = {
            nome: "Jeff Gonçalves",
            email: "jeffgon@gmail.com",
            senha: "12345678",
            confirmaSenha: "12345678",
        };

        await req.post("/cadastro").send(usuario);

        const response = await req.post("/cadastro").send(usuario);

        expect(response.status).toBe(409);
        expect(response.text).toBe("Usuário já cadastrado!");
    })
})

describe("POST /login", () => {
    it("Deve retornar status 200 e o token de sessão ao fazer login com sucesso", async () => {
      const usuario = {
        email: "jeffgon@gmail.com",
        senha: "12345678",
      };

      await req.post("/cadastro").send(usuario);
  
      const response = await req.post("/login").send(usuario);
  
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  
    it("Deve retornar status 422 ao enviar dados inválidos", async () => {
      const usuario = {
        email: "email_invalido",
        senha: "12345678",
      };
  
      const response = await req.post("/login").send(usuario);
  
      expect(response.status).toBe(422);
      expect(response.body).toEqual([
        "\"email\" must be a valid email",
      ]);
    });
  
    it("Deve retornar status 400 se o email não estiver cadastrado", async () => {
      const usuario = {
        email: "email_nao_cadastrado@gmail.com",
        senha: "12345678",
      };
  
      const response = await req.post("/login").send(usuario);
  
      expect(response.status).toBe(400);
      expect(response.text).toBe("Email ou senha incorretos");
    });
  
    it("Deve retornar status 400 se a senha estiver incorreta", async () => {
      const usuario = {
        email: "jeffgon@gmail.com",
        senha: "senha_incorreta",
      };
  
      const response = await req.post("/login").send(usuario);
  
      expect(response.status).toBe(400);
      expect(response.text).toBe("Email ou senha incorretos");
    });
});
