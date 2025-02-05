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

    // Obtém o botão para adicionar produto
    const addButton = document.getElementById('add-product-btn');

     //Funções para adicionar um produto
     var modalDetail = document.getElementById("modal-detail");
     var form = document.getElementById("edit-product-form");

    // Obtém o elemento <span> que fecha o modal
    var closeDetail = document.getElementsByClassName("close-detail")[0];
    
    // Adiciona o evento de submit ao formulário para guardar o produto
    var saveProductBtn = document.getElementById("save-product");

    // Adiciona o evento de clique ao botão para alternar o formulário
    addButton.addEventListener('click', function(event) {
        console.log("correu");
        event.preventDefault();
        modalDetail.style.display = "flex";
    });

    // Quando o utilizador clicar no <span> (x), fecha o modal
    closeDetail.onclick = function() {
        modalDetail.style.display = "none";
    };  
    
    // Função para guardar o produto no local storage
    saveProductBtn.addEventListener('click', function(event) {
        event.preventDefault();
        // Obtém os valores dos campos do formulário
        const nome = document.getElementById('edit-nome').value;
        const descricao = document.getElementById('edit-descricao').value;  
        const preco = document.getElementById('edit-preco').value;
        const categoria = document.getElementById('edit-categoria').value;
        const localidade = document.getElementById('edit-localidade').value;
        const imagem = document.getElementById('edit-imagem').value;
        const data = new Date(); // Data atual
        const anunciante = sessionStorage.getItem('username');

        // Validações dos campos do formulário
        if(nome.trim() === ""){
            alert("O nome do produto é de preenchimento obrigatório");
        }
        else if(descricao.trim() === ""){
            alert("A descrição do produto é de preenchimento obrigatório");
        }
        else if(preco.trim() === ""){
            alert("O preço do produto é de preenchimento obrigatório");
        }
        else if(!checkIfNumeric(preco)){
            alert("Preço inserido inválido. Apenas poderá escrever dígitos e sem quaisquer símbolos");
        }
        else if(localidade.trim() === ""){
            alert("A sua morada é preenchimento obrigatório");
        }
        else if(imagem.trim() === ""){
            alert("Terá de colocar um URL válido da imagem do produto que pretende anunciar");
        }
        else {

            // Cria um objeto com os dados do produto
            const product = {
                nome,
                descricao,
                preco,
                categoria,
                anunciante,
                localidade,
                imagem,
                data
            }
            var confirm = window.confirm('Tem a certeza que pretende adicionar o produto ' + nome + '?'); 

            // Se o utilizador confirmar, guarda o produto no local storage
            if(confirm == true){
                console.log("salvar");
                let products = localStorage.getItem('products');
                if (products) {
                    // Converte a string JSON para um array
                    products = JSON.parse(products); 
                } else {
                    products = [];
                }
                products.push(product);
                // Converte o array para uma string JSON
                localStorage.setItem('products', JSON.stringify(products)); 
                form.reset();
                modalDetail.style.display = "none";
                window.location.reload();
            }
            // Se o utilizador cancelar, limpa o formulário e fecha o modal
            else {
                form.reset();
                modalDetail.style.display = "none";
            }
             
            // Exibe o produto na página
            displayProduct(product, products.length - 1);
        }
    });

    // Função para verificar se uma string é um número
    function checkIfNumeric(string) {
        return !isNaN(string) && // Usa coerção de tipo para analisar toda a string
               !isNaN(parseFloat(string)) // Garante que strings de espaços em branco falhem
    };

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