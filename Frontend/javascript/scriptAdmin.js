import { abrirFecharAside, carregarHeader } from "./scriptHeader.js";
import { carregarFooter } from "./scriptFooter.js";
import { fetchRequest, redirectIfNotLogged } from "./funcoesGerais.js";

document.addEventListener("onload", redirectIfNotLogged());

document.addEventListener("DOMContentLoaded", async function () {
  if (!sessionStorage.getItem("token")) {
    alert("Não está logado para aceder a esta página");
    window.location.href = "../html/index.html";
  }
  const userInfo = await fetchRequest("/user/user", "GET");
  if (userInfo.admin == false) {
    alert("Sem permissão para aceder a esta página");
    window.location.href = "../html/index.html";
  } else {
    await carregarHeader();
    await carregarAsideAdmin();
    await carregarFooter();
    await loadAllProducts();
    await loadAllUsers();
    await loadCategories();
    inicializarBotoesAsideAdmin();
    console.log(document.getElementById("user-info-container"));

    //Método para adicionar eventListener aos butões de exluir e remover utilizadores
    // Event delegation for removing categories
    document
      .getElementById("user-info-container")
      .addEventListener("click", function (event) {
        if (event.target.classList.contains("user-photo")) {
          const userName = event.target.getAttribute("data-username");
          checkUserProfile(userName);
        }

        if (event.target.classList.contains("deleteProductsUserBtn")) {
          const userName = event.target.getAttribute("data-username");
          const numberOfProducts = event.target.getAttribute(
            "data-numberOfProducts"
          );
          deleteProductsOfUser(userName, numberOfProducts, event.target);
        }

        if (event.target.classList.contains("excludeUserBtn")) {
          const userName = event.target.getAttribute("data-username");
          excludeUser(userName, event.target);
        }
        if (event.target.classList.contains("deleteUserBtn")) {
          const userName = event.target.getAttribute("data-username");
          deleteUser(userName, event.target);
        }
      });

    //Método para adicionar eventListener aos butões de remoção de categorias
    // Event delegation for removing categories
    document
      .getElementById("category-container")
      .addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-category-button")) {
          const categoryName = event.target.getAttribute("data-category-name");
          const numberOfProducts = event.target.getAttribute(
            "data-category-numberOfProducts"
          );
          removeCategory(categoryName, numberOfProducts, event.target);
        }
      });

    document
      .getElementById("showAddCategory")
      .addEventListener("click", showOrHideAddCategory);
    document
      .getElementById("addCategory")
      .addEventListener("click", addCategory);
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

  //Botao para fechar o modal de registo utilizador
  const closeCheckUserProfileBtn = document.getElementById(
    "close-checkUserProfile"
  );
  if (closeCheckUserProfileBtn) {
    closeCheckUserProfileBtn.addEventListener("click", closeUserProfile);
  }
}

