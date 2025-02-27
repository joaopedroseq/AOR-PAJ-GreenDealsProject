const gridContainer = document.querySelector(".grid-container");

function displayProduct(product, index) {
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
  gridContainer.insertAdjacentHTML("beforeend", productHTML);
}

function getAvaiableProducts() {
  const getAvaiableProductsUrl =
    "http://localhost:8080/osorio-sequeira-proj3/rest/user/products";
  fetch(getAvaiableProductsUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.text())
    .then((text) => {
      const products = JSON.parse(text);
      products.forEach((product) => {
        displayProduct(product, product.id);
      });
     // setupCategoryFiltering(); // Chama a função de configuração do filtro após carregar os produtos
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Ocorreu um erro: " + error.message);
    });
}

function setupCategoryFiltering() {
  const aside = document.querySelector("aside");
  aside.addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
      const categories = aside.querySelectorAll("ul li");
      categories.forEach((cat) => cat.classList.remove("categoria-ativa"));
      event.target.classList.add("categoria-ativa");

      const selectedCategory = event.target.id.toLowerCase();
      const articles = document.querySelectorAll(".grid-item");

      articles.forEach((article) => {
        const articleCategory = article
          .querySelector(".text-overlay p:nth-child(3)")
          .textContent.split(": ")[1]
          .toLowerCase();
        article.style.display =
          articleCategory === selectedCategory || selectedCategory === "todos"
            ? "block"
            : "none";
      });
    }
  });
}

getAvaiableProducts();
