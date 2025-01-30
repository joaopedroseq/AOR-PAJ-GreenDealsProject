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

  // Exibir o formulário de edição ao clicar no botão "Editar informações"
  document.getElementById('edit-product').addEventListener('click', function() {
    document.getElementById('edit-product-form').style.display = 'block';
    document.getElementById('save-product').style.display = 'block';

    // Preencher o formulário de edição com os dados atuais do produto
    document.getElementById('edit-nome').value = product.nome;
    document.getElementById('edit-descricao').value = product.descricao;
    document.getElementById('edit-preco').value = product.preco;
    document.getElementById('edit-categoria').value = product.categoria;
    document.getElementById('edit-anunciante').value = product.anunciante;
    document.getElementById('edit-localidade').value = product.localidade;
    document.getElementById('edit-imagem').value = product.imagem;
  });
});

// Função para alternar a exibição do formulário de contato
function toggleContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm.style.display === 'none' || contactForm.style.display === '') {
    contactForm.style.display = 'block';
  } else {
    contactForm.style.display = 'none';
  }
}

// Função para enviar mensagem
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

// Salvar as alterações e atualizar o localStorage
document.getElementById('edit-product-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const productIndex = new URLSearchParams(window.location.search).get('index');
  let products = localStorage.getItem('products');
  products = JSON.parse(products);

  const product = products[productIndex];

  // Atualizar os dados do produto com os valores do formulário de edição
  product.nome = document.getElementById('edit-nome').value;
  product.descricao = document.getElementById('edit-descricao').value;
  product.preco = document.getElementById('edit-preco').value;
  product.categoria = document.getElementById('edit-categoria').value;
  product.anunciante = document.getElementById('edit-anunciante').value;
  product.localidade = document.getElementById('edit-localidade').value;
  product.imagem = document.getElementById('edit-imagem').value;

  // Atualizar o localStorage com os dados modificados
  products[productIndex] = product;
  localStorage.setItem('products', JSON.stringify(products));

  alert('Produto atualizado com sucesso!');

  // Atualizar a exibição dos dados do produto na página
  document.getElementById('product-image').src = product.imagem;
  document.getElementById('product-name').textContent = product.nome;
  document.getElementById('product-description').textContent = product.descricao;
  document.getElementById('product-price').textContent = `Preço: €${product.preco}`;
  document.getElementById('product-category').textContent = `Categoria: ${product.categoria}`;
  document.getElementById('product-seller').textContent = `Nome do Anunciante: ${product.anunciante}`;
  document.getElementById('product-location').textContent = `Localização: ${product.localidade}`;
  document.getElementById('product-date').textContent = `Data de Publicação: ${product.data}`;

  // Ocultar o formulário de edição
  document.getElementById('edit-product-form').style.display = 'none';
  document.getElementById('save-product').style.display = 'none';
});
