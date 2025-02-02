w3.includeHTML(() =>  {

  // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
  hamburger.addEventListener('click', toggleAside);
  newAccountBtn.addEventListener('click', openRegistry)
  logoutButton.addEventListener('click', logout);
  registerBtn.addEventListener('click', register);
  var form = document.getElementById("edit-id-form");
  var modalRegister = document.getElementById("modal-register");



  if((sessionStorage.getItem('logged') === null)){
    console.log('not a user logged');
    const login = document.getElementById('loginButton');
    console.log(login);
    login.style.visibility='visible';
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility='hidden';
  }
  else{
  }  
    const loginForm = document.getElementById('login-form');
    const welcomeMessage = document.getElementById('mensagem_boasVindas');
    // Verificar se há um nome de utilizador armazenado no Session Storage
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      welcomeMessage.textContent = `Olá, ${storedUsername}!`;
    }  

  // Guardar o nome de utilizador no Session Storage quando o formulário for submetido
loginForm.addEventListener('submit', (event) => {
    console.log("logged")
    const username = document.getElementById('username').value;
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('logged', true);
    welcomeMessage.textContent = `Olá, ${username}!`;
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.display='block';
    const login = document.getElementById('loginButton');
    login.style.visibility='hidden';
    console.log('user ' + storedUsername + ' logged');
});


function logout(){
  console.log("correu");
  const username = document.getElementById('username').value;
  console.log('user ' + username + ' logged out');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('logged');
  const loginMessage = document.getElementById("loginMessage");
  loginMessage.style.visibility='hidden';
  const login = document.getElementById('loginButton');
  console.log(login);
  login.style.visibility='visible';
}

function openRegistry(){
  modalRegister.style.display = "flex";
}

function register(){
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
  else if(password.trim() === ""){
      alert("A password é de preenchimento obrigatório");
  }
  else if(passwordConfirm.trim() === ""){
      alert("A confirmação da sua password é obrigatória");
  }
  else if(!comparePasswords(password, passwordConfirm)){
    console.log("deu falso");
    alert("As passwords que escolheu não correspondem");
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













// Função para alternar a exibição do aside
  function toggleAside() {
    const asideMenu = document.getElementById("aside-menu");
    console.log(asideMenu);
    if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
        asideMenu.style.display = 'block';
    } else {
        asideMenu.style.display = 'none';
    }
}



});

function showPassword() {
  console.log("start");
  var password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}