import { fetchRequest } from "./funcoesGerais.js";

export async function carregarHeader() {
  fetch("header.html")
    .then((response) => response.text())
    .then(async (data) => {
      document.getElementById("header-placeholder").innerHTML = data;
      await preencheWelcomeMessage();
      inicializarBotoesHeader();
    });
}

export function inicializarBotoesHeader() {
  //botao de login
  const loginForm = document.getElementById("loginSubmit");
  loginForm.addEventListener("click", submitLogin);

  const showPasswordBtn = document.getElementById("showPasswordBtn");
  showPasswordBtn.addEventListener("click", showPassword);

  //botao de logout
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", logout);

  //Funções para  abrir o modal de adicionar produto
  const addButton = document.getElementById("add-product-btn");
  addButton.addEventListener("click", openAddProductModal);

  //Botão de acesso à área pessoal
  const userAreaBtn = document.getElementById("userAreaBtn");
  userAreaBtn.addEventListener("click", openUserArea);

  //Botao para fechar o modal de adicionar produto
  var closeAddProduct = document.getElementsByClassName("close-addProduct")[0];
  closeAddProduct.addEventListener("click", closeAddProductModal);

  //botao para adicionar um produto
  var saveProductBtn = document.getElementById("save-addProduct");
  saveProductBtn.addEventListener("click", addProductFromForm);

  //Botao para abrir o modal de registo utilizador
  const newAccountBtn = document.getElementById("newAccountBtn");
  newAccountBtn.addEventListener("click", openRegistry);

  //Botao para fechar o modal de registo utilizador
  const closeNewAccountBtn = document.getElementById("close-id");
  if (closeNewAccountBtn) {
    closeNewAccountBtn.addEventListener("click", closeRegistry);
  }
  //Botao de registo de utilizador
  const registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    registerBtn.addEventListener("click", register);
  }
  //Botao hamburguer
  const hamburger = document.getElementById("hamburger");
  hamburger.addEventListener("click", abrirFecharAside);
}

export async function preencheWelcomeMessage() {
  const welcomeMessage = document.getElementById("mensagem_boasVindas");
  if (checkIfLogged()) {
    try {
      const endpoint = "/user/user";
      const userInfo = await fetchRequest(endpoint, "GET");

      if (userInfo && userInfo.firstName) {
        welcomeMessage.textContent = `Olá, ${userInfo.firstName}!`;

        if (userInfo.url) {
          document.getElementById("loginPhoto").src = userInfo.url;
        }
      }

      const login = document.getElementById("loginButton");
      login.style.visibility = "hidden";
      const loginMessage = document.getElementById("loginMessage");
      loginMessage.style.visibility = "visible";
    } catch (error) {
      console.error("Failed to fetch user information:", error);

      welcomeMessage.textContent = "Olá, visitante!";
      const login = document.getElementById("loginButton");
      login.style.visibility = "visible";

      const loginMessage = document.getElementById("loginMessage");
      loginMessage.style.visibility = "hidden";
    }
  } else {
    welcomeMessage.textContent = "Olá, visitante!";
    const login = document.getElementById("loginButton");
    login.style.visibility = "visible";

    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility = "hidden";
  }
}

// Função para verificar se existe um utilizador logged
export function checkIfLogged() {
  const logged = sessionStorage.getItem("token");
  if (logged) {
    return true;
  } else {
    return false;
  }
}

export async function submitLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  await login(username, password);
}

export async function login(username, password) {
  const loginUrl =
    "http://localhost:8080/osorio-sequeira-proj3/rest/user/login";
  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    console.log("Status da resposta:", response.status);
    const text = await response.text();
    if (response.ok) {
      console.log("Login bem-sucedido");
      sessionStorage.setItem("token", text);
      window.location.reload();
    } else {
      handleFailedLogin(text);
    }
  } catch (error) {
    console.error("Erro detalhado:", error);
    alert(
      "Erro ao tentar fazer login. Por favor, verifique o console para mais detalhes."
    );
  }
}

export function handleFailedLogin(message) {
  alert(message || "Login falhou. Por favor, tente novamente.");
  console.log("Login falhou:", message);
}

