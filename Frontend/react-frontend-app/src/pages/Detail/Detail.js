import React, { useEffect, useState } from "react";
import "./detail.css";
import {
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../Api/productApi";
import useUserStore from "../../Stores/useUserStore";
import { useLocation, useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastConfig/toastConfig";
import {
  transformArrayDatetoDate,
  dateToFormattedDate,
} from "../../Utils/utilityFunctions";
import { useIntl } from "react-intl";
import useLocaleStore from "../../Stores/useLocaleStore";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import EditProductModal from "../../Components/EditProductModal/EditProductModal";
import errorMessages from "../../Utils/constants/errorMessages";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import handleBuyingProduct from "../../Handles/handleBuyingProduct";

export const Detail = () => {
  const INDEX_OF_PRODUCT = 0;
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const id = new URLSearchParams(useLocation().search).get("id");
  const [product, setProduct] = useState(null);

  const [isOwner, setOwner] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  //Confirmation Modal
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Opções de língua
  const intl = useIntl();
  const locale = useLocaleStore((state) => state.locale);

  // Toggle do edit product modal
  const [isEditProductModalVisible, setIsEditProductModalVisible] =
    useState(false);

  const toggleEditProductModal = () => {
    setIsEditProductModalVisible(!isEditProductModalVisible);
  };

  //Flag para update das informações após alterações destas
  const [isProductUpdated, setIsProductUpdated] = useState(false);

  const handleProductUpdate = () => {
    setIsProductUpdated(true);
  };

  //Operação de excluir produto - operação de admin
  const handleExcludeProduct = async () => {
    const exclusion = {
      excluded: !product.excluded,
    };
    try {
      await updateProduct(exclusion, token, product.id);
      if (!isAdmin) {
        showSuccessToast(
          intl.formatMessage({ id: "detailProductDeletedSuccess" })
        );
        navigate("/");
      } else {
        if (!product.excluded) {
          showSuccessToast(
            intl.formatMessage({ id: "detailProductExcludedSuccess" })
          );
        } else {
          showSuccessToast(
            intl.formatMessage({ id: "detailProductRecoveredSuccess" })
          );
        }
      }
      const updatedProduct = { ...product, excluded: exclusion.excluded };
      setProduct(updatedProduct);
      handleProductUpdate();
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  };

  // Operação de apagar produto - redireciona para a página principal
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(token, product.id);
      showSuccessToast(
        intl.formatMessage({ id: "detailProductDeletedSuccess" })
      );
      navigate(-1);
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  };

  // Fetch das informações do produto após a entrada
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        let productData;
        try {
          let queryParam = {
            id: id,
          };
          productData = await getProducts(queryParam, token);
          if (productData.length > 1) {
            throw new Error("Invalid product - non unique product Id");
          }
          productData = productData[INDEX_OF_PRODUCT];
          productData.date = transformArrayDatetoDate(productData.date);
          setProduct(productData);
        } catch (error) {
          showErrorToast(
            intl.formatMessage({ id: "detailErrorFetchingProduct" })
          );
          navigate("/");
        }
        try {
          const user = await getLoggedUserInformation(token);
          if (user.admin) {
            setAdmin(true);
          }
          if (user.username === productData.seller) {
            setOwner(true);
          }
        } catch (error) {
          console.log("error in getting userlogged" + error);
          showErrorToast(intl.formatMessage({ id: "detailErrorFetchingUser" }));
          setAdmin(false);
          setOwner(false);
        }
      }
    };
    fetchProduct();
  }, [id, token, isProductUpdated]);

  // Comprar produto
  const buyingProduct = async () => {
    setModalConfig({
      title: intl.formatMessage({ id: "detailBuyProductTitle" }),
      message: intl.formatMessage(
        { id: "detailBuyProductMessage" },
        { productName: product.name }
      ),
      onConfirm: async () => {
        const response = await handleBuyingProduct(id, token);
        if (response) {
          showSuccessToast(intl.formatMessage({ id: "detailPurchaseSuccess" }));
          setIsProductUpdated(true);
          setIsModalOpen(false);
        } else {
          showErrorToast(intl.formatMessage({ id: "detailPurchaseFailure" }));
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <div className="main-content">
        {/* Título da categoria do produto */}
        <h2 id="product-category">
          {intl.formatMessage({ id: "detailProductCategoryTitle" })}:{" "}
          {product
            ? locale === "pt"
              ? product.category.nome
              : locale === "en"
              ? product.category.nameEng
              : intl.formatMessage({ id: "detailDefaultCategory" }) // Default for unsupported locales
            : intl.formatMessage({ id: "detailDefaultCategory" })}
        </h2>
        {/* Informações do produto */}
        <div className="product-details">
          <div className="product-image-column">
            <img
              className="product-image"
              id="product-image"
              src={
                product ? product.urlImage : "../images/placeholder/item.png"
              }
              alt={
                product
                  ? product.name
                  : intl.formatMessage({ id: "detailImagePlaceholderAlt" })
              }
            />
          </div>
          <div className="product-detail-column">
            <p id="product-name">
              <strong>
                {intl.formatMessage({ id: "detailProductNameLabel" })}:{" "}
              </strong>
              {product
                ? product.name
                : intl.formatMessage({ id: "detailDefaultProductName" })}
            </p>
            <p id="product-description">
              <strong>
                {intl.formatMessage({ id: "detailProductDescriptionLabel" })}:{" "}
              </strong>
              {product
                ? product.description
                : intl.formatMessage({ id: "detailDefaultProductDescription" })}
            </p>
            <p id="product-price">
              <strong>
                {intl.formatMessage({ id: "detailProductPriceLabel" })}:{" "}
              </strong>
              {product
                ? `${product.price} €`
                : intl.formatMessage({ id: "detailDefaultProductPrice" })}
            </p>
            <p id="product-seller">
              <strong>
                {intl.formatMessage({ id: "detailProductSellerLabel" })}:{" "}
              </strong>
              {product
                ? product.seller
                : intl.formatMessage({ id: "detailDefaultProductSeller" })}
            </p>
            <p id="product-location">
              <strong>
                {intl.formatMessage({ id: "detailProductLocationLabel" })}:{" "}
              </strong>
              {product
                ? product.location
                : intl.formatMessage({ id: "detailDefaultProductLocation" })}
            </p>
            <p id="product-date">
              <strong>
                {intl.formatMessage({ id: "detailProductDateLabel" })}:{" "}
              </strong>
              {product
                ? dateToFormattedDate(product.date)
                : intl.formatMessage({ id: "detailDefaultProductDate" })}
            </p>
          </div>
        </div>
        <div className="productButtons">
          {/* Se for admin, mostrar botão de excluir produto */}
          {isAdmin ? (
            <input
              type="button"
              id="exclude-product-button"
              className="exclude-product-button"
              value={intl.formatMessage({
                id: "detailDeleteProductButtonLabel",
              })}
              onClick={handleDeleteProduct}
            />
          ) : null}

          {/* Se for admin ou dono do produto, mostrar botões de apagar e editar produto */}
          {(isAdmin || isOwner) && (
            <input
              type="button"
              id="edit-product"
              value={intl.formatMessage({ id: "detailEditProductButtonLabel" })}
              onClick={toggleEditProductModal}
            />
          )}
          {(isAdmin || isOwner) && (
            <input
              type="button"
              id="delete-product"
              value={
                isAdmin
                  ? product.excluded
                    ? intl.formatMessage({
                        id: "detailRecoverProductButtonLabel",
                      })
                    : intl.formatMessage({
                        id: "detailExcludeProductButtonLabel",
                      })
                  : isOwner && !isAdmin
                  ? intl.formatMessage({ id: "detailDeleteProductButtonLabel" })
                  : ""
              }
              onClick={handleExcludeProduct}
            />
          )}
          {/* Se não for dono, não mostrar botão de comprar produto */}
          {isOwner ? null : (
            <input
              type="button"
              id="buy-button"
              value={intl.formatMessage({ id: "detailBuyProductButtonLabel" })}
              onClick={buyingProduct}
            />
          )}

          <EditProductModal
            product={product}
            toggleEditProductModal={toggleEditProductModal}
            isEditProductModalVisible={isEditProductModalVisible}
            updatedProduct={handleProductUpdate}
          />

          <ConfirmationModal
            title={modalConfig.title}
            message={modalConfig.message}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={modalConfig.onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
