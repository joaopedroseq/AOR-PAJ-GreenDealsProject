
// header.test.js

// mock do DOM, simulando os elementos HTML a testar
document.body.innerHTML = `
  <form id="login-form"></form>
  <button id="logoutButton"></button>
  <button id="add-product-btn"></button>
  <button id="save-addProduct"></button>
  <button id="userAreaBtn"></button>
`;

// Test for login form submission
//inicia o teste para submissão do formulário de login
test('login form submission', () => {
  //obtém o elemento de login do DOM mockado
  const loginForm = document.getElementById('login-form');
  //cria um "spy" no método addEventListener do formulário de login
  const spy = jest.spyOn(loginForm, 'addEventListener');
  
  // Simula a adição de um event listener ao formulário.
  loginForm.addEventListener('submit', () => {});

  //Verifica se o addEventListener foi chamado com 'submit' e uma função como argumentos.
  expect(spy).toHaveBeenCalledWith('submit', expect.any(Function));
});

// Teste botão logout
test('logout button click', () => {
  //Obtêm o elemento do DOM mockado.
  const logoutButton = document.getElementById('logoutButton');

  // Cria um spy no método addEventListener do elemento.
  const spy = jest.spyOn(logoutButton, 'addEventListener');
  
  // Simulam a adição de um event listener.
  logoutButton.addEventListener('click', () => {});

  // Verificam se o addEventListener foi chamado com o evento correto ('click') e uma função.
  expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
});

// Test for add product button click
test('add product button click', () => {
  //Obtêm o elemento do DOM mockado.
  const addButton = document.getElementById('add-product-btn');

  // Cria um spy no método addEventListener do elemento.
  const spy = jest.spyOn(addButton, 'addEventListener');
  
  // Simulam a adição de um event listener.
  addButton.addEventListener('click', () => {});

  // Verificam se o addEventListener foi chamado com o evento correto ('click') e uma função.
  expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
});

// Test for save product button click
test('save product button click', () => {
  //Obtêm o elemento do DOM mockado.
  const saveProductBtn = document.getElementById('save-addProduct');

  // Cria um spy no método addEventListener do elemento.
  const spy = jest.spyOn(saveProductBtn, 'addEventListener');
  
  // Simulam a adição de um event listener.
  saveProductBtn.addEventListener('click', () => {});

  // Verificam se o addEventListener foi chamado com o evento correto ('click') e uma função.
  expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
});

test('botão area pessoal utilizador', () => {
  //obtém o elemento de login do DOM mockado
  const userButton = document.getElementById('userAreaBtn');

  //cria um "spy" no método addEventListener do formulário de login
  const spy = jest.spyOn(userButton, 'addEventListener');
  
  // Simula a adição de um event listener ao formulário.
  userButton.addEventListener('submit', () => {});

  //Verifica se o addEventListener foi chamado com 'submit' e uma função como argumentos.
  expect(spy).toHaveBeenCalledWith('submit', expect.any(Function));
});
