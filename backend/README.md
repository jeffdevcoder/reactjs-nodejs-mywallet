# My Wallet (Back-end)

O MyWallet é um aplicativo de gestão financeira que permite aos usuários registrar suas entradas e saídas de dinheiro. A interface do usuário foi desenvolvida usando a biblioteca React, garantindo uma experiência interativa e responsiva. No lado do servidor, o projeto utiliza o Node.js juntamente com o banco de dados MongoDB. O aplicativo oferece uma visão geral das finanças do usuário, incluindo acompanhamento do saldo e análise das transações realizadas. Para complementar o projeto, o código-fonte do front-end pode ser encontrado neste repositório: https://github.com/jeffgon/mywallet-frontend. O front-end é a camada que os usuários interagem diretamente, ele se comunica com o back-end para enviar e receber dados, permitindo que os usuários visualizem, adicionem, editem ou excluam transações financeiras.

- Clone ou baixe o repositório do front-end em https://github.com/jeffgon/mywallet-frontend.

- Abra um terminal e navegue até o diretório do projeto.

- Execute o comando npm install para instalar as dependências necessárias. Verifique se você tem o Node.js e o npm instalados em sua máquina.

- Certifique-se de ter o MongoDB instalado em sua máquina. Se necessário, siga as instruções logo abaixo na sessão Tutorial banco de dados.

- Após a conclusão da instalação das dependências, execute o comando npm start para iniciar o servidor.

- O servidor estará em execução em http://localhost:8000. Ele se conectará ao banco de dados MongoDB localmente.

Tutorial banco de dados:

- Certifique-se de ter o MongoDB instalado em sua máquina. Caso ainda não tenha, faça o download do MongoDB em https://www.mongodb.com/ e siga as instruções de instalação adequadas para o seu sistema operacional.

- Após a instalação, abra um terminal ou prompt de comando e inicie o servidor do MongoDB executando o seguinte comando: "mongod". Isso iniciará o servidor do MongoDB localmente na porta padrão 27017. 

- Abra uma nova janela do terminal ou prompt de comando e navegue até o diretório do projeto clonado, onde está localizado o back-end que utiliza o MongoDB.

- Verifique se você tem o Node.js e o npm instalados em sua máquina. Caso não tenha, você pode fazer o download do Node.js em https://nodejs.org/ e seguir as instruções de instalação apropriadas para o seu sistema operacional.

- No terminal, execute o comando npm install para instalar as dependências do projeto.

- Em seguida, localize o arquivo de configuração do projeto, que geralmente é chamado de .env ou config.js. Abra o arquivo em um editor de texto.

- Dentro do arquivo de configuração, você encontrará as configurações de conexão com o banco de dados MongoDB, incluindo o host, a porta, o nome do banco de dados e outras informações relevantes. Verifique se essas configurações estão corretas para sua máquina local. Geralmente, o host será definido como localhost e a porta como 27017, a menos que você tenha alterado essas configurações durante a instalação do MongoDB.

- Salve as alterações no arquivo de configuração.

- Agora você está pronto para criar o banco de dados e suas coleções. No terminal, execute o seguinte comando para inicializar o banco de dados: "npm run db:create". Isso criará o banco de dados com as coleções necessárias com base nas configurações especificadas no arquivo de configuração.

- Por fim, execute o comando npm start para iniciar o servidor do back-end.
