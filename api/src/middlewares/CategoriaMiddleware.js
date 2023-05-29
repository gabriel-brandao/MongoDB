const { validate: isUuid } = require("uuid");
const Categoria = require("../models/Categoria");

module.exports = {
    async validarId(request, response, next) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const categoria = await Categoria.findById(id);
            response.categoria = categoria;
            if (!categoria) {
                return response.status(404).json({ error: "Categoria não encontrada." });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }

        next();
    }
}