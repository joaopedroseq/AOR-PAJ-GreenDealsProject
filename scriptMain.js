
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
  
/* Carregar o formulário quando se carrega no botão "Adicionar Produto" */

function toggleForm() {
    var form = document.getElementById('add-product-form');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}


/* Para fazer a hiperligação entre as categorias e os artigos, fazendo desaparecer os artigos de outras categorias */

document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('aside ul li');
    const articles = document.querySelectorAll('.grid-item');

    // Adiciona um event listener a cada categoria
    categories.forEach(category => {
        category.addEventListener('click', function() {

            // Remove a classe 'categoria-ativa' de todos os itens
            categories.forEach(cat => cat.classList.remove('categoria-ativa'));

            // Adiciona a classe 'categoria-ativa' ao item clicado
            this.classList.add('categoria-ativa');

            // Obtém a categoria selecionada
            const selectedCategory = this.id;

            // Exibe ou oculta os artigos de acordo com a categoria selecionada
            articles.forEach(article => {
                const articleCategory = article.querySelector('.text-overlay p:nth-child(4)').textContent.split(': ')[1].toLowerCase();
                if (articleCategory === selectedCategory) {
                    article.style.display = 'block'; // Exibe os artigos da categoria selecionada
                } else {
                    article.style.display = 'none'; // Oculta os artigos de outras categorias
                }
            });
        });
    });
});



