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
      const login = document.getElementById('loginButton');
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
    const username = document.getElementById('username').value;
    console.log('user ' + username + ' logged out');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('logged');
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility='hidden';
    const login = document.getElementById('loginButton');
    login.style.visibility='visible';
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

        //const index = nextIndex++;
        //localStorage.setItem('nextIndex', nextIndex);
        const hash = 0;
        const nome = document.getElementById('nome').value;
        const descricao = document.getElementById('descricao').value;  
        const preco = document.getElementById('preco').value;
        const categoria = document.getElementById('categoria').value;
        const anunciante = document.getElementById('anunciante').value;
        const localidade = document.getElementById('localidade').value;
        const imagem = document.getElementById('imagem').value;
        const data = new Date();

        console.log(checkIfNumeric(preco));

        if(nome.trim() === ""){
            alert("Terá de escrever o nome do produto");
        }
        else if(descricao.trim() === ""){
            alert("Terá de escrever uma descrição do produto");
        }
        else if(preco.trim() === ""){
            alert("Terá de escrever o preço do produto");
        }
        else if(!checkIfNumeric(preco)){
            alert("Preço inválido");
        }
        else if(anunciante.trim() === ""){
            alert("Terá de escrever o seu nome");
        }
        else if(localidade.trim() === ""){
            alert("Terá de escrever a sua morada");
        }
        else if(imagem.trim() === ""){
            alert("Terá de inserir um endereço válido para a imagem do produto");
        }
        else {
            const product = {
                hash,
                nome,
                descricao,
                preco,
                categoria,
                anunciante,
                localidade,
                imagem,
                data
            }

            console.log(hashCode(JSON.stringify(product)));
            product.hash = hashCode(JSON.stringify(product));
            console.log(product);
            
            var confirm = window.confirm('Tem a certeza que pretende adicionar o produto' + nome + '?');
            if(confirm == true){
                let products = localStorage.getItem('products');
                if (products) {
                    products = JSON.parse(products);
                } else {
                    products = [];
                }
                products.push(product);
                localStorage.setItem('products', JSON.stringify(products));

            
                form.reset();
                form.style.display = 'none';
                window.location.reload();
            }
            else {
                form.reset();
                form.style.display = 'none';
                window.location.reload();
            }           
        }

        // Exibe o produto na página
        displayProduct(product);
    }

    //função para verificar se um dado string é um número
    function checkIfNumeric(string) {
        return !isNaN(string) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(string)) // ...and ensure strings of whitespace fail
      };

    function hashCode(string){
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var code = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
    };

      

    // creates an array of alternating property name, property value
    // with properties in sorted order
    // then stringify's that array
    function stringifyPropsInOrder(obj) {
        var keys = Object.keys(obj).sort();
        var output = [], prop;
        for (var i = 0; i < keys.length; i++) {
            prop = keys[i];
            output.push(prop);
            output.push(obj[prop]);
        }
        return JSON.stringify(output);
    }

    // Adiciona o evento de submit ao formulário para guardar o produto
    form.addEventListener('submit', saveProduct);

    // Função para exibir os produtos na página
    function displayProduct(product) {
        const productHTML = `
            <div class="grid-item" onclick="window.location.href='detail.html?hash=${product.hash}'">
                <img src='${product.imagem}' alt="${product.nome}"/>
                <div class="text-overlay">
                    <h2>${product.nome}</h2>
                    <p>Preço: €${product.preco}</p>
                </div>
            </div>
        `;
        gridContainer.insertAdjacentHTML('beforeend', productHTML);
    }

    function getIndexOfProduct(product) {
        const products = localStorage.getItem('produtos');
        products = JSON.parse(products);

    };

    // Função para carregar os produtos do local storage e exibi-los na página
    function loadProducts() {
        let products = localStorage.getItem('products');
        if (products) {
            products = JSON.parse(products);
            /*for(var i=0; i < products.length; i++) {
                displayProduct(products.getItem(stringify(i)));
            }*/
            products.forEach(product => {
                displayProduct(product)
            })
        }
    };

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
        if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
            asideMenu.style.display = 'block';
        } else {
            asideMenu.style.display = 'none';
        }
    }

    // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
    hamburger.addEventListener('click', toggleAside);   
    
    logoutButton.addEventListener('click', logout);
});

function showPassword() {
    var password = document.getElementById("password");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }