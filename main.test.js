const scriptHeader = require("./scriptHeader");

global.w3 = {
  includeHTML: jest.fn(callback => callback())
};

// Mock document and sessionStorage
global.document = {
  getElementById: jest.fn(() => ({
    addEventListener: jest.fn(),
    value: 'test'
  }))
};
global.sessionStorage = {
  setItem: jest.fn(),
  getItem: jest.fn()
};

test("isNumericTest", () => {
  expect(scriptHeader.checkIfNumeric("12")).toBe(true);
});

test("login", () => {
  scriptHeader.initializeLoginForm();
  scriptHeader.addDetailsUserInSessionStorage("hs1", "11.");
  expect(sessionStorage.setItem).toHaveBeenCalledWith("username", "hs1");
});
