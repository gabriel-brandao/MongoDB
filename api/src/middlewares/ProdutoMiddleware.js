const { validate: isUuid } = require("uuid");
const Produto = require("../models/Produto");

module.exports = {
    async validarId(request, response, next) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const produto = await Produto.findById(id);
            response.produto = produto;
            if (!produto) {
                return response.status(404).json({ error: "Produto não encontrado." });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }

        next();
    },

    async obterProduto(request, response) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const produto = await Produto.findById(id);
            if (!produto) {
                return response.status(404).json({ error: "Produto não encontrado." });
            } else {
                return response.status(200).json({ produto: produto });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },

    async produtosPorIds(ids) {
        const produtos = await Produto.find({ "_id": { $in: ids } }).lean();
        return produtos;
    }
}