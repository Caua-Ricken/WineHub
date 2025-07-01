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