import styled from "styled-components"
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react"
import dotenv from "dotenv"
import { AuthContext } from "../provider";

dotenv.config()


export default function Login({ email, senha, setEmail, setSenha }) {
    const { setToken } = React.useContext(AuthContext);
    const navigate = useNavigate();

    function fazerLogin(e){
        e.preventDefault();

        const requisicao = axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, senha });
        
        requisicao.then((res) => {
            setToken(res.data);
            navigate("/home");           
        })
        requisicao.catch((err) => console.log(err));
    };

    return (
        <Container>
            <div>
                <Logo>
                    <p>MyWallet</p>      
                </Logo>

                <ContainerInputs>
                    <Inputs>
                    <form onSubmit={fazerLogin}>
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
                        <button type="submit">Entrar</button>
                    </form>
                    </Inputs>
                    <p>Primeira vez? <LinkPersonalizado to={"/cadastro"}>Cadastre-se!</LinkPersonalizado></p>
                </ContainerInputs>
            </div>
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

const Logo = styled.div`
    margin-top: 150px;
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

const Inputs = styled.div`
    width: 326px;
    input {
        width: 326px;
        height: 58px;
        background: #FFFFFF;
        border-radius: 5px;
        margin-bottom: 13px;
        border-style: none;
        font-family: 'Raleway';
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
        width: 326px;
        height: 46px;
        background-color: #A328D6;
        border-radius: 5px;
        border-style: none;
        color: #FFFFFF;
        font-family: 'Raleway';
        font-weight: 700;
        font-size: 20px;
    }
`;

const LinkPersonalizado = styled(Link)`
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    color: #FFFFFF;
    margin-top: 36px;
    line-height: 18px;
    text-decoration: none;
`;
