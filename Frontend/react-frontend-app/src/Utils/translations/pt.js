const pt = {
  //Notifications
  //Errors
  noUsername: "Por favor, preencha o nome de utilizador.",
  noPassword: "Por favor, preencha o nome de utilizador.",
  //Success
  goodbye: "Até à próxima {firstName}",

  //Header
  sellProductButton: "Vender um produto",
  profileButton: "O meu perfil",
  logoutButton: "Sair",
  welcomeMessage: "Bem-Vindo ",

  //LoginForm
  logIn: "Entrar",
  username: "Nome de utilizador",
  password: "Palavra-chave",
  showPassword: "mostrar palavra-chave",
  submit: "Submeter",
  register: "Registrar",

  //HandleLogin
  noUsernoPassword: "Os campos de utilizador e password têm de ser preenchidos",
  welcomeNotification: "Bem vindo de volta {firstName}",

  //Homepage
  missionStatement:
    "Na GreenDeals acreditamos que a sustentabilidade começa com pequenas ações que fazem uma grande diferença. Oferecemos um ambiente virtual onde você pode vender itens que já não utiliza e encontrar produtos usados de qualidade a preços acessíveis. Ao reutilizar bens, contribuímos para a redução do desperdício e promovemos um consumo mais consciente.",

  //Activate account
  accountActivateActivatedTitle: "Conta ativada",
  accountActivateActivatedMessage1: "A sua conta foi ativada com sucesso",
  accountActivateInfoCopy:
    "O seu novo link de ativação foi copiado para o clipboard",
  accountActivateInfoNotCopy:
    "Não foi possível copiar para o clipboard o novo link",
  accountActivateActivatedFailTitle: "Token de ativação expirado",
  accountActivateActivatedFailMessage1:
    "O seu token expirou. Utilize o novo link",

  //Admin
  adminNoPermission: "Não tem permissão para aceder a esta página",
  adminModalAddCategoryTitle: "Adicionar Categoria {newCategoryName}?",
  adminNewCategorySuccess: "Categoria adicionada com sucesso!",
  adminModalRemoveCategoryTitle: "Remover categoria??",
  adminModalRemoveCategoryMessage1: "Deseja remover categoria {categoryName}?",
  adminModalRemoveCategoryMessage2:
    "Os {numberOfProducts} produtos associados ficarão vazios",
  adminRemoveCategorySucess: "Categoria removida com sucesso!",
  adminRemoveUserProductsTitle: "Remover produtos de {user}",
  adminRemoveUserProductsMessage1: `Deseja apagar todos os produtos de {username}?`,
  adminRemoveUserProductsSuccess: `Apagados todos os produtos de {username}`,
  adminExcludeUserTitle: "Excluir utilizador",
  adminExcludeUserMessage1: `Deseja excluir o utilizador {username}?`,
  adminExcludeUserMessage2: "Irá também excluir todos os seus produtos",
  adminExcludeUserSuccess: `Excluído o utilizador {username}`,
  adminDeleteUserTitle: "Apagar utilizador",
  adminDeleteUserMessage1: `Deseja apagar o utilizador {username}?`,
  adminDeleteUserMessage2: "Os seus produtos serão excluídos",
  adminDeleteUserSuccess: `Apagado o utilizador {username}`,
  //Sections
  ProductsManagementTitle: "Gestão de Produtos",
  noProductsToShow: "Sem produtos",
  checkBackLater: "Tente mais tarde.",
  UserManagementTitle: "Gestão de Utilizadores",
  noUsersToShow: "Sem utilizadores",
  categoryManagementTitle: "Gestão de Categorias",
  noCategoriesToShow: "Não existem categorias criadas",
  createNewCategory: "Criar nova categoria",
  categoryNameLabel: "nome da categoria",
  addCategoryButtonLabel: "Adicionar",

  //Detail
  detailProductDeletedSuccess: "Produto apagado com sucesso",
  detailProductExcludedSuccess: "Produto excluído com sucesso",
  detailProductRecoveredSuccess: "Produto recuperado com sucesso",
  detailBuyProductTitle: "Comprar Produto",
  detailBuyProductMessage: "Deseja comprar {productName}?",
  detailPurchaseSuccess: "Produto comprado com sucesso",
  detailPurchaseFailure: "Falha na compra do produto",
  detailErrorFetchingProduct: "Erro ao buscar informações do produto",
  detailErrorFetchingUser: "Erro ao buscar informações do utilizador",
  // Página: Detalhes do Produto
  detailProductCategoryTitle: "Categoria",
  detailDefaultCategory: "Indefinida",
  detailImagePlaceholderAlt: "Imagem do item placeholder",
  detailProductNameLabel: "Nome do Produto",
  detailDefaultProductName: "Nome não disponível",
  detailProductDescriptionLabel: "Descrição",
  detailDefaultProductDescription: "Sem descrição",
  detailProductPriceLabel: "Preço",
  detailDefaultProductPrice: "Preço não disponível",
  detailProductSellerLabel: "Vendedor",
  detailDefaultProductSeller: "Vendedor desconhecido",
  detailProductLocationLabel: "Localização",
  detailDefaultProductLocation: "Localização não especificada",
  detailProductDateLabel: "Data de Publicação",
  detailDefaultProductDate: "dd/mm/aaaa",
  detailDeleteProductButtonLabel: "Apagar Produto",
  // Página: Detalhes do Produto
  detailEditProductButtonLabel: "Editar informações",
  detailExcludeProductButtonLabel: "Excluir produto",
  detailRecoverProductButtonLabel: "Recuperar produto",
  detailBuyProductButtonLabel: "Comprar",

  // Página: Perfil
  profileNoPermission: "Não tem permissão para aceder a esta página",
  profileUpdateTitle: "Alterar informações de utilizador",
  profileUpdateMessage1:
    "Pretende alterar informações do utilizador {username}?",
  profileRemoveUserProductsTitle: "Remover produtos de utilizador",
  profileRemoveUserProductsMessage1:
    "Deseja apagar todos os produtos de {username}?",
  profileRemoveUserProductsSuccess: "Apagados todos os produtos de {username}",
  profileExcludeUserTitle: "Excluir utilizador",
  profileExcludeUserMessage1: "Deseja excluir o utilizador {username}?",
  profileExcludeUserMessage2: "Irá também excluir todos os seus produtos",
  profileExcludeUserSuccess: "Excluído o utilizador {username}",
  profileDeleteUserTitle: "Apagar utilizador",
  profileDeleteUserMessage1: "Deseja apagar o utilizador {username}?",
  profileDeleteUserMessage2: "Todos os seus produtos serão excluídos",
  profileDeleteUserSuccess: "Apagado o utilizador {username}",
  profileUserProductsTitle: "Produtos de {username}",
  profileNoProductsAlt: "Nenhum produto disponível",
  profileNoProductsHeading: "Sem produtos disponíveis",
  profileNoProductsMessage: "Por favor, verifique novamente mais tarde.",
  profileUserInfoTitle: "Informações de {username}",
  profileUserIconAlt: "Ícone do utilizador",
  profileFirstNameLabel: "Primeiro Nome",
  profileFirstNameRequired: "Terá de preencher o primeiro nome",
  profileFirstNameInvalid:
    "O primeiro nome não deverá conter caracteres especiais",
  profileLastNameLabel: "Último Nome",
  profileLastNameRequired: "Terá de preencher o apelido",
  profileLastNameInvalid: "O apelido não deverá conter caracteres especiais",
  profileEmailLabel: "Email",
  profileEmailRequired: "Terá de preencher o seu email",
  profileEmailInvalid: "O seu email tem de conter um @",
  profilePhoneLabel: "Telefone",
  profilePhoneRequired: "Terá de preencher o seu contacto telefónico",
  profilePhoneInvalid:
    "O seu número de telefone tem de conter pelo menos 9 dígitos",
  profilePhotoUrlLabel: "Foto URL",
  profilePhotoUrlRequired:
    "Terá de preencher com o URL da sua fotografia de perfil",

  // Página: Utilizador
  userMyProductsTitle: "Os meus produtos",
  userNoProductsAlt: "Nenhum produto disponível",
  userNoProductsHeading: "Sem produtos disponíveis",
  userNoProductsMessage: "Por favor, verifique novamente mais tarde.",
  userPersonalInfoTitle: "Informações Pessoais",
  userProfilePhotoAlt: "Ícone do utilizador",
  userFirstNameLabel: "Primeiro Nome",
  userFirstNameRequired: "Terá de preencher o primeiro nome",
  userFirstNameInvalid:
    "O primeiro nome não deverá conter caracteres especiais",
  userLastNameLabel: "Último Nome",
  userLastNameRequired: "Terá de preencher o apelido",
  userLastNameInvalid: "O apelido não deverá conter caracteres especiais",
  userEmailLabel: "Email",
  userEmailRequired: "Terá de preencher o seu email",
  userEmailInvalid: "O seu email tem de conter um @",
  userPhoneLabel: "Telefone",
  userPhoneRequired: "Terá de preencher o seu contacto telefónico",
  userPhoneInvalid:
    "O seu número de telefone tem de conter pelo menos 9 dígitos",
  userPhotoUrlLabel: "Link Foto",
  userPhotoUrlRequired:
    "Terá de preencher com o URL da sua fotografia de perfil",
  userSaveChangesButton: "Guardar Alterações",
  userChangePasswordButton: "Alterar password",

  //Aside
  asideUserInfo: "Informações",
  asideAdminPage: "Página de Administrador",
  asideAdminProductManagement: "Gestão de Produtos",
  asideAdminUserManagement: "Gestão de Utilizadores",
  asideAdminCategoryManagement: "Gestão de Categorias",
  asideUserProducts: "Produtos de {username}",
  asideUserInfoDetailed: "Informações de {username}",

  //CategoryCard
  categoryCardName: "Categoria",
  categoryCardNumProducts: "Número de produtos: {numberOfProducts}",
  categoryCardRemoveTooltip: "Remover categoria",

  //ChangePasswordModal
  changePasswordModalTitle: "Confirme a sua password",
  changePasswordModalCurrentPassword: "Password:",
  changePasswordModalConfirmPassword: "Confirmar Password:",
  changePasswordModalNewPassword: "Nova Password:",
  changePasswordModalErrorOldPasswordRequired:
    "Para alterar a sua password, terá de preencher campos com a password antiga",
  changePasswordModalErrorInvalidPassword: "A password não pode conter ' ou \"",
  changePasswordModalErrorPasswordMismatch: "As passwords não correspondem",
  changePasswordModalErrorNewPasswordRequired:
    "Para alterar a sua password, terá de preencher a sua nova password",
  changePasswordModalErrorSamePassword: "A nova password é igual à antiga",
  changePasswordModalConfirmButton: "Confirmar",
  changePasswordModalCancelButton: "Cancelar",

  //ConfirmationModal
  confirmationModalConfirmButton: "Confirmar",
  confirmationModalCancelButton: "Cancelar",

  //ConfirmPasswordModal
  confirmPasswordModalTitle: "Confirme a sua password",
  confirmPasswordModalCurrentPassword: "Password:",
  confirmPasswordModalConfirmPassword: "Confirmar Password:",
  confirmPasswordModalErrorPasswordRequired:
    "Para alterar informações de utilizador, terá de preencher a password",
  confirmPasswordModalErrorConfirmPasswordRequired:
    "Para alterar informações de utilizador, terá de preencher a confirmação da password",
  confirmPasswordModalErrorInvalidPassword:
    "A password não pode conter ' ou \"",
  confirmPasswordModalErrorPasswordMismatch: "As passwords não correspondem",
  confirmPasswordModalConfirmButton: "Confirmar",
  confirmPasswordModalCancelButton: "Cancelar",

  //DeleteCategoryModal
  deleteCategoryModalTitle: "Apagar categoria",
  deleteCategoryModalConfirmation: "Deseja apagar a categoria {categoryName}?",
  deleteCategoryModalWarning:
    "Esta categoria tem {numProducts} produtos que ficarão sem qualquer categoria - empty.",
  deleteCategoryModalError: "Algo correu mal",
  deleteCategoryModalConfirmButton: "Confirmo",
  deleteCategoryModalCancelButton: "Cancelar",

  //EditProductModal
  editProductModalTitle: "Alterar informações de produto",
  editProductModalSuccessMessage: "Produto atualizado com sucesso",
  editProductModalUnexpectedError: "Ocorreu um erro inesperado",
  editProductModalProductName: "Nome do Produto:",
  editProductModalProductDescription: "Descrição:",
  editProductModalProductPrice: "Preço do Produto:",
  editProductModalProductCategory: "Categoria do Produto:",
  editProductModalProductLocation: "Localização:",
  editProductModalProductImageUrl: "URL da imagem:",
  editProductModalProductState: "Estado do artigo:",
  editProductModalSelectCategoryPlaceholder: "Escolha uma categoria",
  editProductModalSelectStatePlaceholder: "Escolha um estado",
  editProductModalSaveButton: "Guardar Alterações",
  editProductModaleNoChanges: "Sem alterações a serem feitas",
  //EditProductModalError
  editProductModalErrorEditName: "Terá de preencher o nome do produto.",
  editProductModalErrorEditDescription:
    "Terá de preencher uma descrição do produto.",
  editProductModalErrorEditPrice: "Terá de preencher o preço do produto.",
  editProductModalErrorEditCategory:
    "Terá de preencher a categoria do produto.",
  editProductModalErrorEditLocation:
    "Terá de preencher a localização do produto.",
  editProductModalErrorEditUrlImage:
    "Terá de preencher o URL da imagem do produto.",
  editProductModalErrorEditState: "Terá de definir um estado para o produto.",
  editProductModalErrorInvalidPrice: "O preço apenas pode conter números.",

  //Footer
  footerContactsTitle: "Contactos",
  footerContactsDepartment: "Departamento de Engenharia Informática",
  footerContactsFaculty: "Faculdade de Ciências e Tecnologia",
  footerContactsUniversity: "Universidade de Coimbra",
  footerContactsLocation: "Pólo II - Pinhal de Marrocos",
  footerContactsPostalCode: "3030-290 Coimbra",
  footerCustomerSupportTitle: "Apoio ao Cliente",
  footerFAQ: "FAQ",
  footerPrivacyPolicy: "Política de Privacidade",
  footerTermsOfService: "Termos de Serviço",
  footerAboutUsTitle: "Sobre Nós",
  footerCredits: "Créditos",
  footerMissionAndValues: "Missão e Valores da Empresa",
  footerJobOpportunities: "Oportunidades de Emprego",
  footerFollowUsTitle: "Siga-nos",
  footerCopyrightText: "Todos os direitos reservados.",

  //ProductCard
  productCardPrice: "Preço: €{price}",
  productCardCategory: "Categoria: {category}",
  productCardSeller: "Vendedor: {seller}",

  //RegisterModal
  registerModalTitle: "Criar um Novo Registo",
  registerModalFirstNameLabel: "Primeiro Nome:",
  registerModalLastNameLabel: "Apelido:",
  registerModalUsernameLabel: "Nome de Utilizador:",
  registerModalPasswordLabel: "Palavra-passe:",
  registerModalConfirmPasswordLabel: "Confirmar Palavra-passe:",
  registerModalEmailLabel: "Email:",
  registerModalPhoneLabel: "Número de Telefone:",
  registerModalPhotoUrlLabel: "Fotografia de Perfil (URL):",
  registerModalSubmitButton: "Registar",
  // Success & Error Messages
  registerModalSuccessMessage:
    "Registo bem-sucedido! Agora precisa ativar sua conta.",
  registerModalActivationTokenTitle: "Token de Ativação de Conta",
  registerModalActivationInstruction:
    "Utilize o endereço abaixo para ativar a sua conta.",
  registerModalActivationLinkCopied:
    "O seu link de ativação foi copiado para o clipboard.",
  registerModalFirstNamePlaceholder: "Insira o seu primeiro nome",
  registerModalLastNamePlaceholder: "Insira o seu apelido",
  registerModalUsernamePlaceholder: "Escolha um nome de utilizador",
  registerModalPasswordPlaceholder: "Insira uma palavra-passe",
  registerModalConfirmPasswordPlaceholder: "Confirme a sua palavra-passe",
  registerModalEmailPlaceholder: "Insira o seu endereço de email",
  registerModalPhonePlaceholder: "Insira o seu número de telefone",
  registerModalPhotoUrlPlaceholder: "Insira o URL da sua fotografia de perfil",
  registerModalErrorfirstName: "Tem de preencher o primeiro nome.",
  registerModalErrorlastName: "Tem de preencher o apelido.",
  registerModalErrorusername: "Tem de preencher o nome de utilizador.",
  registerModalErrorpassword: "Tem de preencher a palavra-passe.",
  registerModalErrorpasswordConfirm:
    "Tem de confirmar a palavra-passe.",
    registerModalErroremail: "Tem de preencher o email.",
    registerModalErrorphoneNumber:
    "Tem de preencher o número de telefone.",
    registerModalErrorurlPhoto:
    "Tem de preencher o URL da sua fotografia de perfil.",
    registerModalErrorPasswordMismatch: "As palavras-passe não correspondem.",
  registerModalErrorInvalidName: "O nome não deve conter caracteres especiais.",
  registerModalErrorInvalidUsername:
    "Os nomes de utilizador podem conter '-' e '_', mas não outros caracteres especiais.",
  registerModalErrorInvalidPassword:
    "As palavras-passe não podem conter ' ou \".",
  registerModalErrorInvalidEmail: "Os emails devem conter '@'.",
  registerModalErrorInvalidPhone:
    "O número de telefone deve ter pelo menos 9 dígitos.",

  //Sell Product Modal
  sellProductModalTitle: "Vender um Produto",
  sellProductModalSuccessMessage: "O seu produto foi adicionado com sucesso!",
  sellProductModalAuthError: "Tem de estar autenticado para vender um produto.",
  sellProductModalProductNameLabel: "Nome do Produto:",
  sellProductModalProductDescriptionLabel: "Descrição:",
  sellProductModalProductPriceLabel: "Preço do Produto:",
  sellProductModalProductLocationLabel: "Localização:",
  sellProductModalProductImageUrlLabel: "URL da Imagem:",

  sellProductModalProductCategoryLabel: "Categoria do produto:",
  sellProductModalProductStateLabel: "Estado:",

  sellProductModalProductNamePlaceholder: "Insira o nome do produto",
  sellProductModalProductDescriptionPlaceholder:
    "Insira a descrição do produto",
  sellProductModalProductPricePlaceholder: "Insira o preço do produto",
  sellProductModalProductLocationPlaceholder: "Insira a localização do produto",
  sellProductModalProductImageUrlPlaceholder: "Insira o URL da imagem",


  sellProductModalProductCategoryPlaceholder: "Escolha uma categoria",
  sellProductModalSelectStatePlaceholder: "Escolha um estado",

  sellProductModalErrorproductNameRequired: "O nome do produto é obrigatório.",
  sellProductModalErrorproductDescriptionRequired:
    "A descrição do produto é obrigatória.",
  sellProductModalErrorproductPriceRequired:
    "O preço do produto é obrigatório.",
  sellProductModalErrorproductLocationRequired:
    "A localização do produto é obrigatória.",
    sellProductModalErrorproductUrlImageRequired:
    "O URL da imagem é obrigatório.",
  sellProductModalErrorInvalidProductPrice:
    "O preço apenas pode conter números.",


    //RenderCategoryList
    categoryListAllProducts: "Todos os produtos",

  //Handles
  //handleChangeUserInformation
  handleChangeUserInformationSucess: "Alterações efetuadas com sucesso",

  //General Errors
  errorerrorNetwork_error: "Sem resposta do servidor, verifique a sua conexão.",
  errorUnexpected: "Erro inesperado. Por favor tente novamente.",
  errorInvalidData: "Dados inválidos.",
  errorInvalidToken: "Token inválido, por favor tente novamente.",
  errorPermissionDenied:
    "Sem permissão para o fazer, por favor tente novamente.",
  errorNonExistantCategory: "Categoria inexistente, por favor tente novamente.",
  errorerrorFailed: "A operação falhou, por favor tente novamente.",
  errorNonExistantProduct: "Produto inexistente, por favor tente novamente.",
  errorConflictCategory: "Categoria já existe.",
  errorNonExistingCategory: "Categoria não existe.",
  errorSameUsername: "O nome de usuário já existe.",
  errorGeneral: "Erro nos dados fornecidos.",
  errorWrongUsernamePassword:
    "O nome de utilizador ou palavra-passe estão incorretos.",
  errorWrongPassword: "Palavra-passe incorreta.",
  errorerrorForbidden: "Não tem permissão para essa operação.",
  errorAccountExcluded: "A sua conta foi excluída - contacte o administrador.",
  errorAccountInactive: "A sua conta ainda não está ativada.",
  errorAccountAlreadyActive: "A sua conta já está ativada.",
  errorExpiredToken: "O token para ativar a sua conta expirou.",
  errorGetUsererrorFailed: "Falha ao obter informações do utilizador.",
  errorRegistererrorFailed: "Falha ao registrar o utilizador.",
};
export default pt;
