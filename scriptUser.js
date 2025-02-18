w3.includeHTML(() =>  {
    // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', toggleAside); 

    const loggedUser = sessionStorage.getItem('username');

    loadUserInfo(loggedUser);
    getUserProducts();
    
    
    

    const myProductsBtn = document.getElementById('myProductsBtn');

    const myReviewsBtn = document.getElementById('myReviewsBtn');

    const myInfoBtn = document.getElementById('myInfoBtn');

    const editFormButton = document.getElementById("toggleEditForm");
    editFormButton.addEventListener('click', toggleEditForm);
    


    myProductsBtn.addEventListener('click', function(){
        document.getElementById("informacoesPessoais").style.display = 'none';
        document.getElementById("produtos").style.display = 'contents';
    });

    myInfoBtn.addEventListener('click', function(){
        document.getElementById("informacoesPessoais").style.display = 'contents';
        document.getElementById("produtos").style.display = 'none';
    });

    myReviewsBtn.addEventListener('click', function(){
        console.log('correu reviews');
        document.getElementById("informacoesPessoais").style.display = 'contents';
        document.getElementById("produtos").style.display = 'none';
    });


    async function loadUserInfo(loggedUser) {
        const getUserInfoUrl = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/infoPessoal/${loggedUser}`;
        console.log('URL:', getUserInfoUrl);
      
        try {
            const response = await fetch(getUserInfoUrl, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include' // Inclui as credenciais de sessão
            });
      
          console.log('Status da resposta:', response.status);
      
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro na resposta: ${errorMessage}`);
          }
      
          const userInfo = await response.json();
          console.log('Resposta JSON:', userInfo);
          
          if (userInfo) {
            fillUserInfo(userInfo);            
          } else {
            console.log("User info is empty");
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Ocorreu um erro: ' + error.message);
        }
      }

        // User info functionality
        function fillUserInfo(currentUser) {
            const infoContainer = document.getElementById('user-info-container');
            infoContainer.innerHTML = `
                <table class="user-info-table">
                    <tr><td>Nome:</td><td>${currentUser.firstName} ${currentUser.lastName}</td></tr>
                    <tr><td>Email:</td><td>${currentUser.email}</td></tr>
                    <tr><td>Telefone:</td><td>${currentUser.phoneNumber}</td></tr>
                </table>
            `;

            const formContainer = document.getElementById('edit-form-container');

            // Cria o formulário de edição com os campos preenchidos
            formContainer.innerHTML = `
                <form class="edit-form" id="edit-form" onsubmit="saveUserInfo(event)">
                    <div>
                        <label>Primeiro Nome:</label>
                        <input type="text" id="edit-firstname" value="${currentUser.firstName}" required>
                    </div>
                    <div>
                        <label>Último Nome:</label>
                        <input type="text" id="edit-lastname" value="${currentUser.lastName}" required>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" id="edit-email" value="${currentUser.email}" required>
                    </div>
                    <div>
                        <label>Telefone:</label>
                        <input type="tel" id="edit-phone" value="${currentUser.phoneNumber}">
                    </div>
                    <div>
                        <label>Foto url:</label>
                        <input type="text" id="edit-photoUrl" value="${currentUser.url}">
                    </div>
                    <div>
                        <label>Nova Password:</label>
                        <input type="password" id="edit-password">
                    </div>
                    <div>
                        <label>Confirmar Password:</label>
                        <input type="password" id="edit-password-confirm">
                    </div>
                    <button type="submit">Guardar Alterações</button>
                </form>
            `;
        }

        // função para alternar a visibilidade do formulário de edição de informações
    function toggleEditForm() {
        console.log("correu o toggle edit form");    
        const formContainer = document.getElementById('edit-form-container');
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
        
        /*// Se o formulário estiver visível, preenche os campos com os dados atuais do utilizador
        if(formContainer.style.display === 'block') {
            const currentUser = getUserInfo(sessionStorage.getItem('username'));
            console.log(currentUser);*/
        }


    
        
        


    // Função para exibir os produtos na página
    function displayProduct(product, index) {
        // Obtém o container dos produtos
        let gridContainer = document.querySelector('.grid-container');
        // Cria o HTML do produto
        const productHTML = `
            <div class="grid-item" onclick="window.location.href='detail.html?index=${index}'"> 
                <img src='${product.urlImage}' alt="${product.name}"/>
                <div class="text-overlay">
                    <h2 style="background-color: transparent;">${product.name}</h2>
                    <p style="background-color: transparent;">Preço: €${product.price}</p>
                    <p style="background-color: transparent;">Categoria: ${product.category}</p>
                </div>
            </div>
        `;
        // Insere o produto no container
        gridContainer.insertAdjacentHTML('beforeend', productHTML); 
    }

    // Função para os productos do backend e exibi-los na página de utilizador
    function getUserProducts() {
        const getAvaiableProductsUrl = 'http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/'+ loggedUser +'/products/';
        fetch(getAvaiableProductsUrl, {
          method: 'GET',
          headers: {'Content-Type': 'application/json',}
        })
        .then(response => {
          console.log('Status da resposta:', response.status);
          return response.text().then(text => ({ status: response.status, text: text }));
        })
        .then(data => {
            if(data){
            console.log('Resposta JSON:', data);
            const products = JSON.parse(data.text); // Converter a string JSON para um array
            products.forEach((product) => {
                displayProduct(product, product.id);
              });
            }
            else{
                console.log("No products to load")
            }  
          })
        .catch(error => {
          console.error('Erro:', error);
          alert('Ocorreu um erro: ' + error.message);
        });
      }
    });





