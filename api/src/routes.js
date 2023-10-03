//Esse arquivo concentrará as rotas

//importação da biblioteca
const express = require("express");
const path = require("path"); //para caminho do diretório

const axios = require("axios");

const fs = require('fs');

const sh = require("shelljs");

const { spawn } = require('child_process');

//importar o responsavel por organizar as rotas
const routes = express.Router();

//para receber dados do formulario html no request.body
routes.use(express.urlencoded());

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
routes.get("/", (request, response) => {
    //path.join caminho do e nome do diretorio
    response.sendFile(path.join(__dirname + "/views/index.html"));
});

// Rota para processar a tentativa de login
routes.post("/login", UsuarioMiddleware.validaLogin);

// Rota que serve a página com base no privilégio
routes.get("/dashboard", (request, response) => {
    if (!request.session.privilegio) {
        return response.status(403).send('Acesso negado');
    }

    let caminho;
    switch (request.session.privilegio) {
        case "admin":
            caminho = "/views/systemAdmin.html";
            break;
        case "compras":
            caminho = "/views/compras.html";
            break;
        case "gestor":
            caminho = "/views/gestor.html";
            break;
        case "repositor":
            caminho = "/views/repositor.html";
            break;
        default:
            break;
    }

    response.sendFile(path.join(__dirname, caminho));
});

routes.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard'); // ou outra rota caso ocorra um erro
        }
        res.clearCookie('sid'); // 'sid' é o nome padrão do cookie de sessão, mas pode ser diferente se você o tiver configurado de outra forma.
        res.redirect('/index.html');
    });
});

//passa a arrow function importada
routes.get("/produtos", ProdutoController.index);
routes.post("/produtos", ProdutoController.cadastra);//apesar de serem URL identicas a função será diferente
routes.get("/produto/:id", ProdutoMiddleware.obterProduto);
routes.put("/produtos/:id", ProdutoMiddleware.validarId, ProdutoController.atualiza);
routes.delete("/produtos/:id", ProdutoMiddleware.validarId, ProdutoController.exclui);

