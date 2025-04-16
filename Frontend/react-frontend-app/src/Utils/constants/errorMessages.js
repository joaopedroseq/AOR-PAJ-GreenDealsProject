//Ficheiro de gestão de erros de operações com o backen
const errorMessages = {
    // Erros gerais
    errorNetwork_error: "Sem resposta do servidor, verifique a sua conexão.",
    errorUnexpected: "Erro inesperado. Por favor tente novamente.",
  
    // Erros de produtos
    errorInvalidData: "Dados inválidos.",
    errorInvalidToken: "Token inválido, por favor tente novamente.",
    errorPermissionDenied: "Sem permissão para o fazer, por favor tente novamente.",
    errorNonExistantCategory: "Categoria inexistente, por favor tente novamente.",
    errorFailed: "A operação falhou, por favor tente novamente.",
    errorNonExistantProduct: "Produto inexistente, por favor tente novamente.",
    errorConflictCategory: "Categoria já existe",
    errorNonExistingCategory: "Categoria não existe",
    
  
    // Erros de autenticação
    errorSameUsername: "O nome de usuário já existe.",
    error: "Erro nos dados fornecidos.",
    errorWrongUsernamePassword: "O nome de utilizador ou palavra-passe estão incorretos",
    errorWrongPassword: "Palavra-passe incorreta",
    errorForbidden: "Não tem permissão para essa operação",
    errorAccountExcluded: "A sua conta foi excluída - contacte o administrador",
    errorAccountInactive: "A sua conta ainda não está ativada",
    errorAccountAlreadyActive: "A sua conta já está ativada",
    errorExpiredToken: "O token para ativar a sua conta expirou",
  
    // Erros de get
    errorGetUsererrorFailed: "Falha ao obter informações do utilizador.",
    errorRegistererrorFailed: "Falha ao registrar o utilizador."
  };
  
  export default errorMessages;
  