w3.includeHTML(() =>  {
    // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', toggleAside); 

    const loggedUser = sessionStorage.getItem('username');

    let userData = JSON.parse(sessionStorage.getItem('userData'));
    document.getElementById("infoPhoto").src = userData.photo;
    document.getElementById("infoName").innerHTML = userData.nome;
    document.getElementById("infoLastName").innerHTML = userData.lastname;
    document.getElementById("infoUsername").innerHTML = userData.username;
    document.getElementById("infoEmail").innerHTML = userData.email;
    document.getElementById("infoContact").innerHTML = userData.phone;

    loadProducts();

    
    

    const myProductsBtn = document.getElementById('myProductsBtn');

    const myReviewsBtn = document.getElementById('myReviewsBtn');

    const myInfoBtn = document.getElementById('myInfoBtn');


    myProductsBtn.addEventListener('click', function(){
        document.getElementById("informacoesPessoais").style.display = 'none';
        document.getElementById("produtos").style.display = 'contents';
    });

    myInfoBtn.addEventListener('click', function(){
        document.getElementById("informacoesPessoais").style.display = 'contents';
        document.getElementById("produtos").style.display = 'none';
    });

    myReviewsBtn.addEventListener('click', function(){
        console.log('correu reviews');
        document.getElementById("informacoesPessoais").style.display = 'contents';
        document.getElementById("produtos").style.display = 'none';
    });






    // Função para exibir os produtos na página
    function displayProduct(product, index) {
        // Obtém o container dos produtos
        let gridContainer = document.querySelector('.grid-container');
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
                console.log(product.anunciante);
                if(product.anunciante === loggedUser){
                    displayProduct(product, index);
                }
                else {
                }
            });
        }
    }

    
}
)