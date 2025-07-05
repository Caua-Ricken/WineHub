function alterarQtd(botao, valor){
        const input = botao.parentElement.querySelector("input");
        let atual = parseInt(input.value);
        atual+= valor;
        if(atual < 0) atual = 0;
        input.value = atual;
      }
 
document.getElementById("filtro-select").addEventListener("change", function () {
  const filtro = this.value.trim().toLowerCase();
  const produtos = document.querySelectorAll(".produtos");

  produtos.forEach(produto => {
    const categoria = (produto.getAttribute("data-categoria") || "").toLowerCase();

    if (!filtro || filtro === "") {
      produto.style.display = "flex";
    } else if (categoria.includes(filtro)) {
      produto.style.display = "flex";
    } else {
      produto.style.display = "none";
    }
  });
});


function alterarQtd(botao, valor) {
  const input = botao.parentElement.querySelector("input");
  let atual = parseInt(input.value);
  atual += valor;
  if (atual < 0) atual = 0;
  input.value = atual;

  atualizarCarrinhoTotal();
}

function atualizarCarrinhoTotal() {
  const inputs = document.querySelectorAll(".quantidade input");
  let total = 0;
  inputs.forEach(input => {
    total += parseInt(input.value);
  });

  const contador = document.querySelector(".contador-carrinho");
  if (contador) {
    contador.textContent = total;
  }
}





function alterarQtd(botao, valor) {
  const produto = botao.closest(".produtos");
  const input = produto.querySelector(".quantidade input");
  let atual = parseInt(input.value);
  atual += valor;
  if (atual < 0) atual = 0;
  input.value = atual;

  atualizarCarrinhoTotal();
  salvarCarrinho();
}

function atualizarCarrinhoTotal() {
  const inputs = document.querySelectorAll(".quantidade input");
  let total = 0;
  inputs.forEach(input => {
    total += parseInt(input.value);
  });

  const contador = document.querySelector(".contador-carrinho");
  if (contador) {
    contador.textContent = total;
  }
}

function salvarCarrinho() {
  const produtosDOM = document.querySelectorAll(".produtos");
  const carrinho = [];

  produtosDOM.forEach(produto => {
    const quantidade = parseInt(produto.querySelector(".quantidade input").value);
    if (quantidade > 0) {
      const nome = produto.querySelector(".text div")?.textContent || "Produto";
      const descricao = produto.querySelector(".text").innerText;
      const imagem = produto.querySelector("img").getAttribute("src");
      const precoR = produto.querySelector(".value_r").textContent;
      const precoC = produto.querySelector(".value_c").textContent;
      const preco = `${precoR}${precoC}`;

      carrinho.push({
        nome,
        descricao,
        imagem,
        preco,
        quantidade
      });
    }
  });

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

document.addEventListener("DOMContentLoaded", () => {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.forEach(item => {
    const produtos = document.querySelectorAll(".produtos");
    produtos.forEach(produto => {
      const nomeProduto = produto.querySelector(".text div").textContent.trim().toLowerCase();
      if (nomeProduto === item.nome.trim().toLowerCase()) {
        produto.querySelector(".quantidade input").value = item.quantidade;
      }
    });
  });
  atualizarCarrinhoTotal();
});

