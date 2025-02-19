// Import 'displayRatingStats' da function em Avaliacoes.js
const { displayRatingStats } = require('./Avaliacoes');  

// Reset the rating counts before each test
beforeEach(() => {
  global.ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };  // Ensuring fresh data for each test
});

// Mock DOM elements
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
`;

// Mock w3.includeHTML
global.w3 = {
    includeHTML: jest.fn(callback => callback()) //Mocking w3.includeHtml para testar sem inclusão do HTML verdadeiro
  };

// Mock sessionStorage
global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

// Mock ratingWords
const ratingWords = {
    1: 'Péssimo',
    2: 'Mau',
    3: 'OK',
    4: 'Bom',
    5: 'Excelente'
  };
  

// Mock data for testing
const mockProduct = {
  seller: 'Test Seller',
  ratings: { 1: 0, 2: 2, 3: 3, 4: 5, 5: 10 } //Mock contagem de Ratings para o produto
};

// Require the module AFTER mocking
const scriptAvaliacoes = require('./scriptAvaliacoes.js');


// Test hover over stars
test('hover over stars should highlight and display the correct rating text', () => {
    const stars = document.querySelectorAll('#rating i'); 
    const ratingText = document.getElementById('rating-text'); 
  
    stars.forEach(star => {
      // Simulate mouseover event
      const event = new MouseEvent('mouseover', { bubbles: true });
      star.dispatchEvent(event);
  
      // Check if the rating text is updated
      const ratingValue = star.getAttribute('data-value');
      const expectedText = ratingWords[ratingValue];
      expect(ratingText.textContent).toBe(expectedText);
    });
  });
  
  // Test clicking on a star
  test('clicking on a star should set the rating and display correct rating text', () => {
    const stars = document.querySelectorAll('#rating i');
    const notaInput = document.getElementById('nota');
    const ratingText = document.getElementById('rating-text');
  
    // Simulate click on the 4th star (rating = 4)
    const star = stars[3]; // 4th star (index 3)
    const event = new MouseEvent('click', { bubbles: true });
    star.dispatchEvent(event);
  
    // Ensure the hidden input is updated
    expect(notaInput.value).toBe('4');
  
    // Ensure the correct rating text is displayed
    expect(ratingText.textContent).toBe('Bom');
  });

  


test('Display rating statistics', () => {
  const statsContainer = document.getElementById('rating-stats');

  // Calculate the expected result
  displayRatingStats();

  // Ensure the statistics are rendered correctly
  expect(statsContainer.innerHTML).toContain('<div class="rating-bar">'); // Check that bars are being displayed
  expect(statsContainer.innerHTML).toContain('<span>10</span>'); // Ensure the correct count appears
});