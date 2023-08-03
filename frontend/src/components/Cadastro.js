import axios from "axios";
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cadastro({ 
    email, 
    setEmail, 
    senha, 
    setSenha, 
    nome, 
    setNome, 
    confirmaSenha, 
    setConfirmaSenha 
}) {
    const navigate = useNavigate();

    function seCadastrar(event) {
        event.preventDefault();

        if (senha !== confirmaSenha) return toast.error('As senhas precisam ser iguais');

        if (senha.length < 8) return toast.error('A senha precisa ter no minimo 8 caracteres')

        const req = axios.post(`${process.env.REACT_APP_API_URL}/cadastro`, {
            email: email,
            senha: senha,
            nome: nome,
            confirmaSenha: confirmaSenha
        })
        req.then((res) => {
          toast.success('Cadastro feito com sucesso :)');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }).catch((err) => {
          if (err.response) {
            return toast.error(err.response.data);
          } else if (err.request) {
            toast.error('Erro na comunicação com a API');
          } else {
            toast.error('Erro ao configurar a solicitação');
          }
        });     
    }

    return (
      <Container>
          <div>
              <Logo>
                  <p>MyWallet</p>
              </Logo>

              <ContainerInputs>
                  <Inputs onSubmit={seCadastrar}>                
                      <input 
                          type="name" 
                          required 
                          onChange={(e) => setNome(e.target.value)} 
                          placeholder="Nome"
                          value={nome}
                      />
                      <input 
                          type="email" 
                          required 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="E-mail"
                          value={email}
                      />
                      <input 
                          type="password" 
                          required 
                          onChange={(e) => setSenha(e.target.value)} 
                          placeholder="Senha"
                          value={senha}
                      />
                      <input 
                          type="password" 
                          required 
                          onChange={(e) => setConfirmaSenha(e.target.value)} 
                          placeholder="Senha"
                          value={confirmaSenha}
                      />
                      <button type="submit">Cadastrar</button>      
                      <LinkPersonalizado to={"/"}>Voltar para Login</LinkPersonalizado>
                  </Inputs>               
              </ContainerInputs>
          </div>
      </Container>
    )
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #8C2EBE;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  p { 
    font-family: 'Saira Stencil One';
    font-weight: 400;
    color: #FFFFFF;
    font-size: 32px;
  }
`;

const ContainerInputs = styled.div`
  margin-top: 24px;
  p {
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    color: #FFFFFF;
    margin-top: 36px;
    margin-left: 16%;
    line-height: 18px;
    margin-left: 75px;
  }
`;

const Inputs = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    width: 326px;
    height: 46px;
    background-color: #A328D6;
    border-radius: 5px;
    border-style: none;
    color: #FFFFFF;
    font-family: 'Raleway';
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  input {
    width: 324px;
    height: 58px;
    background: #FFFFFF;
    border-radius: 5px;
    margin-bottom: 13px;
    border-style: none;
    font-family: 'Raleway';
    font-size: 24px; 
    ::placeholder {
      font-family: 'Raleway';
      font-weight: 700;
      font-size: 20px;
      line-height: 23px;
      color: #000000;
      padding: 3%;
    }
  }  
`;

const LinkPersonalizado = styled(Link)`
  width: 326px;
  height: 46px;
  background-color: #A328D6;
  border-radius: 5px;
  border-style: none;
  color: #FFFFFF;
  font-family: 'Raleway';
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 10px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;