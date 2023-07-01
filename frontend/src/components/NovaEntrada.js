import axios from "axios";
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function NovaEntrada({ valor, setValor, descricao, setDescricao }){
    const navigate = useNavigate();

    function inserirNovaEntrada(e){
        e.preventDefault();

        const token = localStorage.getItem("token");

        const requisicao = axios.post(`${process.env.REACT_APP_API_URL}/registros`, { 
            valor: valor, 
            descricao: descricao
        }, {
            headers: {
                "Authorization": `${token}`
            }
        })
            requisicao.then((res) => {
                navigate("/home");
            })
            requisicao.catch(err => {
                console.log("Algo deu errado no envio dos dados!", err);
            })  
    }

    return (
        <Container>
            <Tela>
                <Topo>
                    <p>Nova entrada</p>
                </Topo>

                <Formulario>
                    <form onSubmit={inserirNovaEntrada}>
                    <input 
                        placeholder="Valor"
                        type="number"
                        onChange={(e) => setValor(e.target.value)}
                        value={valor}
                        required
                    />
                    <input 
                        placeholder="Descrição"
                        type="text"
                        onChange={(e) => setDescricao(e.target.value)}
                        value={descricao}
                        required
                    />
                    <button type="submit"><p>Salvar entrada</p></button>
                    </form>
                </Formulario>
            </Tela>
        </Container>
    )
}

const Container = styled.div`
width: 100vw;
height: 100vh;
background: #8C2EBE;
display: flex;
flex-direction: row;
justify-content: center;
`;

const Tela = styled.div`
  width: 85%;
  background-color: ${(props) => (props.tipo === 'entrada' ? '#2ECC71' : '')};
`;

const Topo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 25px;
    p {
        font-family: "Raleway";
        font-weight: 700;
        font-size: 26px;
        color: #FFFFFF;
    }
    ion-icon {
        width: 40px;
        height: 40px;
        color: white;
    }
`;

const Formulario = styled.div`
    margin-top: 40px;
    input {
        width: 99%;
        height: 58px;
        background-color: #FFFFFF;
        border-radius: 5px;
        border-style: none;
        margin-bottom: 13px;
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
    button {
        width: 100%;
        height: 58px;
        background-color: #A328D6;
        border-radius: 5px;
        border-style: none;
        display: flex;
        justify-content: center;
        align-items: center;
        p {
            font-family: 'Raleway';
            font-style: normal;
            font-weight: 700;
            font-size: 20px;
            line-height: 23px;
            color: #FFFFFF;
        }
    }
`;
