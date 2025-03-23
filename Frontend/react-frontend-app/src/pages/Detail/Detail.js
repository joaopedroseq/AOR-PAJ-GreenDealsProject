import React, { useEffect, useState } from "react";
import "./detail.css";
import { getProducts, updateProduct, deleteProduct } from "../../api/productApi";
import userStore from "../../stores/UserStore";
import { useCategoriesStore } from "../../stores/useCategoriesStore";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../Utils/ToastConfig/toastConfig";
import {
  transformArrayDatetoDate,
  dateToFormattedDate,
} from "../../Utils/UtilityFunctions";
import { getUserInformation } from "../../hooks/handleLogin";
import EditProductModal from "../../components/EditProductModal/EditProductModal";
import errorMessages from "../../Utils/constants/errorMessages";


export const Detail = () => {
  const INDEX_OF_PRODUCT = 0;
  const navigate = useNavigate();
  const token = userStore((state) => state.token);
  const id = new URLSearchParams(useLocation().search).get("id");
  const [product, setProduct] = useState(null);
  
  const [isOwner, setOwner] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  //categorieStore - talvez para apagar já que o homepage já o faz
  //no entanto, o modal tem carregado sem as categorias
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  
    useEffect(() => {
      fetchCategories();
    }, [fetchCategories]);

  // Edit product modal - toggle its visibility
    const [isEditProductModalVisible, setIsEditProductModalVisible] = useState(false);
  
    const toggleEditProductModal = () => {
      setIsEditProductModalVisible(!isEditProductModalVisible);
    };

    //A way to update the detail page information if the product is edited
    const [isProductUpdated, setIsProductUpdated] = useState(false);

    const handleProductUpdate = () => {
      setIsProductUpdated(true);
    }

    const handleExcludeProduct = async () => {
      const exclusion = {
        excluded: !product.excluded
      }
      try {
            await updateProduct(exclusion, token, product.id);
            if (!product.excluded) {
              showSuccessToast("Produto excluído com sucesso");
            } else {
              showSuccessToast("Produto recuperado com sucesso");
            }
            const updatedProduct = { ...product, excluded: exclusion.excluded }; //... é spread operator: adiciona ou suplanta o excluded
            setProduct(updatedProduct); // Update the state to reflect the changes
            handleProductUpdate();
          } catch (error) {
            const toastMessage = errorMessages[error.message] || errorMessages.unexpected_error;
            showErrorToast(toastMessage);
          }
        };
      

    const handleDeleteProduct = async () => {
      try {
            await deleteProduct(token, product.id);
            showSuccessToast("Produto apagado com sucesso");
            navigate("/");
          } catch (error) {
            const toastMessage = errorMessages[error.message] || errorMessages.unexpected_error;
            showErrorToast(toastMessage);
          }
        };
      

  // Fetch product information when the component loads
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        let productData;
        try {
          //Get all the product information
          let queryParam = "id=" + id;
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
          const user = await getUserInformation(token);
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

  return (
    <div className="container">
      <div className="main-content">
        {/*Título da categoria do produto*/}
        <h2 id="product-category">
          Categoria: {product ? product.category : "a, b, c"}
        </h2>
        {/*Informações do produto*/}
        <div className="product-details">
          <img
            className="table-img"
            id="product-image"
            src={product ? product.urlImage : "../images/placeholder/item.png"}
            alt={product ? product.name : "item placeholde"}
          />
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
            <strong>Vendedor: </strong> {product ? product.seller : "vendedor"}
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
        {/*Se for admin mostrar botões de excluir produto*/}
        {isAdmin ? (
          <input
            type="button"
            id="exclude-product-button"
            className="exclude-product-button"
            value="Excluir permanentemente produto"
            onClick={handleDeleteProduct}
          />
        ) : null}

        {/*Se for admin ou dono do produto, mostrar botões de apagar e editar produto*/}
        {isAdmin || isOwner ? (
          <div id="edit-delete-buttons">
            <input type="button"
            id="edit-product"
            value="Editar informações"
            onClick={toggleEditProductModal}/>
            <input type="button"
            id="delete-product"
            value={isAdmin && product.excluded ? "Recuperar produto" : "Apagar produto"}
            onClick={handleExcludeProduct}/>
          </div>
        ) : null}

        {/*Se não for dono, não mostrar botão de comprar produto*/}
        {isOwner ? null : (
          <input
            type="button"
            id="buy-button"
            value="Comprar"
          />
        )}

        {/*Butão de contacto*/}
        <button id="contact-btn">Contatar o Anunciante</button>
        <div id="contact-form" style={{ display: "none" }}>
          <textarea
            id="message"
            placeholder="Escreva aqui a sua mensagem..."
          ></textarea>
          <button id="send-btn">Enviar</button>
        </div>
      </div>
      <EditProductModal
        product={product}
        toggleEditProductModal={toggleEditProductModal}
        isEditProductModalVisible={isEditProductModalVisible}
        updatedProduct={handleProductUpdate}
      />
    </div>
  );
};

export default Detail;
