const {response} = require("express");
const Usuario = require("../models/Usuario");

module.exports = {
   async index(request, response){
        try{
            const usuarios = await Usuario.find();

            return response.status(200).json({usuarios});
        } 
         catch(err) {
            response.status(500).json({error: err.message});
        }
    },

    //rota de criação
    async cadastra (request, response){
        //corpo da requisição (info obrigatórias)
        const {cpf, nome, senha, privilegio} = request.body;

        if(!cpf)
            return response.status(400).json({error: "informe o cpf"});
         // providenciar método para validar cpf

        if(!nome)
            return response.status(400).json({error: "informe o nome"});

        if(!senha)
            return response.status(400).json({error: "informe uma senha"});
         // providenciar método para validação de senha

        if(!privilegio)
            return response.status(400).json({error: "Informe o cargo"});
        

        //instanciar um novo usuario
        const usuario = new Usuario ({
            cpf, 
            nome,
            senha,
            privilegio
        });

        try{
            //tenta salvar no BD
            await usuario.save();

            return response.status(201).json({message: "Usuario cadastrado com Sucesso !!"});
        }
         catch (err){
            //caso der errado
            response.status(400).json({error: err.message});
         }
    }
}