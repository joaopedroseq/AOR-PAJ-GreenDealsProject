let ratingCounts;
document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('#rating i');
    const notaInput = document.getElementById('nota');
    const ratingText = document.getElementById('rating-text');
    
    //Get Detalhes do produto desde do URL
    const productIndex = new URLSearchParams(window.location.search).get('index');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[productIndex];
    
    if (!product) {
        console.error("Product not found!");
        return;
    }

    const anunciante = product.anunciante;

    //Descrições dos Ratings
    const ratingWords = {
        1: 'Péssimo',
        2: 'Mau',
        3: 'OK',
        4: 'Bom',
        5: 'Excelente'
    };

    //Inicializa os Ratings
    updateRatings();

    //Adiciona event Listeners para cada hover e click das estrelas
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const ratingValue = this.getAttribute('data-value');
            highlightStars(ratingValue);
            ratingText.textContent = ratingWords[ratingValue];
        });

        star.addEventListener('click', function() {
            const ratingValue = this.getAttribute('data-value');
            notaInput.value = ratingValue;
            selectStars(ratingValue);
            ratingText.textContent = ratingWords[ratingValue];
        });
    });

    //Da reset das Estrelas quando o rato sai da área de Rating
    document.getElementById('rating').addEventListener('mouseleave', function() {
        const selectedValue = notaInput.value;
        if (selectedValue) {
            selectStars(selectedValue);
            ratingText.textContent = ratingWords[selectedValue];
        } else {
            clearStars();
            ratingText.textContent = '';
        }
    });

    //Highlight das Estrelas dependendo do rating
    function highlightStars(value) {
        stars.forEach(s => {
            s.classList.toggle('active', s.getAttribute('data-value') <= value);
        });
    }
    
    //Seleciona as Estrelas dependendo do rating
    function selectStars(value) {
        stars.forEach(s => {
            s.classList.toggle('active', s.getAttribute('data-value') <= value);
        });
    }
    
    //Clear das Estrelas Selecionadas
    function clearStars() {
        stars.forEach(s => {
            s.classList.remove('active');
        });
    }

    //Submisão do Form para as Reviews
    document.getElementById('formAvaliacao').addEventListener('submit', function(event) {
        if((sessionStorage.getItem('logged') === 'false')){
            alert("Tem que estar Logged in para criar uma avaliacao!")
        }else{
        event.preventDefault();
        //Procura  o Produto atual do Anunciante
        const productIndex = new URLSearchParams(window.location.search).get('index');
        
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products[productIndex];
        const anunciante = product.anunciante;//Get nome do anunciante

        //Get informação da Review
        const nota = document.getElementById('nota').value;
        const comentario = document.getElementById('comentario').value;
        const usuario = sessionStorage.getItem('username') || 'Anónimo';
        const id = productIndex;
        const data = new Date().toISOString(); // Adiciona a data atual

        //Cria um objeto Review
        const avaliacao = { nota, comentario, usuario, id, data, anunciante }; // Inclui a data no objeto de avaliação
        let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
        avaliacoes.push(avaliacao);
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));

        // Atualiza as contagens de avaliações
        ratingCounts[nota]++;
        localStorage.setItem('ratingCounts', JSON.stringify(ratingCounts));

        alert('Avaliação enviada com sucesso!');
        displayRatingSummary();
        displayRatingStats();
        displayAvaliacoes(anunciante);
        this.reset();
        clearStars();
        notaInput.value = '';
        ratingText.textContent = '';
        }
    });

    //Mostra as Reviews do Anunciante do Produto
    function displayAvaliacoes(anunciante) {
        let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
    
        // Filter evaluations based on the anunciante (seller) of the product
        let anuncianteAvaliacoes = avaliacoes.filter(av => av.anunciante === anunciante);
        const container = document.getElementById('avaliacoes-container');
        container.innerHTML = ""; // Clear previous reviews
    
        if (anuncianteAvaliacoes.length === 0) {
            container.innerHTML = "<p>Sem avaliações para este anunciante.</p>";
        } else {
            anuncianteAvaliacoes.forEach(avaliacao => {
                const avaliacaoElement = document.createElement('div');
                avaliacaoElement.classList.add('avaliacao-item');
                
                // Create the stars based on the rating (nota)
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= avaliacao.nota) {
                        starsHtml += '<i class="fas fa-star" style="color: #ffd700;"></i>'; // Gold stars
                    } else {
                        starsHtml += '<i class="far fa-star" style="color: #ccc;"></i>'; // Gray stars
                    }
                }
    
                // Format the date
                const dataFormatada = new Date(avaliacao.data).toLocaleString();
    
                // Create the HTML for the review
                avaliacaoElement.innerHTML = `
                    <p><strong>${avaliacao.usuario}:</strong> ${starsHtml}</p>
                    <p><strong>Comentário:</strong> ${avaliacao.comentario}</p>
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                `;
                container.appendChild(avaliacaoElement);
            });
        }
    }

    //Mostra as Estatisticas dos Ratings
    function displayRatingStats() {
        const statsContainer = document.getElementById('rating-stats');
        const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
        
        let statsHTML = '';
        
        for (let i = 5; i >= 1; i--) {
            const amount = totalRatings > 0 ? (ratingCounts[i]) : 0;
            const stars = '<i class="fas fa-star"></i>'.repeat(i) + '<i class="far fa-star"></i>'.repeat(5-i);
            statsHTML += `
                <div class="rating-bar">
                    <span>${stars}</span>
                    <div class="bar-container">
                        <div class="bar" style="width: ${amount}%"></div>
                    </div>
                    <span>${amount}</span>
                </div>
            `;
        }
        
        statsContainer.innerHTML = statsHTML;
    }

    //Mostra a Média dos Ratings e o Total das Reviews
    function displayRatingSummary() {
        const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
        const weightedSum = Object.entries(ratingCounts).reduce((sum, [rating, count]) => sum + rating * count, 0);
        const averageRating = totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : 0;
    
        const averageRatingElement = document.getElementById('average-rating');
        const totalRatingsElement = document.getElementById('total-ratings');
    
        // Criar as estrelas para a média
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(averageRating)) {
                starsHtml += '<i class="fas fa-star" style="color: #ffd700;"></i>'; // Estrela cheia
            } else if (i - 0.5 <= averageRating) {
                starsHtml += '<i class="fas fa-star-half-alt" style="color: #ffd700;"></i>'; // Meia estrela
            } else {
                starsHtml += '<i class="far fa-star" style="color: #ccc;"></i>'; // Estrela vazia
            }
        }
    
        averageRatingElement.innerHTML = `
            <div class="stars-container">${starsHtml}</div>
        `;
        totalRatingsElement.textContent = `${totalRatings} avaliações`;
    }
    
    // Exibir avaliações e estatísticas ao carregar a página
    displayRatingSummary();
    displayRatingStats();
    displayAvaliacoes(anunciante);
});

//Atualiza a Contagem de Ratings para o Anunciante
function updateRatings(){
        const productIndex = new URLSearchParams(window.location.search).get('index');
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products[productIndex];
        //Get nome do anunciante
        const anunciante = product.anunciante;
    let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];

    avaliacoes = avaliacoes.filter(av => av.anunciante === anunciante);
    ratingCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };

    if(avaliacoes.length === 0){
        console.log("não há avaliações")
    }else{
        avaliacoes.forEach(p => {
            ratingCounts[p.nota]++;
        })
    }
}









