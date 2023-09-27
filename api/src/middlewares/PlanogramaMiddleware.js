const { validate: isUuid } = require("uuid");
const Planograma = require("../models/Planograma");

module.exports = {
    async validarId(request, response, next) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const planograma = await Planograma.findById(id);
            response.planograma = planograma;
            if (!planograma) {
                return response.status(404).json({ error: "Planograma não encontrado." });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }

        next();
    },

    processData(data) {
        const lines = data.split('\n').map(line => line.trim());
        const result = {};
    
        let currentModule = null;
        let currentLevel = null;
    
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('no_modulos')) {
                result.no_modulos = parseInt(lines[i].split(' ')[1]);
                result.modulos = [];
            } else if (lines[i].startsWith('modulo')) {
                currentModule = {
                    categoria: null,
                    largura: null,
                    no_niveis: null,
                    niveis: []
                };
                result.modulos.push(currentModule);
            } else if (lines[i].startsWith('categoria')) {
                currentModule.categoria = parseInt(lines[i].split(' ')[1]);
            } else if (lines[i].startsWith('largura')) {
                currentModule.largura = parseInt(lines[i].split(' ')[1]);
            } else if (lines[i].startsWith('no_niveis')) {
                currentModule.no_niveis = parseInt(lines[i].split(' ')[1]);
            } else if (lines[i].startsWith('nivel')) {
                currentLevel = {
                    altura: null,
                    tipos_itens: null,
                    itens: [],
                    quantidade: []
                };
                currentModule.niveis.push(currentLevel);
            } else if (lines[i].startsWith('altura')) {
                currentLevel.altura = parseInt(lines[i].split(' ')[1]);
            } else if (lines[i].startsWith('tipos_itens')) {
                currentLevel.tipos_itens = parseInt(lines[i].split(' ')[1]);
            } else if (lines[i].startsWith('itens')) {
                currentLevel.itens = lines[i].split(' ').slice(1).map(item => parseInt(item));
            } else if (lines[i].startsWith('quantidade')) {
                currentLevel.quantidade = lines[i].split(' ').slice(1).map(qty => parseInt(qty));
            }
        }
    
        return result;
    },

    async obterPlanograma(request, response) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const planograma = await Planograma.findById(id);
            if (!planograma) {
                return response.status(404).json({ error: "Planograma não encontrado." });
            } else {
                return response.status(200).json({ planograma: planograma });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }
}