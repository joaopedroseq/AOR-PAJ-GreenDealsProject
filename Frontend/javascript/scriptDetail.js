import { carregarHeader, checkIfNumeric } from "./scriptHeader.js";
import { carregarFooter } from "./scriptFooter.js";
import { fetchRequest, redirectIfNotLogged } from "./funcoesGerais.js";

document.addEventListener("onload", redirectIfNotLogged());

document.addEventListener("DOMContentLoaded", async function () {
  await carregarHeader();
  await carregarFooter();
  await getProductInformation();
  const contactForm = document.getElementById("contact-form");
  contactForm.style.display = "none";
  contactForm.addEventListener("click", function () {
    toggleContactForm();
  });
});


async function getProductInformation() {
  const productId = new URLSearchParams(window.location.search).get("index");
  const endpoint = `/user/products/${productId}`;

  try {
    const product = await fetchRequest(endpoint, "GET");

    if (product) {
      // Formatar a data no formato 'dd/mm/aaaa'
      const dia = `0${product.date[2]}`.slice(-2); // Adiciona o zero à esquerda e pega os últimos 2 caracteres
      const mes = `0${product.date[1]}`.slice(-2); // Meses começam do 0, então soma-se 1
      const ano = `${product.date[0]}`; // Ano já está completo

      // Combinar data e hora
      const dataFormatada = `${dia}/${mes}/${ano}`;

      // Atualizar os dados do produto na página
      document.getElementById(
        "product-name"
      ).innerHTML = `<strong>Nome do Produto:</strong> ${product.name}`;
      document.getElementById(
        "product-description"
      ).innerHTML = `<strong>Descrição:</strong> ${product.description}`;
      document.getElementById(
        "product-price"
      ).innerHTML = `<strong>Preço:</strong> €${product.price}`;
      document.getElementById(
        "product-category"
      ).innerHTML = `<strong>Categoria:</strong> ${product.category}`;
      document.getElementById(
        "product-seller"
      ).innerHTML = `<strong>Nome do Anunciante:</strong> ${product.seller}`;
      document.getElementById(
        "product-location"
      ).innerHTML = `<strong>Localização:</strong> ${product.location}`;
      document
        .getElementById("product-image")
        .setAttribute("src", product.urlImage);
      document.getElementById(
        "product-date"
      ).innerHTML = `<strong>Data de Publicação:</strong> ${dataFormatada}`;

      adicionarBotoesEditarApagar(product);
      checkAndDisplayBuyButton(product);
    } else {
      console.log("Produto vazio");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro: " + error.message);
  }
}

async function adicionarBotoesEditarApagar(product) {
  if (sessionStorage.getItem("token")) {
    const response = await fetchRequest("/user/user", "GET");
    const usernameLoggedUser = response.username;
    if (usernameLoggedUser == product.seller.trim().toLowerCase()) {
      inicializarBotoesEditarApagarProduto(product);
    }
  } else {
    return;
  }
}

function inicializarBotoesEditarApagarProduto(product) {
  const editDeleteButtons = document.getElementById("edit-delete-buttons");
  editDeleteButtons.style.display = "inline-block";
  const deleteProductBtn = document.getElementById("delete-product");
  deleteProductBtn.addEventListener("click", () => deleteProduct());
  const editProductBtn = document.getElementById("edit-product");
  editProductBtn.addEventListener("click", () => {
    showEditForm(product);
  });
}

async function checkAndDisplayBuyButton(product) {
  if (sessionStorage.getItem("token")) {
    const response = await fetchRequest("/user/user", "GET");
    const usernameLoggedUser = response.username;
    const buyButton = document.getElementById("buy-button");
    if (usernameLoggedUser !== product.seller.trim().toLowerCase()) {
      buyButton.style.display = "block";
      buyButton.addEventListener("click", confirmAndBuyProduct);
    } else {
      buyButton.style.display = "none";
    }
  }
}

function confirmAndBuyProduct() {
  const productId = new URLSearchParams(window.location.search).get("index");
  if (confirm("Tem certeza que deseja comprar este produto?")) {
    buyProduct(productId);
  }
}

async function buyProduct(productId) {
  const endpoint = `/user/products/buy/${productId}`;
  try {
    const response = await fetchRequest(endpoint, "PATCH");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erro:", error);
    alert("Falha ao comprar o produto");
  }
}

// Função para excluir um produto
async function deleteProduct() {
  const response = await fetchRequest("/user/user", "GET");
  const usernameLoggedUser = response.username;
  const productId = new URLSearchParams(window.location.search).get("index");
  var userConfirm = window.confirm(
    "Tem a certeza que pretende eliminar este produto?"
  );
  if (userConfirm) {
    const endpoint = `/user/${usernameLoggedUser}/products/${productId}`;
    try {
      await fetchRequest(endpoint, "PATCH");
      alert("Produto eliminado com sucesso!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao eliminar o produto");
    }
  }
}

// Exibir o formulário de edição ao clicar no botão "Editar informações"
function showEditForm(product) {
  const formularioEditarProduto = document.getElementById("edit-product-form");
  const modalDetail = document.getElementById("modal-detail");
  loadCategories();
  formularioEditarProduto.style.display = "block";
  modalDetail.style.display = "flex";

  // Preencher o formulário com os dados atuais do produto
  document.getElementById("edit-nome").value = product.name;
  document.getElementById("edit-descricao").value = product.description;
  document.getElementById("edit-preco").value = product.price;
  document.getElementById("edit-categoria").value = product.category;
  document.getElementById("edit-localidade").value = product.location;
  document.getElementById("edit-imagem").value = product.urlImage;
  loadStateOptions(product.state);

  // Adicionar event listener para o botão de salvar
  const saveProductBtn = document.getElementById("save-product");
  saveProductBtn.addEventListener("click", async () => {
    await saveEditedProduct(product);
  });
  const closeModalBtn = document.getElementsByClassName("close-detail")[0];
  closeModalBtn.addEventListener("click", fecharModalEditarProduto);
}

function loadStateOptions(productState) {
  const stateTransitions = {
    RASCUNHO: ["RASCUNHO", "DISPONIVEL", "RESERVADO"],
    DISPONIVEL: ["DISPONIVEL", "RESERVADO"],
    RESERVADO: ["RESERVADO", "DISPONIVEL"],
    COMPRADO: ["COMPRADO"],
  };
  const allowedStates = stateTransitions[productState] || [];

  const stateSelect = document.getElementById("edit-state");
  stateSelect.innerHTML = "";
  allowedStates.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state.charAt(0) + state.slice(1).toLowerCase();
    stateSelect.appendChild(option);
  });
}

