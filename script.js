
w3.includeHTML(() =>  {
  if((sessionStorage.getItem('logged') === null)){
console.log('not a user logged');
const login = document.getElementById('loginButton');
console.log(login);
login.style.visibility='visible';
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
  event.preventDefault();
  const username = document.getElementById('username').value;
  sessionStorage.setItem('username', username);
  sessionStorage.setItem('logged', true);
  welcomeMessage.textContent = `Olá, ${username}!`;
  const loginMessage = document.getElementById("loginMessage");
  loginMessage.style.display='block';
  const login = document.getElementById('loginButton');
  login.style.display='none';
  console.log('user ' + storedUsername + ' logged');
});
})


function showPassword() {
  console.log("start");
  var password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

function categoryBarClick() {
  console.log("start");
  var categoryBar = document.getElementById("category-bar");
  if(categoryBar.className === "category-bar"){
    categoryBar.className = "category-bar open";
  }
  else{
    categoryBar.className = "category-bar";
  }
}