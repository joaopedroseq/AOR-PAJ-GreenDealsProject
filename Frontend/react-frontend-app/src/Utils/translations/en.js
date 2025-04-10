
const en = {
  // Notifications
  // Errors
  noUsername: "Please enter the username.",
  noPassword: "Please enter the password.",
  // Success
  goodbye: "Goodbye {firstName}",

  // Header
  sellProductButton: "Sell a product",
  profileButton: "My profile",
  logoutButton: "Log out",
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
  accountActivateActivatedMessage1: "Your account has been successfully activated.",
  accountActivateInfoCopy: "Your new activation link has been copied to the clipboard.",
  accountActivateInfoNotCopy: "Unable to copy the new link to the clipboard.",
  accountActivateActivatedFailTitle: "Activation Token Expired",
  accountActivateActivatedFailMessage1: "Your token has expired. Please use the new link.",

  // Admin
  adminNoPermission: "You do not have permission to access this page.",
  adminModalAddCategoryTitle: "Add Category {newCategoryName}?",
  adminNewCategorySuccess: "Category successfully added!",
  adminModalRemoveCategoryTitle: "Remove Category?",
  adminModalRemoveCategoryMessage1: "Do you wish to remove the category {categoryName}?",
  adminModalRemoveCategoryMessage2: "{numberOfProducts} associated products will remain empty.",
  adminRemoveCategorySucess: "Category successfully removed!",
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
  UserManagementTitle: "Category Management",
  noUsersToShow: "No users available",
  categoryManagementTitle: "Category Management",
  noCategoriesToShow: "No categories created",
  createNewCategory: "Create new category",
  categoryNameLabel: "Category name",
  addCategoryButtonLabel: "Add",

  // Detail
  detailProductDeletedSuccess: "Product successfully deleted",
  detailProductExcludedSuccess: "Product successfully excluded",
  detailProductRecoveredSuccess: "Product successfully recovered",
  detailBuyProductTitle: "Purchase Product",
  detailBuyProductMessage: "Do you wish to purchase {productName}?",
  detailPurchaseSuccess: "Product successfully purchased",
  detailPurchaseFailure: "Product purchase failed",
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
  detailDefaultProductLocation: "Location not specified",
  detailProductDateLabel: "Publication Date",
  detailDefaultProductDate: "dd/mm/yyyy",
  detailDeleteProductButtonLabel: "Delete Product",

  // Product Actions
  detailEditProductButtonLabel: "Edit Information",
  detailExcludeProductButtonLabel: "Exclude Product",
  detailRecoverProductButtonLabel: "Recover Product",
  detailBuyProductButtonLabel: "Purchase"

}
export default en;