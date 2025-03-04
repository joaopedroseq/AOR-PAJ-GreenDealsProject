import { carregarHeader, checkIfNumeric } from "./scriptHeader.js";
import { carregarFooter } from "./scriptFooter.js";
import { fetchRequest } from "./funcoesGerais.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userInfo = await fetchRequest("/user/user", "GET");
  await carregarHeader();
  await carregarAsideUser();
  await carregarFooter();
  await loadUserInfo(userInfo);
  await getUserProducts(userInfo.username);
  //botao editar informaçoes
  const editFormButton = document.getElementById("toggleEditForm");
  editFormButton.addEventListener("click", toggleEditForm);
  //botao de guardar informações de utilizador
  const guardarAlteracoesUserBtn = document.getElementById(
    "guardarAlteracoesUserBtn"
  );
  guardarAlteracoesUserBtn.addEventListener("click", saveUserInfo);
});

async function carregarAsideUser() {
  fetch("asideGestaoPessoal.html")
    .then((response) => response.text())
    .then(async (data) => {
      document.getElementById("aside-placeholder").innerHTML = data;
      addAdministratorOptions();
      inicializarBotoesAsideUser();
    });
}

async function addAdministratorOptions() {
  const loggedUser = await fetchRequest("/user/user", "GET");

  if (loggedUser.admin) {
    const asideMenu = document.getElementById("aside-menu-gestao-pessoal");
    const myAdminOptionsBtn = document.createElement("input");
    myAdminOptionsBtn.type = "button";
    myAdminOptionsBtn.id = "myAdminOptionsBtn";
    myAdminOptionsBtn.value = "Página de Administrador";
    const form = asideMenu.querySelector("form");
    if (form) {
      form.appendChild(myAdminOptionsBtn);
      myAdminOptionsBtn.addEventListener("click", () => {
        window.location.href = "admin.html";
      });
    } else {
      console.error("Form not found in the aside menu!");
    }
  }
}

function inicializarBotoesAsideUser() {
  const myProductsBtn = document.getElementById("myProductsBtn");
  myProductsBtn.addEventListener("click", () => {
    document.getElementById("produtos").style.display = "contents";
    showSection("produtos");
  });

  const myReviewsBtn = document.getElementById("myReviewsBtn");
  myReviewsBtn.addEventListener("click", () => {
    document.getElementById("produtos").style.display = "none";
    showSection("avaliacoes");
  });

  const myInfoBtn = document.getElementById("myInfoBtn");
  myInfoBtn.addEventListener("click", function () {
    document.getElementById("produtos").style.display = "none";
    showSection("informacoes");
  });

  if (document.getElementById("myAdminBtn")) {
    const myAdminBtn = document.getElementById("myAdminBtn");
    myAdminBtn.addEventListener("click", () => {
      window.location.href = "../html/admin.html";
    });
  }
  
}

// User info functionality
async function loadUserInfo(userInfo) {
  const infoContainer = document.getElementById("user-info-container");
  infoContainer.innerHTML = `
                <table class="user-info-table">
                    <tr><td>Nome:</td><td>${userInfo.firstName} ${userInfo.lastName}</td></tr>
                    <tr><td>Email:</td><td>${userInfo.email}</td></tr>
                    <tr><td>Telefone:</td><td>${userInfo.phoneNumber}</td></tr>
                </table>
            `;
  const formContainer = document.getElementById("edit-form-container");
  // Cria o formulário de edição com os campos preenchidos
  formContainer.innerHTML = `
                <form class="edit-form" id="edit-form">
                    <div>
                        <label>Primeiro Nome:</label>
                        <input type="text" id="edit-firstname" value="${userInfo.firstName}" required>
                    </div>
                    <div>
                        <label>Último Nome:</label>
                        <input type="text" id="edit-lastname" value="${userInfo.lastName}" required>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" id="edit-email" value="${userInfo.email}" required>
                    </div>
                    <div>
                        <label>Telefone:</label>
                        <input type="tel" id="edit-phone" value="${userInfo.phoneNumber}">
                    </div>
                    <div>
                        <label>Foto url:</label>
                        <input type="text" id="edit-photoUrl" value="${userInfo.url}">
                    </div>
                    <div>
                        <label>Nova Password:</label>
                        <input type="password" id="edit-password">
                    </div>
                    <div>
                        <label>Confirmar Password:</label>
                        <input type="password" id="edit-password-confirm">
                    </div>
                    <button type="button" id="guardarAlteracoesUserBtn">Guardar Alterações</button>
                </form>
            `;
}

// função para alternar a visibilidade do formulário de edição de informações
function toggleEditForm() {
  const formContainer = document.getElementById("edit-form-container");
  formContainer.style.display =
    formContainer.style.display === "none" ? "block" : "none";

  /*// Se o formulário estiver visível, preenche os campos com os dados atuais do utilizador
        if(formContainer.style.display === 'block') {
            const currentUser = getUserInfo(sessionStorage.getItem('username'));
            console.log(currentUser);*/
}

