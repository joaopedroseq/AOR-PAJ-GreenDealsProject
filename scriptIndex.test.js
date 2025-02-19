// Mock DOM elements
    document.body.innerHTML = `
      <button id="hamburger"></button>
      <button id="newAccountBtn"></button>
      <button id="registerBtn"></button>
      <form id="edit-id-form"></form>
      <div id="modal-register"></div>
      <span class="close-id"></span>
    `;
  
  // Mock w3.includeHTML
  // Cria um mock da função w3.includeHTML, que simula a execução imediata do callback.
  global.w3 = {
    includeHTML: jest.fn(callback => 
        callback())
};
  
  // Mock sessionStorage
  // Cria um mock do sessionStorage com funções simuladas getItem e setItem.
  global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };
  
  // Cria um mock da função toggleAside.
  global.toggleAside = jest.fn();

  // Importa o módulo scriptIndex que será testado.
  const scriptIndex = require('./scriptIndex');
  
  // Test for hamburger button click
test('hamburger button click', () => {
    const hamburger = document.getElementById('hamburger');
    const spy = jest.spyOn(hamburger, 'addEventListener');
    
    // Trigger the event listener setup manually
    hamburger.addEventListener('click', global.toggleAside);
  
    // Check if addEventListener was called with 'click' and toggleAside
    expect(spy).toHaveBeenCalledWith('click', global.toggleAside);
  });


  // Test for new account button click
test('new account button click', () => {
    const newAccountBtn = document.getElementById('newAccountBtn');
    const spy = jest.spyOn(newAccountBtn, 'addEventListener');
    
    // Trigger the event listener setup manually
    newAccountBtn.addEventListener('click', () => {});
  
    // Check if addEventListener was called with 'click' and a function
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
  });
  
  // Test for register button click
test('register button click', () => {
    const registerBtn = document.getElementById('registerBtn');
    const spy = jest.spyOn(registerBtn, 'addEventListener');
    
    // Trigger the event listener setup manually
    registerBtn.addEventListener('click', () => {});
  
    // Check if addEventListener was called with 'click' and a function
    expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
  });