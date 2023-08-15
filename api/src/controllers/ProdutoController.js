const { response } = require("express");
const { v4: uuid } = require("uuid")
const Produto = require("../models/Produto");

//objeto que conteem todas as funções que são necessárias para se chamar na routes

module.exports = {
    //função assincrona, aguarda a resposta
    async index(request, response) {
        try {
            //(await) - aguarda a resposta
            const produtos = await Produto.find().sort({ nome: 1 });
            const produtosCount = await Produto.find().count();
            if (produtosCount)
                //retorna para o cliente a requisição feita
                return response.status(200).json({ found: true, produtos });
            else
                return response.json({ found: false, msg: "<p style='color: #f00'>Não foi encontrado nenhum produto</p>" });
        }
        catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    //rota de criação
    async cadastra(request, response) {
        //corpo da requisição (info obrigatórias)
        const { nome, descricao, categoria, altura, largura, valorUtilidade, minimoProdutos, maximoProdutos } = request.body;

        if (!nome)
            return response.status(400).json({ error: "Informe o nome do produto" });

        if (!descricao)
            return response.status(400).json({ error: "Informe uma descrição para o produto" });

        if (!categoria)
            return response.status(400).json({ error: "Selecione uma categoria para o produto" });

        if (!altura)
            return response.status(400).json({ error: "Informe a altura do produto" });

        if (!largura)
            return response.status(400).json({ error: "Informe a largura do produto" });

        if (!valorUtilidade)
            return response.status(400).json({ error: "valor de utilidade não informado" });

        if (!minimoProdutos)
            return response.status(400).json({ error: "Informe o numero mínimo de frentes para o produto informado" });

        if (!maximoProdutos)
            return response.status(400).json({ error: "numero máximo de produtos não informado" });

        const id = uuid();
        //instanciar um novo produto
        const produto = new Produto({
            _id: id,
            nome,
            descricao,
            categoria,
            altura,
            largura,
            valorUtilidade,
            minimoProdutos,
            maximoProdutos
        });

        try {
            //tenta salvar no BD
            await produto.save();

            return response.status(201).json({ message: "Produto cadastrado com Sucesso !!", id });
        }
        catch (err) {
            //caso der errado
            response.status(400).json({ error: err.message });
        }
    },

    async atualiza(request, response) {
        const { nome, descricao, categoria, altura, largura, valorUtilidade, minimoProdutos, maximoProdutos } = request.body;

        response.produto.nome = nome;
        response.produto.descricao = descricao;
        response.produto.categoria = categoria;
        response.produto.altura = altura;
        response.produto.largura = largura;
        response.produto.valorUtilidade = valorUtilidade;
        response.produto.minimoProdutos = minimoProdutos;
        response.produto.maximoProdutos = maximoProdutos;

        try {
            await response.produto.save();
            return response.status(200).json({ message: "Produto atualizado com sucesso!" });
        } catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    async exclui(request, response) {
        try {
            await response.produto.deleteOne();
            return response.status(200).json({ message: "Produto excluído com sucesso!" });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },
}