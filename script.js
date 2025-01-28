if(sessionStorage.getItem('logged') === true){
  const login = document.getElementById('loginButton');
  login.style.display='block';
}
  
document.addEventListener('DOMContentLoaded', () => {
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
        const login = document.getElementById('loginButton');
        login.style.display='none';
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('logged', true);
        welcomeMessage.textContent = `Olá, ${username}!`;

    });
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