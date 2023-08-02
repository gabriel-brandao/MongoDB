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
        const {inputUsername, inputPassword} = request.body;
        try {
            const usuario = await Usuario.findOne({cpf: inputUsername});
            response.usuario = usuario;
            if (!usuario) {
                return response.status(404).json({ erro: "Usuário ou senha inválido." });
            }
            const comparar = await bcrypt.compare(inputPassword, usuario.senha);
            if (!comparar) {
                return response.status(500).json({ erro: "Usuário ou senha inválido." });
            }
            
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }

        next();
    },

    async redireciona(request, response) {
        const inputUsername = request.body.inputUsername;
        let caminho;
        try {
            const usuario = await Usuario.findOne({cpf: inputUsername});
            response.usuario = usuario;
            switch (usuario.privilegio) {
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
            return caminho;
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },
}