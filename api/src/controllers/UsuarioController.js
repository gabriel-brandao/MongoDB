const { response } = require("express");
const { v4: uuid } = require("uuid");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

module.exports = {
    async index(request, response) {
        try {
            const usuarios = await Usuario.find().sort({ nome: 1 });
            const usuariosCount = await Usuario.find().count();
            if (usuariosCount)
                return response.status(200).json({ found: true, usuarios });
            else
                return response.json({ found: false, msg: "<p style='color: #f00'>Não foi encontrado nenhum usuário</p>" });
        }
        catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    //rota de criação
    async cadastra(request, response) {
        //corpo da requisição (info obrigatórias)
        let { cpf, nome, senha, privilegio } = request.body;

        const usuarioCheck = await Usuario.findOne({ cpf: cpf });
        if (usuarioCheck) {
            return response.json({ error: "ERRO!!! O CPF informado já está cadastrado!" });
        }

        if (!cpf)
            return response.status(400).json({ error: "informe o cpf" });
        // providenciar método para criptografar cpf

        if (!nome)
            return response.status(400).json({ error: "informe o nome" });

        if (!senha)
            return response.status(400).json({ error: "informe uma senha" });
        // providenciar método para criptografar senha

        if (!privilegio)
            return response.status(400).json({ error: "Informe o cargo" });

        senha = bcrypt.hashSync(senha, 10);

        //instanciar um novo usuario
        const usuario = new Usuario({
            _id: uuid(),
            cpf,
            nome,
            senha,
            privilegio
        });

        try {
            //tenta salvar no BD
            await usuario.save();

            return response.status(201).json({ message: "Usuario cadastrado com Sucesso !!" });
        }
        catch (err) {
            //caso der errado
            response.status(400).json({ error: err.message });
        }
    },

    async atualiza(request, response) {
        let { cpf, nome, senha, privilegio } = request.body;

        response.usuario.cpf = cpf;
        response.usuario.nome = nome;
        if (senha) {
            senha = bcrypt.hashSync(senha, 10);
            response.usuario.senha = senha;
        }
        response.usuario.privilegio = privilegio;

        try {
            await response.usuario.save();
            return response.status(200).json({ message: "Usuário atualizado com sucesso!" });
        } catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    async exclui(request, response) {
        try {
            await response.usuario.deleteOne();
            return response.status(200).json({ message: "Usuário excluído com sucesso!" });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },
}