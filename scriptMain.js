w3.includeHTML(() =>  {

    // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', toggleAside); 

    // Obtém o container dos produtos
    const gridContainer = document.querySelector('.grid-container');

    // Função para exibir os produtos na página
    function displayProduct(product, index) {
        // Cria o HTML do produto
        const productHTML = `
            <div class="grid-item" onclick="window.location.href='detail.html?index=${index}'"> 
                <img src='${product.urlImage}' alt="${product.name}"/>
                <div class="text-overlay">
                    <h2 style="background-color: transparent;">${product.name}</h2>
                    <p style="background-color: transparent;">Preço: €${product.price}</p>
                    <p style="background-color: transparent;">Categoria: ${product.category}</p>
                </div>
            </div>
        `;
        // Insere o produto no container
        gridContainer.insertAdjacentHTML('beforeend', productHTML); 
    }


    //fetch dos produtos
    function getAvaiableProducts() {
        const getAvaiableProductsUrl = 'http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/products/';
        fetch(getAvaiableProductsUrl, {
          method: 'GET',
          headers: {'Content-Type': 'application/json',}
        })
        .then(response => {
          console.log('Status da resposta:', response.status);
          return response.text().then(text => ({ status: response.status, text: text }));
        })
        .then(data => {
            if(data){
            console.log('Resposta JSON:', data);
            const products = JSON.parse(data.text); // Converter a string JSON para um array
            products.forEach((product) => {
                displayProduct(product, product.id);
              });
            }
            else{
                console.log("No products to load")
            }  
          })
        .catch(error => {
          console.error('Erro:', error);
          alert('Ocorreu um erro: ' + error.message);
        });
      }

    // Carrega os produtos ao carregar a página
    getAvaiableProducts();

    // Função para fazer a ligação das categorias no aside com os artigos
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
                const articleCategory = article.querySelector('.text-overlay p:nth-child(3)').textContent.split(': ')[1].toLowerCase();
                if (articleCategory === selectedCategory) {
                    // Exibe os artigos da categoria selecionada
                    article.style.display = 'block'; 
                } else {
                    // Oculta os artigos de outras categorias
                    article.style.display = 'none'; 
                }
            });
        });
    });
});