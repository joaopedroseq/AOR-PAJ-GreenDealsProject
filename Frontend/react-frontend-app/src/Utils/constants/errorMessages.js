const errorMessages = {
    // Common errors
    network_error: "No response from server, please check your connection.",
    unexpected_error: "An unexpected error occurred. Please try again.",
  
    // Product-related errors
    invalid_data: "Dados inválidos.",
    invalid_token: "Token inválido, por favor tente novamente.",
    permission_denied: "Sem permissão para o fazer, por favor tente novamente.",
    non_existant_category: "Categoria inexistente, por favor tente novamente.",
    failed: "A operação falhou, por favor tente novamente.",
    non_existant_product: "Produto inexistente, por favor tente novamente.",
  
    // User-related errors
    same_username: "O nome de usuário já existe.",
    error: "Erro nos dados fornecidos.",
  
    // Generic operation errors
    get_user_failed: "Falha ao obter informações do usuário.",
    register_failed: "Falha ao registrar o usuário."
  };
  
  export default errorMessages;
  