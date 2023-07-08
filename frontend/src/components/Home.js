import styled from "styled-components";
import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Home({ nome, setNome, info, setInfo }){
    const navigate = useNavigate();

    useEffect(() => {
      const nome = localStorage.getItem("nome");
      if (nome) {
        setNome(nome);
      }
    }, [setNome]);

    useEffect(() => {
        localStorage.setItem("nome", nome);
    }, [nome]);

   
    useEffect(() => {
        const token = localStorage.getItem("token");

        const requisicao = axios.get(`${process.env.REACT_APP_API_URL}/registros`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        requisicao.then((res) => {
            console.log("chegou as informações de registro!", res.data);
            setInfo(res.data);
            localStorage.setItem("info", JSON.stringify(res.data));
        })
        requisicao.catch((err) => {
            console.log("Algo deu erro no banco de dados!", err);
        })
    },[])

   useEffect(() => {
    const infoData = localStorage.getItem("info");
        if (infoData) {
        setInfo(JSON.parse(infoData));
        }
    }, [setInfo]);

  useEffect(() => {
    localStorage.setItem("info", JSON.stringify(info));
  }, [info]);

    function voltarParaLogin(){
        navigate("/");
    }

    return (
      <Container>
      <Tela>
          <Topo>
            <p>Olá, {nome}</p>
            <ion-icon onClick={voltarParaLogin} name="exit-outline"></ion-icon>
          </Topo>

          {info.length === 0 ? (
            <ContainerSemInformacoes>
              <div>
                <p>Não há registros de entrada ou saída</p>
              </div>
            </ContainerSemInformacoes>
          ) : (
            <ContainerInformacoes>
              <section>
                {info.map((i) => (
                  <div key={i._id}>
                    <p>{i.data}</p>
                    <h1>{i.descricao}</h1>
                    <h2 style={{ color: i.tipo === "entrada" ? "green" : "red" }}>R${i.valor}</h2>
                  </div>
                ))}
              </section>
            </ContainerInformacoes>
          )}

          <Botoes>
            <Link to={"/nova-entrada"}>
              <button>
                <ion-icon name="add-circle-outline"></ion-icon>
                <p>Nova entrada</p>
              </button>
            </Link>

            <Link to={"/nova-saida"}>
              <button>
                <ion-icon name="remove-circle-outline"></ion-icon>
                <p>Nova saída</p>
              </button>
            </Link>
          </Botoes>        
      </Tela>
      </Container>
    );
}


const Tela = styled.div`
  width: 90%;
  height: 100vh;
  background-color: #8C2EBE;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #8C2EBE;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Topo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 25px;
    p {
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 700;
        font-size: 30px;
        line-height: 31px;
        color: #FFFFFF;
    }
    ion-icon {
        width: 40px;
        height: 40px;
        color: white;
    }
`;

const ContainerSemInformacoes = styled.div`
    width: 100%;
    height: 450px;
    background-color: white;
    margin-top: 18px;
    border-radius: 5px;
    position: relative;
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 7px;
        height: 100%;
        p {
            font-family: 'Raleway';
            font-style: normal;
            font-weight: 700;
            font-size: 20px;
            line-height: 19px;
            color: gray;
        }
    }
`;

const ContainerInformacoes = styled.div`
    width: 100%;
    height: 450px;
    background-color: white;
    margin-top: 18px;
    border-radius: 5px;
    position: relative;
    display: flex;
    justify-content: center;
    section {
        position: absolute;
        width: 90%;
        height: 85%;
        margin-left: 15px;
        margin-top: 15px;
        overflow-y: scroll;
        div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 7px;
            height: 40px;
            p {
                font-family: 'Raleway';
                font-style: normal;
                font-weight: 700;
                font-size: 20px;
                line-height: 19px;
                color: gray;
            }
            h1 {
                font-family: 'Raleway';
                font-style: normal;
                font-weight: 700;
                font-size: 16px;
                line-height: 19px;
                color: #000000;
            }
            h2 {
                font-family: 'Raleway';
                font-style: normal;
                font-weight: 700;
                font-size: 18px;
                line-height: 19px;
                text-align: right;
                color: green;
            }
        }
    }
`;

const Botoes = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 13px;
    margin-bottom: 25px;
    button {
        width: 155px;
        height: 100px;
        background-color: #A328D6;
        border-radius: 5px;
        border-style: none;
        position: relative;
        ion-icon {
            width: 25px;
            height: 25px;
            position: absolute;
            left: 4px;
            top: 2px;
            color: white;
        }
        p {
            width: 20px;
            position: absolute;
            bottom: 9px;
            left: 10px;
            font-family: 'Raleway';
            font-style: normal;
            font-weight: 700;
            font-size: 17px;
            line-height: 20px;
            color: #FFFFFF;
        }
    }
`;