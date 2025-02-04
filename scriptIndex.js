w3.includeHTML(() =>  {

  //Verifica se existe user no localstorage, caso contrário cria um array vazio
  if(!localStorage.getItem("users")){
    localStorage.setItem('users', JSON.stringify([]));
  }

  //Verifica se existe utilizador logged, caso contrário, cria no sessionStorage um valor logged - fale
  if(!sessionStorage.getItem("logged")){
    console.log("correu isto");
    sessionStorage.setItem('logged', 'false');
  }
  
  //Obtem elemento do login-form
  const loginForm = document.getElementById('login-form');

  // Vai buscar o valor de username submetido no formulário, e chama a funcão login desse username, e faz reset ao formulário
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    login(username);
    loginForm.reset();
  });

 

  const welcomeMessage = document.getElementById('mensagem_boasVindas');


  //Chama a função para verificar se o username passado como parâmetro existe, se sim, então guarda este no sessionStorage
  //e aplica a visibilidade no elementos de login e da mensagem de boas vindas
  function login(username){
    if(checkUsernameExists(username)){
      sessionStorage.setItem('logged', 'true');
      sessionStorage.setItem('username', username);
      welcomeMessage.textContent = `Olá, ${username}!`;
      const loginMessage = document.getElementById("loginMessage");
      loginMessage.style.visibility= 'visible';
      const login = document.getElementById('loginButton');
      login.style.visibility='hidden';
      console.log('user ' + username + ' logged');
    }
    else {
      alert(username + " não encontrado. Por favor registe-se");  //caso contrário, avisa o utilizador que não existe o seu registo,
      //e não faz login
    }
  }

  //Chama a função logout aquando do click no logoutButton(encontra-se no header.html)
  logoutButton.addEventListener('click', logout);

  //Função para fazer logout, em que são retirados os valores respetivos ao utilizador da sessioStorage, e altera a visiviliade dos elementos
  function logout(){
    const username = document.getElementById('username').value;
    console.log('user ' + username + ' logged out');
    sessionStorage.removeItem('username');
    sessionStorage.setItem('logged', 'false');
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility='hidden';
    const login = document.getElementById('loginButton');
    console.log(login);
    login.style.visibility='visible';
  }

  // Verificar se há um nome de utilizador armazenado no Session Storage
  const storedUsername = sessionStorage.getItem('username');
  if (storedUsername) {
    welcomeMessage.textContent = `Olá, ${storedUsername}!`;
  } 

  //Caso não exista um utilizador logged, apresenta o botão de login
  if((sessionStorage.getItem('logged') === 'false')){
    const login = document.getElementById('loginButton');
    login.style.visibility='visible';
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility='hidden';
  }


  //Funções para o aside
  //vai  buscar o elemento "hamburger"
  const hamburger = document.getElementById('hamburger');
  // Adiciona o evento de clique ao ícone de hambúrguer para alternar a apresentação do aside
  hamburger.addEventListener('click', toggleAside);


  //Registo de utilizadores
  //Procura de elementos 
  newAccountBtn.addEventListener('click', openRegistry)
  registerBtn.addEventListener('click', register);
  var form = document.getElementById("edit-id-form");
  const modalRegister = document.getElementById("modal-register");
  var closeRegister = document.getElementsByClassName("close-id")[0];
  var logged = sessionStorage.getItem('logged');


  //Abrir a janela modal de registo de novo utilizador
  function openRegistry(){
    modalRegister.style.display = "flex";
  }

  //Função para fechar o modal window
  closeRegister.onclick = function() {
    form.reset();
    modalRegister.style.display = "none";
  }; 


  //Função para registo de novo utilizador
  //Verifica se os campos do formulário estão preenchidos, se as condições estáo corretas e
  //se sim, adiciona o nome de utilizador a 'users' do localStorage
  function register(event){
    event.preventDefault();
    const nome = document.getElementById('new-name').value;
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const passwordConfirm = document.getElementById('new-passwordConfirm').value;
    const email = document.getElementById('new-email').value;
    

    if(nome.trim() === ""){
      alert("O nome é um campo de preenchimento obrigatório");
    }
    else if(username.trim() === ""){
      alert("O username é de preenchimento obrigatório");
    }
    else if(checkUsernameExists(username)){
      alert("Esse username já existe");
    }
    else if(password.trim() === ""){
        alert("A password é de preenchimento obrigatório");
    }
    else if(passwordConfirm.trim() === ""){
        alert("A confirmação da sua password é obrigatória");
    }
    else if(!comparePasswords(password, passwordConfirm)){
      console.log("deu falso");
      alert("As passwords não correspondem");
    }
    else if(email.trim() === ""){
      console.log("deu verdadeiro");
        alert("O email é de preenchimento obrigatório");
    }
    else{
      var confirm = window.confirm('Pretende criar um novo registo ' + nome + '?');
      if(confirm == true){
        console.log("salvar");
        let users = localStorage.getItem('users');
        if (users) {
          users = JSON.parse(users);
        } else {
          users = [];
        }
        users.push(username);
        localStorage.setItem('users', JSON.stringify(users));
        login(username);
        form.reset();
        modalRegister.style.display = "none";
      }
    }
  }
  
  //Verifica se duas strings são iguais - serve para assim comparar se
  //a password e a password de confirmação correspondem
  function comparePasswords(passwordA, passwordB){
    if((passwordA.localeCompare(passwordB)) == 0){
      return true;
    }
    else {
      return false;
    }
  }

  //Procura se um username existe na localStorage - no registo de novos utilizadores
  //para verificar se o nome de utilizador não pode ser escolhido por já existir, e para
  //funções de login, serve para verificar se o utilizador existe
  function checkUsernameExists(username){
    console.log("a correr comparação de " + username);
    let users = localStorage.getItem('users');
    users = JSON.parse(users);
    if(users.includes(username)){
      return true;
    }
    else{
      return false;
    }
  }

  // Função para alternar a apresentação do aside
    function toggleAside() {
      console.log("hamburger a correr");
      const asideMenu = document.getElementById("aside-menu");
      console.log(asideMenu);
      if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
          asideMenu.style.display = 'block';
      } else {
          asideMenu.style.display = 'none';
      }
  } 

});

  //Verficia se o utilizador pode ou não aceder ao main.html - não se não tiver feito
  //login
  function goToMain(){
    let logged = sessionStorage.getItem("logged");
    // Verifica se 'logged' existe no localStorage
    if (logged) {
        logged = JSON.parse(logged);
        console.log(logged);
    }
    if(logged){
      window.location.href = "main.html";
    }
    else {
      alert("Terá de fazer login para aceder à página de produtos");
    }
  }

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