// Função para os productos do backend e exibi-los na página de utilizador
async function loadAllProducts() {
  const allProducts = await fetchRequest(`/products/all`, "GET");
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
                ${
                  product.excluded ? '<div class="excluded-overlay"></div>' : ""
                }
                <div class="text-overlay">
                    <h2 style="background-color: transparent;">${
                      product.name
                    }</h2>
                    <p style="background-color: transparent;">Utilizador: ${
                      product.seller
                    }</p>
                    <p style="background-color: transparent;">Preço: €${
                      product.price
                    }</p>
                    <p style="background-color: transparent;">Categoria: ${
                      product.category
                    }</p>
                    <p style="background-color: transparent;">Estado: ${
                      product.state
                    }</p>
                </div>
            </div>
        `;
  // Insere o produto no container
  gridContainer.insertAdjacentHTML("beforeend", productHTML);
}

//carregar todos os utilizadores
async function loadAllUsers() {
  const allUsers = await fetchRequest(`/user/users`, "GET");
  allUsers.sort((a, b) => a.username.localeCompare(b.username));
  allUsers.forEach((user) => {
    displayUser(user);
  });
}

async function checkUserProfile(userToCheck) {
  const modalCheckUserProfile = document.getElementById(
    "modal-checkUserProfile"
  );
  const user = await fetchRequest(`/user/${userToCheck}/userInformation`);
  document.getElementById("firstname").value = user.firstName;
  document.getElementById("lastname").value = user.lastName;
  document.getElementById("usernameText").value = user.username;
  document.getElementById("email").value = user.email;
  document.getElementById("phone").value = user.phonenumber;
  document.getElementById("photo").value = user.url;
  if (user.excluded === true) {
    document.getElementById("state").value = "Excluído";
  } else {
    document.getElementById("state").value = "Ativo";
  }
  modalCheckUserProfile.style.display = "flex";
}

//Função para colocar as informações dos utilizadores na secção users
function displayUser(user) {
  // Obtém o container dos produtos
  let userContainer = document.getElementById("user-info-container");
  let numberOfProducts;
  if (user.products != null) {
    numberOfProducts = user.products.length;
  } else {
    numberOfProducts = 0;
  }

  // Cria o HTML do utilizador
  const userHTML = `
  <div class="user-card">
    <img src="${
      user.url
    }" alt="Foto do Utilizador" class="user-photo" data-username="${
    user.username
  }">
    ${user.excluded ? '<div class="excludedUser-overlay"></div>' : ""}
    <div class="user-info">
        <p class="username ${user.excluded ? "excluded-username" : ""}">${
    user.username
  }
        <p class="name">${user.firstName} ${user.lastName}</p>
        <p class="email">${user.email}</p>
        <img src="../images/deleteProducts.png" alt="exclude user" class="deleteProductsUserBtn" data-numberOfProducts="${numberOfProducts}" data-username="${
    user.username
  }">
        <img src="../images/exclude.png" alt="exclude user" class="excludeUserBtn" data-username="${
          user.username
        }">
        <img src="../images/delete.png" alt="delete user" class="deleteUserBtn" data-username="${
          user.username
        }">
    </div>
