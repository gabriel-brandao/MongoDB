//Esse arquivo concentrará as rotas

//importação da biblioteca
const express = require("express");

//importar o responsavel por organizar as rotas
const routes = express.Router();

const ProdutoController = require("./controllers/ProdutoController");
const CategoriaController = require("./controllers/CategoriaController");
const UsuarioController = require("./controllers/UsuarioController");
const GondulaController = require("./controllers/GondulaController");
const PlanogramaController = require("./controllers/PlanogramaController");
const CategoriaMiddleware = require("./middlewares/CategoriaMiddleware");


/*
Rotas são os parametros da URL, tudo que queremos acessar é baseado em rotas 
há varias maneiras de se fazer essa requisição

como iremos identificar as requisições no back-End:

GET: busca informação
POST: Cria uma informação
PUT: Edita um informação por completo
PATCH: Modificar apenas uma parte da informação
DELETE: Deleta uma informação
*/

//rota home (raiz), função que será executada assim que o / for acessado (request: o que a rota esta enviando para o Back, response: o que o Back enviará para a rota apos a manipulação)
routes.get("/", (request, response)=>{
    //envia para a aplicação
    response.send("Hello World");
});

//passa a arrow function importada
routes.get("/produtos", ProdutoController.index);
routes.post("/produtos", ProdutoController.cadastra);//apesar de serem URL identicas a função será diferente



// para categorias
routes.get("/categorias", CategoriaController.index);
routes.post("/categorias", CategoriaController.cadastra);
routes.put("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.atualiza);
routes.patch("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.atualizaSortimento);
routes.delete("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.exclui);

// para usuarios
routes.get("/usuarios", UsuarioController.index);
routes.post("/usuarios", UsuarioController.cadastra);

// para gondula
routes.get("/gondula", GondulaController.index);
routes.post("/gondula", GondulaController.cadastra);

// para planograma
routes.get("/planograma", PlanogramaController.index);
routes.post("/planograma", PlanogramaController.cadastra);


//exporta a função para o server
module.exports = routes;