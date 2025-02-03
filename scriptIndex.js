w3.includeHTML(() =>  {

  //Verifica se existe user no localstorage, caso contrário cria um array vazio
  if(!localStorage.getItem("users")){
    localStorage.setItem('users', JSON.stringify([]));
  }

  //Verifica se existe utilizador l
  if(logged === null){
    sessionStorage.setItem('logged', 'false');
  }
  
  const loginForm = document.getElementById('login-form');
  const welcomeMessage = document.getElementById('mensagem_boasVindas');

  // Verificar se há um nome de utilizador armazenado no Session Storage
  const storedUsername = sessionStorage.getItem('username');
  if (storedUsername) {
    welcomeMessage.textContent = `Olá, ${storedUsername}!`;
  } 

  //caso não exista um utilizador logged, apresenta o botão de login
  if((sessionStorage.getItem('logged') === 'false')){
    console.log('not a user logged');
    const login = document.getElementById('loginButton');
    login.style.visibility='visible';
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility='hidden';
  }




  // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
  newAccountBtn.addEventListener('click', openRegistry)
  logoutButton.addEventListener('click', logout);
  registerBtn.addEventListener('click', register);
  var form = document.getElementById("edit-id-form");
  const modalRegister = document.getElementById("modal-register");
  var closeRegister = document.getElementsByClassName("close-id")[0];
  var logged = sessionStorage.getItem('logged');

  
  
  
  
    
    
    const hamburger = document.getElementById('hamburger');

    hamburger.addEventListener('click', toggleAside);
    

    

      // Guardar o nome de utilizador no Session Storage quando o formulário for submetido
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        login(username);
        loginForm.reset();
    });

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
        alert(username + " não encontrado. Por favor registe-se");
      }
    }


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


  function openRegistry(){
    modalRegister.style.display = "flex";
  }

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

  function comparePasswords(passwordA, passwordB){
    if((passwordA.localeCompare(passwordB)) == 0){
      return true;
    }
    else {
      return false;
    }
  }

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

  // Função para alternar a exibição do aside
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



  // When the user clicks on <span> (x), close the modal
  closeRegister.onclick = function() {
    form.reset();
    modalRegister.style.display = "none";
  }; 

  

});

  //vê se pode ir para main
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

  function showPassword() {
    console.log("start");
    var password = document.getElementById("password");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }