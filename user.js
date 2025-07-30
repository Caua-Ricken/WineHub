document.querySelector('.user').addEventListener('submit', (e) => {
    e.preventDefault()

    const userData = {
        name: document.getElementById('name').value,
        city: document.getElementById('city').value,
        number: document.getElementById('number').value,
        email: document.getElementById('email').value,
        endereco: document.getElementById('entrega').value
    }

    localStorage.setItem('userData', JSON.stringify(userData))
    alert('Todos os dados foram salvos com sucesso!')
    window.location.href = 'carrinho.html'
})
