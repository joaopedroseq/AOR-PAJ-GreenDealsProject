const errorMessages = {
    // Common errors
    network_error: "Sem resposta do servidor, verifique a sua conexão.",
    unexpected_error: "Erro inesperado. Por favor tente novamente.",
  
    // Product-related errors
    invalid_data: "Dados inválidos.",
    invalid_token: "Token inválido, por favor tente novamente.",
    permission_denied: "Sem permissão para o fazer, por favor tente novamente.",
    non_existant_category: "Categoria inexistente, por favor tente novamente.",
    failed: "A operação falhou, por favor tente novamente.",
    non_existant_product: "Produto inexistente, por favor tente novamente.",
    wrong_username_password: "O nome de utilizador ou palavra-passe estão incorretos",
    wrong_password: "Palavra-passe incorreta",
  
    // User-related errors
    same_username: "O nome de usuário já existe.",
    error: "Erro nos dados fornecidos.",
  
    // Generic operation errors
    get_user_failed: "Falha ao obter informações do utilizador.",
    register_failed: "Falha ao registrar o utilizador."
  };
  
  export default errorMessages;
  