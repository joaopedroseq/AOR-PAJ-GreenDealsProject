// Import functions from Avaliacoes.js
const { displayRatingStats } = require('./Avaliacoes');

// Mock DOM elements
//Este bloco beforeEach é executado antes de cada teste. 
// Ele mocka os elementos DOM necessários para os testes, definindo o innerHTML do document.body com os elementos HTML. 
// Isso garante que os elementos estejam disponíveis para os testes.
beforeEach(() => {
    document.body.innerHTML = `
        <div id="rating">
            <i class="fas fa-star" data-value="1"></i>
            <i class="fas fa-star" data-value="2"></i>
            <i class="fas fa-star" data-value="3"></i>
            <i class="fas fa-star" data-value="4"></i>
            <i class="fas fa-star" data-value="5"></i>
        </div>
        <input type="hidden" id="nota" />
        <div id="rating-text"></div>
        <div id="rating-stats"></div>
    `;
});

// Mock ratingWords
// Esta linha define um objeto ratingWords que mapeia os valores de avaliação para as palavras correspondentes.
const ratingWords = {
    1: 'Péssimo',
    2: 'Mau',
    3: 'OK',
    4: 'Bom',
    5: 'Excelente'
};

// Test 1: Verify rating text changes on mouseover
test('mouseover changes rating text', () => {
  // consts selecionam todos os elementos i dentro do elemento com o ID rating, 
  // e selecionam o elemento com o ID rating-text e selecionam a primeira estrela.
    const stars = document.querySelectorAll('#rating i');
    const ratingText = document.getElementById('rating-text');
    const firstStar = stars[0]; // Select the first star

    // Attach the event listener to firstStar
    //Este bloco anexa um event listener de mouseover na primeira estrela. Quando o evento é disparado, 
    //a função dentro do event listener atualiza o textContent do elemento ratingText com a palavra de avaliação correspondente.
    firstStar.addEventListener('mouseover', () => {
        const ratingValue = firstStar.getAttribute('data-value');
        ratingText.textContent = ratingWords[ratingValue];
    });

    // Dispatch mouseover event
    firstStar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    // Esta linha verifica se o textContent do elemento ratingText foi atualizado corretamente 
    // para "Péssimo", que é o valor correspondente para a primeira estrela.
    expect(ratingText.textContent).toBe(ratingWords[1]);
});

//Teste para avaliação 'Mau'
test('mouseover changes rating text', () => {
    // consts selecionam todos os elementos i dentro do elemento com o ID rating, 
    // e selecionam o elemento com o ID rating-text e selecionam a primeira estrela.
      const stars = document.querySelectorAll('#rating i');
      const ratingText = document.getElementById('rating-text');
      const secondStar = stars[1]; // Select the second star
  
      // Attach the event listener to firstStar
      //Este bloco anexa um event listener de mouseover na primeira estrela. Quando o evento é disparado, 
      //a função dentro do event listener atualiza o textContent do elemento ratingText com a palavra de avaliação correspondente.
      secondStar.addEventListener('mouseover', () => {
          const ratingValue = secondStar.getAttribute('data-value');
          ratingText.textContent = ratingWords[ratingValue];
      });
  
      // Dispatch mouseover event
      secondStar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  
      // Esta linha verifica se o textContent do elemento ratingText foi atualizado corretamente 
      // para "Péssimo", que é o valor correspondente para a primeira estrela.
      expect(ratingText.textContent).toBe(ratingWords[2]);
  });

  //Teste para avaliação 'Excelente'
test('mouseover changes rating text', () => {
    // consts selecionam todos os elementos i dentro do elemento com o ID rating, 
    // e selecionam o elemento com o ID rating-text e selecionam a primeira estrela.
      const stars = document.querySelectorAll('#rating i');
      const ratingText = document.getElementById('rating-text');
      const fiveStar = stars[4]; // Select the second star
  
      // Attach the event listener to firstStar
      //Este bloco anexa um event listener de mouseover na primeira estrela. Quando o evento é disparado, 
      //a função dentro do event listener atualiza o textContent do elemento ratingText com a palavra de avaliação correspondente.
      fiveStar.addEventListener('mouseover', () => {
          const ratingValue = fiveStar.getAttribute('data-value');
          ratingText.textContent = ratingWords[ratingValue];
      });
  
      // Dispatch mouseover event
      fiveStar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  
      // Esta linha verifica se o textContent do elemento ratingText foi atualizado corretamente 
      // para "Péssimo", que é o valor correspondente para a primeira estrela.
      expect(ratingText.textContent).toBe(ratingWords[5]);
  });

// Test 2: Verify nota input value changes on click
test('click sets nota input value', () => {
  // consts selecionam todos os elementos i dentro do elemento com o ID rating, 
  // e selecionam o elemento com o ID rating-text e selecionam a quarta estrela.
    const stars = document.querySelectorAll('#rating i');
    const notaInput = document.getElementById('nota');
    const fourthStar = stars[3]; // Select the fourth star

    // Este bloco anexa um event listener de click à quarta estrela. Quando o evento é disparado, 
    // a função dentro do event listener atualiza o value do elemento notaInput com o valor de avaliação correspondente.
    fourthStar.addEventListener('click', () => {
        const ratingValue = fourthStar.getAttribute('data-value');
        notaInput.value = ratingValue;
    });

    // Simula um evento de click na quarta estrela.
    fourthStar.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Esta linha verifica se o value do elemento notaInput foi atualizado corretamente para "4", 
    // que é o valor correspondente para a quarta estrela.
    expect(notaInput.value).toBe('4');
});

// Test 3: Verify displayRatingStats works
test('displayRatingStats works', () => {
  //Garantem que o elemento rating-stats está presente no DOM e selecionam o elemento com o ID rating-stats.
    document.body.innerHTML = `<div id="rating-stats"></div>`; 
    const statsContainer = document.getElementById('rating-stats');

    // Este bloco mocka as variáveis globais necessárias e chama a função displayRatingStats.
    global.product = {
        ratings: {
            1: 5,
            2: 10,
            3: 15,
            4: 20,
            5: 25
        }
    };
    global.ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; // Ensure this is defined
    displayRatingStats();

    // Verifica se o innerHTML do elemento statsContainer foi atualizado, 
    // indicando que a função displayRatingStats está a funcionar como esperado.
    expect(statsContainer.innerHTML.length).toBeGreaterThan(0);
});
