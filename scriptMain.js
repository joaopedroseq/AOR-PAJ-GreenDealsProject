w3.includeHTML(() =>  {

    // Mensagem de boas-vindas
    const welcomeMessage = document.getElementById('mensagem_boasVindas');

    // Verificar se há um nome de utilizador armazenado no Session Storage
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
        // Se houver um nome de utilizador armazenado, exibe a mensagem de boas-vindas
        welcomeMessage.textContent = `Olá, ${storedUsername}!`;
    }  
    
    // Função para fazer logout, removendo o nome de utilizador do Session Storage
    function logout(){
        const username = document.getElementById('username').value;
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('logged');
        const loginMessage = document.getElementById("loginMessage");
        loginMessage.style.visibility = 'hidden';
        const login = document.getElementById('loginButton');
        login.style.visibility = 'visible';
        // Redireciona para a página de login
        window.location.href = "index.html"; 
    }

    // Adiciona o evento de clique ao botão de logout
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);

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
                <img src='${product.imagem}' alt="${product.nome}"/>
                <div class="text-overlay">
                    <h2 style="background-color: transparent;">${product.nome}</h2>
                    <p style="background-color: transparent;">Preço: €${product.preco}</p>
                    <p style="background-color: transparent;">Categoria: ${product.categoria}</p>
                </div>
            </div>
        `;
        // Insere o produto no container
        gridContainer.insertAdjacentHTML('beforeend', productHTML); 
    }

    // Função para carregar os produtos do local storage e exibi-los na página
    function loadProducts() {
        let products = localStorage.getItem('products');
        if (products) {
            // Converte a string JSON para um array
            products = JSON.parse(products);
            products.forEach((product, index) => {
                displayProduct(product, index);
            });
        }
    }

    // Carrega os produtos ao carregar a página
    loadProducts();

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

    // Função para alternar a exibição do aside
    function toggleAside() {
        const asideMenu = document.getElementById("aside-menu");
        // Se o aside estiver oculto ou não visível, exibe-o
        if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
            asideMenu.style.display = 'block';
        } else {
            // Se o aside estiver visível, oculta-o
            asideMenu.style.display = 'none';
        }
    }
});