function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.profile-section, #produtos').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if(selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Special handling for profile sections
    if(sectionId !== 'produtos') {
        document.querySelectorAll('.profile-section').forEach(section => {
            section.classList.remove('active-section');
        });
        selectedSection.classList.add('active-section');
    }

    // Load content if needed
    if(sectionId === 'avaliacoes') loadUserReviews();
    if(sectionId === 'informacoes'){
        loadUserInfo(loggedUser);
    } 
}



    

    

// Função para guardar as alterações das informações do utilizador
function saveUserInfo(event) {
    console.log("correu");
    event.preventDefault(); // Evita o comportamento padrão de submissão do formulário
    const form = document.getElementById('edit-form');
    
    
    // Obtém os valores do formulário
    const newPassword = document.getElementById('edit-password').value;
    const confirmPassword = document.getElementById('edit-password-confirm').value;
    console.log("new password: " + newPassword);
    console.log("confirm password: " + confirmPassword);
    
    
    if((newPassword.trim() === "") || (confirmPassword.trim() ==="")) {
        alert("Os campos de password estão vazios");
        form.reset();
        return;
    }
    else if(newPassword != confirmPassword){
        alert("As passwords não coincidem!");
        form.reset();
        return;
    }
    else{
        // Atualiza os dados do utilizador
         const updatedUser = {
        'firstName': document.getElementById('edit-firstname').value,
        'lastName' : document.getElementById('edit-lastname').value,
        'email': document.getElementById('edit-email').value,
        'phoneNumber': document.getElementById('edit-phone').value,
        'url': document.getElementById('edit-photoUrl').value,
        'password': document.getElementById('edit-password').value,
    };
    console.log(updatedUser);
    if (confirm('Pretende alterar as suas informações?')) {
        updateUser(sessionStorage.getItem('username'), updatedUser);
    }
}
    /*
    loadUserInfo();
    toggleEditForm();
    alert("Informacoes Atualizadas com Sucesso!");*/
}

