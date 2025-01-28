
/* Carregar o formulário quando se carrega no botão "Adicionar Produto" */

function toggleForm() {
    var form = document.getElementById('add-product-form');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}


/* Para fazer a hiperligação entre as categorias e os artigos, fazendo desaparecer os artigos de outras categorias */

document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('aside ul li');
    const articles = document.querySelectorAll('.grid-item');

    // Adiciona um event listener a cada categoria
    categories.forEach(category => {
        category.addEventListener('click', function() {

            // Remove a classe 'categoria-ativa' de todos os itens
            categories.forEach(cat => cat.classList.remove('categoria-ativa'));

            // Adiciona a classe 'categoria-ativa' ao item clicado
            this.classList.add('categoria-ativa');

            // Obtém a categoria selecionada
            const selectedCategory = this.id;

            // Exibe ou oculta os artigos de acordo com a categoria selecionada
            articles.forEach(article => {
                const articleCategory = article.querySelector('.text-overlay p:nth-child(4)').textContent.split(': ')[1].toLowerCase();
                if (articleCategory === selectedCategory) {
                    article.style.display = 'block'; // Exibe os artigos da categoria selecionada
                } else {
                    article.style.display = 'none'; // Oculta os artigos de outras categorias
                }
            });
        });
    });
});



