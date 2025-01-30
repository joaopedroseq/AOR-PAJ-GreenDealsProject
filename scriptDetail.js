w3.includeHTML(() =>  {
  const productIndex = new URLSearchParams(window.location.search).get('index');
  let products = localStorage.getItem('products');
  products = JSON.parse(products);

  const product = products[productIndex];
  if(product){
    document.getElementById('product-image').src = product.imagem;
    document.getElementById('product-name').textContent = product.nome;
    document.getElementById('product-description').textContent = product.descricao;
    document.getElementById('product-price').textContent = `Preço: €${product.preco}`;
    document.getElementById('product-category').textContent = `Categoria: ${product.categoria}`;
    document.getElementById('product-seller').textContent = `Nome do Anunciante: ${product.anunciante}`;
    document.getElementById('product-location').textContent = `Localização: ${product.localidade}`;
    document.getElementById('product-date').textContent = `Data de Publicação: ${product.data}`;
  }

  if((sessionStorage.getItem('logged') === null)){
    const login = document.getElementById('loginButton');
    login.style.visibility = 'visible';
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility = 'hidden';
  }

  const loginForm = document.getElementById('login-form');
  const welcomeMessage = document.getElementById('mensagem_boasVindas');
  const storedUsername = sessionStorage.getItem('username');
  if (storedUsername) {
    welcomeMessage.textContent = `Olá, ${storedUsername}!`;
  }

  loginForm.addEventListener('submit', (event) => {
    const username = document.getElementById('username').value;
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('logged', true);
    welcomeMessage.textContent = `Olá, ${username}!`;
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.display = 'block';
    const login = document.getElementById('loginButton');
    login.style.visibility = 'hidden';
  });

  function logout(){
    const username = document.getElementById('username').value;
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('logged');
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility = 'hidden';
    const login = document.getElementById('loginButton');
    login.style.visibility = 'visible';
  }

  function showPassword() {
    var password = document.getElementById("password");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

  function toggleAside() {
    const asideMenu = document.getElementById("aside-menu");
    if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
      asideMenu.style.display = 'block';
    } else {
      asideMenu.style.display = 'none';
    }
  }

  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', toggleAside);

  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', logout);

  document.getElementById('delete-product').addEventListener('click', deleteProduct);

  function deleteProduct(){
    let productIndex = new URLSearchParams(window.location.search).get('index');
    productIndex = parseInt(productIndex);
    let products = localStorage.getItem('products');
    products = JSON.parse(products);

    products.splice(productIndex, 1);
    localStorage.setItem('products', JSON.stringify(products));

    window.location.href = 'main.html';
  }
});

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
    document.getElementById('message').value = '';
    document.getElementById('contact-form').style.display = 'none';
  }
}

