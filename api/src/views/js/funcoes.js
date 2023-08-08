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
    if(confirm("Você deseja realmente excluir este produto?")) {
        let produtoOption = produtoSelect.options[produtoSelect.selectedIndex].value;
        if (!produtoOption) {
            document.getElementById("msgSemProdutos").innerHTML = "<p style='color: #ff0'>Selecione um Produto se quiser Remover!</p>";
            return;
        }
        
        const remover = await axios.delete("/produtos/" + produtoOption);
        alert(remover.data.message);
        location.reload();
    }
}