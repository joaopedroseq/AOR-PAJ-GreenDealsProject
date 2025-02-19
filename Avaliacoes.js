let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; // Initialize rating counts

document.addEventListener('DOMContentLoaded', async function () {
    const stars = document.querySelectorAll('#rating i');
    const notaInput = document.getElementById('nota');
    const ratingText = document.getElementById('rating-text');

    // Get product details from URL
    const productIndex = new URLSearchParams(window.location.search).get('index');
    if (!productIndex) {
        console.error("Product index not found in URL!");
        return;
    }


    // Fetch product details from backend
    const product = await getProductInformation(productIndex);
    if (!product) {
        console.error("Product not found!");
        return;
    }

    const anunciante = product.seller; // Seller of the product

    // Rating descriptions
    const ratingWords = {
        1: 'Péssimo',
        2: 'Mau',
        3: 'OK',
        4: 'Bom',
        5: 'Excelente'
    };

    // Initialize ratings and display evaluations
    await updateRatings(productIndex, anunciante);
    await displayAvaliacoes(anunciante, productIndex);

    // Add event listeners for star hover and click
    stars.forEach(star => {
        star.addEventListener('mouseover', function () {
            const ratingValue = this.getAttribute('data-value');
            highlightStars(ratingValue);
            ratingText.textContent = ratingWords[ratingValue];
        });

        star.addEventListener('click', function () {
            const ratingValue = this.getAttribute('data-value');
            notaInput.value = ratingValue; // Set the hidden input value
            selectStars(ratingValue);
            ratingText.textContent = ratingWords[ratingValue];
        });
    });

    // Reset stars when mouse leaves the rating area
    document.getElementById('rating').addEventListener('mouseleave', function () {
        const selectedValue = notaInput.value;
        if (selectedValue) {
            selectStars(selectedValue);
            ratingText.textContent = ratingWords[selectedValue];
        } else {
            clearStars();
            ratingText.textContent = '';
        }
    });

    // Form submission for evaluations
    document.getElementById('formAvaliacao').addEventListener('submit', async function (event) {
        event.preventDefault();

        const productIndex = new URLSearchParams(window.location.search).get('index');  // Get productIndex from URL
        console.log("Product index from URL:", productIndex);
        if (!productIndex) {
            alert("Erro: o ID do produto não foi encontrado na URL.");
            return;
        }

        if (sessionStorage.getItem('logged') === 'false') {
            alert("Tem que estar logado para criar uma avaliação!");
            return;
        }

        const nota = notaInput.value;
        const comentario = document.getElementById('comentario').value;

        if (!nota || !comentario) {
            alert("Por favor, selecione uma nota e escreva um comentário.");
            return;
        }

        try {
            const evaluation = {
                starNumber: parseInt(nota),
                comment: comentario,
                userName: sessionStorage.getItem('username'),
                seller: anunciante,
                productId: productIndex
            };

            let storedUsername = sessionStorage.getItem('username');
            let password = sessionStorage.getItem('password');

            const addEvaluationtHeader = new Headers({
                'Content-Type': 'application/json',
                'password': password,
                'username': storedUsername
              });

            const response = await fetch(
                `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/add/evaluation/${anunciante}`,
                {
                    method: 'POST',
                    headers: addEvaluationtHeader,
                    body: JSON.stringify(evaluation)
                }
            );

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erro desconhecido');
            }

            // Clear form and refresh evaluations
            this.reset();
            clearStars();
            notaInput.value = '';
            ratingText.textContent = '';

            await updateRatings(productIndex, anunciante);
            await displayAvaliacoes(anunciante, productIndex);

            alert('Avaliação enviada com sucesso!');

        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            alert(error.message);
        }
    });
});

// Highlight stars based on rating
function highlightStars(value) {
    const stars = document.querySelectorAll('#rating i');
    stars.forEach(s => {
        s.classList.toggle('active', s.getAttribute('data-value') <= value);
    });
}