async function loadCategories() {
  const endpoint = "/category/all";
  try {
    const categories = await fetchRequest(endpoint, "GET");

    const categorySelect = document.getElementById("edit-categoria");
    // Clear existing options (optional, if needed)
    categorySelect.innerHTML = "";
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

function fecharModalEditarProduto() {
  const formularioEditarProduto = document.getElementById("edit-product-form");
  const modalDetail = document.getElementById("modal-detail");
  modalDetail.style.display = "none";
  formularioEditarProduto.style.display = "none";
}

async function saveEditedProduct(product) {
  if (document.getElementById("edit-nome").value.trim() === "") {
    alert("O nome do produto é de preenchimento obrigatório");
  } else if (document.getElementById("edit-descricao").value === "") {
    alert("A descrição do produto é de preenchimento obrigatório");
  } else if (document.getElementById("edit-preco").value === "") {
    alert("O preço do produto é de preenchimento obrigatório");
  } else if (!checkIfNumeric(document.getElementById("edit-preco").value)) {
    alert(
      "Preço inserido inválido. Apenas poderá escrever dígitos e sem quaisquer símbolos"
    );
  } else if (document.getElementById("edit-localidade").value === "") {
    alert("A sua morada é preenchimento obrigatório");
  } else if (document.getElementById("edit-imagem").value === "") {
    alert(
      "Terá de colocar um URL válido da imagem do produto que pretende anunciar"
    );
  } else if (document.getElementById("edit-categoria").value === "") {
    alert("Produto sem categoria");
  } else {
    product.name = document.getElementById("edit-nome").value;
    product.description = document.getElementById("edit-descricao").value;
    product.price = parseFloat(document.getElementById("edit-preco").value);
    product.category = document.getElementById("edit-categoria").value;
    product.location = document.getElementById("edit-localidade").value;
    product.urlImage = document.getElementById("edit-imagem").value;
    product.state = document.getElementById("edit-state").value;

    const response = await fetchRequest("/user/user", "GET");
    const usernameLoggedUser = response.username;
    const endpoint = `/user/${usernameLoggedUser}/products/${product.id}`;
    try {
      await fetchRequest(endpoint, "PUT", product);
      alert("Produto editado com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao editar o produto");
    }
  }
}

// Função para alternar a exibição do formulário de contato
function toggleContactForm() {
  const contactForm = document.getElementById("contact-form");
  // Se o formulário estiver oculto ou não existir, exibi-lo
  if (
    contactForm.style.display === "none" ||
    contactForm.style.display === ""
  ) {
    contactForm.style.display = "inline-block";
  } else {
    contactForm.style.display = "none";
  }
  document.getElementById("send-btn").addEventListener("click", sendMessage);
}

// Função para enviar mensagem
function sendMessage() {
  const message = document.getElementById("message").value;
  if (message.trim() === "") {
    // Se a mensagem estiver vazia, exibir um alerta
    alert("Por favor, escreva uma mensagem antes de enviar.");
  } else {
    // Se a mensagem não estiver vazia, exibir um alerta com a mensagem
    alert("Mensagem enviada: " + message);
    document.getElementById("message").value = "";
    document.getElementById("contact-form").style.display = "none";
  }
}
