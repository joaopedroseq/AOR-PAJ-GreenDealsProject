import handleChangeUserInformation from "../../Handles/handleChangeUserInformation";

const en = {
  //ProtectedRoute
  protectedRoute: "To access this page, please login",

  // Notifications
  // Errors
  noUsername: "Please enter the username.",
  noPassword: "Please enter the password.",
  // Success
  goodbye: "Goodbye {firstName}",

  // Header
  sellProductButton: "Sell product",
  profileButton: "Profile",
  logoutButton: "Logout",
  welcomeMessage: "Welcome ",

  // Login Form
  logIn: "Log in",
  username: "Username",
  password: "Password",
  showPassword: "Show password",
  submit: "Submit",
  register: "Register",

  // Handle Login
  noUsernoPassword: "Both username and password fields must be filled in.",
  welcomeNotification: "Welcome back {firstName}",

  // Homepage
  missionStatement:
    "At GreenDeals, we believe that sustainability begins with small actions that make a significant impact. We provide a virtual space where users can sell items they no longer need and find quality second-hand products at affordable prices. By reusing goods, we contribute to waste reduction and promote more conscious consumption.",

  // Activate Account
  accountActivateActivatedTitle: "Account Activated",
  accountActivateActivatedMessage1:
    "Your account has been successfully activated.",
  accountActivateInfoCopy:
    "Your new activation link has been copied to the clipboard.",
  accountActivateInfoNotCopy: "Unable to copy the new link to the clipboard.",
  accountActivateActivatedFailTitle: "Activation Token Expired",
  accountActivateActivatedFailMessage1:
    "Your token has expired. Please use the new link.",

  // Admin
  adminNoPermission: "You do not have permission to access this page.",
  adminModalAddCategoryTitle: "Add Category {newCategoryName}?",
  adminNewCategorySuccess: "Category successfully added!",
  adminModalRemoveCategoryTitle: "Remove Category?",
  adminModalRemoveCategoryMessage1:
    "Do you wish to remove the category {categoryName}?",
  adminModalRemoveCategoryMessage2:
    "{numberOfProducts} associated products will remain empty.",
  adminRemoveCategorySuccess: "Category successfully removed!",
  adminRemoveUserProductsTitle: "Remove products from {user}",
  adminRemoveUserProductsMessage1: `Do you wish to delete all products of {username}?`,
  adminRemoveUserProductsSuccess: `All products of {username} have been deleted.`,
  adminExcludeUserTitle: "Exclude user",
  adminExcludeUserMessage1: `Do you wish to exclude the user {username}?`,
  adminExcludeUserMessage2: "This will also remove all of their products.",
  adminExcludeUserSuccess: `User {username} has been excluded.`,
  adminDeleteUserTitle: "Delete user",
  adminDeleteUserMessage1: `Do you wish to delete the user {username}?`,
  adminDeleteUserMessage2: "Their products will also be deleted.",
  adminDeleteUserSuccess: `User {username} has been deleted.`,

  // Sections
  ProductsManagementTitle: "Product Management",
  noProductsToShow: "No products available",
  checkBackLater: "Please check back later.",
  UserManagementTitle: "User Management",
  noUsersToShow: "No users available",
  categoryManagementTitle: "Category Management",
  noCategoriesToShow: "No categories created",
  createNewCategory: "Create new category",
  categoryNameLabel: "Category name",
  addCategoryButtonLabel: "Add",

  // Detail
  detailProductDeletedSuccess: "Product successfully deleted",
  detailProductExcludedSuccess: "Product successfully removed",
  detailProductRecoveredSuccess: "Product successfully restored",
  detailBuyProductTitle: "Purchase Product",
  detailBuyProductMessage: "Do you wish to purchase {productName}?",
  detailPurchaseSuccess: "Product successfully purchased",
  detailPurchaseFailure: "errorFailed to purchase the product",
  detailErrorFetchingProduct: "Error retrieving product information",
  detailErrorFetchingUser: "Error retrieving user information",

  // Product Details Page
  detailProductCategoryTitle: "Category",
  detailDefaultCategory: "Undefined",
  detailImagePlaceholderAlt: "Placeholder item image",
  detailProductNameLabel: "Product Name",
  detailDefaultProductName: "Name unavailable",
  detailProductDescriptionLabel: "Description",
  detailDefaultProductDescription: "No description available",
  detailProductPriceLabel: "Price",
  detailDefaultProductPrice: "Price unavailable",
  detailProductSellerLabel: "Seller",
  detailDefaultProductSeller: "Unknown seller",
  detailProductLocationLabel: "Location",
  detailDefaultProductLocation: "Location unspecified",
  detailProductDateLabel: "Publication Date",
  detailDefaultProductDate: "dd/mm/yyyy",
  detailDeleteProductButtonLabel: "Delete Product",

  // Product Actions
  detailEditProductButtonLabel: "Edit Information",
  detailExcludeProductButtonLabel: "Remove Product",
  detailRecoverProductButtonLabel: "Restore Product",
  detailBuyProductButtonLabel: "Purchase",

  // Profile Page
  profileNoPermission: "You do not have permission to access this page",
  profileUpdateTitle: "Update User Information",
  profileUpdateMessage1:
    "Do you wish to update the information for {username}?",
  profileRemoveUserProductsTitle: "Remove User’s Products",
  profileRemoveUserProductsMessage1:
    "Do you wish to delete all products of {username}?",
  profileRemoveUserProductsSuccess:
    "All products of {username} have been deleted",
  profileExcludeUserTitle: "Remove User",
  profileExcludeUserMessage1: "Do you wish to remove the user {username}?",
  profileExcludeUserMessage2: "This will also remove all of their products",
  profileExcludeUserSuccess: "User {username} has been removed",
  profileDeleteUserTitle: "Delete User",
  profileDeleteUserMessage1: "Do you wish to delete the user {username}?",
  profileDeleteUserMessage2: "All of their products will also be deleted",
  profileDeleteUserSuccess: "User {username} has been deleted",
  profileUserProductsTitle: "Products of {username}",
  profileNoProductsAlt: "No products available",
  profileNoProductsHeading: "No products available",
  profileNoProductsMessage: "Please check back later.",
  profileUserInfoTitle: "Information about {username}",
  profileUserIconAlt: "User icon",
  profileFirstNameLabel: "First Name",
  profileFirstNameRequired: "You must enter a first name",
  profileFirstNameInvalid:
    "The first name should not contain special characters",
  profileLastNameLabel: "Last Name",
  profileLastNameRequired: "You must enter a last name",
  profileLastNameInvalid: "The last name should not contain special characters",
  profileEmailLabel: "Email",
  profileEmailRequired: "You must enter an email",
  profileEmailInvalid: "The email must contain an @",
  profilePhoneLabel: "Phone",
  profilePhoneRequired: "You must enter a phone number",
  profilePhoneInvalid: "The phone number must contain at least 9 digits",
  profilePhotoUrlLabel: "Profile Photo URL",
  profilePhotoUrlRequired: "You must enter a URL for your profile photo",

  // User Page
  userMyProductsTitle: "My Products",
  userNoProductsAlt: "No products available",
  userNoProductsHeading: "No products available",
  userNoProductsMessage: "Please check back later.",
  userPersonalInfoTitle: "Personal Information",
  userProfilePhotoAlt: "User icon",
  userFirstNameLabel: "First Name",
  userFirstNameRequired: "You must enter a first name",
  userFirstNameInvalid: "The first name should not contain special characters",
  userLastNameLabel: "Last Name",
  userLastNameRequired: "You must enter a last name",
  userLastNameInvalid: "The last name should not contain special characters",
  userEmailLabel: "Email",
  userEmailRequired: "You must enter an email",
  userEmailInvalid: "The email must contain an @",
  userPhoneLabel: "Phone",
  userPhoneRequired: "You must enter a phone number",
  userPhoneInvalid: "The phone number must contain at least 9 digits",
  userPhotoUrlLabel: "Photo URL",
  userPhotoUrlRequired: "You must enter a URL for your profile photo",
  userSaveChangesButton: "Save Changes",
  userChangePasswordButton: "Change Password",

  //Aside
  asideUserInfo: "Information",
  asideAdminPage: "Administrator Page",
  asideAdminProductManagement: "Product Management",
  asideAdminUserManagement: "User Management",
  asideAdminCategoryManagement: "Category Management",
  asideUserProducts: "{username}'s Products",
  asideUserInfoDetailed: "{username}'s Information",

  //CategoryCard
  categoryCardName: "Category",
  categoryCardNumProducts: "Number of products: {numberOfProducts}",
  categoryCardRemoveTooltip: "Remove category",

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
  confirmationModalConfirmButton: "Confirm",
  confirmationModalCancelButton: "Cancel",

  //ConfirmPasswordModal
  confirmPasswordModalTitle: "Confirm your password",
  confirmPasswordModalCurrentPassword: "Password:",
  confirmPasswordModalConfirmPassword: "Confirm Password:",
  confirmPasswordModalErrorPasswordRequired:
    "To update user information, you must enter the password",
  confirmPasswordModalErrorConfirmPasswordRequired:
    "To update user information, you must enter the password confirmation",
  confirmPasswordModalErrorInvalidPassword:
    "The password cannot contain ' or \"",
  confirmPasswordModalErrorPasswordMismatch: "Passwords do not match",
  confirmPasswordModalConfirmButton: "Confirm",
  confirmPasswordModalCancelButton: "Cancel",

  //DeleteCategoryModal
  deleteCategoryModalTitle: "Delete category",
  deleteCategoryModalConfirmation:
    "Do you want to delete the category {categoryName}?",
  deleteCategoryModalWarning:
    "This category has {numProducts} products that will be left uncategorized - empty.",
  deleteCategoryModalError: "Something went wrong",
  deleteCategoryModalConfirmButton: "Confirm",
  deleteCategoryModalCancelButton: "Cancel",

  //EditProductModal
  editProductModalTitle: "Edit product details",
  editProductModalSuccessMessage: "Product successfully updated",
  editProductModalUnexpectedError: "An unexpected error occurred",
  editProductModalProductName: "Product Name:",
  editProductModalProductDescription: "Description:",
  editProductModalProductPrice: "Product Price:",
  editProductModalProductCategory: "Product Category:",
  editProductModalProductLocation: "Location:",
  editProductModalProductImageUrl: "Image URL:",
  editProductModalProductState: "Item State:",
  editProductModalSelectCategoryPlaceholder: "Choose a category",
  editProductModalSelectStatePlaceholder: "Choose a state",
  editProductModalSaveButton: "Save Changes",
  editProductModalNoChanges: "No changes to be made",
  //EditProductModalError
  editProductModalErrorEditName: "You must enter the product name.",
  editProductModalErrorEditDescription:
    "You must enter a description of the product.",
  editProductModalErrorEditPrice: "You must enter the product price.",
  editProductModalErrorEditCategory: "You must select a product category.",
  editProductModalErrorEditLocation: "You must enter the product location.",
  editProductModalErrorEditUrlImage: "You must enter the product image URL.",
  editProductModalErrorEditState: "You must define a state for the product.",
  editProductModalErrorInvalidPrice: "The price can only contain numbers.",

  //Footer
  footerContactsTitle: "Contacts",
  footerContactsDepartment: "Departamento de Engenharia Informática",
  footerContactsFaculty: "Faculdade de Ciências e Tecnologia",
  footerContactsUniversity: "Universidade de Coimbra",
  footerContactsLocation: "Pólo II - Pinhal de Marrocos",
  footerContactsPostalCode: "3030-290 Coimbra",
  footerCustomerSupportTitle: "Customer Support",
  footerFAQ: "FAQ",
  footerPrivacyPolicy: "Privacy Policy",
  footerTermsOfService: "Terms of Service",
  footerAboutUsTitle: "About Us",
  footerCredits: "Credits",
  footerMissionAndValues: "Mission and Company Values",
  footerJobOpportunities: "Job Opportunities",
  footerFollowUsTitle: "Follow Us",
  footerCopyrightText: "All rights reserved.",

  //ProductCard
  productCardPrice: "Price: €{price}",
  productCardCategory: "Category: {category}",
  productCardSeller: "Seller: {seller}",

  //RegisterModal
  registerModalTitle: "Create a New Account",
  registerModalFirstNameLabel: "First Name:",
  registerModalLastNameLabel: "Last Name:",
  registerModalUsernameLabel: "Username:",
  registerModalPasswordLabel: "Password:",
  registerModalConfirmPasswordLabel: "Confirm Password:",
  registerModalEmailLabel: "Email:",
  registerModalPhoneLabel: "Phone Number:",
  registerModalPhotoUrlLabel: "Profile Photo (URL):",
  registerModalSubmitButton: "Register",
  // Success & Error Messages
  registerModalSuccessMessage:
    "Registration successful! Please activate your account.",
  registerModalActivationLinkCopied:
    "Your activation link has been copied to the clipboard.",
  registerModalActivationTokenTitle: "Account Activation Token",
  registerModalActivationInstruction:
    "Use the link below to activate your account.",
  registerModalFirstNamePlaceholder: "Enter your first name",
  registerModalLastNamePlaceholder: "Enter your last name",
  registerModalUsernamePlaceholder: "Choose a username",
  registerModalPasswordPlaceholder: "Enter a password",
  registerModalConfirmPasswordPlaceholder: "Confirm your password",
  registerModalEmailPlaceholder: "Enter your email address",
  registerModalPhonePlaceholder: "Enter your phone number",
  registerModalPhotoUrlPlaceholder: "Enter your profile photo URL",
  registerModalErrorfirstName: "You must enter your first name.",
  registerModalErrorlastName: "You must enter your last name.",
  registerModalErrorusername: "You must enter a username.",
  registerModalErrorpassword: "You must enter a password.",
  registerModalErrorpasswordConfirm: "You must confirm your password.",
  registerModalErroremail: "You must enter an email.",
  registerModalErrorphoneNumber: "You must enter your phone number.",
  registerModalErrorurlPhoto: "You must enter your profile photo URL.",
  registerModalErrorPasswordMismatch: "Passwords do not match.",
  registerModalErrorInvalidName: "Names should not contain special characters.",
  registerModalErrorInvalidUsername:
    "Usernames can contain '-' and '_', but no other special characters.",
  registerModalErrorInvalidPassword: "Passwords cannot contain ' or \".",
  registerModalErrorInvalidEmail: "Emails must contain '@'.",
  registerModalErrorInvalidPhone: "Phone numbers must have at least 9 digits.",

  //SellProductModal
  sellProductModalTitle: "Sell a Product",
  sellProductModalSuccessMessage: "Your product has been successfully added!",
  sellProductModalAuthError: "You must be authenticated to sell a product.",
  sellProductModalProductNameLabel: "Product Name:",
  sellProductModalProductDescriptionLabel: "Description:",
  sellProductModalProductPriceLabel: "Product Price:",
  sellProductModalProductLocationLabel: "Location:",
  sellProductModalProductImageUrlLabel: "Image URL:",

  sellProductModalProductCategoryLabel: "Product category:",
  sellProductModalProductStateLabel: "State:",

  sellProductModalProductNamePlaceholder: "Enter product name",
  sellProductModalProductDescriptionPlaceholder: "Enter product description",
  sellProductModalProductPricePlaceholder: "Enter product price",
  sellProductModalProductLocationPlaceholder: "Enter product location",
  sellProductModalProductImageUrlPlaceholder: "Enter image URL",

  sellProductModalProductCategoryPlaceholder: "Choose a category",
  sellProductModalSelectStatePlaceholder: "Choose a state",

  sellProductModalErrorproductNameRequired: "Product name is required.",
  sellProductModalErrorproductDescriptionRequired:
    "Product description is required.",
  sellProductModalErrorproductPriceRequired: "Product price is required.",
  sellProductModalErrorproductLocationRequired: "Product location is required.",
  sellProductModalErrorproductUrlImageRequired: "Image URL is required.",
  sellProductModalErrorInvalidProductPrice: "Price must contain only numbers.",

  //Handles
  //handleChangeUserInformation
  handleChangeUserInformationSucess: "Update successfull",

  //RenderCategoryList
  categoryListAllProducts: "All products",

  //NotificationsWebsockets
  wsNotificationsLastMessage: "{sender} wants to talk to you:\"{message}\" at {timestamp}",
  wsNotificationsUnreadMessages: "You have {numMessages} messages from {sender} to read",
  wsNotificationsProductAltered: "Admin {username} changed your product",
  wsNotificationsProductBought: "User {username} has bought one of your products",

  //Chat
  chatWsClosedMessageSent:"There was a problem but your message was sent",
  chatWsClosedMessageNotSent:"There was a problem. Your message wasn't sent. Try again",

  //Errors
  errorerrorNetwork_error:
    "No response from the server, please check your connection.",
  errorUnexpected: "Unexpected error. Please try again.",
  errorInvalidData: "Invalid data.",
  errorInvalidToken: "Invalid token, please try again.",
  errorPermissionDenied: "Permission denied, please try again.",
  errorNonExistantCategory: "Category does not exist, please try again.",
  errorerrorFailed: "The operation errorFailed, please try again.",
  errorNonExistantProduct: "Product does not exist, please try again.",
  errorConflictCategory: "Category already exists.",
  errorNonExistingCategory: "Category does not exist.",
  errorSameUsername: "Username already exists.",
  errorGeneral: "Error in provided data.",
  errorWrongUsernamePassword: "Username or password is incorrect.",
  errorWrongPassword: "Incorrect password.",
  errorerrorForbidden: "You do not have permission for this operation.",
  errorAccountExcluded:
    "Your account has been deleted - contact the administrator.",
  errorAccountInactive: "Your account is not yet activated.",
  errorAccountAlreadyActive: "Your account is already active.",
  errorExpiredToken: "Your account activation token has expired.",
  errorGetUsererrorFailed: "errorFailed to retrieve user information.",
  errorRegistererrorFailed: "errorFailed to register user.",
};
export default en;
