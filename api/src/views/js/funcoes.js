/**
 * PRODUTO
 */

async function cadastraProduto() {
    const data = {
        nome: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricaoProduto').value,
        altura: document.getElementById('alturaProduto').value,
        largura: document.getElementById('larguraProduto').value,
        valorUtilidade: document.getElementById('valorUtilidade').value,
        minimoProdutos: document.getElementById('minimoProdutos').value,
        maximoProdutos: document.getElementById('maximoProdutos').value,
    };

    const cadastrar = await axios.post("/produtos", data);
    if (cadastrar.data.error) {
        alert(cadastrar.data.error);
    } else {
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
    let produtoOption = produtoSelect.options[produtoSelect.selectedIndex].value;
    if (!produtoOption) {
        document.getElementById("msgSemProdutos").innerHTML = "<p style='color: #ff0'>Selecione um Produto para Alterar!</p>";
        scrollTo(0, 0);
        return;
    }

    const data = {
        nome: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricaoProduto').value,
        altura: document.getElementById('alturaProduto').value,
        largura: document.getElementById('larguraProduto').value,
        valorUtilidade: document.getElementById('valorUtilidade').value,
        minimoProdutos: document.getElementById('minimoProdutos').value,
        maximoProdutos: document.getElementById('maximoProdutos').value,
    };

    const atualizar = await axios.put("/produtos/" + produtoOption, data);
    alert(atualizar.data.message);
    location.reload();
}

async function removeProduto() {
    let produtoOption = produtoSelect.options[produtoSelect.selectedIndex].value;
    if (!produtoOption) {
        document.getElementById("msgSemProdutos").innerHTML = "<p style='color: #ff0'>Selecione um Produto se quiser Remover!</p>";
        scrollTo(0, 0);
        return;
    }
    if(confirm("Você deseja realmente excluir este produto?")) {
        const remover = await axios.delete("/produtos/" + produtoOption);
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
        categoriaSelect.innerHTML = opcoes;
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
    if(confirm("Você deseja realmente excluir esta Categoria?")) {
        const remover = await axios.delete("/categorias/" + categoriaOption);
        alert(remover.data.message);
        location.reload();
    }
}