//Função para efetuar o Logout
export async function logout() {
  try {
    const endpoint = "/user/logout";
    await fetchRequest(endpoint, "POST");
    sessionStorage.removeItem("token");
    console.log("Logout bem-sucedido");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erro durante o logout:", error);
    alert(`Ocorreu um erro durante o logout: ${error.message}`);
  }
}

// Função para ir para a área pessoal
export function openUserArea() {
  if (checkIfLogged()) {
    window.location.href = "user.html";
  } else {
    alert("Tem que estar Logged in para aceder à sua área pessoal!");
  }
}

export function openAddProductModal() {
  if (!sessionStorage.getItem("token")) {
    alert("Tem que estar Logged in para vender um Produto!");
  } else {
    var modalAddProduct = document.getElementById("modal-addProduct");
    loadCategories();
    modalAddProduct.style.display = "flex";
  }
}

async function loadCategories() {
  const endpoint = "/category/all";

  try {
    const categories = await fetchRequest(endpoint, "GET");

    const categorySelect = document.getElementById("add-categoria");

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

export function closeAddProductModal() {
  var modalAddProduct = document.getElementById("modal-addProduct");
  modalAddProduct.style.display = "none";
}

export async function addProductFromForm() {
  // Obtém os valores dos campos do formulário
  const name = document.getElementById("add-nome").value;
  const description = document.getElementById("add-descricao").value;
  const price = document.getElementById("add-preco").value;
  const category = document.getElementById("add-categoria").value;
  const location = document.getElementById("add-localidade").value;
  const urlImage = document.getElementById("add-imagem").value;
  const response = await fetchRequest("/user/user", "GET");
  const seller = response.username;

  // Validações dos campos do formulário
  if (name.trim() === "") {
    alert("O nome do produto é de preenchimento obrigatório");
  } else if (description.trim() === "") {
    alert("A descrição do produto é de preenchimento obrigatório");
  } else if (price.trim() === "") {
    alert("O preço do produto é de preenchimento obrigatório");
  } else if (!checkIfNumeric(price)) {
    alert(
      "Preço inserido inválido. Apenas poderá escrever dígitos e sem quaisquer símbolos"
    );
  } else if (category.trim() === "" || category === null) {
    alert("A categoria do produto é de preenchimento obrigatório");
  } else if (location.trim() === "") {
    alert("A localização é de preenchimento obrigatório");
  } else if (urlImage.trim() === "") {
    alert(
      "Terá de colocar um URL válido da imagem do produto que pretende anunciar"
    );
  } else {
    // Cria um objeto com os dados do produto
    const product = {
      name,
      description,
      price,
      category,
      seller,
      location,
      urlImage,
    };
    var confirm = window.confirm(
      "Tem a certeza que pretende adicionar o produto " + name + "?"
    );

    if (confirm) {
      try {
        const result = await addProduct(seller, product);
        console.log("Produto adicionado com sucesso:", result);
        var modalAddProduct = document.getElementById("modal-addProduct");
        modalAddProduct.style.display = "none";
        window.location.reload();
      } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Ocorreu um erro ao adicionar o produto: " + error.message);
      }
    } else {
      modalDetail.style.display = "none";
    }
  }
}

// Função para verificar se uma string é um número
export function checkIfNumeric(string) {
  return (
    !isNaN(string) && // Usa coerção de tipo para analisar toda a string
    !isNaN(parseFloat(string))
  ); // Garante que strings de espaços em branco falhem
}

export async function addProduct(seller, product) {
  const endpoint = `/user/${seller}/add`;
  console.log(product);
  try {
    const response = await fetchRequest(endpoint, "POST", product);
    alert(
      "O seu produto foi adicionado como RASCUNHO\nPara alterar edite o produto na sua página pessoal"
    );
    return response;
  } catch (error) {
    console.error("Erro detalhado:", error);
    if (error.name === "TypeError") {
      console.error("Possível erro de rede ou CORS");
    }
    throw error;
  }
}

//Abrir a janela modal de registo de novo utilizador
export function openRegistry() {
  const modalRegister = document.getElementById("modal-register");
  modalRegister.style.display = "flex";
}

//Função para fechar o modal window
export function closeRegistry() {
  const modalRegister = document.getElementById("modal-register");
  modalRegister.style.display = "none";
}

//funcao de registo de utilizador
export function register() {
  const firstName = document.getElementById("new-name").value;
  const lastName = document.getElementById("new-lastname").value;
  const username = document.getElementById("new-username").value;
  const password = document.getElementById("new-password").value;
  const passwordConfirm = document.getElementById("new-passwordConfirm").value;
  const email = document.getElementById("new-email").value;
  const phoneNumber = document.getElementById("new-phone").value;
  const url = document.getElementById("new-photo").value;

  const userData = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
    email: email,
    phoneNumber: phoneNumber,
    url: url,
  };

  if (firstName.trim() === "") {
    alert("O nome é um campo de preenchimento obrigatório");
  } else if (lastName.trim() === "") {
    alert("O último nome é obrigatório.");
  } else if (username.trim() === "") {
    alert("O username é de preenchimento obrigatório");
  } else if (!checkIfUsernameValid(username)){
    alert("O username não pode conter espaços");
  } else if (password.trim() === "") {
    alert("A password é de preenchimento obrigatório");
  } else if (passwordConfirm.trim() === "") {
    alert("A confirmação da sua password é obrigatória");
  } else if (password !== passwordConfirm) {
    alert("As passwords não correspondem");
  } else if (email.trim() === "") {
    alert("O email é de preenchimento obrigatório");
  } else if (!email.includes("@")) {
    alert("O Email deve conter '@'.");
  } else if (phoneNumber.trim() === "") {
    alert("O número de telefone é obrigatório");
  } else if (!/^\d{9}$/.test(phoneNumber)) {
    alert("O número de telefone deve ter 9 dígitos.");
  } else if (url.trim() === "") {
    alert("A fotografia de perfil é obrigatória");
  } else {
    var confirm = window.confirm(
      "Pretende criar um novo registo " + firstName + "?"
    );
    if (confirm) {
      fetch("http://localhost:8080/osorio-sequeira-proj3/rest/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
          return response.text().then((text) => {
            throw new Error(text || response.statusText);
          });
        })
        .then((data) => {
          console.log("Registro bem-sucedido:", data);
          alert("Registro realizado com sucesso!");
          document.getElementById("edit-id-form").reset();
          document.getElementById("modal-register").style.display = "none";
          // Aqui você pode chamar a função de login ou redirecionar o usuário
        })
        .catch((error) => {
          console.error("Erro durante o registro:", error);
          let errorMessage = error.message;
          if (errorMessage === "Bad Request") {
            errorMessage =
              "Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.";
          } else if (
            errorMessage.includes("There is a user with the same username")
          ) {
            errorMessage = "Já existe um usuário com este nome de usuário.";
          }
          alert("Erro durante o registro: " + errorMessage);
        });
    }
  }
}

//Função para mostrar a password no form de login
export function showPassword() {
  var password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

export function abrirFecharAside() {
  const asideMenu = document.getElementById("aside-menu");
  const aside = document.getElementById("aside-placeholder");
  const asideGestaoPessoal = document.getElementById(
    "aside-menu-gestao-pessoal"
  );
  if (asideMenu != null) {
    if (asideMenu.style.display == "none" || asideMenu.style.display === "") {
      asideMenu.style.display = "block";
      aside.style.display = "block";
    } else {
      asideMenu.style.display = "none";
      aside.style.display = "none";
    }
  }
  if (asideGestaoPessoal !== null) {
    if (
      asideGestaoPessoal.style.display === "none" ||
      asideGestaoPessoal.style.display === ""
    ) {
      asideGestaoPessoal.style.display = "block";
      aside.style.display = "block";
    } else {
      asideGestaoPessoal.style.display = "none";
      aside.style.display = "none";
    }
  }  
}

function checkIfUsernameValid(username){
  for(let character of username){
    if(character == " "){
      return false;
    }
  }
  return true;
}