async function updateUser(username, updatedUser) {
    
    const updateUserURL = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/update/${username}`;
    console.log(updatedUser);
    
    try {
      const response = await fetch(updateUserURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(updatedUser)
      });
  
      console.log('Status da resposta:', response.status);
      const text = await response.text();
      console.log('Texto da resposta:', text);
      alert("Informações atualizadas")
      window.location.reload();
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return {
        status: response.status, text: text };
    }
    catch (error) {
      console.error('Erro detalhado:', error);
      if (error.name === 'TypeError') {
        console.error('Possível erro de rede ou CORS');
      }
      throw error;
    }
  }

// Função para carregar e exibir as avaliações do utilizador
function loadUserReviews() {
    const container = document.getElementById('user-reviews-container');
    container.innerHTML = ''; // Limpa o conteúdo anterior
    
    const allReviews = JSON.parse(localStorage.getItem('avaliacoes')) || [];
    const username = sessionStorage.getItem('username');

    // Filtra as avaliações para mostrar apenas as do utilizador logado
    const userReviews = allReviews.filter(r => r.usuario === username);

     // Itera sobre as avaliações e cria o HTML para cada uma
    userReviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'user-review-item';
        reviewElement.innerHTML = `
            <div class="review-header">
                <strong>Avaliação para o Anunciante: ${review.anunciante}</strong>
                <span>${new Date(review.data).toLocaleDateString()}</span>
            </div>
            ${generateStars(review.nota)}
            <p>${review.comentario}</p>
            <div class="review-actions">
                <button class="edit-review" onclick="editUserReview('${review.data}')">Editar</button>
                <button class="delete-review" onclick="deleteUserReview('${review.data}')">Eliminar</button>
            </div>
        `;
        container.appendChild(reviewElement);
    });
}

function generateStars(nota) {
    let stars = '';
    for(let i = 1; i <= 5; i++) {
        stars += i <= nota 
            ? '<i class="fas fa-star" style="color: #ffd700;"></i>'
            : '<i class="far fa-star" style="color: #ccc;"></i>';
    }
    return stars;
}

function editUserReview(reviewId) {
    const allReviews = JSON.parse(localStorage.getItem('avaliacoes'));
    const review = allReviews.find(r => r.data === reviewId);

    // Solicita ao utilizador o novo comentário e nota
    const newComment = prompt('Editar comentário:', review.comentario);
    let newNota = prompt('Editar nota (1-5):', review.nota);
    newNota = parseInt(newNota);

    // Valida a nova nota e atualiza a avaliação
    if(newComment && !isNaN(newNota) && newNota >= 1 && newNota <= 5) {
        review.comentario = newComment;
        review.nota = newNota;
        localStorage.setItem('avaliacoes', JSON.stringify(allReviews));
        loadUserReviews();// Recarrega as avaliações
    }
}

function deleteUserReview(reviewId) {
    if(confirm('Tem certeza que deseja eliminar esta avaliação?')) {
        const allReviews = JSON.parse(localStorage.getItem('avaliacoes'));
        const updatedReviews = allReviews.filter(r => r.data !== reviewId);
        localStorage.setItem('avaliacoes', JSON.stringify(updatedReviews));
        loadUserReviews();
    }
}

    

    async function addProduct(username, password, product) {
  console.log('Username:', username);
  console.log('Password:', password);
  
  const addProductURL = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/${username}/add`;

  const addProductHeaders = new Headers({
    'Content-Type': 'application/json',
    'password': password
  });

  console.log('URL da solicitação:', addProductURL);
  console.log('Cabeçalhos da solicitação:', Object.fromEntries(addProductHeaders));
  console.log('Corpo da solicitação:', JSON.stringify(product));

  
  try {
    const response = await fetch(addProductURL, {
      method: 'POST',
      headers: addProductHeaders,
      body: JSON.stringify(product)
    });

    console.log('Status da resposta:', response.status);
    const text = await response.text();
    console.log('Texto da resposta:', text);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { status: response.status, text: text };
  } catch (error) {
    console.error('Erro detalhado:', error);
    if (error.name === 'TypeError') {
      console.error('Possível erro de rede ou CORS');
    }
    throw error;
  }
}