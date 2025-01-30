w3.includeHTML(() =>  {
    
    let nextIndex = localStorage.getItem('nextIndex');
    console.log(nextIndex);

    if(nextIndex){
        var indexNumber = nextIndex['0'];
        console.log(indexNumber);
        localStorage.setItem('nextIndex', indexNumber);
    }
    else {
        localStorage.setItem('nextIndex', '0');
    }
    

    if((sessionStorage.getItem('logged') === null)){
      console.log('not a user logged');
      const login = document.getElementById('loginButton');
      console.log(login);
      login.style.visibility='visible';
      const loginMessage = document.getElementById("loginMessage");
      loginMessage.style.visibility='hidden';
    }
      const loginForm = document.getElementById('login-form');
      const welcomeMessage = document.getElementById('mensagem_boasVindas');
      
      // Verificar se há um nome de utilizador armazenado no Session Storage
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        welcomeMessage.textContent = `Olá, ${storedUsername}!`;
      }  
  
    // Guardar o nome de utilizador no Session Storage quando o formulário for submetido
  loginForm.addEventListener('submit', (event) => {
      console.log("logged")
      const username = document.getElementById('username').value;
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('logged', 'true');
      welcomeMessage.textContent = `Olá, ${username}!`;
      const loginMessage = document.getElementById("loginMessage");
      loginMessage.style.display='block';
      const login = document.getElementById('loginButton');
      login.style.visibility='hidden';
      console.log('user ' + storedUsername + ' logged');
  });
  

function logout(){
    console.log("correu");
    const username = document.getElementById('username').value;
    console.log('user ' + username + ' logged out');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('logged');
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility='hidden';
    const login = document.getElementById('loginButton');
    console.log(login);
    login.style.visibility='visible';
  }
  
function showPassword() {
    console.log("start");
    var password = document.getElementById("password");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

    const form = document.getElementById('add-product-form');
    const addButton = document.getElementById('add-product-btn');
    const gridContainer = document.querySelector('.grid-container');

    // Função para alternar a exibição do formulário
    function toggleForm() {
        var form = document.getElementById('add-product-form');
        if (form.style.display === 'none' || form.style.display === '') {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    }
    
    // Adiciona o evento de clique ao botão para alternar o formulário
    addButton.addEventListener('click', function(event) {
        event.preventDefault();
        toggleForm();
    });

    // Função para guardar o produto no local storage
    function saveProduct(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const descricao = document.getElementById('descricao').value;  
        const preco = document.getElementById('preco').value;
        const categoria = document.getElementById('categoria').value;
        const anunciante = document.getElementById('anunciante').value;
        const localidade = document.getElementById('localidade').value;
        const imagem = document.getElementById('imagem').value;
        const data = new Date();

        const product = {
            nome,
            descricao,
            preco,
            categoria,
            anunciante,
            localidade,
            imagem,
            data
        };

        let products = localStorage.getItem('products');
        if (products) {
            products = JSON.parse(products);
        } else {
            products = [];
        }

        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        alert('Produto adicionado com sucesso!');
        form.reset();
        form.style.display = 'none';

        // Exibe o produto na página
        displayProduct(product, products.length - 1);
    }

    // Adiciona o evento de submit ao formulário para guardar o produto
    form.addEventListener('submit', saveProduct);

    // Função para exibir os produtos na página
    function displayProduct(product, index) {
        const productHTML = `
            <div class="grid-item" onclick="window.location.href='detail.html?index=${index}'">
                <img src='${product.imagem}' alt="${product.nome}"/>
                <div class="text-overlay">
                    <h2>${product.nome}</h2>
                    <p>Preço: €${product.preco}</p>
                </div>
            </div>
        `;
        gridContainer.insertAdjacentHTML('beforeend', productHTML);
    }

    // Função para carregar os produtos do local storage e exibi-los na página
    function loadProducts() {
        let products = localStorage.getItem('products');
        if (products) {
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
                const articleCategory = article.querySelector('.text-overlay p:nth-child(4)').textContent.split(': ')[1].toLowerCase();
                if (articleCategory === selectedCategory) {
                    article.style.display = 'block'; // Exibe os artigos da categoria selecionada
                } else {
                    article.style.display = 'none'; // Oculta os artigos de outras categorias
                }
            });
        });
    });

      // Função para alternar a exibição do aside
    function toggleAside() {
        const asideMenu = document.getElementById("aside-menu");
        console.log(asideMenu);
        if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
            asideMenu.style.display = 'block';
        } else {
            asideMenu.style.display = 'none';
        }
    }

    // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', toggleAside);   
    
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);
});
