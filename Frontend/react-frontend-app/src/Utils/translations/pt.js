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
  UserManagementTitle: "Gestão de Categorias",
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
profileUpdateMessage1: "Pretende alterar informações do utilizador {username}?",
profileRemoveUserProductsTitle: "Remover produtos de utilizador",
profileRemoveUserProductsMessage1: "Deseja apagar todos os produtos de {username}?",
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
profileFirstNameInvalid: "O primeiro nome não deverá conter caracteres especiais",
profileLastNameLabel: "Último Nome",
profileLastNameRequired: "Terá de preencher o apelido",
profileLastNameInvalid: "O apelido não deverá conter caracteres especiais",
profileEmailLabel: "Email",
profileEmailRequired: "Terá de preencher o seu email",
profileEmailInvalid: "O seu email tem de conter um @",
profilePhoneLabel: "Telefone",
profilePhoneRequired: "Terá de preencher o seu contacto telefónico",
profilePhoneInvalid: "O seu número de telefone tem de conter pelo menos 9 dígitos",
profilePhotoUrlLabel: "Foto URL",
profilePhotoUrlRequired: "Terá de preencher com o URL da sua fotografia de perfil",

// Página: Utilizador
userMyProductsTitle: "Os meus produtos",
userNoProductsAlt: "Nenhum produto disponível",
userNoProductsHeading: "Sem produtos disponíveis",
userNoProductsMessage: "Por favor, verifique novamente mais tarde.",
userPersonalInfoTitle: "Informações Pessoais",
userProfilePhotoAlt: "Ícone do utilizador",
userFirstNameLabel: "Primeiro Nome",
userFirstNameRequired: "Terá de preencher o primeiro nome",
userFirstNameInvalid: "O primeiro nome não deverá conter caracteres especiais",
userLastNameLabel: "Último Nome",
userLastNameRequired: "Terá de preencher o apelido",
userLastNameInvalid: "O apelido não deverá conter caracteres especiais",
userEmailLabel: "Email",
userEmailRequired: "Terá de preencher o seu email",
userEmailInvalid: "O seu email tem de conter um @",
userPhoneLabel: "Telefone",
userPhoneRequired: "Terá de preencher o seu contacto telefónico",
userPhoneInvalid: "O seu número de telefone tem de conter pelo menos 9 dígitos",
userPhotoUrlLabel: "Link Foto",
userPhotoUrlRequired: "Terá de preencher com o URL da sua fotografia de perfil",
userSaveChangesButton: "Guardar Alterações",
userChangePasswordButton: "Alterar password",

//NOVO
};
export default pt;