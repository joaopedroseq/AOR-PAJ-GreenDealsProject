w3.includeHTML(() =>  {
  //Funções para o aside
  //vai  buscar o elemento "hamburger"
  const hamburger = document.getElementById('hamburger');
  // Adiciona o evento de clique ao ícone de hambúrguer para alternar a apresentação do aside
  hamburger.addEventListener('click', toggleAside);


  //Registo de utilizadores
  //Procura de elementos 
  newAccountBtn.addEventListener('click', openRegistry)
  registerBtn.addEventListener('click', register);
  var form = document.getElementById("edit-id-form");
  const modalRegister = document.getElementById("modal-register");
  var closeRegister = document.getElementsByClassName("close-id")[0];
  var logged = sessionStorage.getItem('logged');


  //Abrir a janela modal de registo de novo utilizador
  function openRegistry(){
    modalRegister.style.display = "flex";
  }

  //Função para fechar o modal window
  closeRegister.onclick = function() {
    form.reset();
    modalRegister.style.display = "none";
  }; 


  //Função para registo de novo utilizador
  //Verifica se os campos do formulário estão preenchidos, se as condições estáo corretas e
  //se sim, adiciona o nome de utilizador a 'users' do localStorage
  function register(event) {
    event.preventDefault();
    const firstName = document.getElementById('new-name').value;
    const lastName = document.getElementById('new-lastname').value;
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const passwordConfirm = document.getElementById('new-passwordConfirm').value;
    const email = document.getElementById('new-email').value;
    const phoneNumber = document.getElementById('new-phone').value;
    const url = document.getElementById('new-photo').value;

    const userData = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        email: email,
        phoneNumber: phoneNumber,
        url: url
    };

    if (firstName.trim() === "") {
        alert("O nome é um campo de preenchimento obrigatório");
    } else if (lastName.trim() === "") {
        alert("O último nome é obrigatório.");
    } else if (username.trim() === "") {
        alert("O username é de preenchimento obrigatório");
    } else if (password.trim() === "") {
        alert("A password é de preenchimento obrigatório");
    } else if (passwordConfirm.trim() === "") {
        alert("A confirmação da sua password é obrigatória");
    } else if (password !== passwordConfirm) {
        alert("As passwords não correspondem");
    } else if (email.trim() === "") {
        alert("O email é de preenchimento obrigatório");
    } else if (!email.includes('@')) {
        alert("O Email deve conter '@'.");
    } else if (phoneNumber.trim() === "") {
        alert("O número de telefone é obrigatório");
    } else if (!/^\d{9}$/.test(phoneNumber)) {
        alert("O número de telefone deve ter 9 dígitos.");
    } else if (url.trim() === "") {
        alert("A fotografia de perfil é obrigatória");
    } else {
        var confirm = window.confirm('Pretende criar um novo registo ' + firstName + '?');
        if (confirm) {
            fetch('http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                return response.text().then(text => {
                    throw new Error(text || response.statusText);
                });
            })
            .then(data => {
                console.log('Registro bem-sucedido:', data);
                alert('Registro realizado com sucesso!');
                document.getElementById('edit-id-form').reset();
                document.getElementById('modal-register').style.display = "none";
                // Aqui você pode chamar a função de login ou redirecionar o usuário
            })
            .catch(error => {
                console.error('Erro durante o registro:', error);
                let errorMessage = error.message;
                if (errorMessage === 'Bad Request') {
                    errorMessage = 'Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.';
                } else if (errorMessage.includes('There is a user with the same username')) {
                    errorMessage = 'Já existe um usuário com este nome de usuário.';
                }
                alert('Erro durante o registro: ' + errorMessage);
            });
        }
    }
}

  
  //Verifica se duas strings são iguais - serve para assim comparar se
  //a password e a password de confirmação correspondem
  function comparePasswords(passwordA, passwordB){
    if((passwordA.localeCompare(passwordB)) == 0){
      return true;
    }
    else {
      return false;
    }
  }

  //Procura se um username existe na localStorage - no registo de novos utilizadores
  //para verificar se o nome de utilizador não pode ser escolhido por já existir, e para
  //funções de login, serve para verificar se o utilizador existe
  function checkUsernameExists(username){
    console.log("a correr comparação de " + username);
    let users = JSON.parse(localStorage.getItem('users'));
    let user = users.find(user => user.username === username);

    /* localstorage.getItem s
    let users = localStorage.getItem('users');
    users = JSON.parse(users);
    "O antigo if continha LocalStorage.includes -- mas so funcionas para valors primitovs, nao objetos"
    */
    if(user){ 
      console.log("Username encontrado.")
      return true;
    }
    else{
      console.log("Username nao encontrou.")
      return false;
    }
  }

  //Procura se um Email existe na LocalStorage - no registo de novos utilizadores
function checkEmailExists(email){
  console.log("a correr comparacao de " + email);
  let users = localStorage.getItem('users');
  users=JSON.parse(users);
  if (users.includes(email)){
    return true;
  }
  else{
    return false;
  }
}

});


  //Função para mostrar a password no form de login
  function showPassword() {
    console.log("start");
    var password = document.getElementById("password");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }