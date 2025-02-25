

 
  
  

  

  

  

  



 

 

 
 





    

 




// Função para verificar se uma string é um número
function checkIfNumeric(string) {
  return !isNaN(string) && // Usa coerção de tipo para analisar toda a string
         !isNaN(parseFloat(string)) // Garante que strings de espaços em branco falhem
};

function addDetailsUserInSessionStorage(username,password){
  sessionStorage.setItem('logged', 'true');
  sessionStorage.setItem('username', username);
  sessionStorage.setItem('password', password);
}

 // Função para alternar a exibição do aside
 function toggleAside() {
    const asideMenu = document.getElementById("aside-menu");
    const asideGestaoPessoal = document.getElementById("aside-menu-gestao-pessoal");
    // Se o aside estiver oculto ou não visível, exibe-o
    if(asideMenu !== null){
        console.log("aside normal");
        if (asideMenu.style.display === 'none' || asideMenu.style.display === '') {
            asideMenu.style.display = 'block';
        } else {
            // Se o aside estiver visível, oculta-o
            asideMenu.style.display = 'none';
        }
    }
    if(asideGestaoPessoal !== null){
        console.log("aside gestão pessoal");
        if (asideGestaoPessoal.style.display === 'none' || asideGestaoPessoal.style.display === '') {
            asideGestaoPessoal.style.display = 'block';
        } else {
            // Se o aside estiver visível, oculta-o
            asideGestaoPessoal.style.display = 'none';
        }
    }
}


