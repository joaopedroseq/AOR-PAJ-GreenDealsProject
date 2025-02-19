w3.includeHTML(() => {
  // Adiciona o evento de clique ao ícone de hambúrguer para alternar o aside
  const hamburger = document.getElementById("hamburger");
  hamburger.addEventListener("click", toggleAside);

  const loggedUser = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  loadUserInfo(loggedUser, password);
  getUserProducts(loggedUser, password);
    
  const myProductsBtn = document.getElementById('myProductsBtn');

  const myReviewsBtn = document.getElementById("myReviewsBtn");

  const myInfoBtn = document.getElementById("myInfoBtn");

  const editFormButton = document.getElementById("toggleEditForm");
  editFormButton.addEventListener("click", toggleEditForm);

  myProductsBtn.addEventListener("click", function () {
    document.getElementById("informacoesPessoais").style.display = "none";
    document.getElementById("produtos").style.display = "contents";
  });

  myInfoBtn.addEventListener("click", function () {
    document.getElementById("informacoesPessoais").style.display = "contents";
    document.getElementById("produtos").style.display = "none";
  });

  myReviewsBtn.addEventListener("click", function () {
    console.log("correu reviews");
    document.getElementById("informacoesPessoais").style.display = "contents";
    document.getElementById("produtos").style.display = "none";
  });

  async function loadUserInfo(loggedUser, password) {
    const getUserInfoUrl = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/infoPessoal/${loggedUser}`;
    console.log("URL:", getUserInfoUrl);

    const loadUserInfoHeaders = new Headers({
      'Content-Type': 'application/json',
      'password': password,
      'username': loggedUser
    });


    try {
      const response = await fetch(getUserInfoUrl, {
        method: "GET",
        headers: loadUserInfoHeaders,
        credentials: "include", // Inclui as credenciais de sessão
      });

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erro na resposta: ${errorMessage}`);
      }

      const userInfo = await response.json();
      console.log("Resposta JSON:", userInfo);

      if (userInfo) {
        fillUserInfo(userInfo);
      } else {
        console.log("User info is empty");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Ocorreu um erro: " + error.message);
    }
  }

  // User info functionality
  function fillUserInfo(currentUser) {
    const infoContainer = document.getElementById("user-info-container");
    infoContainer.innerHTML = `
                <table class="user-info-table">
                    <tr><td>Nome:</td><td>${currentUser.firstName} ${currentUser.lastName}</td></tr>
                    <tr><td>Email:</td><td>${currentUser.email}</td></tr>
                    <tr><td>Telefone:</td><td>${currentUser.phoneNumber}</td></tr>
                </table>
            `;

    const formContainer = document.getElementById("edit-form-container");

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
    const formContainer = document.getElementById("edit-form-container");
    formContainer.style.display =
      formContainer.style.display === "none" ? "block" : "none";

    /*// Se o formulário estiver visível, preenche os campos com os dados atuais do utilizador
        if(formContainer.style.display === 'block') {
            const currentUser = getUserInfo(sessionStorage.getItem('username'));
            console.log(currentUser);*/
  }

  // Função para exibir os produtos na página
  function displayProduct(product, index) {
    // Obtém o container dos produtos
    let gridContainer = document.querySelector(".grid-container");
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
    gridContainer.insertAdjacentHTML("beforeend", productHTML);
  }

  // Função para os productos do backend e exibi-los na página de utilizador
  function getUserProducts(loggedUser, password) {
    const getAvaiableProductsUrl =
      "http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/" +
      loggedUser +
      "/products/";
    const getUserProductstHeaders = new Headers({
        'Content-Type': 'application/json',
        'password': password,
        'username': loggedUser
      });
    fetch(getAvaiableProductsUrl, {
      method: "GET",
      headers: getUserProductstHeaders
    })
      .then((response) => {
        console.log("Status da resposta:", response.status);
        return response
          .text()
          .then((text) => ({ status: response.status, text: text }));
      })
      .then((data) => {
        if (data) {
          console.log("Resposta JSON:", data);
          const products = JSON.parse(data.text); // Converter a string JSON para um array
          products.forEach((product) => {
            displayProduct(product, product.id);
          });
        } else {
          console.log("No products to load");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Ocorreu um erro: " + error.message);
      });
  }
});

