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
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f55; font-weight: bold'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let cargoOption = cargoSelect.options[cargoSelect.selectedIndex].value;
    if (!cargoOption) {
        document.getElementById("msgSemCargo").innerHTML = "<p style='color: #f55; font-weight: bold'>Por favor, selecione um Cargo para cadastrar o usuário!</p>";
        scrollTo(0, 0);
        return;
    }

    let cpfUsuario = document.getElementById('cpfUsuario').value;
    if (!cpfUsuario) {
        document.getElementById("msgSemCpf").innerHTML = "<p style='color: #f55; font-weight: bold'>Por favor, informe o CPF do usuário para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let senhaUsuario = document.getElementById('senhaUsuario').value;
    if (!senhaUsuario) {
        document.getElementById("msgSemSenha").innerHTML = "<p style='color: #f55; font-weight: bold'>Por favor, informe uma senha para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let senhaRepete = document.getElementById('senhaRepete').value;
    if (!senhaRepete) {
        document.getElementById("msgSenhaRepete").innerHTML = "<p style='color: #f55; font-weight: bold'>Por favor, repita a senha para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    if (senhaUsuario != senhaRepete) {
        document.getElementById("msgSenhaRepete").innerHTML = "<p style='color: #f55; font-weight: bold'>As senhas devem ser iguais para cadastrar!</p>";
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
        document.getElementById("msgSemUsuarios").innerHTML = "<p style='color: #f00'>Selecione um Usuário para Alterar!</p>";
        scrollTo(0, 0);
        return;
    }

    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgSemCargo").innerHTML = "";
    document.getElementById("msgSemCpf").innerHTML = "";

    let nomeUsuario = document.getElementById('nomeUsuario').value;
    if (!nomeUsuario) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f00'>O usuário precisa ter um Nome!</p>";
        scrollTo(0, 0);
        return;
    }

    let cargoOption = cargoSelect.options[cargoSelect.selectedIndex].value;
    if (!cargoOption) {
        document.getElementById("msgSemCargo").innerHTML = "<p style='color: #f00'>O usuário precisa ter um Cargo!</p>";
        scrollTo(0, 0);
        return;
    }

    let cpfUsuario = document.getElementById('cpfUsuario').value;
    if (!cpfUsuario) {
        document.getElementById("msgSemCpf").innerHTML = "<p style='color: #f00'>O CPF é obrigatório!</p>";
        scrollTo(0, 0);
        return;
    }

    let senhaUsuario = document.getElementById('senhaUsuario').value;
    let senhaRepete = document.getElementById('senhaRepete').value;

    if (senhaUsuario) {
        if (!senhaRepete) {
            document.getElementById("msgSenhaRepete").innerHTML = "<p style='color: #f00'>Repita a senha para atualizar!</p>";
            scrollTo(0, 0);
            return;
        }
        if (senhaUsuario != senhaRepete) {
            document.getElementById("msgSenhaRepete").innerHTML = "<p style='color: #f00'>As senhas devem ser iguais para atualizar!</p>";
            scrollTo(0, 0);
            return;
        }
    }
    if (senhaRepete && !senhaUsuario) {
        document.getElementById("msgSemSenha").innerHTML = "<p style='color: #f00'>Você preencheu a repetição mas não preencheu o primeiro campo de senha!</p>";
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
        document.getElementById("msgSemUsuarios").innerHTML = "<p style='color: #f00'>Selecione um Usuário se quiser Remover!</p>";
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
        document.getElementById("msgNaoSelecionado").innerHTML = "<p style='color: #ff0'>Por favor, selecione um Tipo de Categoria para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgLargMin").innerHTML = "";
    document.getElementById("msgLargMax").innerHTML = "";

    let nomeCategoria = document.getElementById('nomeCategoria').value;
    if (!nomeCategoria) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #ff0'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraMinCategoria = document.getElementById('larguraMinCategoria').value;
    if (!larguraMinCategoria) {
        document.getElementById("msgLargMin").innerHTML = "<p style='color: #ff0'>Por favor, informe a largura mínima para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraMaxCategoria = document.getElementById('larguraMaxCategoria').value;
    if (!larguraMaxCategoria) {
        document.getElementById("msgLargMax").innerHTML = "<p style='color: #ff0'>Por favor, informe a largura máxima para cadastrar!</p>";
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
}

const categoriaSelect = document.getElementById("categoriaSelect");
if (categoriaSelect) {
    listarCategorias();
}

if (categoriaSelect) {
    categoriaSelect.addEventListener("change", async () => {
        let categoriaOption = categoriaSelect.options[categoriaSelect.selectedIndex].value;
        document.getElementById("msgSemCategorias").innerHTML = "";
        // console.log(categoriaOption);
        if (!categoriaOption) {
            document.getElementById("tiposDropdown").value = "";
            document.getElementById("nomeCategoria").value = "";
            document.getElementById("larguraMinCategoria").value = "";
            document.getElementById("larguraMaxCategoria").value = "";
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

    } else {
        // console.log(categorias.data.msg)
        document.getElementById("msgSemCategorias").innerHTML = categorias.data.msg;
    }
}

async function atualizaCategoria() {
    let categoriaOption = categoriaSelect.options[categoriaSelect.selectedIndex].value;
    if (!categoriaOption) {
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #f00'>Selecione uma Categoria para Alterar!</p>";
        scrollTo(0, 0);
        return;
    }

    let tipoOption = tipoSelect.options[tipoSelect.selectedIndex].value;
    if (!tipoOption) {
        document.getElementById("msgNaoSelecionado").innerHTML = "<p style='color: #f00'>A categoria precisa ter um Tipo!</p>";
        scrollTo(0, 0);
        return;
    }
    document.getElementById("msgSemNome").innerHTML = "";
    document.getElementById("msgLargMin").innerHTML = "";
    document.getElementById("msgLargMax").innerHTML = "";

    let nomeCategoria = document.getElementById('nomeCategoria').value;
    if (!nomeCategoria) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #f00'>A categoria precisa ter um Nome!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraMinCategoria = document.getElementById('larguraMinCategoria').value;
    if (!larguraMinCategoria) {
        document.getElementById("msgLargMin").innerHTML = "<p style='color: #f00'>A categoria precisa ter uma Largura Mínima!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraMaxCategoria = document.getElementById('larguraMaxCategoria').value;
    if (!larguraMaxCategoria) {
        document.getElementById("msgLargMax").innerHTML = "<p style='color: #f00'>A categoria precisa ter uma Largura Máxima!</p>";
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
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #f00'>Selecione uma Categoria se quiser Remover!</p>";
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
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #ff0'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let descricaoProduto = document.getElementById('descricaoProduto').value;
    if (!descricaoProduto) {
        document.getElementById("msgSemDesc").innerHTML = "<p style='color: #ff0'>O produto deve ter uma descrição!</p>";
        scrollTo(0, 0);
        return;
    }

    const categoriaNome = categoriaProduto.options[categoriaProduto.selectedIndex].text;
    let categoriaId = categoriaProduto.options[categoriaProduto.selectedIndex].value;
    if (!categoriaId) {
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #ff0'>O produto deve ter uma categoria!</p>";
        scrollTo(0, 0);
        return;
    }

    let categoriaProd = {
        id: categoriaId,
        nome: categoriaNome
    }

    let alturaProduto = document.getElementById('alturaProduto').value;
    if (!alturaProduto) {
        document.getElementById("msgSemAltura").innerHTML = "<p style='color: #ff0'>O produto deve ter uma altura!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraProduto = document.getElementById('larguraProduto').value;
    if (!larguraProduto) {
        document.getElementById("msgSemLargura").innerHTML = "<p style='color: #ff0'>O produto deve ter uma largura!</p>";
        scrollTo(0, 0);
        return;
    }

    let minProdutos = document.getElementById('minimoProdutos').value;
    if (!minProdutos) {
        document.getElementById("msgMinProdutos").innerHTML = "<p style='color: #ff0'>Por favor, defina o número mínimo de frentes!</p>";
        scrollTo(0, 0);
        return;
    }

    let maxProdutos = document.getElementById('maximoProdutos').value;
    if (!maxProdutos) {
        document.getElementById("msgMaxProdutos").innerHTML = "<p style='color: #ff0'>Por favor, defina o número máximo de frentes!</p>";
        scrollTo(0, 0);
        return;
    }

    let valorUtil = document.getElementById('valorUtilidade').value;
    if (!valorUtil) {
        document.getElementById("msgValorUtil").innerHTML = "<p style='color: #ff0'>O produto deve ter um valor de utilidade!</p>";
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
        document.getElementById("msgSemProdutos").innerHTML = "<p style='color: #ff0'>Selecione um Produto para Alterar!</p>";
        scrollTo(0, 0);
        return;
    }

    let nomeProduto = document.getElementById('nomeProduto').value;
    if (!nomeProduto) {
        document.getElementById("msgSemNome").innerHTML = "<p style='color: #ff0'>Por favor, informe um nome para cadastrar!</p>";
        scrollTo(0, 0);
        return;
    }

    let descricaoProduto = document.getElementById('descricaoProduto').value;
    if (!descricaoProduto) {
        document.getElementById("msgSemDesc").innerHTML = "<p style='color: #ff0'>O produto deve ter uma descrição!</p>";
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
        document.getElementById("msgSemCategorias").innerHTML = "<p style='color: #ff0'>O produto deve ter uma categoria!</p>";
        scrollTo(0, 0);
        return;
    }

    let categoriaProd = {
        id: categoriaId,
        nome: categoriaNome
    }

    let alturaProduto = document.getElementById('alturaProduto').value;
    if (!alturaProduto) {
        document.getElementById("msgSemAltura").innerHTML = "<p style='color: #ff0'>O produto deve ter uma altura!</p>";
        scrollTo(0, 0);
        return;
    }

    let larguraProduto = document.getElementById('larguraProduto').value;
    if (!larguraProduto) {
        document.getElementById("msgSemLargura").innerHTML = "<p style='color: #ff0'>O produto deve ter uma largura!</p>";
        scrollTo(0, 0);
        return;
    }

    let minProdutos = document.getElementById('minimoProdutos').value;
    if (!minProdutos) {
        document.getElementById("msgMinProdutos").innerHTML = "<p style='color: #ff0'>Por favor, defina o número mínimo de frentes!</p>";
        scrollTo(0, 0);
        return;
    }

    let maxProdutos = document.getElementById('maximoProdutos').value;
    if (!maxProdutos) {
        document.getElementById("msgMaxProdutos").innerHTML = "<p style='color: #ff0'>Por favor, defina o número máximo de frentes!</p>";
        scrollTo(0, 0);
        return;
    }

    let valorUtil = document.getElementById('valorUtilidade').value;
    if (!valorUtil) {
        document.getElementById("msgValorUtil").innerHTML = "<p style='color: #ff0'>O produto deve ter um valor de utilidade!</p>";
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
        document.getElementById("msgSemProdutos").innerHTML = "<p style='color: #ff0'>Selecione um Produto se quiser Remover!</p>";
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
let categoriasAdicionadas = [];

function adicionarCategoria() {
    const select = document.getElementById('categoriaProduto');
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