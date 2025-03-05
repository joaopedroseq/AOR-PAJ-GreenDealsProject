import { carregarHeader } from "./scriptHeader.js";
import { carregarFooter } from "./scriptFooter.js";
import { fetchRequest } from "./funcoesGerais.js";

document.addEventListener("DOMContentLoaded", async function () {
  await carregarHeader();
  await carregarAsideNormal();
  await carregarFooter();
  await getAvailableProducts();
});

async function carregarAsideNormal() {
  fetch("aside.html")
    .then((response) => response.text())
    .then(async (data) => {
      document.getElementById("aside-placeholder").innerHTML = data;
      await carregarCategorias();
      setupCategoryFiltering();
      //todo if user is admin, load users
      await carregarUsers();
    });
}

function displayProduct(product, index) {
  const gridContainer = document.querySelector(".grid-container");
  const productHTML = `
            <div class="grid-item" data-category = "${product.category}" onclick="window.location.href='detail.html?index=${index}'"> 
                <img src='${product.urlImage}' alt="${product.name}"/>
                <div class="text-overlay">
                    <h2 style="background-color: transparent;">${product.name}</h2>
                    <p style="background-color: transparent;">Preço: €${product.price}</p>
                    <p style="background-color: transparent;" >Categoria: ${product.category}</p>
                </div>
            </div>
        `;
  gridContainer.insertAdjacentHTML("beforeend", productHTML);
}

async function getAvailableProducts() {
  const endpoint = "/products/available";

  try {
    const products = await fetchRequest(endpoint, "GET");
    products.forEach((product) => {
      displayProduct(product, product.id);
    });

    //setupCategoryFiltering();
  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro: " + error.message);
  }
}

function setupCategoryFiltering() {
  const aside = document.querySelector("aside");
  aside.addEventListener("click", displayByCategory);
}

/*
function displayByCategory(event) {
  if (event.target.tagName === "LI") {
    const selectedCategory = event.target.name.toLowerCase();
    const articles = document.querySelectorAll(".grid-item");
    console.log(articles);
    console.log(selectedCategory);

    articles.forEach((article) => {
      const articleCategory = article.getAttribute("data-category");
      console.log(articleCategory);
      article.style.display =
        articleCategory === selectedCategory || selectedCategory === "todos"
          ? "block"
          : "none";
    });
  }
}
*/

async function carregarCategorias() {
  try {
    const categorias = await fetchRequest("/category/all", "GET");
    const asideMenu = document.getElementById("aside-menu");
    const ul = asideMenu.querySelector("ul");

    ul.innerHTML = "<h3>Categorias</h3>";
    const li = document.createElement("li");
    li.name = "todos";
    li.textContent = "Todos os Produtos";
    ul.appendChild(li);

    categorias.forEach((categoria) => {
      const li = document.createElement("li");
      li.name = categoria.name;
      li.textContent = categoria.name;
      ul.appendChild(li);
    });
    ul.id = "category-list";
    ul.addEventListener("click", loadProductsByCategory);

  } catch (error) {
    console.error("Failed to load categories:", error);
  }
}

async function carregarUsers() {
  const endpoint = "/user/users";
  try {
    const users = await fetchRequest(endpoint, "GET");
    console.log(users);
    const asideMenu = document.getElementById("aside-menu");
    const newUl = document.createElement("ul");
    newUl.innerHTML = "<h3>Utilizadores</h3>";
    asideMenu.appendChild(newUl);
    users.forEach((user) => {
      const li = document.createElement("li");
      li.name = user.username;
      li.textContent = user.username;
      newUl.appendChild(li);
    });
    newUl.id = "user-list";

    newUl.addEventListener("click", loadProductsByUser);

  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro: " + error.message);
  }
}

// Function to handle category clicks
function loadProductsByCategory(event) {
  if (event.target.tagName === "LI") {
    const selectedCategory = event.target.name.toLowerCase();
    console.log("Category clicked:", selectedCategory);
    // Add your logic to handle category clicks here
  }
}

// Function to handle user clicks
function loadProductsByUser(event) {
  if (event.target.tagName === "LI") {
    const selectedUser = event.target.name.toLowerCase();
    console.log("User clicked:", selectedUser);
    // Add your logic to handle user clicks here
  }
}
