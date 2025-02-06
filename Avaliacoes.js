let ratingCounts;
document.addEventListener('DOMContentLoaded', function () {
   
    const stars = document.querySelectorAll('#rating i');
    const notaInput = document.getElementById('nota');
    const ratingText = document.getElementById('rating-text');

    const ratingWords = {
        1: 'Péssimo',
        2: 'Mau',
        3: 'OK',
        4: 'Bom',
        5: 'Excelente'
    };

    updateRatings();

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

    function highlightStars(value) {
        stars.forEach(s => {
            s.classList.toggle('active', s.getAttribute('data-value') <= value);
        });
    }
    
    function selectStars(value) {
        stars.forEach(s => {
            s.classList.toggle('active', s.getAttribute('data-value') <= value);
        });
    }
    
    function clearStars() {
        stars.forEach(s => {
            s.classList.remove('active');
        });
    }

    document.getElementById('formAvaliacao').addEventListener('submit', function(event) {
        if((sessionStorage.getItem('logged') === 'false')){
            alert("Tem que estar Logged in para criar uma avaliacao!")
        }else{
        event.preventDefault();
        const nota = document.getElementById('nota').value;
        const comentario = document.getElementById('comentario').value;
        const usuario = sessionStorage.getItem('username') || 'Anónimo';
        const id = new URLSearchParams(window.location.search).get('id'); 
        const data = new Date().toISOString(); // Adiciona a data atual

        const avaliacao = { nota, comentario, usuario, id, data }; // Inclui a data no objeto de avaliação
        let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
        avaliacoes.push(avaliacao);
        localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));

        // Atualiza as contagens de avaliações
        ratingCounts[nota]++;
        localStorage.setItem('ratingCounts', JSON.stringify(ratingCounts));

        alert('Avaliação enviada com sucesso!');
        displayRatingSummary();
        displayRatingStats();
        displayAvaliacoes();
        this.reset();
        clearStars();
        notaInput.value = '';
        ratingText.textContent = '';
        }
    });

    function displayAvaliacoes() {
        const productId = new URLSearchParams(window.location.search).get('id'); 
        
        let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
        avaliacoes = avaliacoes.filter(p=> p.id === productId);
            
        
        const container = document.getElementById('avaliacoes-container');
        container.innerHTML = "";

        if (avaliacoes.length === 0) {
            container.innerHTML = "<p>Sem avaliações para este produto.</p>";
        } else {
            avaliacoes.forEach(avaliacao => {
                const avaliacaoElement = document.createElement('div');
                avaliacaoElement.classList.add('avaliacao-item');
                
                // Criar as estrelas
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= avaliacao.nota) {
                        starsHtml += '<i class="fas fa-star" style="color: #ffd700;"></i>'; // Estrelas douradas
                    } else {
                        starsHtml += '<i class="far fa-star" style="color: #ccc;"></i>'; // Estrelas cinza
                    }
                }

                // Formatar a data
                const dataFormatada = new Date(avaliacao.data).toLocaleString();

                avaliacaoElement.innerHTML = `
                    <p><strong>${avaliacao.usuario}:</strong> ${starsHtml}</p>
                    <p><strong>Comentário:</strong> ${avaliacao.comentario}</p>
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                `;
                container.appendChild(avaliacaoElement);
            });
        }
    }

    function displayRatingStats() {
        const statsContainer = document.getElementById('rating-stats');
        const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
        
        let statsHTML = '';
        
        for (let i = 5; i >= 1; i--) {
            const percentage = totalRatings > 0 ? (ratingCounts[i] / totalRatings * 100).toFixed(1) : 0;
            const stars = '<i class="fas fa-star"></i>'.repeat(i) + '<i class="far fa-star"></i>'.repeat(5-i);
            statsHTML += `
                <div class="rating-bar">
                    <span>${stars}</span>
                    <div class="bar-container">
                        <div class="bar" style="width: ${percentage}%"></div>
                    </div>
                    <span>${percentage}%</span>
                </div>
            `;
        }
        
        statsContainer.innerHTML = statsHTML;
    }

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
    displayAvaliacoes();
});

function updateRatings(){
    const productId = new URLSearchParams(window.location.search).get('id'); 
    let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];

    avaliacoes = avaliacoes.filter(p=> p.id === productId);
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