function showSection(sectionId) {
  // Hide all sections
  document
    .querySelectorAll(".profile-section, #produtos")
    .forEach((section) => {
      section.style.display = "none";
    });

  // Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = "block";
  }

  // Special handling for profile sections
  if (sectionId !== "produtos") {
    document.querySelectorAll(".profile-section").forEach((section) => {
      section.classList.remove("active-section");
    });
    selectedSection.classList.add("active-section");
  }

  // Load content if needed
  if (sectionId === "avaliacoes") loadUserReviews();
  if (sectionId === "informacoes") {
    loadUserInfo(loggedUser);
  }
}

// Função para guardar as alterações das informações do utilizador
function saveUserInfo(event) {
  console.log("correu");
  event.preventDefault(); // Evita o comportamento padrão de submissão do formulário
  const form = document.getElementById("edit-form");

  // Obtém os valores do formulário
  const newPassword = document.getElementById("edit-password").value;
  const confirmPassword = document.getElementById(
    "edit-password-confirm"
  ).value;
  console.log("new password: " + newPassword);
  console.log("confirm password: " + confirmPassword);

  if (newPassword.trim() === "" || confirmPassword.trim() === "") {
    alert("Os campos de password estão vazios");
    form.reset();
    return;
  } else if (newPassword != confirmPassword) {
    alert("As passwords não coincidem!");
    form.reset();
    return;
  } else {
    // Atualiza os dados do utilizador
    const updatedUser = {
      firstName: document.getElementById("edit-firstname").value,
      lastName: document.getElementById("edit-lastname").value,
      email: document.getElementById("edit-email").value,
      phoneNumber: document.getElementById("edit-phone").value,
      url: document.getElementById("edit-photoUrl").value,
      password: document.getElementById("edit-password").value,
    };
    console.log(updatedUser);
    if (confirm("Pretende alterar as suas informações?")) {
      let loggedUser = sessionStorage.getItem('username');
      let password = sessionStorage.getItem('password');
      updateUser(loggedUser, password, updatedUser);
      updateWithNewInformation(updatedUser);
    }   
  }
}

//função para guarda novos dados na sessionStorage
function updateWithNewInformation(updatedUser){
  sessionStorage.setItem('password', updatedUser.password);
  sessionStorage.setItem('firstName', updatedUser.firstName);
  sessionStorage.setItem('photo', updatedUser.url);
}


