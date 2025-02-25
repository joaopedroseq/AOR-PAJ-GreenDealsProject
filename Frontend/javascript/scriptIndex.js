document.addEventListener("DOMContentLoaded", function () {

  carregarHeader();

  function carregarHeader() {
    fetch("header.html")
      .then((response) => response.text())
      .then(async (data) => {
        document.getElementById("header-placeholder").innerHTML = data;
        //Verifica se existe utilizador logged, caso contrário, cria no sessionStorage um valor logged - fale
        if (!sessionStorage.getItem("logged")) {
          sessionStorage.setItem("logged", "false");
        }

        //Obtem elemento do login-form
        const loginForm = document.getElementById("login-form");
        loginForm.addEventListener("submit", submitLogin);

        const welcomeMessage = document.getElementById("mensagem_boasVindas");

        //Chama a função logout aquando do click no logoutButton(encontra-se no header.html)
        logoutButton.addEventListener("click", logout);

        // Verificar se há um nome de utilizador armazenado no Session Storage
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
          let firstName = sessionStorage.getItem("firstName");
          welcomeMessage.textContent = `Olá, ${firstName}!`;
          let user = JSON.parse(sessionStorage.getItem("userData"));
          document.getElementById("loginPhoto").src =
            sessionStorage.getItem("photo"); ///para implementar
        }

        //Caso não exista um utilizador logged, apresenta o botão de login
        if (sessionStorage.getItem("logged") === "false") {
          const login = document.getElementById("loginButton");
          login.style.visibility = "visible";
          const loginMessage = document.getElementById("loginMessage");
          loginMessage.style.visibility = "hidden";
        }

        const addButton = document.getElementById("add-product-btn");

        //Funções para adicionar um produto
        var modalAddProduct = document.getElementById("modal-addProduct");
        var form = document.getElementById("add-product-form");

        // Obtém o elemento <span> que fecha o modal
        var closeAddProduct =
          document.getElementsByClassName("close-addProduct")[0];

        // Adiciona o evento de submit ao formulário para guardar o produto
        var saveProductBtn = document.getElementById("save-addProduct");

        // Adiciona o evento de clique ao botão para alternar o formulário
        addButton.addEventListener("click", openAddProductModal);

        // Quando o utilizador clicar no <span> (x), fecha o modal
        closeAddProduct.addEventListener("click", closeAddProductModal);

        // Função para guardar o produto no local storage
        saveProductBtn.addEventListener("click", addProductFromForm);

        //Botão de acesso à área pessoal
        const userAreaBtn = document.getElementById("userAreaBtn");
        userAreaBtn.addEventListener("click", openUserArea);
      });
  }

      // FUnção para verificar se existe um utilizador logged
    function checkIfLogged(){
        const logged = sessionStorage.getItem('logged');
        if(logged == 'true'){
            return true;
        }
        else if((logged == 'false') || (logged == null)){
            return false;
        }
    }

  // Vai buscar o valor de username submetido no formulário, e chama a funcão login desse username, e faz reset ao formulário
  function submitLogin(event) {
    //REMEDIAR SERÁ NECESSÀRIO APAGAR?
    const loginForm = document.getElementById("login-form");
    event.preventDefault;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    login(username, password);
    loginForm.reset();
  }

  // Função para ir para a área pessoal
  function openUserArea() {
    if (checkIfLogged()) {
      window.location.href = "user.html";
    } else {
      alert("Tem que estar Logged in para aceder à sua área pessoal!");
    }
  }

  function openAddProductModal(event) {
    if (sessionStorage.getItem("logged") === "false") {
      alert("Tem que estar Logged in para vender um Produto!");
    } else {
      event.preventDefault();
      modalAddProduct.style.display = "flex";
    }
  }

  function closeAddProductModal() {
    modalAddProduct.style.display = "none";
  }

  async function addProductFromForm(event) {
    event.preventDefault();
    // Obtém os valores dos campos do formulário
    const name = document.getElementById("add-nome").value;
    const description = document.getElementById("add-descricao").value;
    const price = document.getElementById("add-preco").value;
    const category = document.getElementById("add-categoria").value;
    const location = document.getElementById("add-localidade").value;
    const urlImage = document.getElementById("add-imagem").value;
    const seller = sessionStorage.getItem("username");

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
    } else if (location.trim() === "") {
      alert("A sua morada é preenchimento obrigatório");
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

      // Se o utilizador confirmar, guarda o produto no local storage
      if (confirm) {
        try {
          const result = await addProduct(
            sessionStorage.getItem("username"),
            sessionStorage.getItem("password"),
            product
          );
          console.log("Produto adicionado com sucesso:", result);
          form.reset();
          modalAddProduct.style.display = "none";
          window.location.reload();
        } catch (error) {
          console.error("Erro ao adicionar produto:", error);
          alert("Ocorreu um erro ao adicionar o produto: " + error.message);
        }
      } else {
        form.reset();
        modalDetail.style.display = "none";
      }

      // Exibe o produto na página
      displayProduct(product, products.length - 1);
    }
  }

  async function addProduct(username, password, product) {
    console.log("Username:", username);
    console.log("Password:", password);

    const addProductURL = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/${username}/add`;

    const addProductHeaders = new Headers({
      "Content-Type": "application/json",
      username: username,
      password: password,
    });

    console.log("URL da solicitação:", addProductURL);
    console.log(
      "Cabeçalhos da solicitação:",
      Object.fromEntries(addProductHeaders)
    );
    console.log("Corpo da solicitação:", JSON.stringify(product));

    try {
      const response = await fetch(addProductURL, {
        method: "POST",
        headers: addProductHeaders,
        body: JSON.stringify(product),
      });

      console.log("Status da resposta:", response.status);
      const text = await response.text();
      console.log("Texto da resposta:", text);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert(
        "O seu produto foi adicionado como RASCUNHO\nPara alterar edite o produto na sua página pessoal"
      );
      return { status: response.status, text: text };
    } catch (error) {
      console.error("Erro detalhado:", error);
      if (error.name === "TypeError") {
        console.error("Possível erro de rede ou CORS");
      }
      throw error;
    }
  }

  //Chama a função para verificar se o username passado como parâmetro existe, se sim, então guarda este no sessionStorage
  //e aplica a visibilidade no elementos de login e da mensagem de boas vindas
  async function login(username, password) {
    const loginUrl =
      "http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/login";

    await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        console.log("Status da resposta:", response.status);
        return response
          .text()
          .then((text) => ({ status: response.status, text: text }));
      })
      .then((data) => {
        console.log("Dados recebidos:", data);
        if (data.status === 200) {
          handleSuccessfulLogin(username, password);
        } else {
          handleFailedLogin(data.text);
        }
      })
      .catch((error) => {
        console.error("Erro detalhado:", error);
        alert(
          "Erro ao tentar fazer login. Por favor, verifique o console para mais detalhes."
        );
      });
  }

  //possivelmente alterar esta função
  async function handleSuccessfulLogin(username, password) {
    console.log("correu successfull login");
    await loadUserInfo(username, password);
    await addDetailsUserInSessionStorage(username, password);
    let firstName = sessionStorage.getItem("firstName");
    welcomeMessage.textContent = `Olá, ${firstName}!`;
    document.getElementById("loginPhoto").src = sessionStorage.getItem("photo"); ///para implementar
    document.getElementById("loginMessage").style.visibility = "visible";
    document.getElementById("loginButton").style.visibility = "hidden";
    console.log("Login bem-sucedido para:", username);
    window.location.reload();
  }

  function handleFailedLogin(message) {
    console.log("correu unsuccessfull login");
    alert(message || "Login falhou. Por favor, tente novamente.");
    console.log("Login falhou:", message);
  }

  async function loadUserInfo(loggedUser, password) {
    const getUserInfoUrl = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/infoPessoal/${loggedUser}`;
    console.log("URL:", getUserInfoUrl);

    const loadUserInfoHeaders = new Headers({
      "Content-Type": "application/json",
      password: password,
      username: loggedUser,
    });

    try {
      const response = await fetch(getUserInfoUrl, {
        method: "GET",
        headers: loadUserInfoHeaders,
        credentials: "include", // Inclui as credenciais de sessão
      });

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erro na resposta: ${errorMessage}`);
      }

      const responseData = await response.json();
      console.log("Resposta JSON:", responseData);

      if (responseData) {
        sessionStorage.setItem("photo", responseData.url);
        sessionStorage.setItem("firstName", responseData.firstName);
      } else {
        console.log("Not a user logged");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Ocorreu um erro: " + error.message);
    }
  }

  //Função para efetuar o Logout
  async function logout() {
    try {
      const response = await fetch(
        "http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Inclui cookies na requisição
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Falha no logout: ${errorMessage}`);
      }

      // Limpar dados de sessão locais
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("logged");
      sessionStorage.removeItem("password"); // Removendo a senha
      localStorage.removeItem("token"); // Se estiver usando JWT

      // Atualizar a interface do usuário
      const loginMessage = document.getElementById("loginMessage");
      if (loginMessage) loginMessage.style.visibility = "hidden";

      const loginButton = document.getElementById("loginButton");
      if (loginButton) loginButton.style.visibility = "visible";

      console.log("Logout bem-sucedido, redirecionando...");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro durante o logout:", error);
      alert(`Ocorreu um erro durante o logout: ${error.message}`);
    }
  }

  //FUNÇÕES PREVIAS DO INDEX

  //Funções para o aside
  //vai  buscar o elemento "hamburger"
  const hamburger = document.getElementById("hamburger");
  // Adiciona o evento de clique ao ícone de hambúrguer para alternar a apresentação do aside
  hamburger.addEventListener("click", toggleAside);

  //Registo de utilizadores
  //Procura de elementos
  newAccountBtn.addEventListener("click", openRegistry);
  registerBtn.addEventListener("click", register);
  var form = document.getElementById("edit-id-form");
  const modalRegister = document.getElementById("modal-register");
  var closeRegister = document.getElementsByClassName("close-id")[0];
  var logged = sessionStorage.getItem("logged");

  //Abrir a janela modal de registo de novo utilizador
  function openRegistry() {
    modalRegister.style.display = "flex";
  }

  //Função para fechar o modal window
  closeRegister.onclick = function () {
    form.reset();
    modalRegister.style.display = "none";
  };

  //Função para registo de novo utilizador
  //Verifica se os campos do formulário estão preenchidos, se as condições estáo corretas e
  //se sim, adiciona o nome de utilizador a 'users' do localStorage
  function register(event) {
    event.preventDefault();
    const firstName = document.getElementById("new-name").value;
    const lastName = document.getElementById("new-lastname").value;
    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const passwordConfirm = document.getElementById(
      "new-passwordConfirm"
    ).value;
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
        fetch(
          "http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        )
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
});

//Função para mostrar a password no form de login
function showPassword() {
  console.log("start");
  var password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}