// para categorias
routes.get("/categorias", CategoriaController.index);
routes.post("/categorias", CategoriaController.cadastra);
routes.get("/categoria/:id", CategoriaMiddleware.obterCategoria);
routes.put("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.atualiza);
routes.patch("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.atualizaProdutos);
routes.delete("/categorias/:id", CategoriaMiddleware.validarId, CategoriaController.exclui);

// para usuarios
routes.get("/usuarios", UsuarioController.index);
routes.post("/usuarios", UsuarioController.cadastra);
routes.get("/usuario/:id", UsuarioMiddleware.obterUsuario);
routes.put("/usuarios/:id", UsuarioMiddleware.validarId, UsuarioController.atualiza);
routes.delete("/usuarios/:id", UsuarioMiddleware.validarId, UsuarioController.exclui);

// para gondula
routes.get("/gondulas", GondulaController.index);
routes.post("/gondula", GondulaController.cadastra);
routes.get("/gondula/:id", GondulaMiddleware.obterGondula);
routes.put("/gondula/:id", GondulaMiddleware.validarId, GondulaController.atualiza);
routes.delete("/gondula/:id", GondulaMiddleware.validarId, GondulaController.exclui);

// para planograma
routes.get("/planograma", PlanogramaController.index);
routes.post("/planograma", PlanogramaController.cadastra);
routes.get("/planograma/:id", PlanogramaMiddleware.obterPlanograma);
routes.delete("/planograma/:id", PlanogramaMiddleware.validarId, PlanogramaController.exclui);

// routes.post("/shell", () => {
//     sh.echo("SUCESSO!!! (mensagem no console do backend/terminal)");
// });

let isProcessingPlan = false;

routes.post("/gerarPlanograma", async (req, res) => {
    try {
        isProcessingPlan = true;

        const { idGondula } = req.body;

        const gondula = await GondulaMiddleware.gondulaPlan(idGondula);
        if (!gondula) return res.status(404).send("Gôndula não encontrada.");

        const categorias = await CategoriaMiddleware.categoriaPlan(gondula);

        let dadosDat = `
        H = ${gondula.altura};
        W = ${gondula.largura};
        qtdeNiveis = ${gondula.quantidadeDeNiveis};
        qtdeCategorias = ${categorias.length};
        `;

        let Wmin = [];
        let Wmax = [];
        let Ir = [];
        let h = [];
        let w = [];
        let d = [];
        let dMin = [];
        let v = []; 
        let l = []; 
        let indiceProdutoAtual = 1;

        for (let categoria of categorias) {
            Wmin.push(categoria.larguraMinima);
            Wmax.push(categoria.larguraMaxima);

            let indicesCategoria = [];
            const produtos = await ProdutoMiddleware.produtosPorIds(categoria.produtos);
            let vCategoria = [];

            for (let produto of produtos) {
                indicesCategoria.push(indiceProdutoAtual);
                
                h.push(produto.altura);
                w.push(produto.largura);
                d.push(produto.maximoProdutos);
                dMin.push(produto.minimoProdutos);
                l.push(1); // mudar para 2 se necessario

                let vProduto = [];
                for (let i = 0; i < gondula.quantidadeDeNiveis; i++) {
                    vProduto.push(produto.valorUtilidade * categoria.valorPorArea[gondula.regioes[i]]);
                }
                vCategoria.push(vProduto);

                indiceProdutoAtual++;
            }
            Ir.push(`{${indicesCategoria.join(",")}}`);
            v.push(`[${vCategoria.map(x => x.join(",")).join("], [")}]`);
        }

        dadosDat += `
        Wmin = [${Wmin.join(",")}];
        Wmax = [${Wmax.join(",")}];

        Ir = [${Ir.join(",")}];
        h = [${h.join(",")}];
        w = [${w.join(",")}];
        d = [${d.join(",")}];
        dMin = [${dMin.join(",")}]; // descomentar se necessario 
        
        v = [${v.join(", ")}];
        
        
        l = [${l.join(",")}];
        `;

      
        const dirPath = path.join(__dirname, 'solver');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        
        const filePath = path.join(__dirname, 'solver', 'dados.dat');
        fs.writeFileSync(filePath, dadosDat);

        // sh.cd('src/solver');
        // sh.exec('oplrun modeloMercado.mod dados.dat');
        // sh.cd('../../');
        // teste:
        // sh.cd('src/solver');
        // sh.exec('oplrun modeloMercado3.mod supermecOleos.dat');
        // sh.cd('../../');

        const child = spawn('oplrun', ['ModeloNovoArquivo.mod', 'supermec2.dat'], {
            cwd: path.join(__dirname, 'solver'), // define o diretório de trabalho
        });

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            if (code !== 0) {
                console.log(`O processo filho retornou o código ${code}`);
            } else {
                fs.readFile( dirPath + '/modelRun.txt', 'utf8', (err, data) => {
                    if (err) {
                        return res.status(500).json({ error: "Erro ao ler o arquivo." });
                    }
                
                    // Processar os dados e converter em objeto
                    let structuredData = PlanogramaMiddleware.processData(data);

                    structuredData.usuario = req.session.usuario;
                    structuredData.gondula = gondula.nome;
                    structuredData._id = '';
                                    
                    // Salvar no BD
                    PlanogramaController.cadastra(structuredData);
                });
                console.log('O processo filho foi concluído com sucesso');
            }
            isProcessingPlan = false;
            res.send({ success: true });
        });

        console.log('O processamento do plano começou.');

    } catch (err) {
        isProcessingPlan = false;
        res.status(500).send(err.message);
    }
});

routes.get('/statusPlanograma', (req, res) => {
    res.json({ processing: isProcessingPlan });
});

//exporta a função para o server
module.exports = routes;