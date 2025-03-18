import React from "react"


export const Detail = () => {

    return (
    <div classNameName="container">
        <div className="main-content">
            {/*Título da categoria do produto*/}
            <h2 id="product-category">Categoria: a, b, c</h2>
            {/*Informações do produto*/}
            <div className="product-details">
                <img className="table-img" id="product-image" src='../images/placeholder/item.png' alt="Isto é um item" />
                <p id="product-name"><strong>Nome do Produto:</strong> Nome Xx Yy</p>
                <p id="product-description"><strong>Descrição:</strong> Descrição do Produto</p>
                <p id="product-price"><strong>Preço:</strong> XX.xx€</p>
                <p id="product-seller"><strong>Nome do Anunciante:</strong> Nome Xx Yy</p>
                <p id="product-location"><strong>Localização:</strong> Rua A, n.º X, Cidade, XXXX-XXX Cidade</p>
                <p id="product-date"><strong>Data de Publicação:</strong> dd/mm/aaaa</p>
            </div>

            <button id="exclude-product-button" className="exclude-product-button" style="display: none;">Eliminar permanentemente produto</button>
            <div id="edit-delete-buttons" style="display: none">
                <input type="button" id="edit-product" value="Editar informações"/>
                <input type="button" id="delete-product" value="Apagar produto"/>
            </div> 
            <button id="buy-button" style="display: none;">Comprar</button>
            {/*Butão de contacto*/}
            <button id="contact-btn">Contatar o Anunciante</button>
                <div id="contact-form" style="display: none;">
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
                                <label for="edit-nome">Nome do Produto:</label>
                                <input type="text" id="edit-nome" name="edit-nome" maxlength="30"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label for="edit-descricao">Descrição:</label>
                                <input type="text" id="edit-descricao" name="edit-descricao" maxlength="30"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label for="edit-preco">Preço do Produto:</label>
                                <input type="text" id="edit-preco" name="edit-preco" maxlength="6"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label for="edit-categoria">Categoria do Produto:</label>
                                <select id="edit-categoria" name="edit-categoria">
                                    <option value="vestuario">Vestuário</option>
                                    <option value="calcado">Calçado</option>
                                    <option value="brinquedos">Brinquedos</option>
                                    <option value="viagens">Viagens</option>
                                    <option value="papelaria">Papelaria</option>
                                </select>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label for="edit-localidade">Localização:</label>
                                <input type="text" id="edit-localidade" name="edit-localidade" maxlength="30"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label for="edit-imagem">url de imagem:</label>
                                <input type="text" id="edit-imagem" name="edit-imagem"/>
                            </div>
                            <div className="edit-product-form-field" id="edit-product-form-field">
                                <label for="edit-categoria">Estado do artigo:</label>
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