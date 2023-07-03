# My Wallet

O MyWallet é um aplicativo de gestão financeira que permite aos usuários registrar suas entradas e saídas de dinheiro. A interface do usuário foi desenvolvida usando a biblioteca React, garantindo uma experiência interativa e responsiva. No lado do servidor, o projeto utiliza o Node.js juntamente com o banco de dados MongoDB. O aplicativo oferece uma visão geral das finanças do usuário, incluindo acompanhamento do saldo e análise das transações realizadas.

[![Vídeo do Loom](https://cdn.loom.com/sessions/thumbnails/263febee405c4909aabc429bea612d60-with-play.gif)](https://www.loom.com/share/263febee405c4909aabc429bea612d60)


## Configuração do ambiente de desenvolvimento

### Pré-requisitos

- Node.js (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/)

### Front-end

O front-end é a camada que os usuários interagem diretamente, ele se comunica com o back-end para enviar e receber dados, permitindo que os usuários visualizem, adicionem entradas e saídas financeiras.

#### Instalação e execução

1. Abra um terminal e navegue até o diretório do projeto.
2. Execute o comando `npm install` para instalar as dependências necessárias.
3. Após a conclusão da instalação, execute o comando `npm start` para iniciar o servidor de desenvolvimento.
4. O front-end estará disponível em http://localhost:5000 no seu navegador. Você poderá interagir com o aplicativo MyWallet e gerenciar suas finanças.

### Back-end

O back-end é responsável por gerenciar os dados e fornecer as funcionalidades necessárias para a aplicação funcionar corretamente.

#### Configuração do banco de dados

Certifique-se de ter o MongoDB instalado em sua máquina. Caso ainda não tenha, faça o download do MongoDB em https://www.mongodb.com/ e siga as instruções de instalação adequadas para o seu sistema operacional.


### Mongodb ara Ubuntu 22.04+ (terminal):
sudo apt-get install gnupg wget
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update

wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
sudo apt install -y mongodb-org
mkdir ~/.mongo

### Iniciando servidor

1. Após a instalação, abra um terminal ou prompt de comando e inicie o servidor do MongoDB executando o seguinte comando: `mongod --dbpath ~/.mongo`. Isso iniciará o servidor do MongoDB localmente na porta padrão 27017.

2. Abra uma nova janela do terminal ou prompt de comando e navegue até o diretório do projeto clonado, onde está localizado o back-end que utiliza o MongoDB.

3. Verifique se você tem o Node.js e o npm instalados em sua máquina. Caso não tenha, você pode fazer o download do Node.js em https://nodejs.org/ e seguir as instruções de instalação apropriadas para o seu sistema operacional.

4. No terminal, execute o comando `npm install` para instalar as dependências do projeto.

5. Em seguida, localize o arquivo de configuração do projeto, chamado de `.env`. Abra o arquivo em um editor de texto.

6. Dentro do arquivo de configuração, você encontrará as configurações de conexão com o banco de dados MongoDB, incluindo o host, a porta, o nome do banco de dados e outras informações relevantes. Verifique se essas configurações estão corretas para sua máquina local. O host será definido como `localhost` e a porta como `27017`, a menos que você tenha alterado essas configurações durante a instalação do MongoDB.

7. Salve as alterações no arquivo de configuração.

#### Execução do back-end

1. Agora você está pronto para criar o banco de dados e suas coleções. No terminal, execute o seguinte comando para inicializar o banco de dados: `npm run db:create`. Isso criará o banco de dados com as coleções necessárias com base nas configurações especificadas no arquivo de configuração.

2. Por fim, execute o comando `npm start` para iniciar o servidor do back-end.
