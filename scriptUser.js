w3.includeHTML(() =>  {
    // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', toggleAside); 

    const loggedUser = sessionStorage.getItem('username');

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
                console.log(product.anunciante);
                if(product.anunciante === loggedUser){
                    displayProduct(product, index);
                }
                else {
                }
            });
        }
    }

    // Carrega os produtos ao carregar a página
    loadProducts();
    
}
)

function toggleAside() {
    console.log("correu");
    const asideMenu = document.getElementById("aside-menu-gestao-pessoal");
    if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
      asideMenu.style.display = 'block';
    } else {
      asideMenu.style.display = 'none';
    }
  }