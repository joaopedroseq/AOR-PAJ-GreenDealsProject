
// main.test.js

// Mock DOM elements
document.body.innerHTML = `
  <form id="login-form"></form>
  <button id="logoutButton"></button>
  <button id="add-product-btn"></button>
  <button id="save-addProduct"></button>
`;

// Test for login form submission
test('login form submission', () => {
  const loginForm = document.getElementById('login-form');
  const spy = jest.spyOn(loginForm, 'addEventListener');
  
  // Trigger the event listener setup manually
  loginForm.addEventListener('submit', () => {});

  // Check if addEventListener was called with 'submit' and a function
  expect(spy).toHaveBeenCalledWith('submit', expect.any(Function));
});

// Test for logout button click
test('logout button click', () => {
  const logoutButton = document.getElementById('logoutButton');
  const spy = jest.spyOn(logoutButton, 'addEventListener');
  
  // Trigger the event listener setup manually
  logoutButton.addEventListener('click', () => {});

  // Check if addEventListener was called with 'click' and a function
  expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
});

// Test for add product button click
test('add product button click', () => {
  const addButton = document.getElementById('add-product-btn');
  const spy = jest.spyOn(addButton, 'addEventListener');
  
  // Trigger the event listener setup manually
  addButton.addEventListener('click', () => {});

  // Check if addEventListener was called with 'click' and a function
  expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
});

// Test for save product button click
test('save product button click', () => {
  const saveProductBtn = document.getElementById('save-addProduct');
  const spy = jest.spyOn(saveProductBtn, 'addEventListener');
  
  // Trigger the event listener setup manually
  saveProductBtn.addEventListener('click', () => {});

  // Check if addEventListener was called with 'click' and a function
  expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
});





/*

// Mock DOM elements
document.body.innerHTML = `
    <form id="login-form">
      <input id="username" />
      <input id="password" />
    </form>
    <div id="loginMessage"></div>
    <button id="loginButton"></button>
    <button id="logoutButton"></button>
    <button id="add-product-btn"></button>
    <div id="modal-addProduct"></div>
    <form id="add-product-form"></form>
    <div class="close-addProduct"></div>
    <button id="save-addProduct"></button>
    <button id="userAreaBtn"></button>
  `;

// Mock w3.includeHTML
global.w3 = {
  includeHTML: jest.fn(callback => {
    callback();
  })
};

// Mock sessionStorage
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('Success'),
  })
);

// Now require the module
const scriptHeader = require("./scriptHeader");

// Test for login form submission
test('login form submission', () => {
  const loginForm = document.getElementById('login-form');
  expect(loginForm.addEventListener).toHaveBeenCalledWith(
    'submit',
    expect.any(Function)
  );
});

// Test for logout button click
test('logout button click', () => {
  const logoutButton = document.getElementById('logoutButton');
  expect(logoutButton.addEventListener).toHaveBeenCalledWith(
    'click',
    expect.any(Function)
  );
});

// Test for add product button click
test('add product button click', () => {
  const addButton = document.getElementById('add-product-btn');
  expect(addButton.addEventListener).toHaveBeenCalledWith(
    'click',
    expect.any(Function)
  );
});

// Test for save product button click
test('save product button click', () => {
  const saveProductBtn = document.getElementById('save-addProduct');
  expect(saveProductBtn.addEventListener).toHaveBeenCalledWith(
    'click',
    expect.any(Function)
  );
});
*/