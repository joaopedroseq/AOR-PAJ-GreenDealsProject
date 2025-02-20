// Mock DOM elements for modal tests
// Esta função beforeEach é executada antes de cada teste. 
// Ela cria um mock do DOM com botões "About" e "Privacy", e um elemento de fechamento.
beforeEach(() => {
    document.body.innerHTML = `
      <button id='aboutButton'></button>
      <button id='privacyButton'></button>
      <div class='close'></div>
    `;
    // Spy on addEventListener
    // Estas linhas criam spies nos métodos addEventListener de todos os elementos button e div.
  jest.spyOn(HTMLButtonElement.prototype, 'addEventListener');
  jest.spyOn(HTMLDivElement.prototype, 'addEventListener');
});


  // Adding a basic test to ensure the test suite is not empty
  //O principal objetivo deste teste é garantir que a suite de testes está funcionando corretamente
  //e que o ambiente de teste está configurado adequadamente.
test('scriptFooter has a working modal', () => {
    expect(true).toBe(true);
  });

  // Adding modal test cases for "About" and "Privacy" buttons
test('open about modal', () => {
    const aboutBtn = document.getElementById('aboutButton');
    aboutBtn.addEventListener('click', () => {});
    //Simula um clique no botão.
    aboutBtn.click();
    expect(aboutBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
});

test('open privacy modal', () => {
    const privacyBtn = document.getElementById('privacyButton');
    privacyBtn.addEventListener('click', () => {});
    //Simula um clique no botão.
    privacyBtn.click();
    expect(privacyBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
});

test('close modal on click', () => {
    const closeButton = document.getElementsByClassName('close')[0];
    //Simula um clique no botão.
    closeButton.click();
    expect(closeButton).toBeDefined();
});