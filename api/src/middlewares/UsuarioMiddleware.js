const { validate: isUuid } = require("uuid");
const Usuario = require("../models/Usuario");
const path = require("path");
const bcrypt = require("bcrypt");

module.exports = {
    async validarId(request, response, next) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const usuario = await Usuario.findById(id);
            response.usuario = usuario;
            if (!usuario) {
                return response.status(404).json({ error: "Usuário não encontrado." });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }

        next();
    },

    async validaLogin(request, response, next) {
        const { inputUsername, inputPassword } = request.body;
        try {
            const usuario = await Usuario.findOne({ cpf: inputUsername });
            if (!usuario) {
                return response.json({ erro: "Usuário ou senha inválidos! Favor, tente novamente!" });
            }
    
            const comparar = await bcrypt.compare(inputPassword, usuario.senha);
            if (!comparar) {
                return response.json({ erro: "Usuário ou senha inválidos! Favor, tente novamente!" });
            }
    
            // Armazena o privilégio e o nome do usuário na sessão
            request.session.privilegio = usuario.privilegio;
            request.session.usuario = usuario.nome; 
    
            // Retorna uma resposta de sucesso
            return response.json({ sucesso: true });
    
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },

    async obterUsuario(request, response) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return response.status(404).json({ error: "Usuario não encontrado." });
            } else {
                return response.status(200).json({ usuario: usuario });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }
}