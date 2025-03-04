import { carregarHeader } from "./scriptHeader.js";
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
  allProducts.forEach((product) => {
    displayProduct(product, product.id);
  });
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
  <div class="user-item" onclick="alert.("ir para a pagina de utilizador")">
    <img src='${user.url}>
    <p> Utilizador
  `

}



// Função para exibir os produtos na página
function displayProduct(product, index) {
  // Obtém o container dos produtos
  let gridContainer = document.querySelector(".grid-container");

  // Cria o HTML do produto
  const productHTML = `
            <div class="grid-item" onclick="window.location.href='detail.html?index=${index}'"> 
                <img src='${product.urlImage}' alt="${product.name}"/>
                <div class="text-overlay">
                    <h2 style="background-color: transparent;">${product.name}</h2>
                    <p style="background-color: transparent;">Utilizador: ${product.seller}</p>
                    <p style="background-color: transparent;">Preço: €${product.price}</p>
                    <p style="background-color: transparent;">Categoria: ${product.category}</p>
                    <p style="background-color: transparent;">Estado: ${product.state}</p>
                    <p style="background-color: transparent;">Excluído: ${product.excluded}</p>
                </div>
            </div>
        `;
  // Insere o produto no container
  gridContainer.insertAdjacentHTML("beforeend", productHTML);
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
  }

  // Special handling for profile sections
  if (sectionId !== "produtos") {
    document.querySelectorAll(".profile-section").forEach((section) => {
      section.classList.remove("active-section");
    });
    selectedSection.classList.add("active-section");
  }
}
