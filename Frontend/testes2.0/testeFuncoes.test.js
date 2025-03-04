const {
  fetchRequest,
  openRegistry,
  inicializarBotoesAsideUser,
  showSection,
} = require("./funcoesTestadas");

describe("Testes de fetchRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks das funções antes de cada teste
  });

  test("fetchRequest() lança um erro devido a um pedido mal-sucedido", async () => {
    // Mock da função fetch para simular uma resposta mal-sucedida hard-coded
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn(),
      headers: {
        get: jest.fn(),
      },
    });

    // Chamada da função e comparação do resultado esperado com o erro
    await expect(fetchRequest("/endpoint")).rejects.toThrow(
      "HTTP error! status: 500"
    );
  });

  test("fetchRequest() devolve um produto no corpo da resposta após um pedido GET", async () => {
    // Mock do produto que será recebido na resposta
    const mockProduct = { id: 1, name: "Product 1", price: 100 };

    // Mock da função fetch para simular uma resposta bem-sucedida
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockProduct),
      headers: {
        get: jest.fn().mockReturnValue("application/json"),
      },
    });

    const endpoint = "/products/all";
    const response = await fetchRequest(endpoint, "GET"); // Chama a função

    // Verifica se a resposta corresponde ao produto definido acima
    expect(response).toEqual(mockProduct);
  });

  test("fetchRequest() realiza um pedido POST e devolve uma mensagem de sucesso", async () => {
    // Resposta simulada de sucesso
    const successMessage = { message: "Produto adicionado com sucesso" };

    // Mock da função fetch para simular um pedido POST bem-sucedido
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: jest.fn().mockResolvedValue(successMessage),
      headers: {
        get: jest.fn().mockReturnValue("application/json"),
      },
    });

    const product = { id: 1, name: "Product A", price: 100 };
    const response = await fetchRequest("/users/addProduct", "POST", product); // Chama a função

    // Verifica se a resposta corresponde à mensagem definida acima
    expect(response).toEqual(successMessage);
  });
});

describe("openRegistry", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks to prevent interference between tests

    // Mock document.getElementById
    document.getElementById = jest.fn();
  });

  test("sets modalRegister's display to 'flex'", () => {
    // Mock the modal element
    const mockModal = { style: { display: "none" } }; // Initial style.display set to "none"
    document.getElementById.mockReturnValue(mockModal);

    // Call the function
    openRegistry();

    // Verify that getElementById was called with "modal-register"
    expect(document.getElementById).toHaveBeenCalledWith("modal-register");

    // Verify that the modal's display property was updated
    expect(mockModal.style.display).toBe("flex");
  });
});

describe("inicializarBotoesAsideUser", () => {
  let mockElements;

  beforeEach(() => {
    // Create a more complete mock of DOM elements
    mockElements = {
      myProductsBtn: { addEventListener: jest.fn() },
      myReviewsBtn: { addEventListener: jest.fn() },
      myInfoBtn: { addEventListener: jest.fn() },
      produtos: { style: { display: "none" } },
      avaliacoes: { style: { display: "none" } },
      informacoes: { style: { display: "none" } },
    };

    document.getElementById = jest.fn((id) => mockElements[id] || null);
  });

  afterEach(() => {
    jest.clearAllMocks();
    Object.values(mockElements).forEach((element) => {
      if (element.addEventListener) {
        element.addEventListener.mockClear();
      }
    });
  });

  test("initializes event listeners for 'myProductsBtn'", async () => {
    inicializarBotoesAsideUser();

    const myProductsBtn = document.getElementById("myProductsBtn");
    const clickCallback = myProductsBtn.addEventListener.mock.calls[0][1];

    clickCallback();

    expect(mockElements.produtos.style.display).toBe("block");
    expect(mockElements.avaliacoes.style.display).toBe("none");
    expect(mockElements.informacoes.style.display).toBe("none");
  });

  test("initializes event listeners for 'myReviewsBtn'", () => {
    inicializarBotoesAsideUser();

    // Verify that addEventListener is called for 'myReviewsBtn'
    const myReviewsBtn = document.getElementById("myReviewsBtn");
    expect(myReviewsBtn.addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
  });

  test("initializes event listeners for 'myInfoBtn'", () => {
    inicializarBotoesAsideUser();

    // Verify that addEventListener is called for 'myInfoBtn'
    const myInfoBtn = document.getElementById("myInfoBtn");
    expect(myInfoBtn.addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
  });

  test("initializes event listeners for all buttons", () => {
    inicializarBotoesAsideUser();

    // Verify all buttons have event listeners
    ["myProductsBtn", "myReviewsBtn", "myInfoBtn"].forEach((btnId) => {
      const btn = document.getElementById(btnId);
      expect(btn.addEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
    });
  });

  test("myProductsBtn shows products section and hides others", async () => {
    inicializarBotoesAsideUser();

    const myProductsBtn = document.getElementById("myProductsBtn");
    expect(myProductsBtn.addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );

    // Get and execute the click handler
    const clickHandler = myProductsBtn.addEventListener.mock.calls[0][1];
    await clickHandler();

    // Verify section visibility
    expect(mockElements.produtos.style.display).toBe("block");
    expect(mockElements.avaliacoes.style.display).toBe("none");
    expect(mockElements.informacoes.style.display).toBe("none");
  });
});
