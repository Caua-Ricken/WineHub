document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinho.length === 0) {
    container.innerHTML += '<p class="text">Seu carrinho está vazio.</p>';
    return;
  }

  carrinho.forEach(item => {
    const itemHTML = `
      <div class="card_item">
        <img src="${item.imagem}" alt="${item.nome}">
        <div class="name_itens">
          <h2>${item.nome}</h2>
          <p>${item.descricao}</p>
          <span class="value">R$ ${item.preco} x ${item.quantidade}</span>
        </div>
      </div>
    `;
    container.innerHTML += itemHTML;
  });
});
