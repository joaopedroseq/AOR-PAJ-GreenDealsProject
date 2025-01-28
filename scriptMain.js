
/* Carregar o formulário quando se carrega no botão "Adicionar Produto" */

function toggleForm() {
    var form = document.getElementById('add-product-form');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}