// Select stars based on rating
function selectStars(value) {
    const stars = document.querySelectorAll('#rating i');
    stars.forEach(s => {
        s.classList.toggle('active', s.getAttribute('data-value') <= value);
    });
}

// Clear selected stars
function clearStars() {
    const stars = document.querySelectorAll('#rating i');
    stars.forEach(s => {
        s.classList.remove('active');
    });
}

async function getProductInformation(productIndex) {
    const getProductInformationUrl = 'http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/products/' + productIndex;
    
    try {
        const response = await fetch(getProductInformationUrl, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            throw new Error('Product not found');
        }

        const product = await response.json();  // Directly parse the response as JSON
        console.log('Produto obtido:', product);

        // Format product data (as you already have)
        const dataCompleta = new Date(product.date);
        const dia = dataCompleta.getDate().toString().padStart(2, '0');
        const mes = (dataCompleta.getMonth() + 1).toString().padStart(2, '0');
        const ano = dataCompleta.getFullYear();
        const horas = dataCompleta.getHours().toString().padStart(2, '0');
        const minutos = dataCompleta.getMinutes().toString().padStart(2, '0');
        const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

        // Update product information on the page
        document.getElementById('product-name').innerHTML = `<strong>Nome do Produto:</strong> ${product.name}`;
        document.getElementById('product-description').innerHTML = `<strong>Descrição:</strong> ${product.description}`;
        document.getElementById('product-price').innerHTML = `<strong>Preço:</strong> €${product.price}`;
        document.getElementById('product-category').innerHTML = `<strong>Categoria:</strong> ${product.category}`;
        document.getElementById('product-seller').innerHTML = `<strong>Nome do Anunciante:</strong> ${product.seller}`;
        document.getElementById('product-location').innerHTML = `<strong>Localização:</strong> ${product.location}`;
        document.getElementById('product-image').setAttribute('src', product.urlImage);
        document.getElementById('product-date').innerHTML = `<strong>Data de Publicação:</strong> ${dataFormatada}`;

        console.log("Product details fetched:", product);
        return product;
        

    } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
        alert('Erro ao carregar produto: ' + error.message);
        return null;
    }
}


// Update rating counts for the product
// Update rating counts for the product (or seller)
async function updateRatings(productIndex, anunciante) {
    try {
        const response = await fetch(
            `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/all/evaluations/${anunciante}`
        );
        const evaluations = await response.json();

        // Reset rating counts
        ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        // Filter evaluations for the current seller (anunciante)
        const productEvaluations = evaluations.filter(ev => {
            console.log("Evaluation seller:", ev.seller);  // Debug log to check the seller field
            console.log("Expected seller:", anunciante);  // Log the expected seller

            return ev.seller === anunciante;
        });

        // Log the filtered evaluations to check if the filtering is correct
        console.log("Filtered product evaluations:", productEvaluations);

        // Make sure productEvaluations is not empty before processing
        if (productEvaluations.length === 0) {
            console.log("No evaluations found for this seller.");
            return;  // Exit if no evaluations were found
        }

        // Update ratingCounts based on the evaluations
        productEvaluations.forEach(ev => {
            if (ev.starNumber >= 1 && ev.starNumber <= 5) {
                ratingCounts[ev.starNumber]++;  // Increment the count for the corresponding star rating
            }
        });

        // Log the updated counts
        console.log("Updated rating counts:", ratingCounts);

        // After updating the counts, update the UI
        displayRatingSummary();
        displayRatingStats();

    } catch (error) {
        console.error('Error updating ratings:', error);
    }
}

