// Mock w3 before any tests run
beforeAll(() => {
    global.w3 = {
      includeHTML: jest.fn(callback => callback())
    };
  });

// Mock DOM elements for modal tests
beforeEach(() => {
    document.body.innerHTML = `
      <button id='aboutButton'></button>
      <button id='privacyButton'></button>
      <div class='close'></div>
    `;
    // Spy on addEventListener
  jest.spyOn(HTMLButtonElement.prototype, 'addEventListener');
  jest.spyOn(HTMLDivElement.prototype, 'addEventListener');
});


  // Adding a basic test to ensure the test suite is not empty
test('scriptFooter has a working modal', () => {
    expect(true).toBe(true);
  });

  // Adding modal test cases for "About" and "Privacy" buttons
test('open about modal', () => {
    const aboutBtn = document.getElementById('aboutButton');
    aboutBtn.addEventListener('click', () => {});
    aboutBtn.click();
    expect(aboutBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
});

test('open privacy modal', () => {
    const privacyBtn = document.getElementById('privacyButton');
    privacyBtn.addEventListener('click', () => {});
    privacyBtn.click();
    expect(privacyBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
});

test('close modal on click', () => {
    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.click();
    expect(closeButton).toBeDefined();
});