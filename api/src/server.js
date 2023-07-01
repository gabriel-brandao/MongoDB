//onde inicializaremos a aplicação em node que são baseadas em rotas, pra executar algo
//usa o framework express para facilitar o roteamento no backend

//importa já executando uma funcção dentro dele
require("dotenv").config();


//importação da biblioteca
const express = require("express");
//importando mongoose
const mongoose = require("mongoose");

//importa as rotas do arquivo routes (dentro de src)
const routes = require("./routes");
//importa do arquivo database.js o modulo
const connectToDatabase = require("./database")

//executa a função
connectToDatabase();

//executa o express, e pede pra ele executar as rotas
const app = express();
const port = 3333;

app.use(express.static(__dirname + '/views'));

//o express passa a entender JSON, e peço para usar as rotas
app.use(express.json());
app.use(routes);

//porta onde ficará ouvindo (onde a aplicação ira startar - 3333 convenção), função que executará quando a porta for acessada
app.listen(3333, () => {
    console.log(`⚡ Back-End iniciado em http://localhost:${port}`); //abrir esse link on terminal
})

