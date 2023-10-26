/**
 * USUÁRIO
 */

const cargoSelect = document.getElementById("cargoUsuario");
if (cargoSelect) {
    cargoSelect.addEventListener("change", async () => {
        let cargoOption = cargoSelect.options[cargoSelect.selectedIndex].value;
        document.getElementById("msgSemCargo").innerHTML = "";
    });
}

async function cadastraUsuario() {
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemCpf").innerHTML = "";
    document.getElementById("msgSemSenha").innerHTML = "";
    document.getElementById("msgSenhaRepete").innerHTML = "";

    let nomeUsuario = document.getElementById('nomeUsuario').value;
    if (!nomeUsuario) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let cargoOption = cargoSelect.options[cargoSelect.selectedIndex].value;
    if (!cargoOption) {
        document.getElementById("msgSemCargo").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, selecione um Cargo para cadastrar o usuário!</p>";
        scrollTo(0, 0);
        return;
    }

    let cpfUsuario = document.getElementById('cpfUsuario').value;
    if (!cpfUsuario) {
        document.getElementById("msgSemCpf").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe o CPF do usuário para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let senhaUsuario = document.getElementById('senhaUsuario').value;
    if (!senhaUsuario) {
        document.getElementById("msgSemSenha").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe uma senha para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let senhaRepete = document.getElementById('senhaRepete').value;
    if (!senhaRepete) {
        document.getElementById("msgSenhaRepete").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, repita a senha para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    if (senhaUsuario != senhaRepete) {
        document.getElementById("msgSenhaRepete").innerHTML = "<p style='color: #f33; font-weight: bold'>As senhas devem ser iguais para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    const data = {
        cpf: cpfUsuario,
        nome: nomeUsuario,
        senha: senhaUsuario,
        privilegio: cargoOption,
    };

    const cadastrar = await axios.post("/usuarios", data);
    if (cadastrar.data.error) {
        alert(cadastrar.data.error);
    } else {
        alert(cadastrar.data.message);
        location.reload();
    }
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemCpf").innerHTML = "";
    document.getElementById("msgSemSenha").innerHTML = "";
    document.getElementById("msgSenhaRepete").innerHTML = "";
}

const usuarioSelect = document.getElementById("usuarioSelect");
if (usuarioSelect) {
    listarUsuarios();
}

if (usuarioSelect) {
    usuarioSelect.addEventListener("change", async () => {

        document.getElementById("msgSemNome").innerHTML = "";
        document.getElementById("msgSemCargo").innerHTML = "";
        document.getElementById("msgSemCpf").innerHTML = "";

        let usuarioOption = usuarioSelect.options[usuarioSelect.selectedIndex].value;
        document.getElementById("msgSemUsuarios").innerHTML = "";
        // console.log(categoriaOption);
        if (!usuarioOption) {
            document.getElementById("nomeUsuario").value = "";
            document.getElementById("cargoUsuario").value = "";
            document.getElementById("cpfUsuario").value = "";
            document.getElementById("senhaUsuario").value = "";
            document.getElementById("senhaRepete").value = "";
            return;
        }

        const obterUsuario = await axios.get("/usuario/" + usuarioOption);
        const usuarioSelecionado = obterUsuario.data.usuario;
        // console.log(produtoSelecionado);

        document.getElementById("nomeUsuario").value = usuarioSelecionado.nome;
        document.getElementById("cargoUsuario").value = usuarioSelecionado.privilegio;
        document.getElementById("cpfUsuario").value = usuarioSelecionado.cpf;
        document.getElementById("senhaUsuario").value = "";
        document.getElementById("senhaRepete").value = "";
    });
}

async function listarUsuarios() {
    const usuarios = await axios.get("/usuarios");
    const resposta = usuarios.data.usuarios
    // console.log(resposta);

    if (usuarios.data.found) {
        document.getElementById("msgSemUsuarios").innerHTML = "";

        let opcoes = '<option value="">--Selecione um Usuário--</option>';
        for (let i = 0; i < resposta.length; i++) {
            // console.log(resposta[i]['nome']);
            // usuarioSelect.innerHTML = usuarioSelect.innerHTML + '<option value="' + resposta[i]['_id'] + '">' + resposta[i]['nome'] + '</option>';
            opcoes += '<option value="' + resposta[i]["_id"] + '">' + resposta[i]["nome"] + '</option>';
        }
        if (usuarioSelect) {
            usuarioSelect.innerHTML = opcoes;
        }
        // if (categoriaProduto) {
        //     categoriaProduto.innerHTML = opcoes;
        // }

    } else {
        // console.log(categorias.data.msg)
        document.getElementById("msgSemUsuarios").innerHTML = usuarios.data.msg;
    }
}

async function atualizaUsuario() {
    let usuarioOption = usuarioSelect.options[usuarioSelect.selectedIndex].value;
    if (!usuarioOption) {
        document.getElementById("msgSemUsuarios").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione um Usuário para Alterar!</p>";
        scrollTo(0, 0);
        return;
    }

    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemCargo").innerHTML = "";
    document.getElementById("msgSemCpf").innerHTML = "";

    let nomeUsuario = document.getElementById('nomeUsuario').value;
    if (!nomeUsuario) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f33; font-weight: bold'>O usuário precisa ter um Nome!</p>";
        scrollTo(0, 0);
        return;
    }

    let cargoOption = cargoSelect.options[cargoSelect.selectedIndex].value;
    if (!cargoOption) {
        document.getElementById("msgSemCargo").innerHTML = "<p style='color: #f33; font-weight: bold'>O usuário precisa ter um Cargo!</p>";
        scrollTo(0, 0);
        return;
    }

    let cpfUsuario = document.getElementById('cpfUsuario').value;
    if (!cpfUsuario) {
        document.getElementById("msgSemCpf").innerHTML = "<p style='color: #f33; font-weight: bold'>O CPF é obrigatório!</p>";
        scrollTo(0, 0);
        return;
    }

    let senhaUsuario = document.getElementById('senhaUsuario').value;
    let senhaRepete = document.getElementById('senhaRepete').value;

    if (senhaUsuario) {
        if (!senhaRepete) {
            document.getElementById("msgSenhaRepete").innerHTML = "<p style='color: #f33; font-weight: bold'>Repita a senha para atualizar!</p>";
            scrollTo(0, 0);
            return;
        }
        if (senhaUsuario != senhaRepete) {
            document.getElementById("msgSenhaRepete").innerHTML = "<p style='color: #f33; font-weight: bold'>As senhas devem ser iguais para atualizar!</p>";
            scrollTo(0, 0);
            return;
        }
    }
    if (senhaRepete && !senhaUsuario) {
        document.getElementById("msgSemSenha").innerHTML = "<p style='color: #f33; font-weight: bold'>Você preencheu a repetição mas não preencheu o primeiro campo de senha!</p>";
        scrollTo(0, 0);
        return;
    }

    const data = {
        cpf: cpfUsuario,
        nome: nomeUsuario,
        senha: senhaUsuario,
        privilegio: cargoOption,
    };

    const atualizar = await axios.put("/usuarios/" + usuarioOption, data);
    alert(atualizar.data.message);
    location.reload();
}

async function removeUsuario() {
    let usuarioOption = usuarioSelect.options[usuarioSelect.selectedIndex].value;
    if (!usuarioOption) {
        document.getElementById("msgSemUsuarios").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione um Usuário se quiser Remover!</p>";
        scrollTo(0, 0);
        return;
    }

    if (confirm("Você deseja realmente excluir este Usuário?")) {
        const remover = await axios.delete("/usuarios/" + usuarioOption);
        alert(remover.data.message);
        location.reload();
    }
}

/**
 * CATEGORIA
*/

const tipoSelect = document.getElementById("tiposDropdown");
if (tipoSelect) {
    tipoSelect.addEventListener("change", async () => {
        let tipoOption = tipoSelect.options[tipoSelect.selectedIndex].value;
        document.getElementById("msgNaoSelecionado").innerHTML = "";
    });
}

async function cadastraCategoria() {
    let tipoOption = tipoSelect.options[tipoSelect.selectedIndex].value;
    if (!tipoOption) {
        document.getElementById("msgNaoSelecionado").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, selecione um Tipo de Categoria para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgLargMin").innerHTML = "";
    document.getElementById("msgLargMax").innerHTML = "";
    document.getElementById("msgRegioes").innerHTML = "";

    let nomeCategoria = document.getElementById('nomeCategoria').value;
    if (!nomeCategoria) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraMinCategoria = Math.trunc(document.getElementById('larguraMinCategoria').value);
    if (!larguraMinCategoria) {
        document.getElementById("msgLargMin").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe a largura mínima para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraMaxCategoria = Math.trunc(document.getElementById('larguraMaxCategoria').value);
    if (!larguraMaxCategoria) {
        document.getElementById("msgLargMax").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe a largura máxima para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let regiaoCima = Math.trunc(document.getElementById('regiaoCima').value);
    let regiaoCentro = Math.trunc(document.getElementById('regiaoCentro').value);
    let regiaoBaixo = Math.trunc(document.getElementById('regiaoBaixo').value);
    if (!regiaoCima || !regiaoCentro || !regiaoBaixo) {
        document.getElementById("msgRegioes").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe o valor para cada região!</p>";
        scrollTo(0, 0);
        return;
    }

    if (document.getElementById("horizontal").checked) {
        orientacaoCategoria = "horizontal";
    } else if (document.getElementById("vertical").checked) {
        orientacaoCategoria = "vertical";
    }

    const data = {
        nome: nomeCategoria,
        tipo: tipoOption,
        valorPorArea: [regiaoCima, regiaoCentro, regiaoBaixo],
        larguraMinima: larguraMinCategoria,
        larguraMaxima: larguraMaxCategoria,
        orientacao: orientacaoCategoria,
    };

    const cadastrar = await axios.post("/categorias", data);
    if (cadastrar.data.error) {
        alert(cadastrar.data.error);
    } else {
        alert(cadastrar.data.message);
        location.reload();
    }
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgLargMin").innerHTML = "";
    document.getElementById("msgLargMax").innerHTML = "";
    document.getElementById("msgRegioes").innerHTML = "";
}

const categoriaSelect = document.getElementById("categoriaSelect");
if (categoriaSelect) {
    listarCategorias();
}

if (categoriaSelect) {
    categoriaSelect.addEventListener("change", async () => {

        document.getElementById("msgSemNome").innerHTML = "";
        document.getElementById("msgLargMin").innerHTML = "";
        document.getElementById("msgLargMax").innerHTML = "";
        document.getElementById("msgRegioes").innerHTML = "";

        let categoriaOption = categoriaSelect.options[categoriaSelect.selectedIndex].value;
        document.getElementById("msgSemCategorias").innerHTML = "";
        // console.log(categoriaOption);
        if (!categoriaOption) {
            document.getElementById("tiposDropdown").value = "";
            document.getElementById("nomeCategoria").value = "";
            document.getElementById("larguraMinCategoria").value = "";
            document.getElementById("larguraMaxCategoria").value = "";
            document.getElementById("regiaoCima").value = "";
            document.getElementById("regiaoCentro").value = "";
            document.getElementById("regiaoBaixo").value = "";
            document.getElementById("horizontal").value = "";
            document.getElementById("vertical").value = "";
            return;
        }

        const obterCategoria = await axios.get("/categoria/" + categoriaOption);
        const categoriaSelecionada = obterCategoria.data.categoria;
        // console.log(produtoSelecionado);

        document.getElementById("tiposDropdown").value = categoriaSelecionada.tipo;
        document.getElementById("nomeCategoria").value = categoriaSelecionada.nome;
        document.getElementById("larguraMinCategoria").value = categoriaSelecionada.larguraMinima;
        document.getElementById("larguraMaxCategoria").value = categoriaSelecionada.larguraMaxima;
        document.getElementById("regiaoCima").value = categoriaSelecionada.valorPorArea[0];
        document.getElementById("regiaoCentro").value = categoriaSelecionada.valorPorArea[1];
        document.getElementById("regiaoBaixo").value = categoriaSelecionada.valorPorArea[2];
        if (categoriaSelecionada.orientacao == "horizontal") {
            document.getElementById("horizontal").checked = true;
        }
        else {
            document.getElementById("vertical").checked = true;
        }
    });
}

async function listarCategorias() {
    const categorias = await axios.get("/categorias");
    const resposta = categorias.data.categorias
    // console.log(resposta);

    if (categorias.data.found) {
        document.getElementById("msgSemCategorias").innerHTML = "";

        let opcoes = '<option value="">--Selecione uma Categoria--</option>';
        for (let i = 0; i < resposta.length; i++) {
            // console.log(resposta[i]['nome']);
            // categoriaSelect.innerHTML = categoriaSelect.innerHTML + '<option value="' + resposta[i]['_id'] + '">' + resposta[i]['nome'] + '</option>';
            opcoes += '<option value="' + resposta[i]["_id"] + '">' + resposta[i]["nome"] + '</option>';
        }
        if (categoriaSelect) {
            categoriaSelect.innerHTML = opcoes;
        }
        if (categoriaProduto) {
            categoriaProduto.innerHTML = opcoes;
        }
        if (categoriaGondula) {
            categoriaGondula.innerHTML = opcoes;
        }

    } else {
        // console.log(categorias.data.msg)
        document.getElementById("msgSemCategorias").innerHTML = categorias.data.msg;
    }
}

async function atualizaCategoria() {
    let categoriaOption = categoriaSelect.options[categoriaSelect.selectedIndex].value;
    if (!categoriaOption) {
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione uma Categoria para Alterar!</p>";
        scrollTo(0, 0);
        return;
    }

    let tipoOption = tipoSelect.options[tipoSelect.selectedIndex].value;
    if (!tipoOption) {
        document.getElementById("msgNaoSelecionado").innerHTML = "<p style='color: #f33; font-weight: bold'>A categoria precisa ter um Tipo!</p>";
        scrollTo(0, 0);
        return;
    }
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgLargMin").innerHTML = "";
    document.getElementById("msgLargMax").innerHTML = "";
    document.getElementById("msgRegioes").innerHTML = "";

    let nomeCategoria = document.getElementById('nomeCategoria').value;
    if (!nomeCategoria) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f33; font-weight: bold'>A categoria precisa ter um Nome!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraMinCategoria = Math.trunc(document.getElementById('larguraMinCategoria').value);
    if (!larguraMinCategoria) {
        document.getElementById("msgLargMin").innerHTML = "<p style='color: #f33; font-weight: bold'>A categoria precisa ter uma Largura Mínima!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraMaxCategoria = Math.trunc(document.getElementById('larguraMaxCategoria').value);
    if (!larguraMaxCategoria) {
        document.getElementById("msgLargMax").innerHTML = "<p style='color: #f33; font-weight: bold'>A categoria precisa ter uma Largura Máxima!</p>";
        scrollTo(0, 0);
        return;
    }

    let regiaoCima = Math.trunc(document.getElementById('regiaoCima').value);
    let regiaoCentro = Math.trunc(document.getElementById('regiaoCentro').value);
    let regiaoBaixo = Math.trunc(document.getElementById('regiaoBaixo').value);
    if (!regiaoCima || !regiaoCentro || !regiaoBaixo) {
        document.getElementById("msgRegioes").innerHTML = "<p style='color: #f33; font-weight: bold'>Informe valores para cada Região!</p>";
        scrollTo(0, 0);
        return;
    }

    if (document.getElementById("horizontal").checked) {
        orientacaoCategoria = "horizontal";
    } else if (document.getElementById("vertical").checked) {
        orientacaoCategoria = "vertical";
    }

    const data = {
        nome: nomeCategoria,
        tipo: tipoOption,
        valorPorArea: [regiaoCima, regiaoCentro, regiaoBaixo],
        larguraMinima: larguraMinCategoria,
        larguraMaxima: larguraMaxCategoria,
        orientacao: orientacaoCategoria,
    };

    const atualizar = await axios.put("/categorias/" + categoriaOption, data);
    alert(atualizar.data.message);
    location.reload();
}

async function removeCategoria() {
    let categoriaOption = categoriaSelect.options[categoriaSelect.selectedIndex].value;
    if (!categoriaOption) {
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione uma Categoria se quiser Remover!</p>";
        scrollTo(0, 0);
        return;
    }

    const obterCategoria = await axios.get("/categoria/" + categoriaOption);
    const categoriaSelecionada = obterCategoria.data.categoria;

    if (categoriaSelecionada.produtos.length) {
        alert("Não é possível remover uma categoria com produtos cadastrados. Para remover, altere a categoria dos produtos relacionados ou remova-os.");
        return;
    }
    if (confirm("Você deseja realmente excluir esta Categoria?")) {
        const remover = await axios.delete("/categorias/" + categoriaOption);
        alert(remover.data.message);
        location.reload();
    }
}

/**
 * PRODUTO
 */
const categoriaProduto = document.getElementById("categoriaProduto");
if (categoriaProduto) {
    listarCategorias();
}

async function cadastraProduto() {
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemDesc").innerHTML = "";
    document.getElementById("msgSemCategorias").innerHTML = "";
    document.getElementById("msgSemAltura").innerHTML = "";
    document.getElementById("msgSemLargura").innerHTML = "";
    document.getElementById("msgMinProdutos").innerHTML = "";
    document.getElementById("msgMaxProdutos").innerHTML = "";
    document.getElementById("msgValorUtil").innerHTML = "";

    let nomeProduto = document.getElementById('nomeProduto').value;
    if (!nomeProduto) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let descricaoProduto = document.getElementById('descricaoProduto').value;
    if (!descricaoProduto) {
        document.getElementById("msgSemDesc").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter uma descrição!</p>";
        scrollTo(0, 0);
        return;
    }

    const categoriaNome = categoriaProduto.options[categoriaProduto.selectedIndex].text;
    let categoriaId = categoriaProduto.options[categoriaProduto.selectedIndex].value;
    if (!categoriaId) {
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter uma categoria!</p>";
        scrollTo(0, 0);
        return;
    }

    let categoriaProd = {
        id: categoriaId,
        nome: categoriaNome
    }

    let alturaProduto = Math.trunc(document.getElementById('alturaProduto').value);
    if (!alturaProduto) {
        document.getElementById("msgSemAltura").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter uma altura!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraProduto = Math.trunc(document.getElementById('larguraProduto').value);
    if (!larguraProduto) {
        document.getElementById("msgSemLargura").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter uma largura!</p>";
        scrollTo(0, 0);
        return;
    }

    let minProdutos = Math.trunc(document.getElementById('minimoProdutos').value);
    if (!minProdutos) {
        document.getElementById("msgMinProdutos").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, defina o número mínimo de frentes!</p>";
        scrollTo(0, 0);
        return;
    }

    let maxProdutos = Math.trunc(document.getElementById('maximoProdutos').value);
    if (!maxProdutos) {
        document.getElementById("msgMaxProdutos").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, defina o número máximo de frentes!</p>";
        scrollTo(0, 0);
        return;
    }

    let valorUtil = Math.trunc(document.getElementById('valorUtilidade').value);
    if (!valorUtil) {
        document.getElementById("msgValorUtil").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter um valor de utilidade!</p>";
        scrollTo(0, 0);
        return;
    }

    const data = {
        nome: nomeProduto,
        descricao: descricaoProduto,
        categoria: categoriaProd,
        altura: alturaProduto,
        largura: larguraProduto,
        valorUtilidade: valorUtil,
        minimoProdutos: minProdutos,
        maximoProdutos: maxProdutos,
    };

    const cadastrar = await axios.post("/produtos", data);
    if (cadastrar.data.error) {
        alert(cadastrar.data.error);
        return;
    } else {
        const produtoDadoId = {
            produtoId: cadastrar.data.id,
            operacao: "cadastro"
        }
        const insereProdCat = await axios.patch("/categorias/" + categoriaId, produtoDadoId);
        if (insereProdCat.data.error) {
            alert(insereProdCat.data.error);
            return;
        }
        alert(cadastrar.data.message);
        location.reload();
    }

}

const produtoSelect = document.getElementById("produtoSelect");
if (produtoSelect) {
    listarProdutos();
}

if (produtoSelect) {
    produtoSelect.addEventListener("change", async () => {
        document.getElementById("msgSemNome").innerHTML = "";
        document.getElementById("msgSemDesc").innerHTML = "";
        document.getElementById("msgSemCategorias").innerHTML = "";
        document.getElementById("msgSemAltura").innerHTML = "";
        document.getElementById("msgSemLargura").innerHTML = "";
        document.getElementById("msgMinProdutos").innerHTML = "";
        document.getElementById("msgMaxProdutos").innerHTML = "";
        document.getElementById("msgValorUtil").innerHTML = "";

        let produtoOption = produtoSelect.options[produtoSelect.selectedIndex].value;
        document.getElementById("msgSemProdutos").innerHTML = "";
        // console.log(produtoOption);
        if (!produtoOption) {
            document.getElementById("nomeProduto").value = "";
            document.getElementById("descricaoProduto").value = "";
            document.getElementById("categoriaProduto").value = "";
            document.getElementById("alturaProduto").value = "";
            document.getElementById("larguraProduto").value = "";
            document.getElementById("minimoProdutos").value = "";
            document.getElementById("maximoProdutos").value = "";
            document.getElementById("valorUtilidade").value = "";
            return;
        }

        const obterProduto = await axios.get("/produto/" + produtoOption);
        const produtoSelecionado = obterProduto.data.produto;
        // console.log(produtoSelecionado);

        document.getElementById("nomeProduto").value = produtoSelecionado.nome;
        document.getElementById("descricaoProduto").value = produtoSelecionado.descricao;
        document.getElementById("categoriaProduto").value = produtoSelecionado.categoria.id;
        document.getElementById("alturaProduto").value = produtoSelecionado.altura;
        document.getElementById("larguraProduto").value = produtoSelecionado.largura;
        document.getElementById("minimoProdutos").value = produtoSelecionado.minimoProdutos;
        document.getElementById("maximoProdutos").value = produtoSelecionado.maximoProdutos;
        document.getElementById("valorUtilidade").value = produtoSelecionado.valorUtilidade;
    });
}

async function listarProdutos() {
    const produtos = await axios.get("/produtos");
    const resposta = produtos.data.produtos
    // console.log(resposta);

    if (produtos.data.found) {
        document.getElementById("msgSemProdutos").innerHTML = "";

        let opcoes = '<option value="">--Selecione um Produto--</option>';
        for (let i = 0; i < resposta.length; i++) {
            // console.log(resposta[i]['nome']);
            // produtoSelect.innerHTML = produtoSelect.innerHTML + '<option value="' + resposta[i]['_id'] + '">' + resposta[i]['nome'] + '</option>';
            opcoes += '<option value="' + resposta[i]["_id"] + '">' + resposta[i]["nome"] + '</option>';
        }
        produtoSelect.innerHTML = opcoes;
    } else {
        // console.log(produtos.data.msg)
        document.getElementById("msgSemProdutos").innerHTML = produtos.data.msg;
    }
}

async function atualizaProduto() {
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemDesc").innerHTML = "";
    document.getElementById("msgSemCategorias").innerHTML = "";
    document.getElementById("msgSemAltura").innerHTML = "";
    document.getElementById("msgSemLargura").innerHTML = "";
    document.getElementById("msgMinProdutos").innerHTML = "";
    document.getElementById("msgMaxProdutos").innerHTML = "";
    document.getElementById("msgValorUtil").innerHTML = "";

    let produtoOption = produtoSelect.options[produtoSelect.selectedIndex].value;
    if (!produtoOption) {
        document.getElementById("msgSemProdutos").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione um Produto para Alterar!</p>";
        scrollTo(0, 0);
        return;
    }

    let nomeProduto = document.getElementById('nomeProduto').value;
    if (!nomeProduto) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let descricaoProduto = document.getElementById('descricaoProduto').value;
    if (!descricaoProduto) {
        document.getElementById("msgSemDesc").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter uma descrição!</p>";
        scrollTo(0, 0);
        return;
    }

    const obterProduto = await axios.get("/produto/" + produtoOption);
    const produtoSelecionado = obterProduto.data.produto;
    const categoriaAntiga = produtoSelecionado.categoria.id;

    const produtoDadoRemove = {
        produtoId: produtoOption,
        operacao: "remove"
    }
    await axios.patch("/categorias/" + categoriaAntiga, produtoDadoRemove);

    const categoriaNome = categoriaProduto.options[categoriaProduto.selectedIndex].text;
    let categoriaId = categoriaProduto.options[categoriaProduto.selectedIndex].value;
    if (!categoriaId) {
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter uma categoria!</p>";
        scrollTo(0, 0);
        return;
    }

    let categoriaProd = {
        id: categoriaId,
        nome: categoriaNome
    }

    let alturaProduto = Math.trunc(document.getElementById('alturaProduto').value);
    if (!alturaProduto) {
        document.getElementById("msgSemAltura").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter uma altura!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraProduto = Math.trunc(document.getElementById('larguraProduto').value);
    if (!larguraProduto) {
        document.getElementById("msgSemLargura").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter uma largura!</p>";
        scrollTo(0, 0);
        return;
    }

    let minProdutos = Math.trunc(document.getElementById('minimoProdutos').value);
    if (!minProdutos) {
        document.getElementById("msgMinProdutos").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, defina o número mínimo de frentes!</p>";
        scrollTo(0, 0);
        return;
    }

    let maxProdutos = Math.trunc(document.getElementById('maximoProdutos').value);
    if (!maxProdutos) {
        document.getElementById("msgMaxProdutos").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, defina o número máximo de frentes!</p>";
        scrollTo(0, 0);
        return;
    }

    let valorUtil = Math.trunc(document.getElementById('valorUtilidade').value);
    if (!valorUtil) {
        document.getElementById("msgValorUtil").innerHTML = "<p style='color: #f33; font-weight: bold'>O produto deve ter um valor de utilidade!</p>";
        scrollTo(0, 0);
        return;
    }

    const data = {
        nome: nomeProduto,
        descricao: descricaoProduto,
        categoria: categoriaProd,
        altura: alturaProduto,
        largura: larguraProduto,
        valorUtilidade: valorUtil,
        minimoProdutos: minProdutos,
        maximoProdutos: maxProdutos,
    };

    const atualizar = await axios.put("/produtos/" + produtoOption, data);
    if (atualizar.data.error) {
        alert(atualizar.data.error);
        return
    } else {
        const produtoDadoId = {
            produtoId: produtoOption,
            operacao: "cadastro"
        }
        const atualizaProdCat = await axios.patch("/categorias/" + categoriaId, produtoDadoId);
        if (atualizaProdCat.data.error) {
            alert(atualizaProdCat.data.error);
            return;
        }
        alert(atualizar.data.message);
        location.reload();
    }
}

async function removeProduto() {
    let produtoOption = produtoSelect.options[produtoSelect.selectedIndex].value;
    if (!produtoOption) {
        document.getElementById("msgSemProdutos").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione um Produto se quiser Remover!</p>";
        scrollTo(0, 0);
        return;
    }
    if (confirm("Você deseja realmente excluir este produto?")) {
        const obterProduto = await axios.get("/produto/" + produtoOption);
        const produtoSelecionado = obterProduto.data.produto;
        const categoriaAntiga = produtoSelecionado.categoria.id;

        const produtoDadoRemove = {
            produtoId: produtoOption,
            operacao: "remove"
        }
        await axios.patch("/categorias/" + categoriaAntiga, produtoDadoRemove);

        const remover = await axios.delete("/produtos/" + produtoOption);
        alert(remover.data.message);
        location.reload();
    }
}


/**
 * GÔNDULA
 */
let regioesNiveis = [];

let categoriasAdicionadas = [];
function adicionarCategoria() {
    const select = document.getElementById('categoriaGondula');
    const categoriasDiv = document.getElementById('categoriasSelecionadas');

    for (const option of select.options) {
        if (option.selected) {
            if (option.value) {
                if (!categoriasAdicionadas.includes(option.value)) {
                    categoriasAdicionadas.push(option.value);

                    const badge = document.createElement('span');
                    badge.className = 'badge bg-cat m-1 cursor-pointer';
                    badge.textContent = option.text;

                    const closeIcon = document.createElement('span');
                    closeIcon.innerHTML = '&times;';
                    closeIcon.className = 'ms-2';

                    badge.appendChild(closeIcon);

                    badge.onclick = function () {
                        const index = categoriasAdicionadas.indexOf(option.value);
                        if (index > -1) {
                            categoriasAdicionadas.splice(index, 1);
                            badge.remove();
                        }
                    };

                    categoriasDiv.appendChild(badge);
                }
            }
        }
    }
}

const categoriaGondula = document.getElementById("categoriaGondula");
if (categoriaGondula) {
    listarCategorias();
}

async function cadastraGondula() {
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemCategorias").innerHTML = "";
    document.getElementById("msgSemAltura").innerHTML = "";
    document.getElementById("msgSemLargura").innerHTML = "";
    document.getElementById("msgQtdNiveis").innerHTML = "";

    let nomeGondula = document.getElementById('nomeGondula').value;
    if (!nomeGondula) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f33; font-weight: bold'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    if (!categoriasAdicionadas.length) {
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione ao menos uma categoria para compor a Gôndula!</p>";
        scrollTo(0, 0);
        return;
    }

    let alturaGondula = Math.trunc(document.getElementById('alturaGondula').value);
    if (!alturaGondula) {
        document.getElementById("msgSemAltura").innerHTML = "<p style='color: #f33; font-weight: bold'>Informe a altura da Gôndula!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraGondula = Math.trunc(document.getElementById('larguraGondula').value);
    if (!larguraGondula) {
        document.getElementById("msgSemLargura").innerHTML = "<p style='color: #f33; font-weight: bold'>Informe a largura da Gôndula!</p>";
        scrollTo(0, 0);
        return;
    }

    let qtdNiveis = parseInt(document.getElementById('numNiveis').value);
    if (!qtdNiveis || isNaN(qtdNiveis) || qtdNiveis <= 0) {
        document.getElementById("msgQtdNiveis").innerHTML = "<p style='color: #f33; font-weight: bold'>Informe a quantidade de níveis da Gôndula!</p>";
        scrollTo(0, 0);
        return;
    }

    if (qtdNiveis != regioesNiveis.length) {
        alert('Por favor, selecione a região para todos os níveis.');
        console.log(qtdNiveis);
        console.log(regioesNiveis);
        return;
    }

    const data = {
        nome: nomeGondula,
        categorias: categoriasAdicionadas,
        altura: alturaGondula,
        largura: larguraGondula,
        quantidadeDeNiveis: qtdNiveis,
        regioes: regioesNiveis  // Adicionado o array de regiões
    };

    const cadastrar = await axios.post("/gondula", data);
    if (cadastrar.data.error) {
        alert(cadastrar.data.error);
    } else {
        categoriasAdicionadas = [];
        alert(cadastrar.data.message);
        location.reload();
    }
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemCategorias").innerHTML = "";
    document.getElementById("msgSemAltura").innerHTML = "";
    document.getElementById("msgSemLargura").innerHTML = "";
    document.getElementById("msgQtdNiveis").innerHTML = "";
}

const gondulaSelect = document.getElementById("gondulaSelect");
if (gondulaSelect) {
    listarGondulas();
}

async function badgeCategoria(categoria) {
    const pegaCategoria = await axios.get("/categoria/" + categoria);
    const categoriaNome = pegaCategoria.data.categoria.nome;

    const badge = document.createElement('span');
    badge.className = 'badge bg-cat m-1 cursor-pointer';
    badge.textContent = categoriaNome;

    const closeIcon = document.createElement('span');
    closeIcon.innerHTML = '&times;';
    closeIcon.className = 'ms-2';

    badge.appendChild(closeIcon);

    badge.onclick = function () {
        const index = categoriasAdicionadas.indexOf(categoria);
        if (index > -1) {
            categoriasAdicionadas.splice(index, 1);
            badge.remove();
        }
    };

    document.getElementById('categoriasSelecionadas').appendChild(badge);
}

if (gondulaSelect) {
    gondulaSelect.addEventListener("change", async () => {

        document.getElementById("msgSemNome").innerHTML = "";
        document.getElementById("msgSemCategorias").innerHTML = "";
        document.getElementById("msgSemAltura").innerHTML = "";
        document.getElementById("msgSemLargura").innerHTML = "";
        document.getElementById("msgQtdNiveis").innerHTML = "";

        let gondulaOption = gondulaSelect.options[gondulaSelect.selectedIndex].value;
        document.getElementById("msgSemGondulas").innerHTML = "";
        // console.log(gondulaOption);
        if (!gondulaOption) {
            document.getElementById("nomeGondula").value = "";
            document.getElementById("categoriaGondula").value = "";
            document.getElementById("alturaGondula").value = "";
            document.getElementById("larguraGondula").value = "";
            document.getElementById("numNiveis").value = "";
            document.getElementById("categoriasSelecionadas").innerText = "";
            categoriasAdicionadas = [];

            document.getElementById("tabelaNiveis").hidden = true;
            return;
        }
        document.getElementById("tabelaNiveis").hidden = false;

        const obterGondula = await axios.get("/gondula/" + gondulaOption);
        const gondulaSelecionada = obterGondula.data.gondula;
        // console.log(gondulaSelecionada);

        document.getElementById("nomeGondula").value = gondulaSelecionada.nome;

        document.getElementById("categoriasSelecionadas").innerText = "";
        categoriasAdicionadas = gondulaSelecionada.categorias;
        categoriasAdicionadas.forEach(badgeCategoria);

        document.getElementById("alturaGondula").value = gondulaSelecionada.altura;
        document.getElementById("larguraGondula").value = gondulaSelecionada.largura;
        document.getElementById("numNiveis").value = gondulaSelecionada.quantidadeDeNiveis;

        
        let regioesNiveis = gondulaSelecionada.regioes;
        showTabelaNiveis(gondulaSelecionada.quantidadeDeNiveis, regioesNiveis);
        // for (let i = 0; i < regioesNiveis.length; i++) {
        //     document.querySelector(`select[name="nivel${i + 1}"]`).value = regioesNiveis[i].toString();
        // }
    });
}

async function listarGondulas() {
    const gondulas = await axios.get("/gondulas");
    const resposta = gondulas.data.gondulas
    // console.log(resposta);

    if (gondulas.data.found) {
        document.getElementById("msgSemGondulas").innerHTML = "";

        let opcoes = '<option value="">--Selecione uma Gôndula--</option>';
        for (let i = 0; i < resposta.length; i++) {
            // console.log(resposta[i]['nome']);
            // gondulaSelect.innerHTML = gondulaSelect.innerHTML + '<option value="' + resposta[i]['_id'] + '">' + resposta[i]['nome'] + '</option>';
            opcoes += '<option value="' + resposta[i]["_id"] + '">' + resposta[i]["nome"] + '</option>';
        }
        if (gondulaSelect) {
            gondulaSelect.innerHTML = opcoes;
        }
        if (gondulaPlanograma) {
            gondulaPlanograma.innerHTML = opcoes;
        }
    } else {
        // console.log(gondulas.data.msg)
        document.getElementById("msgSemGondulas").innerHTML = gondulas.data.msg;
    }
}

async function atualizaGondula() {
    let gondulaOption = gondulaSelect.options[gondulaSelect.selectedIndex].value;
    if (!gondulaOption) {
        document.getElementById("msgSemGondulas").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione uma Gôndula para Alterar!</p>";
        scrollTo(0, 0);
        return;
    }

    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemCategorias").innerHTML = "";
    document.getElementById("msgSemAltura").innerHTML = "";
    document.getElementById("msgSemLargura").innerHTML = "";
    document.getElementById("msgQtdNiveis").innerHTML = "";

    let nomeGondula = document.getElementById('nomeGondula').value;
    if (!nomeGondula) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f33; font-weight: bold'>A gôndula precisa ter um nome!</p>";
        scrollTo(0, 0);
        return;
    }

    if (!categoriasAdicionadas.length) {
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione ao menos uma categoria para compor a Gôndula!</p>";
        scrollTo(0, 0);
        return;
    }

    let alturaGondula = Math.trunc(document.getElementById('alturaGondula').value);
    if (!alturaGondula) {
        document.getElementById("msgSemAltura").innerHTML = "<p style='color: #f33; font-weight: bold'>Informe a altura da Gôndula!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraGondula = Math.trunc(document.getElementById('larguraGondula').value);
    if (!larguraGondula) {
        document.getElementById("msgSemLargura").innerHTML = "<p style='color: #f33; font-weight: bold'>Informe a largura da Gôndula!</p>";
        scrollTo(0, 0);
        return;
    }

    let qtdNiveis = parseInt(document.getElementById('numNiveis').value);
    if (!qtdNiveis || isNaN(qtdNiveis) || qtdNiveis <= 0) {
        document.getElementById("msgQtdNiveis").innerHTML = "<p style='color: #f33; font-weight: bold'>Informe a quantidade de níveis da Gôndula!</p>";
        scrollTo(0, 0);
        return;
    }

    const data = {
        nome: nomeGondula,
        categorias: categoriasAdicionadas,
        altura: alturaGondula,
        largura: larguraGondula,
        quantidadeDeNiveis: qtdNiveis,
        regioesNiveis: regioesNiveis
    };

    const atualizar = await axios.put("/gondula/" + gondulaOption, data);
    alert(atualizar.data.message);
    location.reload();
}

async function removeGondula() {
    let gondulaOption = gondulaSelect.options[gondulaSelect.selectedIndex].value;
    if (!gondulaOption) {
        document.getElementById("msgSemGondulas").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione uma Gôndula se quiser Remover!</p>";
        scrollTo(0, 0);
        return;
    }

    if (confirm("Você deseja realmente excluir esta Gôndula?")) {
        const remover = await axios.delete("/gondula/" + gondulaOption);
        alert(remover.data.message);
        location.reload();
    }
}

function showTabelaNiveis(num, regioesNiveisIniciais = []) {
    regioesNiveis = [...regioesNiveisIniciais];
    
    if (regioesNiveis.length === 0) {
        for (let i = 0; i < num; i++) {
            regioesNiveis.push(0);
        }
    }
        
    const tabela = document.getElementById('tabelaNiveis');
    const headers = document.getElementById('nivelHeaders');
    const cells = document.getElementById('nivelCells');
    
    headers.innerHTML = '';  // Limpar cabeçalhos anteriores
    cells.innerHTML = '';  // Limpar células anteriores

    for (let i = 0; i < num; i++) {
        // Adicionando cabeçalho
        const th = document.createElement('th');
        th.textContent = "Nível " + (i + 1);
        th.style.textAlign = 'center';  // Centralizando o texto
        th.style.color = 'black';  // Mudando a cor para preto
        headers.appendChild(th);
        
        // Adicionando células
        const td = document.createElement('td');
        const select = document.createElement('select');
        
        const initialValue = regioesNiveisIniciais.length > i && regioesNiveisIniciais[i] !== null ? regioesNiveisIniciais[i] : '0';
        select.value = initialValue;

        select.onchange = function () {
            regioesNiveis[i] = select.value !== null ? parseInt(select.value) : 0;
        };

        select.name = `nivel${i + 1}`;
        select.className = "form-control bg-dark text-warning";  // Estilo do Bootstrap e cor personalizada

        const options = [
            {value: '0', text: 'Cima'},
            {value: '1', text: 'Centro'},
            {value: '2', text: 'Baixo'}
        ];

        options.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.text;
            option.className = "bg-dark text-warning";
            // Marca o option como selecionado se ele corresponder ao valor inicial
            if (optionData.value == initialValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        td.appendChild(select);
        cells.appendChild(td);

        // if (initialValue !== null) {
        //     regioesNiveis[i] = parseInt(initialValue);
        // }
        // regioesNiveis[i] = parseInt(initialValue);
    }

    tabela.classList.add('table-rounded');  // Adicionar classe para bordas arredondadas
    tabela.style.display = 'block';  // Mostrar tabela
}

/**
 * PLANOGRAMA
 */
const gondulaPlanograma = document.getElementById("gondulaPlanograma");
if (gondulaPlanograma) {
    listarGondulas();
    gondulaPlanograma.addEventListener("change", () => {
        document.getElementById("msgSemGondulas").innerHTML = "";
    });
}

const btnGeraPlan = document.getElementById('botaoGerarPlanograma');

if (btnGeraPlan) {
    // Inicializa o estado do botão com base no localStorage
    // localStorage.setItem('gerandoPlan', 'false');
    checkPlanogramaStatus();
    statusBotao();
}

function statusBotao() {
    // Verifique o valor no localStorage
    const isGenerating = localStorage.getItem('gerandoPlan') === 'true';

    if (isGenerating) {
        document.getElementById("msgGerando").innerHTML = "<p style='color: #f33; font-weight: bold; font-size: 20px'>Estamos gerando seu Planograma, por favor aguarde!</p>";
        btnGeraPlan.disabled = true;
    } else {
        document.getElementById("msgGerando").innerHTML = "";
        btnGeraPlan.disabled = false;
    }
}

async function gerarPlanograma() {
    let gondulaPOption = gondulaPlanograma.options[gondulaPlanograma.selectedIndex].value;
    if (!gondulaPOption) {
        document.getElementById("msgSemGondulas").innerHTML = "<p style='color: #f33; font-weight: bold;'>Selecione uma Gôndula para Gerar o Planograma!</p>";
        scrollTo(0, 0);
        return;
    }

    // Define o valor no localStorage
    localStorage.setItem('gerandoPlan', 'true');
    statusBotao();

    const geraPlan = await axios.post("/gerarPlanograma", { idGondula: gondulaPOption });

    // await new Promise(r => setTimeout(r, 5000));

    checkPlanogramaStatus();

}

function checkPlanogramaStatus() {
    axios.get('/statusPlanograma').then(response => {
        const isProcessing = response.data.processing;
        if (isProcessing) {
            setTimeout(checkPlanogramaStatus, 5000);
        } else {
            localStorage.setItem('gerandoPlan', 'false');
            statusBotao();
        }
    }).catch(error => {
        console.error('Erro ao verificar o status do planograma:', error);
        setTimeout(checkPlanogramaStatus, 5000);
    });
}

async function listarPlanogramas() {
    const planograma = await axios.get("/planograma");
    const resposta = planograma.data.planogramas;

    if (planograma.data.found) {
        document.getElementById("msgSemPlanogramas").innerHTML = "";

        let opcoes = '<option value="">--Selecione um Planograma--</option>';
        for (let i = 0; i < resposta.length; i++) {
            opcoes += '<option value="' + resposta[i]["_id"] + '">' + resposta[i]["gondula"] + ' - ' + resposta[i]["usuario"] + ' - ' + resposta[i]["data_hora"] + '</option>';
        }
        if (selectPlanograma) {
            selectPlanograma.innerHTML = opcoes;
        }
    } else {
        // console.log(planograma.data.msg)
        document.getElementById("msgSemPlanogramas").innerHTML = planograma.data.msg;
    }
}

const selectPlanograma = document.getElementById("selectPlanograma");
if (selectPlanograma) {
    listarPlanogramas();
    selectPlanograma.addEventListener("change", async () => {
        document.getElementById("msgSemPlanogramas").innerHTML = "";
        let planogramaOption = selectPlanograma.options[selectPlanograma.selectedIndex].value;
        if (!planogramaOption) {
            location.reload();
            return;
        }
        const obterPlanograma = await axios.get("/planograma/" + planogramaOption);
        // console.log(obterPlanograma);
        renderizaPlanograma(obterPlanograma.data.planograma);
        legendaPlanograma(obterPlanograma.data.planograma);
    });
}

async function renderizaPlanograma(data) {
    const container = document.querySelector('#planogramContainer');

    // Limpa o conteúdo anterior do container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const itemColorMapping = {};

    for (const modulo of data.modulos) {
        const moduleDiv = document.createElement('div');
        moduleDiv.classList.add('module');
        moduleDiv.style.width = modulo.largura * 2.7 + 'px';

        for (const nivel of modulo.niveis) {
            const levelDiv = document.createElement('div');
            levelDiv.classList.add('level');
            levelDiv.style.height = nivel.altura * 2.7 + 'px';

            for (let idx = 0; idx < nivel.itens.length; idx++) {
                const item = nivel.itens[idx];
                if (!itemColorMapping[item]) {
                    itemColorMapping[item] = generateRandomColor();
                }
                const produtoID = data.produtos[item];

                try {
                    const produtoObtido = await axios.get("/produto/" + produtoID);
                    const produto = produtoObtido.data.produto;

                    for (let i = 0; i < nivel.quantidade[idx]; i++) {
                        const itemDiv = document.createElement('div');
                        itemDiv.classList.add('item');
                        itemDiv.textContent = `${item}`;
                        itemDiv.style.backgroundColor = itemColorMapping[item];
                        itemDiv.style.height = produto.altura * 2.7 - 3 + 'px';
                        itemDiv.style.width = produto.largura * 2.7 + 'px';
                        levelDiv.appendChild(itemDiv);
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados do produto: " + error);
                }
            }

            moduleDiv.appendChild(levelDiv);
        }

        container.appendChild(moduleDiv);
    }
}

async function legendaPlanograma(data) {
    const legenda = document.querySelector('#planogramaLegendas');

    // Limpa o conteúdo anterior da legenda
    while (legenda.firstChild) {
        legenda.removeChild(legenda.firstChild);
    }
    legenda.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';

    const para = document.createElement('p');
    para.innerText = "Legenda: ";
    para.style.color = '#ffd900';
    para.style.fontWeight = 'bold';
    legenda.appendChild(para);

    const ul = document.createElement('ul');
    
    for (let indiceProd = 0; indiceProd < data.produtos.length; indiceProd++) {
        const produtoID = data.produtos[indiceProd];
        try {
            const produtoData = await axios.get("/produto/" + produtoID);
            const produto = produtoData.data.produto;
            const produtoItem = document.createElement('li');
            produtoItem.setAttribute('class','produtoItem');
            produtoItem.innerHTML = indiceProd.toString() + " : " + produto.nome;
            ul.appendChild(produtoItem);
        } catch (error) {
            console.error("Erro ao buscar dados do produto: " + error);
        }
    }
    
    legenda.appendChild(ul);

}

function generateRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 60%, 70%)`;
}

async function removePlanograma() {
    let planogramaOption = selectPlanograma.options[selectPlanograma.selectedIndex].value;
    if (!planogramaOption) {
        document.getElementById("msgSemPlanogramas").innerHTML = "<p style='color: #f33; font-weight: bold'>Selecione um Planograma se quiser Remover!</p>";
        scrollTo(0, 0);
        return;
    }

    if (confirm("Você deseja realmente excluir este Planograma?")) {
        const remover = await axios.delete("/planograma/" + planogramaOption);
        alert(remover.data.message);
        location.reload();
    }
}