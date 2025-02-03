w3.includeHTML(() =>  {

  //LOAD PAGE
  const productIndex = new URLSearchParams(window.location.search).get('index');
  let products = localStorage.getItem('products');
  products = JSON.parse(products);

  // Verificar se o produto foi encontrado
  var product = products[productIndex];

if(product){
  // Pega a data original do produto
  const dataCompleta = new Date(product.data);

  // Formatar a data no formato 'dd/mm/aaaa'
  /*padStart utilizado para preencher uma string até que ela tenha um comprimento
   especificado, O comprimento final da string depois que os caracteres forem adicionados*/

  const dia = dataCompleta.getDate().toString().padStart(2, '0'); // Adiciona o zero à esquerda se necessário
  const mes = (dataCompleta.getMonth() + 1).toString().padStart(2, '0'); // Meses começam do 0, então soma-se 1
  const ano = dataCompleta.getFullYear(); //p

  // Formatar a hora no formato 'hh:mm'
  const horas = dataCompleta.getHours().toString().padStart(2, '0');
  const minutos = dataCompleta.getMinutes().toString().padStart(2, '0');

  // Combinar data e hora
  const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

  // Atualizar os dados do produto na página
  document.getElementById('product-name').innerHTML = `<strong>Nome do Produto:</strong> ${product.nome}`;
  document.getElementById('product-description').innerHTML = `<strong>Descrição:</strong> ${product.descricao}`;
  document.getElementById('product-price').innerHTML = `<strong>Preço:</strong> €${product.preco}`;
  document.getElementById('product-category').innerHTML = `<strong>Categoria:</strong> ${product.categoria}`;
  document.getElementById('product-seller').innerHTML = `<strong>Nome do Anunciante:</strong> ${product.anunciante}`;
  document.getElementById('product-location').innerHTML = `<strong>Localização:</strong> ${product.localidade}`;
  document.getElementById('product-image').setAttribute('src', product.imagem);
  document.getElementById('product-date').innerHTML = `<strong>Data de Publicação:</strong> ${dataFormatada}`;
}


  //Login
  if((sessionStorage.getItem('logged') === null) || (sessionStorage.getItem('logged') == 'false')){
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
    event.preventDefault();
    const username = document.getElementById('username').value;
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('logged', true);
    welcomeMessage.textContent = `Olá, ${username}!`;
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility = 'visible';
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

  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', logout);

  
  

  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', toggleAside);

  document.getElementById('delete-product').addEventListener('click', deleteProduct);

  function deleteProduct(){
    let productIndex = new URLSearchParams(window.location.search).get('index');
    productIndex = parseInt(productIndex);
    let products = localStorage.getItem('products');
    products = JSON.parse(products);

    var confirm = window.confirm('Tem a certeza que pretende eliminar este produto?');
    if(confirm == true){
        products.splice(productIndex, 1);
        localStorage.setItem('products', JSON.stringify(products));
        window.location.href = 'main.html';
    }
    else {
    }
  }

  
    // Exibir o formulário de edição ao clicar no botão "Editar informações"
    document.getElementById('edit-product').addEventListener('click', function() {
      products = localStorage.getItem('products');
      products = JSON.parse(products);
      product = products[productIndex];
      console.log(product);
      document.getElementById('edit-product-form').style.display = 'block';
      console.log(document.getElementById('save-product'));
      fillEditForm();
    });


    // Preencher o formulário de edição com os dados atuais do produto
    function fillEditForm() {
      
      document.getElementById('edit-nome').value = product.nome;
      document.getElementById('edit-descricao').value = product.descricao;
      document.getElementById('edit-preco').value = product.preco;
      document.getElementById('edit-categoria').value = product.categoria;
      document.getElementById('edit-anunciante').value = product.anunciante;
      document.getElementById('edit-localidade').value = product.localidade;
      document.getElementById('edit-imagem').value = product.imagem;
      console.log("terminou de encher os dados para o form")
    }
  });


//});

///FIM DE LOAD PAGE
  // Salvar as alterações e atualizar o localStorage
  function saveProduct(event) {
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
    toggleAside();
  
    // Atualizar a exibição dos dados do produto na página
    document.getElementById('product-image').src = product.imagem;
    document.getElementById('product-name').innerHTML = `<strong>Nome do Produto:</strong> ${product.nome}`;
    document.getElementById('product-description').innerHTML = `<strong>Descrição:</strong> ${product.descricao}`;
    document.getElementById('product-price').innerHTML = `<strong>Preço:</strong> €${product.preco}`;
    document.getElementById('product-category').innerHTML = `<strong>Categoria:</strong> ${product.categoria}`;
    document.getElementById('product-seller').innerHTML = `<strong>Nome do Anunciante:</strong> ${product.anunciante}`;
    document.getElementById('product-location').innerHTML = `<strong>Localização:</strong> ${product.localidade}`;
    //document.getElementById('product-date').innerHTML = `<strong>Data de Publicação:</strong> ${dataFormatada}`;
  

    modal.style.display = "none";
    modalDetail.style.display = "none";

    console.log('terminou');
  };

// Função para alternar a exibição do formulário de contato
function toggleContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm.style.display === 'none' || contactForm.style.display === '') {
    contactForm.style.display = 'inline-block';
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



function showPassword() {
  var password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}


//FUNÇõES PARA EDIÇÃO DO PRODUTO
  // Get the modal
  var modalDetail = document.getElementById("modal-detail");
  

  //Botão - "Sobre Nós"
  var editBtn = document.getElementById("edit-product");
  
  // Get the <span> element that closes the modal
  var closeDetail = document.getElementsByClassName("close-detail")[0];


  //Função - "Editar produto"
  editBtn.onclick = function() {
      modalDetail.style.display = "flex";

      // Preencher o formulário de edição com os dados atuais do produto
      document.getElementById('edit-nome').value = product.nome;
      document.getElementById('edit-descricao').value = product.descricao;
      document.getElementById('edit-preco').value = product.preco;
      document.getElementById('edit-categoria').value = product.categoria;
      document.getElementById('edit-anunciante').value = product.anunciante;
      document.getElementById('edit-localidade').value = product.localidade;
      document.getElementById('edit-imagem').value = product.imagem;
    }

    // When the user clicks on <span> (x), close the modal
    closeDetail.onclick = function() {
      console.log("correu este");
      modalDetail.style.display = "none";
    };  
    
    //ASIDE
  function toggleAside() {
    const asideMenu = document.getElementById("aside-menu");
    if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
      asideMenu.style.display = 'block';
    } else {
      asideMenu.style.display = 'none';
    }
  }