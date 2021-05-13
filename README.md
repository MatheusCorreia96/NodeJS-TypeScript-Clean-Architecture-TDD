<h1 align="center">
    Technical Challenge
</h1>

# Tecnologias

Este projeto foi construído utilizando as seguintes tecnologias:

- [NodeJS](https://nodejs.org/en/)
- [Tyepscript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [DynamoDB](https://aws.amazon.com/pt/dynamodb/)

# Como utilizar

Para executar essa aplicação, você irá precisar do NodeJS em sua versão 12 ou superior.

- ## Instalando DynamoDB

  Após clonar o projeto, basta executar em um terminal o seguinte comando, na raiz do projeto: `./setup.sh` . Esse comando irá executar um bash para a instalação do banco de dados (`DynamoDB`) localmente.

- ## Instalando Dependências

  Após a instalação do banco de dados, em outro terminal basta executar o seguinte comando: `./run.sh` . Esse comando vai executar o bash responsável por instalar as dependências do projeto, criar as tabelas do banco de dados e iniciar a aplicação localmente.

  Também é possivel a instalação das dependências via `npm install` ou `npm run build` esse último também ira buildar a aplicação.

- ## Inicializando a aplicação localmente

  Antes de iniciar a aplicação é possivel alterar as configurações da aplicação pelos arquivos `/src/infra/config/git-ignored/config.json` e `/src/infra/config/git-ignored/databases.json`.

  É possivel iniciar a aplicação de duas maneiras, a primeira é executando o comando `./run.sh` , que ira instalar as dependêcias do projeto, criar as tabelas do banco de dados e iniciar a aplicação localmente.

  Também é possivel iniciar a aplicação através de `npm run start`

- ## Inicializando os testes

  - `npm run test`: Irá executar todos os testes do projeto;
  - `npm run test:watch`: Irá executar todos os testes do projeto em modo watch, escutando alterações em arquivos .spec;
  - `npm run coverage`: Irá executar todos os testes do projeto, ao final exibindo o coverage dos testes;
  - `npm run coverage:watch`: Irá executar todos os testes do projeto em modo watch, sempre exibindo o coverage dos testes e escutando alterações em arquivos .spec;
  - `npm run coverage-html`: Irá executar todos os testes do projeto, ao final criando uma pasta na raiz do projeto `coverage` contendo uma interface em html exibindo informações sobre os testes e o coverage deles;

- ## Documentação

  - Existe um swagger contendo as informações dos endpoints, localizado no seguinte path: `docs/api-swagger.yaml`

- ## Collection

  - Existe uma collection, pronta para ser importada e utilizada para teste dos endpoints, localizada no path: `docs/api.collection.json`

---

Desenvolvido por [Matheus Correia](https://www.linkedin.com/in/matheuscorreia96)