</div>
  `;
  // Insere o produto no container
  userContainer.insertAdjacentHTML("beforeend", userHTML);
}

async function excludeUser(userName, button) {
  let confirmExclude =
    confirm(`Tem a certeza que a pretende excluir o utilizador ${userName}?\n
  Irá também exluir todos os seus produtos`);
  if (confirmExclude) {
    const response = await fetchRequest(`/user/${userName}/exclude`, "PATCH");
    console.log(response);
    const userCard = button.closest(".user-card");
    /*
    if (userCard) {
      userCard.remove();
    }*/
  }
}

async function deleteUser(userName, button) {
  let confirmDelete =
    confirm(`Tem a certeza que a pretende apagar o utilizador ${userName}?\n
  Todos os seus produtos passarão para utilizador anónimo`);
  if (confirmDelete) {
    const response = await fetchRequest(`/user/${userName}/delete`, "DELETE");
    console.log(response);
    const userCard = button.closest(".user-card");
    if (userCard) {
      userCard.remove();
    }
  }
}

async function deleteProductsOfUser(userName, numberOfProducts, button) {
  let confirmDeleteProducts = confirm(
    `Tem a certeza que a pretende apagar todos os ${numberOfProducts} produtos de ${userName}?`
  );
  if (confirmDeleteProducts) {
    const response = await fetchRequest(
      `/user/${userName}/deleteProducts`,
      "DELETE"
    );
    alert("Produtos apagados com sucesso");
    window.location.reload();
  }
}

//carregar todos os utilizadores
async function loadCategories() {
  const categories = await fetchRequest(`/category/all`, "GET");
  categories.sort((a, b) => b.name.localeCompare(a.name));
  let categoryContainer = document.getElementById("category-container");
  const addCategory = `
  <div class="category-card" id="addCategory-card">
    <div class="category-info">
      <button class="showAddCategory" id="showAddCategory">Criar nova categoria</button>
      <div class="newCategoryName" id="newCategoryName" style="display: none;">
        <label>nome da categoria:</label>
        <input type="text" class="newCategoryNameBox" id="newCategoryNameBox" required>
        <button class="addCategory" id="addCategory">Adicionar</button>
      </div>  
    </div>
  </div>`;
  categoryContainer.innerHTML = '';
  categories.forEach((category) => {
    displayCategory(category);
  });
  // Insere o produto no container
  categoryContainer.insertAdjacentHTML("beforeend", addCategory);
}

//Função para colocar as informações dos utilizadores na secção users
function displayCategory(category) {
  // Obtém o container dos produtos
  let categoryContainer = document.getElementById("category-container");
  let numberOfProducts;
  if (category.products != null) {
    numberOfProducts = category.products.length;
  } else {
    numberOfProducts = 0;
  }

  // Cria o HTML do utilizador
  const categoryHTML = `
  <div class="category-card">
    <div class="category-info">
      <p class="category-name">${category.name}</p>
      <p class="category-numberOfProducts" >Nº produtos: ${numberOfProducts}</p>
      <button class="remove-category-button" data-category-numberOfProducts=${numberOfProducts} data-category-name="${category.name}">Remover</button>
    </div>
  </div>
  `;
  // Insere o produto no container
  categoryContainer.insertAdjacentHTML("afterbegin", categoryHTML);
}

// Função para remover a categoria
async function removeCategory(categoryName, numberOfProducts, button) {
  let confirmRemovalText;
  if (numberOfProducts == 0) {
    confirmRemovalText = `Tem a certeza que a pretende remover a categoria ${categoryName}?`;
  } else {
    confirmRemovalText = `A categoria ${categoryName} está associada a ${numberOfProducts} produto(s) que ficarão com a categoria "empty".\nTem a certeza que a pretende remover?`;
  }
  const confirmRemoval = confirm(confirmRemovalText);
  if (confirmRemoval) {
    const category = {
      name: categoryName,
    };
    const response = await fetchRequest("/category/delete", "DELETE", category);
    console.log(response);
    const categoryCard = button.closest(".category-card");
    if (categoryCard) {
      categoryCard.remove();
    }
  }
}

function showOrHideAddCategory() {
  const newCategoryName = document.getElementById("newCategoryName");
  if (newCategoryName.style.display == "none") {
    newCategoryName.style.display = "block";
  } else {
    newCategoryName.style.display = "none";
  }
}

//função para adicionar nova categoria
async function addCategory() {
  const newCategoryName = document
    .getElementById("newCategoryNameBox")
    .value.trim();
  if (newCategoryName.trim() == "" || newCategoryName === null) {
    alert(
      "Terá de preencher o campo do nome da nova categoria para a adicionar"
    );
  } else {
    const confirmNewCategory = confirm(
      `Pretende adicionar ${newCategoryName} como nova categoria?`
    );
    if (confirmNewCategory) {
      const newCategory = {
        name: newCategoryName,
      };
      const url =
        "http://localhost:8080/osorio-sequeira-proj3/rest/category/register";

      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(newCategory),
      })
        .then((response) => {
          const status = response.status;
          console.log("HTTP Response Status:", status);

          if (!response.ok) {
            if (status === 400) {
              throw new Error("Bad Request");
            } else if (status === 401) {
              throw new Error("Unauthorized");
            } else if (status === 403) {
              throw new Error("Forbidden");
            } else if (status === 409) {
              alert(`Categoria ${newCategoryName} já existe.`);
              throw new Error("Conflict");
            } else if (status === 500) {
              throw new Error("Internal Server Error");
            } else {
              throw new Error("Unknown error: " + status);
            }
          }

          //Check if the response is JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then((data) => {
          console.log("Response Data:", data);
          alert(`Categoria ${newCategoryName} adicionada com sucesso`);
          //document.getElementById("newCategoryNameBox").value = "";
          //showOrHideAddCategory();
          loadCategories();
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:", error);
        });
    }
  }
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

//Abrir a janela modal de registo de novo utilizador
function openRegistry() {
  const modalUserProfile = document.getElementById("modal-register");
  modalUserProfile.style.display = "flex";
}

//Função para fechar o modal window
function closeUserProfile() {
  const modalUserProfile = document.getElementById("modal-checkUserProfile");
  modalUserProfile.style.display = "none";
}
