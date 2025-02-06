w3.includeHTML(() =>  {
 // Obtém o botão para adicionar produto
 const addButton = document.getElementById('add-product-btn');

 console.log(addButton);

  //Funções para adicionar um produto
  var modalAddProduct = document.getElementById("modal-addProduct");
  var form = document.getElementById("modal-header-addProduct");

 // Obtém o elemento <span> que fecha o modal
 var closeAddProduct = document.getElementsByClassName("close-addProduct")[0];
 
 // Adiciona o evento de submit ao formulário para guardar o produto
 var saveProductBtn = document.getElementById("save-addProduct");

 // Adiciona o evento de clique ao botão para alternar o formulário
 addButton.addEventListener('click', function(event) {
     console.log("correu");
     event.preventDefault();
     modalAddProduct.style.display = "flex";
 });

 // Quando o utilizador clicar no <span> (x), fecha o modal
 closeAddProduct.onclick = function() {
    modalAddProduct.style.display = "none";
 };  
 
 // Função para guardar o produto no local storage
 saveProductBtn.addEventListener('click', function(event) {
     event.preventDefault();
     // Obtém os valores dos campos do formulário
     const nome = document.getElementById('add-nome').value;
     const descricao = document.getElementById('add-descricao').value;  
     const preco = document.getElementById('add-preco').value;
     const categoria = document.getElementById('add-categoria').value;
     const localidade = document.getElementById('add-localidade').value;
     const imagem = document.getElementById('add-imagem').value;
     const data = new Date(); // Data atual
     const anunciante = sessionStorage.getItem('username');

     // Validações dos campos do formulário
     if(nome.trim() === ""){
         alert("O nome do produto é de preenchimento obrigatório");
     }
     else if(descricao.trim() === ""){
         alert("A descrição do produto é de preenchimento obrigatório");
     }
     else if(preco.trim() === ""){
         alert("O preço do produto é de preenchimento obrigatório");
     }
     else if(!checkIfNumeric(preco)){
         alert("Preço inserido inválido. Apenas poderá escrever dígitos e sem quaisquer símbolos");
     }
     else if(localidade.trim() === ""){
         alert("A sua morada é preenchimento obrigatório");
     }
     else if(imagem.trim() === ""){
         alert("Terá de colocar um URL válido da imagem do produto que pretende anunciar");
     }
     else {

         // Cria um objeto com os dados do produto
         const product = {
             nome,
             descricao,
             preco,
             categoria,
             anunciante,
             localidade,
             imagem,
             data
         }
         var confirm = window.confirm('Tem a certeza que pretende adicionar o produto ' + nome + '?'); 

         // Se o utilizador confirmar, guarda o produto no local storage
         if(confirm == true){
             console.log("salvar");
             let products = localStorage.getItem('products');
             if (products) {
                 // Converte a string JSON para um array
                 products = JSON.parse(products); 
             } else {
                 products = [];
             }
             products.push(product);
             // Converte o array para uma string JSON
             localStorage.setItem('products', JSON.stringify(products)); 
             form.reset();
             modalDetail.style.display = "none";
             window.location.reload();
         }
         // Se o utilizador cancelar, limpa o formulário e fecha o modal
         else {
             form.reset();
             modalDetail.style.display = "none";
         }
          
         // Exibe o produto na página
         displayProduct(product, products.length - 1);
     }
 });

 // Função para verificar se uma string é um número
 function checkIfNumeric(string) {
     return !isNaN(string) && // Usa coerção de tipo para analisar toda a string
            !isNaN(parseFloat(string)) // Garante que strings de espaços em branco falhem
 };

 function checkIfLogged(){
    const logged = sessionStorage.getItem('logged');

 }
});