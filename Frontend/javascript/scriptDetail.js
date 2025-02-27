import { carregarHeader, checkIfNumeric } from "./scriptHeader.js";
import { carregarFooter } from "./scriptFooter.js";

document.addEventListener("DOMContentLoaded", async function () {
  await carregarHeader();
  await carregarAsideNormal();
  await carregarFooter();
  await getProductInformation();
  const contactForm = document.getElementById("contact-form");
  contactForm.style.display = "none";
  contactForm.addEventListener("click", function () {
    toggleContactForm();
  });
});

async function carregarAsideNormal() {
  fetch("aside.html")
    .then((response) => response.text())
    .then(async (data) => {
      document.getElementById("aside-placeholder").innerHTML = data;
    });
}

async function getProductInformation() {
  const productId = new URLSearchParams(window.location.search).get("index");
  const getProductInformationUrl =
    "http://localhost:8080/osorio-sequeira-proj3/rest/user/products/" +
    productId;
  await fetch(getProductInformationUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      console.log("Status da resposta:", response.status);
      return response
        .text()
        .then((text) => ({ status: response.status, text: text }));
    })
    .then((product) => {
      if (product) {
        product = JSON.parse(product.text);
        // Pega a data original do produto
        const dataCompleta = new Date(product.date);

        // Formatar a data no formato 'dd/mm/aaaa'
        /*padStart utilizado para preencher uma string até que ela tenha um comprimento
      especificado, O comprimento final da string depois que os caracteres forem adicionados*/

        const dia = dataCompleta.getDate().toString().padStart(2, "0"); // Adiciona o zero à esquerda se necessário
        const mes = (dataCompleta.getMonth() + 1).toString().padStart(2, "0"); // Meses começam do 0, então soma-se 1
        const ano = dataCompleta.getFullYear(); //p

        // Formatar a hora no formato 'hh:mm'
        const horas = dataCompleta.getHours().toString().padStart(2, "0");
        const minutos = dataCompleta.getMinutes().toString().padStart(2, "0");

        // Combinar data e hora
        const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

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
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Ocorreu um erro: " + error.message);
    });
}

function adicionarBotoesEditarApagar(product) {
  if (sessionStorage.getItem("logged") == "true") {
    const storedUsername = sessionStorage
      .getItem("username")
      .trim()
      .toLowerCase();
    if (sessionStorage.getItem("logged") == "true") {
      if (product && storedUsername == product.seller.trim().toLowerCase()) {
        inicializarBotoesEditarApagarProduto(product);
      }
    } else {
      return;
    }
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

function checkAndDisplayBuyButton(product) {
  const storedUsername = sessionStorage.getItem("username").trim().toLowerCase();
  const buyButton = document.getElementById("buy-button");
  if (product && storedUsername !== product.seller.trim().toLowerCase()) {
    buyButton.style.display = "block";
    buyButton.addEventListener("click", confirmAndBuyProduct);
  } else {
    buyButton.style.display = "none";
  }
}

function confirmAndBuyProduct(productId, storedUsername, password) {
  if (confirm("Tem certeza que deseja comprar este produto?")) {
    buyProduct(productId, storedUsername, password);
  }
}

function buyProduct(productId, storedUsername, password) {
  const buyProductHeaders = new Headers({
    "Content-Type": "application/json",
    password: password,
    username: storedUsername,
  });

  fetch(
    `http://localhost:8080/osorio-sequeira-proj3/rest/user/products/buy/${productId}`,
    {
      method: "POST",
      headers: buyProductHeaders,
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw new Error("Falha na requisição");
    })
    .then((data) => {
      alert(data); // Mostra a mensagem de sucesso
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Falha ao comprar o produto");
    });
}

// Função para excluir um produto
async function deleteProduct() {
  const storedUsername = sessionStorage
    .getItem("username")
    .trim()
    .toLowerCase();
  const password = sessionStorage.getItem("password").trim().toLowerCase();
  const productId = new URLSearchParams(window.location.search).get("index");
  var userConfirm = window.confirm(
    "Tem a certeza que pretende eliminar este produto?"
  );

  if (userConfirm) {
    const deleteProductHeader = new Headers({
      "Content-Type": "application/json",
      password: password,
      username: storedUsername,
    });
    // Fazer a requisição DELETE para o backend
    fetch(
      `http://localhost:8080/osorio-sequeira-proj3/rest/user/${storedUsername}/products/${productId}`,
      {
        method: "DELETE",
        headers: deleteProductHeader,
      }
    )
      .then((response) => {
        if (response.ok) {
          // Produto deletado com sucesso
          alert("Produto eliminado com sucesso!");
          // Atualizar a lista local de produtos
          let products = JSON.parse(localStorage.getItem("products") || "[]");
          products = products.filter((p) => p.id !== productId);
          localStorage.setItem("products", JSON.stringify(products));
          // Voltar para a página anterior
          history.back();
        } else {
          // Erro ao deletar o produto
          alert("Erro ao eliminar o produto. Por favor, tente novamente.");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao tentar eliminar o produto.");
      });
  }
}

// Exibir o formulário de edição ao clicar no botão "Editar informações"
function showEditForm(product) {
  const storedUsername = sessionStorage
    .getItem("username")
    .trim()
    .toLowerCase();
  const password = sessionStorage.getItem("password").trim().toLowerCase();
  const formularioEditarProduto = document.getElementById("edit-product-form");
  const modalDetail = document.getElementById("modal-detail");
  formularioEditarProduto.style.display = "block";
  modalDetail.style.display = "flex";

  // Preencher o formulário com os dados atuais do produto
  document.getElementById("edit-nome").value = product.name;
  document.getElementById("edit-descricao").value = product.description;
  document.getElementById("edit-preco").value = product.price;
  document.getElementById("edit-categoria").value = product.category;
  document.getElementById("edit-localidade").value = product.location;
  document.getElementById("edit-imagem").value = product.urlImage;
  document.getElementById("edit-state").value = product.state;

  // Adicionar event listener para o botão de salvar
  const saveProductBtn = document.getElementById("save-product");
  saveProductBtn.addEventListener("click", async () => {
    await saveEditedProduct(product.id, storedUsername, password);
  });
  const closeModalBtn = document.getElementsByClassName("close-detail")[0];
  closeModalBtn.addEventListener("click", fecharModalEditarProduto);
}

function fecharModalEditarProduto() {
  const formularioEditarProduto = document.getElementById("edit-product-form");
  const modalDetail = document.getElementById("modal-detail");
  modalDetail.style.display = "none";
  formularioEditarProduto.style.display = "none";
}

async function saveEditedProduct(productId, storedUsername, password) {
  // Validações dos campos do formulário
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
    const editedProduct = {
      name: document.getElementById("edit-nome").value,
      description: document.getElementById("edit-descricao").value,
      price: parseFloat(document.getElementById("edit-preco").value),
      category: document.getElementById("edit-categoria").value,
      location: document.getElementById("edit-localidade").value,
      urlImage: document.getElementById("edit-imagem").value,
      state: document.getElementById("edit-state").value,
    };

    const editProductHeader = new Headers({
      "Content-Type": "application/json",
      password: password,
      username: storedUsername,
    });

    await fetch(
      `http://localhost:8080/osorio-sequeira-proj3/rest/user/${storedUsername}/products/${productId}`,
      {
        method: "POST",
        headers: editProductHeader,
        body: JSON.stringify(editedProduct),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          console.log(response.text());
          throw new Error("Falha ao atualizar o produto");
        }
      })
      .then((data) => {
        alert(data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao atualizar o produto");
      });
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
