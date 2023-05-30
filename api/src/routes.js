//Esse arquivo concentrará as rotas

//importação da biblioteca
const express = require("express");
const path = require("path"); //para caminho do diretório

//importar o responsavel por organizar as rotas
const routes = express.Router();

const ProdutoController = require("./controllers/ProdutoController");
const ProdutoMiddleware = require("./middlewares/ProdutoMiddleware");
const CategoriaController = require("./controllers/CategoriaController");
const CategoriaMiddleware = require("./middlewares/CategoriaMiddleware");
const UsuarioController = require("./controllers/UsuarioController");
const UsuarioMiddleware = require("./middlewares/UsuarioMiddleware");
const GondulaController = require("./controllers/GondulaController");
const GondulaMiddleware = require("./middlewares/GondulaMiddleware");
const PlanogramaController = require("./controllers/PlanogramaController");
const PlanogramaMiddleware = require("./middlewares/PlanogramaMiddleware");


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
    console.log(__dirname);
    //path.join caminho do e nome do diretorio
    response.sendFile(path.join(__dirname + "/index.html")); 
});

//passa a arrow function importada
routes.get("/produtos", ProdutoController.index);
routes.post("/produtos", ProdutoController.cadastra);//apesar de serem URL identicas a função será diferente
routes.put("/produtos/:id", ProdutoMiddleware.validarId, ProdutoController.atualiza);
routes.delete("/produtos/:id", ProdutoMiddleware.validarId, ProdutoController.exclui);

// para categorias
routes.get("/categorias", CategoriaController.index);
routes.post("/categorias", CategoriaController.cadastra);
routes.put("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.atualiza);
routes.patch("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.atualizaSortimento);
routes.delete("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.exclui);

// para usuarios
routes.get("/usuarios", UsuarioController.index);
routes.post("/usuarios", UsuarioController.cadastra);
routes.put("/usuarios/:id", UsuarioMiddleware.validarId, UsuarioController.atualiza);
routes.delete("/usuarios/:id", UsuarioMiddleware.validarId, UsuarioController.exclui);

// para gondula
routes.get("/gondula", GondulaController.index);
routes.post("/gondula", GondulaController.cadastra);
routes.put("/gondula/:id", GondulaMiddleware.validarId, GondulaController.atualiza);
routes.delete("/gondula/:id", GondulaMiddleware.validarId, GondulaController.exclui);

// para planograma
routes.get("/planograma", PlanogramaController.index);
routes.post("/planograma", PlanogramaController.cadastra);
routes.delete("/planograma/:id", PlanogramaMiddleware.validarId, PlanogramaController.exclui);


//exporta a função para o server
module.exports = routes;