import React, { useEffect, useState }from "react"
import './detail.css';
import { getProducts } from "../../api/productApi";
import userStore from "../../stores/userStore";
import { useLocation } from "react-router-dom";
import { showErrorToast } from "../../Utils/ToastConfig/toastConfig";
import { transformArrayDatetoDate, dateToFormattedDate } from "../../Utils/UtilityFunctions";


export const Detail = () => {
    const INDEX_OF_PRODUCT = 0;
    const token = userStore((state) => state.token);
    const id = new URLSearchParams(useLocation().search).get("id");
    const [product, setProduct] = useState(null);
    const [owner, setOwner] = useState(false);
    
    // Fetch product information when the component loads
    useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const queryParam = 'id='+id;
        try {
        //Get all the product information
          let productData = await getProducts(queryParam, token);
          if(productData.length > 1){
            throw new Error('Invalid product - non unique product Id');
          }
          productData=productData[INDEX_OF_PRODUCT];
          productData.date = transformArrayDatetoDate(productData.date); //passa o array de date para um objeto date javascript
          setProduct(productData);
        //Get the userLogged and compare with the owner
        } catch (error) {
          showErrorToast("Error fetching product information");
        }
      }
    };
    fetchProduct();
    }, [id]);


    return (
    <div className="container">
        <div className="main-content">
            {/*Título da categoria do produto*/}
            <h2 id="product-category">Categoria: {product ? product.category : 'a, b, c'}</h2>
            {/*Informações do produto*/}
            <div className="product-details">
                <img className="table-img" id="product-image" src={product ? product.urlImage :'../images/placeholder/item.png'} alt={product ? product.name :"item placeholde"} />
                <p id="product-name"><strong>Nome do Produto: </strong>{product ? product.name :'nome'}</p>
                <p id="product-description"><strong>Descrição: </strong> {product ? product.description :'descrição'}</p>
                <p id="product-price"><strong>Preço: </strong>{product ? product.price :'preço'} € </p>
                <p id="product-seller"><strong>Vendedor: </strong> {product ? product.seller :'vendedor'}</p>
                <p id="product-location"><strong>Localização: </strong> {product ? product.location :'localização'}</p>
                <p id="product-date"><strong>Data de Publicação:</strong> {product ? dateToFormattedDate(product.date) : 'dd/mm/aaaa'}</p>
            </div>

            <button id="exclude-product-button" className="exclude-product-button" style={{display: 'none'}}>Eliminar permanentemente produto</button>
            <div id="edit-delete-buttons" style={{display: 'none'}}>
                <input type="button" id="edit-product" value="Editar informações"/>
                <input type="button" id="delete-product" value="Apagar produto"/>
            </div> 
            <button id="buy-button" style={{display: 'none'}}>Comprar</button>
            {/*Butão de contacto*/}
            <button id="contact-btn">Contatar o Anunciante</button>
                <div id="contact-form" style={{display: 'none'}}>
                    <textarea id="message" placeholder="Escreva aqui a sua mensagem..."></textarea>
                    <button id="send-btn">Enviar</button>
                </div>
          

            {/*Janela modal para alterar informações de um produto*/}
            <div id="modal-detail" className="modal-detail">
                {/*Conteúdo da janela modal*/}
                <div className="modal-content-detail">
                    <div className="modal-header-detail" id="modal-header-detail">
                        <p className="modal-header-detail-title">Alterar informações de produto</p>
                        <p className="close-detail" id="close-detail">&times;</p>
                    </div>
                    <div className="modal-body-detail">
                        {/*Formulário de edição de informações de um produto*/}
                        <div className="edit-product-form" id="edit-product-form">
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label htmlFor="edit-nome">Nome do Produto:</label>
                                <input type="text" id="edit-nome" name="edit-nome" maxLength="30"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label htmlFor="edit-descricao">Descrição:</label>
                                <input type="text" id="edit-descricao" name="edit-descricao" maxLength="30"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label htmlFor="edit-preco">Preço do Produto:</label>
                                <input type="text" id="edit-preco" name="edit-preco" maxLength="6"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label htmlFor="edit-categoria">Categoria do Produto:</label>
                                <select id="edit-categoria" name="edit-categoria">
                                    <option value="vestuario">Vestuário</option>
                                    <option value="calcado">Calçado</option>
                                    <option value="brinquedos">Brinquedos</option>
                                    <option value="viagens">Viagens</option>
                                    <option value="papelaria">Papelaria</option>
                                </select>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label htmlFor="edit-localidade">Localização:</label>
                                <input type="text" id="edit-localidade" name="edit-localidade" maxLength="30"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label htmlFor="edit-imagem">url de imagem:</label>
                                <input type="text" id="edit-imagem" name="edit-imagem"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label htmlFor="edit-categoria">Estado do artigo:</label>
                                <select id="edit-state" name="edit-state">
                                    <option value="RASCUNHO">Rascunho</option>
                                    <option value="DISPONIVEL">Disponível</option>
                                    <option value="RESERVADO">Reservado</option>
                                    <option value="COMPRADO">Comprado</option>
                                </select>
                            </div>
                            <input type="button" className="save-product" id="save-product" value="Guardar Alterações"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
};

export default Detail;