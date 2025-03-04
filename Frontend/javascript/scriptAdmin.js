import { abrirFecharAside, carregarHeader } from "./scriptHeader.js";
import { carregarFooter } from "./scriptFooter.js";
import { fetchRequest } from "./funcoesGerais.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userInfo = await fetchRequest("/user/user", "GET");
  if(userInfo.admin == false){
    alert('Sem permissão para aceder a esta página');
    window.location.href = "../html/index.html";
  }
  else {
  await carregarHeader();
  await carregarAsideAdmin();
  await carregarFooter();
  await loadAllProducts();
  await loadAllUsers();
  await loadCategories();
  inicializarBotoesAsideAdmin();
  }
});

async function carregarAsideAdmin() {
  fetch("asideAdmin.html")
    .then((response) => response.text())
    .then(async (data) => {
      document.getElementById("aside-placeholder").innerHTML = data;
      inicializarBotoesAsideAdmin();
    });
}

function inicializarBotoesAsideAdmin() {
  const productSectionButton = document.getElementById("showProductSection");
  productSectionButton.addEventListener("click", () => {
    document.getElementById("produtos").style.display = "contents";
    showSection("produtos");
  });

  const userSectionButton = document.getElementById("showUserSection");
  userSectionButton.addEventListener("click", () => {
    document.getElementById("produtos").style.display = "none";
    showSection("utilizadores");
  });

  const categorySectionButton = document.getElementById("showCategorySection");
  categorySectionButton.addEventListener("click", function () {
    document.getElementById("produtos").style.display = "none";
    showSection("categorias");
  });  
}

// Função para os productos do backend e exibi-los na página de utilizador
async function loadAllProducts() {
  const allProducts = await fetchRequest(
    `/products/all`,
    "GET"
  );
  allProducts.sort((a, b) => a.name.localeCompare(b.name));
  allProducts.forEach((product) => {
    displayProduct(product, product.id);
  });
}

// Função para exibir os produtos na página
function displayProduct(product, index) {
  // Obtém o container dos produtos
  let gridContainer = document.querySelector(".grid-container");

  // Cria o HTML do produto
  const productHTML = `
            <div class="grid-item" onclick="window.location.href='detail.html?index=${index}'"> 
                <img src='${product.urlImage}' alt="${product.name}"/>
                ${product.excluded ? '<div class="excluded-overlay"></div>' : ''}
                <div class="text-overlay">
                    <h2 style="background-color: transparent;">${product.name}</h2>
                    <p style="background-color: transparent;">Utilizador: ${product.seller}</p>
                    <p style="background-color: transparent;">Preço: €${product.price}</p>
                    <p style="background-color: transparent;">Categoria: ${product.category}</p>
                    <p style="background-color: transparent;">Estado: ${product.state}</p>
                </div>
            </div>
        `;
  // Insere o produto no container
  gridContainer.insertAdjacentHTML("beforeend", productHTML);
}

//carregar todos os utilizadores
async function loadAllUsers() {
  const allUsers = await fetchRequest(`/user/users`,
    "GET"
  );
  allUsers.forEach((user) => {
    displayUser(user);
  })

}

//Função para colocar as informações dos utilizadores na secção users
function displayUser(user){
  // Obtém o container dos produtos
  let userContainer = document.getElementById("user-info-container");

  // Cria o HTML do utilizador
  const userHTML = `
  <div class="user-card">
    <img src="${user.url}" alt="Foto do Utilizador" class="user-photo">
      <div class="user-info">
        <p class="username">${user.username}</p>
        <p class="name">${user.firstName} ${user.lastName}</p>
        <p class="email">${user.email}</p>
      </div>
  </div>
  `
  // Insere o produto no container
  userContainer.insertAdjacentHTML("beforeend", userHTML);
}

//carregar todos os utilizadores
async function loadCategories() {
  const categories = await fetchRequest(`/category/all`,
    "GET"
  );
  categories.forEach((category) => {
    displayCategory(category);
  })

}

//Função para colocar as informações dos utilizadores na secção users
function displayCategory(category){
  // Obtém o container dos produtos
  let categoryContainer = document.getElementById("category-container");
  let numberOfProducts;
  if(category.products != null){
    numberOfProducts = category.products.length;
  }
  else {
    numberOfProducts = 0;
  }
  console.log(numberOfProducts);

  // Cria o HTML do utilizador
  const categoryHTML = `
  <div class="category-card">
    <div class="category-info">
      <p class="category-name">${category.name}</p>
      <p class="category-numberOfProducts">Nº produtos: ${numberOfProducts}</p>
      <button id="removerCategory" onclick="removeCategory(${category.name}, this)">Remover</button>
    </div>
  </div>
  `
  // Insere o produto no container
  categoryContainer.insertAdjacentHTML("afterbegin", categoryHTML);
}

function removeCategory(category, button){
  console.log("correu");
}





function showSection(sectionId) {
  // Hide all sections
  document
    .querySelectorAll(".profile-section, #produtos")
    .forEach((section) => {
      section.style.display = "none";
    });

  // Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = "block";
    abrirFecharAside();
  }

  // Special handling for profile sections
  if (sectionId !== "produtos") {
    document.querySelectorAll(".profile-section").forEach((section) => {
      section.classList.remove("active-section");
    });
    selectedSection.classList.add("active-section");
  }
}
