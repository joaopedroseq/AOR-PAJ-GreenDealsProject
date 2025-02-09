w3.includeHTML(() =>  {
    //Verifica se existe user no localstorage, caso contrário cria um array vazio
  if(!localStorage.getItem("users")){
    localStorage.setItem('users', JSON.stringify([]));
  }

  //Verifica se existe utilizador logged, caso contrário, cria no sessionStorage um valor logged - fale
  if(!sessionStorage.getItem("logged")){
    sessionStorage.setItem('logged', 'false');
  }
  
  //Obtem elemento do login-form
  const loginForm = document.getElementById('login-form');

  // Vai buscar o valor de username submetido no formulário, e chama a funcão login desse username, e faz reset ao formulário
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
    loginForm.reset();
  });

  const welcomeMessage = document.getElementById('mensagem_boasVindas');


  //Chama a função para verificar se o username passado como parâmetro existe, se sim, então guarda este no sessionStorage
  //e aplica a visibilidade no elementos de login e da mensagem de boas vindas
  function login(username, password){
      let users = JSON.parse(localStorage.getItem('users'));
      let user = users.find(user => user.username === username && user.password === password)

    if(user){
      sessionStorage.setItem('logged', 'true');
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('userData', JSON.stringify(user));
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



const addButton = document.getElementById('add-product-btn');

  //Funções para adicionar um produto
  var modalAddProduct = document.getElementById("modal-addProduct");
  var form = document.getElementById("add-product-form");

 // Obtém o elemento <span> que fecha o modal
 var closeAddProduct = document.getElementsByClassName("close-addProduct")[0];
 
 // Adiciona o evento de submit ao formulário para guardar o produto
 var saveProductBtn = document.getElementById("save-addProduct");

 // Adiciona o evento de clique ao botão para alternar o formulário
 addButton.addEventListener('click', function(event) {
    if((sessionStorage.getItem('logged') === 'false')){
        alert("Tem que estar Logged in para vender um Produto!")
    }else{
     event.preventDefault();
     modalAddProduct.style.display = "flex";
 }});

 // Quando o utilizador clicar no <span> (x), fecha o modal
 closeAddProduct.onclick = function() {
    modalAddProduct.style.display = "none";
 };  
 
 // Função para guardar o produto no local storage
saveProductBtn.addEventListener('click', function(event) {
    event.preventDefault();
     // Obtém os valores dos campos do formulário
    const nome = document.getElementById('add-nome').value;
    const descricao = document.getElementById('add-descricao').value;  
    const preco = document.getElementById('add-preco').value;
    const categoria = document.getElementById('add-categoria').value;
    const localidade = document.getElementById('add-localidade').value;
    const imagem = document.getElementById('add-imagem').value;
     const data = new Date(); // Data atual
    const anunciante = sessionStorage.getItem('username');

     // Validações dos campos do formulário
    if(nome.trim() === ""){
        alert("O nome do produto é de preenchimento obrigatório");
    }
    else if(descricao.trim() === ""){
        alert("A descrição do produto é de preenchimento obrigatório");
    }
    else if(preco.trim() === ""){
        alert("O preço do produto é de preenchimento obrigatório");
    }
    else if(!checkIfNumeric(preco)){
        alert("Preço inserido inválido. Apenas poderá escrever dígitos e sem quaisquer símbolos");
    }
    else if(localidade.trim() === ""){
        alert("A sua morada é preenchimento obrigatório");
    }
    else if(imagem.trim() === ""){
        alert("Terá de colocar um URL válido da imagem do produto que pretende anunciar");
    }
    else {

         // Cria um objeto com os dados do produto
        const product = {
            nome,
            descricao,
            preco,
            categoria,
            anunciante,
            localidade,
            imagem,
            data
        }
        var confirm = window.confirm('Tem a certeza que pretende adicionar o produto ' + nome + '?'); 

         // Se o utilizador confirmar, guarda o produto no local storage
        if(confirm == true){
            console.log("salvar");
            let products = localStorage.getItem('products');
            if (products) {
                 // Converte a string JSON para um array
                products = JSON.parse(products); 
            } else {
                products = [];
            }
            products.push(product);
             // Converte o array para uma string JSON
            localStorage.setItem('products', JSON.stringify(products)); 
            form.reset();
            modalAddProduct.style.display = "none";
            window.location.reload();
        }
         // Se o utilizador cancelar, limpa o formulário e fecha o modal
        else {
            form.reset();
            modalDetail.style.display = "none";
        }
        
        // Exibe o produto na página
        displayProduct(product, products.length - 1);
    } 
});

    //Função para efetuar o Logout
    function logout(){
    // Remover o nome de utilizador da sessão
    const username = document.getElementById('username').value;
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('logged');
    const loginMessage = document.getElementById("loginMessage");
    loginMessage.style.visibility = 'hidden';
    const login = document.getElementById('loginButton');
    login.style.visibility = 'visible';
    console.log("agora vai fazer reload");
    // Redirecionar o utilizador para a página de login
    window.location.href = "index.html";
}   


    //Botão de acesso à área pessoal
    const userAreaBtn = document.getElementById('userAreaBtn');
    // Função para ir para a área pessoal
    userAreaBtn.addEventListener('click', function(event) {
        if(checkIfLogged()){
            window.location.href = 'user.html';
        }
        else{
            alert("Tem que estar Logged in para aceder à sua área pessoal!")
        }
    })


 // Função para verificar se uma string é um número
function checkIfNumeric(string) {
     return !isNaN(string) && // Usa coerção de tipo para analisar toda a string
            !isNaN(parseFloat(string)) // Garante que strings de espaços em branco falhem
};


});

 // Função para alternar a exibição do aside
 function toggleAside() {
    const asideMenu = document.getElementById("aside-menu");
    const asideGestaoPessoal = document.getElementById("aside-menu-gestao-pessoal");
    // Se o aside estiver oculto ou não visível, exibe-o
    if(asideMenu !== null){
        console.log("aside normal");
        if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
            asideMenu.style.display = 'block';
        } else {
            // Se o aside estiver visível, oculta-o
            asideMenu.style.display = 'none';
        }
    }
    if(asideGestaoPessoal !== null){
        console.log("aside gestão pessoal");
        if (asideGestaoPessoal.style.display === 'none' || asideGestaoPessoal.style.display === '') {
            asideGestaoPessoal.style.display = 'block';
        } else {
            // Se o aside estiver visível, oculta-o
            asideGestaoPessoal.style.display = 'none';
        }
    }


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