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
        showSuccessToast("Produto apagado com sucesso");
        navigate("/");
      } else {
        if (!product.excluded) {
          showSuccessToast("Produto excluído com sucesso");
        } else {
          showSuccessToast("Produto recuperado com sucesso");
        }
      }
      const updatedProduct = { ...product, excluded: exclusion.excluded }; //... é spread operator: adiciona ou suplanta o excluded
      setProduct(updatedProduct); // Update the state to reflect the changes
      handleProductUpdate();
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  };

  //Operação de apagar produto - redireciona para a página principal
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(token, product.id);
      showSuccessToast("Produto apagado com sucesso");
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
          //Get all the product information
          let queryParam = {
            id: id,
          };
          productData = await getProducts(queryParam, token);
          if (productData.length > 1) {
            throw new Error("Invalid product - non unique product Id");
          }
          productData = productData[INDEX_OF_PRODUCT];
          productData.date = transformArrayDatetoDate(productData.date); //passa o array de date para um objeto date javascript
          setProduct(productData);
        } catch (error) {
          showErrorToast("Error fetching product information");
          navigate("/");
        }
        try {
          //Get the userLogged and compare with the owner
          const user = await getLoggedUserInformation(token);
          if (user.admin) {
            setAdmin(true);
          }
          if (user.username === productData.seller) {
            setOwner(true);
          }
        } catch (error) {
          console.log("error in getting userlogged" + error);
          showErrorToast("Error fetching user information");
          setAdmin(false);
          setOwner(false);
        }
      }
    };
    fetchProduct();
  }, [id, token, isProductUpdated]);

  //Comprar produto
  const buyingProduct = async () => {
    setModalConfig({
      title: "Comprar Produto",
      message: `Deseja comprar ${product.name}?`,
      onConfirm: async () => {
        const response = await handleBuyingProduct(id, token);
        if (response) {
          showSuccessToast(`Produto comprado com sucesso`);
          setIsProductUpdated(true);
          setIsModalOpen(false);
        } else {
          showErrorToast("Falha na compra do produto");
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <div className="main-content">
        {/*Título da categoria do produto*/}
        <h2 id="product-category">
          Categoria: {product ? product.category : "a, b, c"}
        </h2>
        {/*Informações do produto*/}
        <div className="product-details">
          <div className="product-image-column">
            <img
              className="product-image"
              id="product-image"
              src={
                product ? product.urlImage : "../images/placeholder/item.png"
              }
              alt={product ? product.name : "item placeholder"}
            />
          </div>
          <div className="product-detail-column">
            <p id="product-name">
              <strong>Nome do Produto: </strong>
              {product ? product.name : "nome"}
            </p>
            <p id="product-description">
              <strong>Descrição: </strong>{" "}
              {product ? product.description : "descrição"}
            </p>
            <p id="product-price">
              <strong>Preço: </strong>
              {product ? product.price : "preço"} €{" "}
            </p>
            <p id="product-seller">
              <strong>Vendedor: </strong>{" "}
              {product ? product.seller : "vendedor"}
            </p>
            <p id="product-location">
              <strong>Localização: </strong>{" "}
              {product ? product.location : "localização"}
            </p>
            <p id="product-date">
              <strong>Data de Publicação:</strong>{" "}
              {product ? dateToFormattedDate(product.date) : "dd/mm/aaaa"}
            </p>
          </div>
        </div>
        <div className="productButtons">
          {/*Se for admin mostrar botões de excluir produto*/}
          {isAdmin ? (
            <input
              type="button"
              id="exclude-product-button"
              className="exclude-product-button"
              value="Apagar Produto"
              onClick={handleDeleteProduct}
            />
          ) : null}

          {/*Se for admin ou dono do produto, mostrar botões de apagar e editar produto*/}
          {(isAdmin || isOwner) && (
            <input
              type="button"
              id="edit-product"
              value="Editar informações"
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
                    ? "Recuperar produto"
                    : "Excluir produto"
                  : isOwner && !isAdmin
                  ? "Apagar Produto"
                  : ""
              }
              onClick={handleExcludeProduct}
            />
          )}
          {/*Se não for dono, não mostrar botão de comprar produto*/}
          {isOwner ? null : (
            <input
              type="button"
              id="buy-button"
              value="Comprar"
              onClick={buyingProduct}
            />
          )}
        </div>
      </div>
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
  );
};

export default Detail;
