w3.includeHTML(() =>  {

  //Obter o índice do produto a ser exibido
  const productIndex = new URLSearchParams(window.location.search).get('index'); 
  let products = localStorage.getItem('products');
  products = JSON.parse(products);

  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', toggleAside);
  getProductInformation(productIndex);

  async function getProductInformation(productIndex){
    const getProductInformationUrl = 'http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/products/'+productIndex;
    await fetch(getProductInformationUrl, {
      method: 'GET',
      headers: {'Content-Type': 'application/json',}
    })
    .then(response => {
      console.log('Status da resposta:', response.status);
      return response.text().then(text => ({ status: response.status, text: text }));
    })
    .then(product => {
      if(product){
      console.log('Resposta JSON:', product);
      console.log(JSON.parse(product.text));
      product=JSON.parse(product.text);
        // Pega a data original do produto
      const dataCompleta = new Date(product.date);
      console.log("teste");
      console.log(product.name);
  
      // Formatar a data no formato 'dd/mm/aaaa'
      /*padStart utilizado para preencher uma string até que ela tenha um comprimento
      especificado, O comprimento final da string depois que os caracteres forem adicionados*/
    
      const dia = dataCompleta.getDate().toString().padStart(2, '0'); // Adiciona o zero à esquerda se necessário
      const mes = (dataCompleta.getMonth() + 1).toString().padStart(2, '0'); // Meses começam do 0, então soma-se 1
      const ano = dataCompleta.getFullYear(); //p
    
      // Formatar a hora no formato 'hh:mm'
      const horas = dataCompleta.getHours().toString().padStart(2, '0');
      const minutos = dataCompleta.getMinutes().toString().padStart(2, '0');
    
      // Combinar data e hora
      const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    
      // Atualizar os dados do produto na página
      document.getElementById('product-name').innerHTML = `<strong>Nome do Produto:</strong> ${product.name}`;
      document.getElementById('product-description').innerHTML = `<strong>Descrição:</strong> ${product.description}`;
      document.getElementById('product-price').innerHTML = `<strong>Preço:</strong> €${product.price}`;
      document.getElementById('product-category').innerHTML = `<strong>Categoria:</strong> ${product.category}`;
      document.getElementById('product-seller').innerHTML = `<strong>Nome do Anunciante:</strong> ${product.seller}`;
      document.getElementById('product-location').innerHTML = `<strong>Localização:</strong> ${product.location}`;
      document.getElementById('product-image').setAttribute('src', product.urlImage);
      document.getElementById('product-date').innerHTML = `<strong>Data de Publicação:</strong> ${dataFormatada}`;
      } 
      else{
      console.log("Produto vazio")
        }  
      })
    .catch(error => {
      console.error('Erro:', error);
      alert('Ocorreu um erro: ' + error.message);
    });
  }
})

 


  // Verificar se o utilizador logado é o dono do produto antes de mostrar os botões
  document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('logged') === 'true') {
        const storedUsername = sessionStorage.getItem('username')?.trim().toLowerCase();
        const productId = new URLSearchParams(window.location.search).get('index');

        if (productId) {
            fetchProductDetails(productId, storedUsername);
        }
    }
});

