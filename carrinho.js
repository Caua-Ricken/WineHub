function generateOrderNumber() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${randomNum}`;
}

function generatePixPayload(cpf, orderNumber, total) {
    return `00020126360014BR.GOV.BCB.PIX0111${cpf.replace(/[\D]/g, '')}5204000053039865406${total.toFixed(2)}5802BR5908WineHub6008SaoPaulo62070503***6304${orderNumber}`;
}

function generateBoletoBarcode(orderNumber) {
    return `2379338128600080781234567890123456789012${orderNumber}`;
}

function formatOrderAsText(orderNumber, carrinho, customerInfo, paymentMethod, total) {
    const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    let orderText = `=== Detalhes do Pedido ===\n`;
    orderText += `Número do Pedido: ${orderNumber}\n`;
    orderText += `Data e Hora: ${date}\n\n`;

    orderText += `=== Informações do Cliente ===\n`;
    orderText += `Nome: ${customerInfo.name}\n`;
    orderText += `Cidade: ${customerInfo.city}\n`;
    orderText += `Número: ${customerInfo.number}\n`;
    orderText += `Email: ${customerInfo.email}\n`;
    orderText += `Local de entrega: ${customerInfo.endereco}\n\n`;

    orderText += `=== Itens do Carrinho ===\n`;
    carrinho.forEach(item => {
        const itemTotal = parseFloat(item.preco.replace(',', '.')) * item.quantidade;
        orderText += `Produto: ${item.nome}\n`;
        orderText += `Descrição: ${item.descricao}\n`;
        orderText += `Quantidade: ${item.quantidade}\n`;
        orderText += `Preço Unitário: R$ ${item.preco}\n`;
        orderText += `Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
        orderText += `------------------------\n`;
    });

    orderText += `\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\n`;

    orderText += `=== Método de Pagamento ===\n`;
    if (paymentMethod === 'pix') {
        orderText += `Método: Pix\n`;
        orderText += `Chave Pix: 122.336.289-26\n`;
    } else if (paymentMethod === 'boleto') {
        orderText += `Método: Boleto\n`;
        orderText += `Código de Barras: ${generateBoletoBarcode(orderNumber)}\n`;
    } else if (paymentMethod === 'cartao') {
        orderText += `Método: Cartão de Crédito\n`;
    }

    return orderText;
}

function saveOrderAsTextFile(orderNumber, orderText) {
    const blob = new Blob([orderText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `order_${orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function displayOrderConfirmation(orderNumber, carrinho, paymentMethod, customerInfo) {
    const container = document.querySelector(".container");
    let total = 0;
    carrinho.forEach(item => {
        const price = parseFloat(item.preco.replace(',', '.')) * item.quantidade;
        total += price;
    });

    const orderText = formatOrderAsText(orderNumber, carrinho, customerInfo, paymentMethod, total);
    saveOrderAsTextFile(orderNumber, orderText);

    let qrCodeHTML = '';
    if (typeof QRCode !== 'undefined') {
        if (paymentMethod === 'pix') {
            const pixPayload = generatePixPayload('122.336.289-26', orderNumber, total);
            qrCodeHTML = `
                <div id="pix-qrcode" style="margin: 2rem auto; text-align: center;"></div>
                <script>
                    new QRCode(document.getElementById("pix-qrcode"), {
                        text: "${pixPayload}",
                        width: 200,
                        height: 200
                    });
                </script>
            `;
        } else if (paymentMethod === 'boleto') {
            const boletoBarcode = generateBoletoBarcode(orderNumber);
            qrCodeHTML = `
                <div id="boleto-qrcode" style="margin: 2rem auto; text-align: center;"></div>
                <script>
                    new QRCode(document.getElementById("boleto-qrcode"), {
                        text: "${boletoBarcode}",
                        width: 200,
                        height: 200
                    });
                </script>
            `;
        }
    } else {
        console.warn("QRCode library not loaded. QR codes will not be displayed.");
    }

    const confirmationHTML = `
        <div class="order-confirmation">
            <h2>Pedido Confirmado!</h2>
            <p>Número do pedido: ${orderNumber}</p>
            <p>Total: R$ ${total.toFixed(2).replace('.', ',')}</p>
            <p>Detalhes do pedido foram enviados para o seu e-mail.</p>
            <p>Um arquivo com os detalhes do pedido (${orderNumber}.txt) foi baixado.</p>
            ${paymentMethod === 'pix' ? '<p>Escaneie o QR Code abaixo para pagar via Pix:</p>' : ''}
            ${paymentMethod === 'boleto' ? '<p>Escaneie o QR Code abaixo para pagar via Boleto:</p>' : ''}
            ${qrCodeHTML}
        </div>
    `;
    container.innerHTML += confirmationHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
    const totalDiv = document.querySelector(".total");
    const limparBtn = document.querySelector(".clean");

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (carrinho.length === 0) {
        container.innerHTML += '<p class="text">Seu carrinho está vazio.</p>';

        const totalDiv = document.querySelector(".total");
        if (totalDiv && totalDiv.querySelector("p")) {
            totalDiv.querySelector("p").innerHTML = `
            <span>Total da Compra</span><br>
            R$ 0,00
        `;
        }
        return;
    }

    let totalCompra = 0;

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

        const preco = parseFloat(item.preco.replace(',', '.')) * item.quantidade;
        totalCompra += preco;
    });

    if (totalDiv) {
        totalDiv.querySelector("p").innerHTML = `
        <span>Total da Compra</span><br>
        R$ ${totalCompra.toFixed(2).replace('.', ',')}
    `;
    }

    if (limparBtn) {
        limparBtn.addEventListener("click", () => {
            localStorage.removeItem("carrinho");
            location.reload();
        });
    }

    const radios = document.querySelectorAll('input[name="pay"]');
    const cardPay = document.getElementById('card-pay');
    const pixDiv = document.querySelector('.pix');
    const boletoDiv = document.querySelector('.boleto');
    const confirmButton = document.querySelector('.comfirm'); 

    function togglePaymentFields() {
        const selected = document.querySelector('input[name="pay"]:checked').value;
        cardPay.classList.add('hidden');
        pixDiv.classList.add('hidden');
        boletoDiv.classList.add('hidden');

        if (selected === 'cartao') cardPay.classList.remove('hidden');
        else if (selected === 'pix') pixDiv.classList.remove('hidden');
        else if (selected === 'boleto') boletoDiv.classList.remove('hidden');
    }

    togglePaymentFields();
    radios.forEach(radio => {
        radio.addEventListener('change', togglePaymentFields);
    });

    confirmButton.addEventListener('click', (e) => {
        e.preventDefault();

        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const { name, city, number, email, endereco } = userData;

        if (!name || !city || !number || !email || !endereco) {
            alert("Por favor, preencha todos os dados de cadastro em 'Cadastro de Usuário' antes de finalizar a compra.");
            window.location.href = "user.html"; 
            return; 
        }

        const paymentMethod = document.querySelector('input[name="pay"]:checked').value;

        if (paymentMethod === 'cartao') {
            const cardNumber = document.getElementById('cartao-namber').value;
            const cardName = document.getElementById('name-card').value;
            const cvc = document.getElementById('cvc').value;
            if (!cardNumber || !cardName || !cvc) {
                alert('Por favor, preencha todos os campos do cartão.');
                return;
            }
        }

        const orderNumber = generateOrderNumber();
        const customerInfo = { name, city, number, email, endereco }; 

        container.innerHTML = ''; 
        displayOrderConfirmation(orderNumber, carrinho, paymentMethod, customerInfo);

        localStorage.removeItem('carrinho'); 
    });
});