//função alterar no backend
async function updateUser(loggedUser, password, updatedUser) {
  const updateUserURL = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/update/${username}`;
  console.log(updatedUser);
  const updateUserHeaders = new Headers({
    'Content-Type': 'application/json',
    'password': password,
    'username': loggedUser
  });

  try {
    const response = await fetch(updateUserURL, {
      method: "POST",
      headers: updateUserHeaders,
      body: JSON.stringify(updatedUser),
    });

    console.log("Status da resposta:", response.status);
    const text = await response.text();
    console.log("Texto da resposta:", text);
    alert("Informações atualizadas");
    window.location.reload();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      status: response.status,
      text: text,
    };
  } catch (error) {
    console.error("Erro detalhado:", error);
    if (error.name === "TypeError") {
      console.error("Possível erro de rede ou CORS");
    }
    throw error;
  }
}

async function loadUserReviews() {
    const container = document.getElementById('user-reviews-container');
    container.innerHTML = 'Carregando...';
    
    const loggedUser = sessionStorage.getItem('username');
    
    try {
        const response = await fetch(
            `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/all/evaluations/${loggedUser}`
        );
        const evaluations = await response.json();

        container.innerHTML = ''; // Clear container
        
        // Filter evaluations where loggedUser is the seller
        const sellerEvaluations = evaluations.filter(ev => ev.seller === loggedUser);
        
        if (sellerEvaluations.length === 0) {
            container.innerHTML = "<p>Você ainda não recebeu avaliações.</p>";
            return;
        }

        // Display each evaluation
        sellerEvaluations.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('avaliacao-item');
            reviewElement.innerHTML = `
                <div class="review-header">
                    <strong>${review.userName}</strong>
                    <span>${new Date(review.date).toLocaleString()}</span>
                </div>
                ${generateStars(review.starNumber)}
                <p>${review.comment}</p>
            `;
            container.appendChild(reviewElement);
        });

    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        container.innerHTML = "<p>Erro ao carregar avaliações.</p>";
    }
}

// Add stars generation helper
function generateStars(nota) {
    let stars = '';
    for(let i = 1; i <= 5; i++) {
        stars += i <= nota 
            ? '<i class="fas fa-star" style="color: #ffd700;"></i>'
            : '<i class="far fa-star" style="color: #ccc;"></i>';
    }
    return stars;
}


async function editReview(evaluationId, currentComment, currentStarNumber, seller) {
    const loggedUser = sessionStorage.getItem('username');  // Retrieve logged-in user
    const password = sessionStorage.getItem('password');
    
    if (!loggedUser) {
        alert("Faça login para editar avaliações!");
        return;
    }

    const newComment = prompt('Editar comentário:', currentComment);
    let newStarNumber = prompt('Editar a nota (1-5):', currentStarNumber);
    newStarNumber = parseInt(newStarNumber); // Convert to number

    if (newComment !== null && !isNaN(newStarNumber) && newStarNumber >= 1 && newStarNumber <= 5) {
        const updatedEvaluation = {
            evaluationId,
            comment: newComment,
            starNumber: newStarNumber
        };

        try {

          const editReviewHeaders = new Headers({
            'Content-Type': 'application/json',
            'password': password,
            'username': loggedUser
          });
            const response = await fetch(
                `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/evaluation/edit/${evaluationId}/${seller}/${loggedUser}`,
                {
                    method: 'POST',
                    headers: editReviewHeaders,
                    body: JSON.stringify(updatedEvaluation)
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao atualizar avaliação');
            }

            alert("Avaliação atualizada com sucesso!");
            loadUserReviews();  // Reload the reviews
            updateRatings();  // Update statistics
        } catch (error) {
            console.error('Error updating evaluation:', error);
            alert(error.message);
        }
    } else {
        alert("Nota inválida. Insira um número entre 1 e 5.");
    }
}


async function deleteReview(evaluationId, seller) {
    const loggedUser = sessionStorage.getItem('username');  // Retrieve logged-in user
    const password = sessionStorage.getItem('password');

    if (!loggedUser) {
        alert("Faça login para apagar avaliações!");
        return;
    }

    const confirmDelete = confirm('Tem certeza que deseja eliminar esta avaliação?');
    if (confirmDelete) {
        try {
          const deleteReviewHeaders = new Headers({
            'Content-Type': 'application/json',
            'password': password,
            'username': loggedUser
          });
            const response = await fetch(
                `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/evaluation/delete/${evaluationId}/${seller}/${loggedUser}`,
                {
                    method: 'DELETE',
                    headers: deleteReviewHeaders,
                }
            );
            
            if (!response.ok) {
                throw new Error('Erro ao excluir a avaliação');
            }

            alert("Avaliação excluída com sucesso!");
            loadUserReviews();  // Reload the reviews
            updateRatings();  // Update statistics
        } catch (error) {
            console.error('Error deleting evaluation:', error);
            alert(error.message);
        }
    }
}



    async function getUserInfo(loggedUser, password) {
        
        const getUserInfoUrl = `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/infoPessoal/${loggedUser}`;
        console.log('URL:', getUserInfoUrl);

        const getUserInfoHeaders = new Headers({
          'Content-Type': 'application/json',
          'password': password,
          'username': loggedUser
        });
      
        try {
            const response = await fetch(getUserInfoUrl, {
              method: 'GET',
              headers: getUserInfoHeaders,
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
            return userInfo;            
          } else {
            console.log("User info is empty");
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Ocorreu um erro: ' + error.message);
        }
      }
    
