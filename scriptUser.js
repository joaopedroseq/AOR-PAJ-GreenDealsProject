w3.includeHTML(() =>  {
    // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', toggleAside); 

    const loggedUser = sessionStorage.getItem('username');


    getUserProducts();
    loadUserInfo(loggedUser);
    
    

    const myProductsBtn = document.getElementById('myProductsBtn');

    const myReviewsBtn = document.getElementById('myReviewsBtn');

    const myInfoBtn = document.getElementById('myInfoBtn');


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
        console.log("a correr loaduserinfo");
        
        const getUserInfoUrl = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/${loggedUser}`;
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
      
          const responseData = await response.json();
          console.log('Resposta JSON:', responseData);
          
          if (responseData) {
            const currentUser = responseData;
            console.log('Dados do usuário:', currentUser);
          } else {
            console.log("Not a user logged");
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Ocorreu um erro: ' + error.message);
        }
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

})

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
    if(sectionId === 'informacoes') loadUserInfo();
}



    // User info functionality
    function fillUserInfo(currentUser) {
        console.log(currentUser);
        
        const infoContainer = document.getElementById('user-info-container');
        infoContainer.innerHTML = `
            <table class="user-info-table">
                <tr><td>Nome:</td><td>${currentUser.firstName} ${currentUser.lastName}</td></tr>
                <tr><td>Email:</td><td>${currentUser.email}</td></tr>
                <tr><td>Telefone:</td><td>${currentUser.phoneNumber}</td></tr>
            </table>
        `;
    }

    // função para alternar a visibilidade do formulário de edição de informações
    function toggleEditForm() {
        const formContainer = document.getElementById('edit-form-container');
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
        
        // Se o formulário estiver visível, preenche os campos com os dados atuais do utilizador
        if(formContainer.style.display === 'block') {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const currentUser = users.find(u => u.username === sessionStorage.getItem('username'));
            
            // Cria o formulário de edição com os campos preenchidos
            formContainer.innerHTML = `
                <form class="edit-form" onsubmit="saveUserInfo(event)">
                    <div>
                        <label>Primeiro Nome:</label>
                        <input type="text" id="edit-firstname" value="${currentUser.nome}" required>
                    </div>
                    <div>
                        <label>Último Nome:</label>
                        <input type="text" id="edit-lastname" value="${currentUser.lastname}" required>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" id="edit-email" value="${currentUser.email}" required>
                    </div>
                    <div>
                        <label>Telefone:</label>
                        <input type="tel" id="edit-phone" value="${currentUser.phone}">
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
    }

// Função para guardar as alterações das informações do utilizador
function saveUserInfo(event) {
    event.preventDefault(); // Evita o comportamento padrão de submissão do formulário
    const users = JSON.parse(localStorage.getItem('users'));
     // Encontra o índice do utilizador logado
    const currentUserIndex = users.findIndex(u => u.username === sessionStorage.getItem('username'));
    
    // Obtém os valores do formulário
    const newPassword = document.getElementById('edit-password').value;
    const confirmPassword = document.getElementById('edit-password-confirm').value;
    
    
    if(newPassword && newPassword !== confirmPassword) {
        alert("As passwords não coincidem!");
        return;
    }

     // Atualiza os dados do utilizador
    const updatedUser = {
        ...users[currentUserIndex], // Mantém os dados existentes
        nome: document.getElementById('edit-firstname').value,
        lastname: document.getElementById('edit-lastname').value, // Fix property name (was lastName)
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value
    };

    if(newPassword) {
        updatedUser.password = newPassword;
    }

    // Substitui o utilizador antigo pelo atualizado no array de utilizadores
    users[currentUserIndex] = updatedUser;
    
    localStorage.setItem('users', JSON.stringify(users));
     // Recarrega as informações do utilizador e fecha o formulário
    loadUserInfo();
    toggleEditForm();
    alert("Informacoes Atualizadas com Sucesso!");
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