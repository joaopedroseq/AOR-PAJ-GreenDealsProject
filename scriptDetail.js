w3.includeHTML(() =>  {
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



function showPassword() {
  console.log("start");
  var password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
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

// Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
hamburger.addEventListener('click', toggleAside);

logoutButton.addEventListener('click', logout);


function toggleContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm.style.display === 'none' || contactForm.style.display === '') {
      contactForm.style.display = 'block';
  } else {
      contactForm.style.display = 'none';
  }
}

function sendMessage() {
  const message = document.getElementById('message').value;
  if (message.trim() === '') {
      alert('Por favor, escreva uma mensagem antes de enviar.');
  } else {
      alert('Mensagem enviada: ' + message);
      document.getElementById('message').value = ''; // Limpa o campo de mensagem
      document.getElementById('contact-form').style.display = 'none'; // Oculta o formulário de contato
  }
};
});