function fetchProductDetails(productId, storedUsername) {
    fetch(`http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Produto não encontrado');
            }
            return response.json();
        })
        .then(product => {
            if (product && storedUsername === product.seller.trim().toLowerCase()) {
                const editDeleteButtons = document.getElementById('edit-delete-buttons');
                editDeleteButtons.style.display = "inline-block";

                // Adicionar event listeners para os botões
                document.getElementById('delete-product').addEventListener('click', () => deleteProduct(productId));
                document.getElementById('edit-product').addEventListener('click', () => showEditForm(product));
            }
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do produto:', error);
        });
}

  // Função para excluir um produto
  function deleteProduct(){
    let productIndex = new URLSearchParams(window.location.search).get('index');
    productIndex = parseInt(productIndex);
    let products = localStorage.getItem('products');
    products = JSON.parse(products);
    
    var confirm = window.confirm('Tem a certeza que pretende eliminar este produto?');
    if(confirm == true){
        products.splice(productIndex, 1);
        localStorage.setItem('products', JSON.stringify(products));
        history.back();
    }
    else {
    }
  }


    // Exibir o formulário de edição ao clicar no botão "Editar informações"
    function showEditForm(product) {
      const form = document.getElementById('edit-product-form');
      form.style.display = 'block';
      
      // Preencher o formulário com os dados atuais do produto
      document.getElementById('edit-nome').value = product.name;
      document.getElementById('edit-descricao').value = product.description;
      document.getElementById('edit-preco').value = product.price;
      document.getElementById('edit-categoria').value = product.category;
      document.getElementById('edit-localidade').value = product.location;
      document.getElementById('edit-imagem').value = product.urlImage;
  
      // Adicionar event listener para o botão de salvar
      document.getElementById('save-product').addEventListener('click', () => saveEditedProduct(product.id));
  }
  
  function saveProduct(productId) {
      const editedProduct = {
          name: document.getElementById('edit-nome').value,
          description: document.getElementById('edit-descricao').value,
          price: parseFloat(document.getElementById('edit-preco').value),
          category: document.getElementById('edit-categoria').value,
          location: document.getElementById('edit-localidade').value,
          urlImage: document.getElementById('edit-imagem').value
      };
  
      fetch(`http://localhost:8080/berta-sequeira-miguel-proj2/rest/user/products/${productId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'password': sessionStorage.getItem('password')
          },
          body: JSON.stringify(editedProduct)
      })
      .then(response => {
          if (response.ok) {
              alert('Produto atualizado com sucesso');
              window.location.reload(); // Recarregar a página para mostrar as alterações
          } else {
              throw new Error('Falha ao atualizar o produto');
          }
      })
      .catch(error => {
          console.error('Erro:', error);
          alert('Erro ao atualizar o produto');
      });
  }
  

// Função para alternar a exibição do formulário de contato
function toggleContactForm() {
  const contactForm = document.getElementById('contact-form');
  // Se o formulário estiver oculto ou não existir, exibi-lo
  if (contactForm.style.display === 'none' || contactForm.style.display === '') {
    contactForm.style.display = 'inline-block';
  } else {
    contactForm.style.display = 'none';
  }
}

// Função para enviar mensagem
function sendMessage() {
  const message = document.getElementById('message').value;
  if (message.trim() === '') {
    // Se a mensagem estiver vazia, exibir um alerta
    alert('Por favor, escreva uma mensagem antes de enviar.');
  } else {
    // Se a mensagem não estiver vazia, exibir um alerta com a mensagem
    alert('Mensagem enviada: ' + message);
    document.getElementById('message').value = '';
    document.getElementById('contact-form').style.display = 'none';
  }
}


//Funções para edição do produto
  // Get the modal´
  var modalDetail = document.getElementById("modal-detail");
  

  //Botão - "Sobre Nós"
  var editBtn = document.getElementById("edit-product");
  
  // Get the <span> element that closes the modal
  var closeDetail = document.getElementsByClassName("close-detail")[0];


  //Função - "Editar produto"
  editBtn.onclick = function() {
      modalDetail.style.display = "flex";

      // Preencher o formulário de edição com os dados atuais do produto
      document.getElementById('edit-nome').value = product.nome;
      document.getElementById('edit-descricao').value = product.descricao;
      document.getElementById('edit-preco').value = product.preco;
      document.getElementById('edit-categoria').value = product.categoria;
      document.getElementById('edit-anunciante').value = product.anunciante;
      document.getElementById('edit-localidade').value = product.localidade;
      document.getElementById('edit-imagem').value = product.imagem;
    }

    // Quando o utilizador clica no <span> (x), fecha o modal
    closeDetail.onclick = function() {
      console.log("correu este");
      modalDetail.style.display = "none";
    };  
    
    //ASIDE
  function toggleAside() {
    const asideMenu = document.getElementById("aside-menu");
    if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
      asideMenu.style.display = 'block';
    } else {
      asideMenu.style.display = 'none';
    }
  }

  