// Função para os productos do backend e exibi-los na página de utilizador
async function getUserProducts(username) {
  const userActiveProducts = await fetchRequest(
    `/products/active/${username}`,
    "GET"
  );
  userActiveProducts.forEach((product) => {
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
                <div class="text-overlay">
                    <h2 style="background-color: transparent;">${product.name}</h2>
                    <p style="background-color: transparent;">Preço: €${product.price}</p>
                    <p style="background-color: transparent;">Categoria: ${product.category}</p>
                    <p style="background-color: transparent;">Estado: ${product.state}</p>
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

  // Load content if needed
  if (sectionId === "avaliacoes") loadUserReviews();
}

// Função para guardar as alterações das informações do utilizador
function saveUserInfo(event) {
  event.preventDefault(); // Evita o comportamento padrão de submissão do formulário
  const form = document.getElementById("edit-form");

  // Obtém os valores do formulário
  const newPassword = document.getElementById("edit-password").value;
  const confirmPassword = document.getElementById(
    "edit-password-confirm"
  ).value;

  if (newPassword.trim() === "" || confirmPassword.trim() === "") {
    alert("Os campos de password estão vazios");
    form.reset();
    return;
  } else if (newPassword != confirmPassword) {
    alert("As passwords não coincidem!");
    form.reset();
    return;
  } else {
    // Atualiza os dados do utilizador
    const updatedUserInformation = {
      firstName: document.getElementById("edit-firstname").value,
      lastName: document.getElementById("edit-lastname").value,
      email: document.getElementById("edit-email").value,
      phoneNumber: document.getElementById("edit-phone").value,
      url: document.getElementById("edit-photoUrl").value,
      password: document.getElementById("edit-password").value,
    };
    if (confirm("Pretende alterar as suas informações?")) {
      updateUser(updatedUserInformation);
    }
  }
}

//função alterar no backend
async function updateUser(updatedUserInformation) {
  console.log(updatedUserInformation);
  const response = await fetchRequest(
    "/user/update",
    "PUT",
    updatedUserInformation
  );
  alert("Informações atualizadas");
  window.location.reload();
}

async function loadUserReviews() {
  const container = document.getElementById("user-reviews-container");
  container.innerHTML = "Carregando...";

  const loggedUser = sessionStorage.getItem("username");

  try {
    const response = await fetch(
      `http://localhost:8080/osorio-sequeira-proj3/rest/user/all/evaluations/${loggedUser}`
    );
    const evaluations = await response.json();

    container.innerHTML = ""; // Clear container

    // Filter evaluations where loggedUser is the seller
    const sellerEvaluations = evaluations.filter(
      (ev) => ev.seller === loggedUser
    );

    if (sellerEvaluations.length === 0) {
      container.innerHTML = "<p>Você ainda não recebeu avaliações.</p>";
      return;
    }

    // Display each evaluation
    sellerEvaluations.forEach((review) => {
      const reviewElement = document.createElement("div");
      reviewElement.classList.add("avaliacao-item");
      reviewElement.innerHTML = `
                <div class="review-header">
                    <strong>${review.userName}</strong>
                    <span>${new Date(review.date).toLocaleString()}</span>
                </div>
                ${generateStars(review.starNumber)}
                <p>${review.comment}</p>
            `;
      container.appendChild(reviewElement);
    });
  } catch (error) {
    console.error("Erro ao carregar avaliações:", error);
    container.innerHTML = "<p>Erro ao carregar avaliações.</p>";
  }
}

// Add stars generation helper
function generateStars(nota) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars +=
      i <= nota
        ? '<i class="fas fa-star" style="color: #ffd700;"></i>'
        : '<i class="far fa-star" style="color: #ccc;"></i>';
  }
  return stars;
}

async function editReview(
  evaluationId,
  currentComment,
  currentStarNumber,
  seller
) {
  const loggedUser = sessionStorage.getItem("username"); // Retrieve logged-in user
  const password = sessionStorage.getItem("password");

  if (!loggedUser) {
    alert("Faça login para editar avaliações!");
    return;
  }

  const newComment = prompt("Editar comentário:", currentComment);
  let newStarNumber = prompt("Editar a nota (1-5):", currentStarNumber);
  newStarNumber = parseInt(newStarNumber); // Convert to number

  if (
    newComment !== null &&
    !isNaN(newStarNumber) &&
    newStarNumber >= 1 &&
    newStarNumber <= 5
  ) {
    const updatedEvaluation = {
      evaluationId,
      comment: newComment,
      starNumber: newStarNumber,
    };

    try {
      const editReviewHeaders = new Headers({
        "Content-Type": "application/json",
        password: password,
        username: loggedUser,
      });
      const response = await fetch(
        `http://localhost:8080/osorio-sequeira-proj3/rest/user/evaluation/edit/${evaluationId}/${seller}/${loggedUser}`,
        {
          method: "POST",
          headers: editReviewHeaders,
          body: JSON.stringify(updatedEvaluation),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar avaliação");
      }

      alert("Avaliação atualizada com sucesso!");
      loadUserReviews(); // Reload the reviews
      updateRatings(); // Update statistics
    } catch (error) {
      console.error("Error updating evaluation:", error);
      alert(error.message);
    }
  } else {
    alert("Nota inválida. Insira um número entre 1 e 5.");
  }
}

async function deleteReview(evaluationId, seller) {
  const loggedUser = sessionStorage.getItem("username"); // Retrieve logged-in user
  const password = sessionStorage.getItem("password");

  if (!loggedUser) {
    alert("Faça login para apagar avaliações!");
    return;
  }

  const confirmDelete = confirm(
    "Tem certeza que deseja eliminar esta avaliação?"
  );
  if (confirmDelete) {
    try {
      const deleteReviewHeaders = new Headers({
        "Content-Type": "application/json",
        password: password,
        username: loggedUser,
      });
      const response = await fetch(
        `http://localhost:8080/osorio-sequeira-proj3/rest/user/evaluation/delete/${evaluationId}/${seller}/${loggedUser}`,
        {
          method: "DELETE",
          headers: deleteReviewHeaders,
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir a avaliação");
      }

      alert("Avaliação excluída com sucesso!");
      loadUserReviews(); // Reload the reviews
      updateRatings(); // Update statistics
    } catch (error) {
      console.error("Error deleting evaluation:", error);
      alert(error.message);
    }
  }
}