// Display evaluations for the product
async function displayAvaliacoes(anunciante, productIndex) {
    const container = document.getElementById('avaliacoes-container');
    container.innerHTML = 'Carregando...';  // Loading message

    try {
        const response = await fetch(
            `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/all/evaluations/${anunciante}`
        );
        const evaluations = await response.json();
        console.log("Fetched evaluations:", evaluations);  // Debugging log to check fetched data

        // Clear previous content
        container.innerHTML = '';

        // If the product evaluations don't have a productId, we can use seller and userName to filter
        const productEvaluations = evaluations.filter(ev => ev.seller === anunciante);
        console.log("Filtered evaluations for the product:", productEvaluations);  // Debug log

        if (productEvaluations.length === 0) {
            container.innerHTML = "<p>Sem avaliações para este produto.</p>";
            return;
        }

        // Display each evaluation
        productEvaluations.forEach(avaliacao => {
            const avaliacaoElement = document.createElement('div');
            avaliacaoElement.classList.add('avaliacao-item');

            // Format date
            const dataFormatada = new Date(avaliacao.date).toLocaleString();

            // Create stars HTML
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += i <= avaliacao.starNumber ? 
                    '<i class="fas fa-star" style="color: #ffd700;"></i>' : 
                    '<i class="far fa-star" style="color: #ccc;"></i>';
            }

            // Check if current user is the review author
            const loggedUser = sessionStorage.getItem('username')?.trim().toLowerCase();
            const reviewAuthor = avaliacao.userName?.trim().toLowerCase();
            const showActions = loggedUser === reviewAuthor;

            avaliacaoElement.innerHTML = `
                <div class="review-header">
                    <strong>${avaliacao.userName}</strong>
                    <span>${dataFormatada}</span>
                </div>
                <div class="stars">${starsHtml}</div>
                <p class="comment">${avaliacao.comment}</p>
                ${showActions ? `
                <div class="review-actions">
                    <button class="edit-review" data-id="${avaliacao.evaluationId}">Editar</button>
                    <button class="delete-review" data-id="${avaliacao.evaluationId}">Eliminar</button>
                </div>` : ''}
            `;

            container.appendChild(avaliacaoElement);
           // Add event listeners for edit and delete buttons
           const deleteButton = avaliacaoElement.querySelector('.delete-review');
           if (deleteButton) {
               deleteButton.addEventListener('click', async function () {
                   await deleteReview(avaliacao.evaluationId, avaliacao.seller);
               });
           }

           const editButton = avaliacaoElement.querySelector('.edit-review');
           if (editButton) {
               editButton.addEventListener('click', async function () {
                   await editReview(avaliacao.evaluationId, avaliacao.comment, avaliacao.starNumber, avaliacao.seller);
               });
           }
       });

    } catch (error) {
        console.error('Error loading evaluations:', error);
        container.innerHTML = "<p>Erro ao carregar avaliações.</p>";
    }
}
    

// Delete Review
async function deleteReview(evaluationId, seller) {
    const loggedUser = sessionStorage.getItem('username');  // Retrieve logged-in user

    if (!loggedUser) {
        alert("Faça login para apagar avaliações!");
        return;
    }

    const confirmDelete = confirm('Tem certeza que deseja eliminar esta avaliação?');
    if (confirmDelete) {
        let storedUsername = sessionStorage.getItem('username');
        let password = sessionStorage.getItem('password');

        const deleteEvaluationHeader = new Headers({
            'Content-Type': 'application/json',
            'password': password,
            'username': storedUsername
          });

        try {
            const response = await fetch(
                `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/evaluation/delete/${evaluationId}/${seller}/${loggedUser}`,
                {
                    method: 'DELETE',
                    headers: deleteEvaluationHeader,
                }
            );
            
            if (!response.ok) {
                throw new Error('Erro ao excluir a avaliação');
            }

            // Refresh evaluations after delete
            const productIndex = new URLSearchParams(window.location.search).get('index');
            await displayAvaliacoes(seller, productIndex);  // Refresh evaluations for the product
            await updateRatings(productIndex,seller);
            //displayRatingSummary();
            //displayRatingStats();
            alert("Avaliação excluída com sucesso!");
        } catch (error) {
            console.error('Error deleting evaluation:', error);
            alert(error.message);
        }
    }
}



// Edit Review
async function editReview(evaluationId, currentComment, currentStarNumber, seller) {
    const loggedUser = sessionStorage.getItem('username');  // Retrieve logged-in user
    
    // Check if logged user is available
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

        let storedUsername = sessionStorage.getItem('username');
        let password = sessionStorage.getItem('password');
        const editReviewHeader = new Headers({
            'Content-Type': 'application/json',
            'password': password,
            'username': storedUsername
          });

        try {
            const response = await fetch(
                `http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/evaluation/edit/${evaluationId}/${seller}/${loggedUser}`,
                {
                    method: 'POST',
                    headers: editReviewHeader,
                    body: JSON.stringify(updatedEvaluation)
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao atualizar avaliação');
            }

            // Refresh evaluations after edit
            const productIndex = new URLSearchParams(window.location.search).get('index');
            await displayAvaliacoes(seller, productIndex);  // Refresh evaluations for the product
            await updateRatings(productIndex,seller);
            //displayRatingSummary();
            //displayRatingStats();
            alert("Avaliação atualizada com sucesso!");
        } catch (error) {
            console.error('Error updating evaluation:', error);
            alert(error.message);
        }
    } else {
        alert("Nota inválida. Insira um número entre 1 e 5.");
    }
}




function displayRatingSummary() {
    const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
    const weightedSum = Object.entries(ratingCounts).reduce((sum, [rating, count]) => sum + rating * count, 0);
    const averageRating = totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : 0;

    console.log("Total Ratings:", totalRatings);  // Debugging log to ensure totalRatings is calculated correctly
    console.log("Average Rating:", averageRating);  // Debugging log to check average

    const averageRatingElement = document.getElementById('average-rating');
    const totalRatingsElement = document.getElementById('total-ratings');

    // Create stars HTML for average rating
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(averageRating)) {
            starsHtml += '<i class="fas fa-star" style="color: #ffd700;"></i>';
        } else if (i - 0.5 <= averageRating) {
            starsHtml += '<i class="fas fa-star-half-alt" style="color: #ffd700;"></i>';
        } else {
            starsHtml += '<i class="far fa-star" style="color: #ccc;"></i>';
        }
    }

    averageRatingElement.innerHTML = `
        <div class="stars-container">${starsHtml}</div>
    `;
    totalRatingsElement.textContent = `${totalRatings} avaliações`;
}


// Display rating statistics
function displayRatingStats() {
    const statsContainer = document.getElementById('rating-stats');
    const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0);

    let statsHTML = '';
    for (let i = 5; i >= 1; i--) {
        const amount = totalRatings > 0 ? (ratingCounts[i] / totalRatings) * 100 : 0;
        const stars = '<i class="fas fa-star"></i>'.repeat(i) + '<i class="far fa-star"></i>'.repeat(5 - i);
        statsHTML += `
            <div class="rating-bar">
                <span>${stars}</span>
                <div class="bar-container">
                    <div class="bar" style="width: ${amount}%"></div>
                </div>
                <span>${ratingCounts[i]}</span>
            </div>
        `;
    }

    statsContainer.innerHTML = statsHTML;
}

test('Display rating statistics', () => {
    const statsContainer = document.getElementById('rating-stats');
  
    // Simulate rating counts and display stats
    ratingCounts = { 1: 0, 2: 2, 3: 3, 4: 5, 5: 10 };
    displayRatingStats();
  
    // Check if the stats container contains the correct elements
    expect(statsContainer.innerHTML).toContain('<div class="rating-bar">'); // Check that the bars are being rendered
    expect(statsContainer.innerHTML).toContain('<span>10</span>'); // Check if the count 10 appears in the stats
  });

  const ratingWords = {
    1: 'Péssimo',
    2: 'Mau',
    3: 'OK',
    4: 'Bom',
    5: 'Excelente'
  };

module.exports = { displayRatingStats, ratingWords};






