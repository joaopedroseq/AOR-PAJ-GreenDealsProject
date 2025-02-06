w3.includeHTML(() =>  {
// Get the modal
var modal = document.getElementById("modal");

//Botão - "Sobre Nós"
var aboutBtn = document.getElementById("aboutButton");

//Botão - "Termos de Privacidade"
var privacyBtn = document.getElementById("privacyButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var aboutHeader = document.getElementById("modal-header");
var line1 = document.getElementById("phrase1");
var line2 = document.getElementById("phrase2");

//Função - "Sobre Nós"
aboutBtn.onclick = function() {
  aboutHeader.textContent="Desenvolvimento Web & Design Gráfico";
  line1.textContent="Criado e desenvolvido por João Sequeira e Vanessa Figueiredo";
  line2.textContent="Programação Avançada em Java - Acertar o Rumo 2024/25";
  modal.style.display = "block";
}

privacyBtn.onclick = function() {
  aboutHeader.textContent="Politica de Privacidade";
  line1.textContent="Preocupamo-nos em proteger a sua privacidade, garantindo o tratamento dos seus dados pessoais em conformidade com as disposições legais aplicáveis em matéria de proteção de dados.[1]\r\n"+
  "Neste sentido, aconselhamos a leitura desta Política de Privacidade e das respetivas atualizações. Em caso de modificação da Política de Privacidade, a data da última alteração, disponível no topo desta página, é também atualizada.\r\n"+
  "O responsável pelo tratamento\r\n"+
  "O responsável pela recolha e tratamento dos seus dados pessoais será a GreenDeals Company (doravante designada por “GreenDeals”), que lhe presta serviços jurídicos e que nesse âmbito decide quais os dados recolhidos, meios de tratamento e finalidades para que os quais os seus dados são utilizados.\r\n"+
  "Caso tenha alguma dúvida sobre o modo como procedemos ao tratamento dos dados pessoais que nos forneceu, deseje algum esclarecimento sobre o presente documento ou queira exercer algum dos direitos mencionados no presente documento, deverá enviar-nos um e-mail para dadospessoais@GreenDealslegal.pt ou, em alternativa, escrever-nos para:\r\n"+
  "A GreenDeals gostaria, ainda, de informar que foi designado um Responsável pela Privacidade, a qual será responsável por, entre outras funções, (i) monitorizar a conformidade do tratamento de dados com as normas aplicáveis, (ii) ser um ponto de contacto com os titulares dos dados pessoais para esclarecimento de questões relativas ao tratamento dos seus dados pela GreenDeals, (iii) cooperar com a Comissão Nacional de Proteção de Dados (doravante designada por “CNPD”), e (iv) prestar informação e aconselhamento à GreenDeals sobre as suas obrigações no âmbito da privacidade e proteção de dados.\r\n"+
  "Caso deseje entrar em contacto com a nossa Responsável pela Privacidade, deverá enviar uma comunicação por escrito para os contactos que constam desta política.\r\n"+
  "Que dados pessoais são recolhidos e tratados\r\n"+
  "Por “dados pessoais” entende-se qualquer informação, de qualquer natureza e em qualquer suporte, relativa a uma pessoa singular identificada ou identificável. É considerada identificável a pessoa que possa ser identificada direta ou indiretamente, por exemplo através do nome, do n.º de identificação, de um dado de localização, de um identificador eletrónico ou outros elementos que permitam chegar à identificação dessa pessoa singular, tais como elementos específicos da sua identidade física, fisiológica, genética ou económica.\r\n"+
  "Podemos recolher os seus dados pessoais durante a prestação dos nossos serviços, através do uso do nosso website, ao contactar ou solicitar informação sobre a GreenDeals ou enquanto resultado dos contactos que possa manter com algum dos nossos colaboradores ou clientes.\r\n"+
  "Como obtemos os dados pessoais\r\n"
  +"    Através das nossas ferramentas e aplicações informáticas, incluindo o nosso website e comunicações eletrónicas enviadas para a GreenDeals\r\n"
  +"	\r\n"
  +"Como utilizamos os seus dados pessoais\r\n"+
  "A GreenDeals recolhe e trata os seus dados pessoais de várias formas, nomeadamente através do uso do nosso website e dos nossos serviços. Utilizamos os seus dados:\r\n"
  +"    Para prestar os nossos serviços, o que pode incluir o tratamento de dados pessoais de terceiros em nome dos nossos clientes;\r\n"
  +"    Para disponibilizar informação que nos solicite;\r\n"
  +"    Na promoção dos nossos serviços, através do envio de notícias e publicações e/ou newsletters;\r\n"
  +"    Na promoção dos eventos e/ou seminários organizados ou coorganizados pelo nosso escritório;\r\n"
  +"    Para orientar e dirigir a nossa relação consigo;\r\n"
  +"    Para cumprimento de legislação fiscal e sobre branqueamento de capitais e financiamento do terrorismo, bem como para verificação de conflitos;\r\n"
  +"    Na prossecução das nossas obrigações legais, regulatórias e de gestão de risco, inclusivamente no exercício de direitos ou na defesa de processos judiciais;\r\n"
  +"    Para disponibilizar e melhorar o nosso website, inclusivamente ao auditar e monitorizar o seu uso;\r\n"
  +"    Com o propósito de recrutamento.\r\n"
  +"A GreenDeals trata e conserva os seus dados pessoais conforme as finalidades para que os mesmos são tratados ou sempre que exista uma obrigação, legal e/ou regulamentária, específica de conservação dos mesmos.\r\n"
  +"Assim, a título de exemplo, há casos em que a lei obriga ao tratamento e conservação dos dados por um período de tempo mínimo, designadamente por (i) 10 anos os dados necessários para informação à Autoridade Tributária para efeitos contabilísticos ou fiscais ou os dados relativos a escrituração mercantil; (ii) 7 anos com a finalidade de combate ao branqueamento de capitais e ao financiamento do terrorismo; (iii) 30 dias gravações de imagens, ou (iv) durante a relação de mandato, acrescido do prazo de 20 anos, para os dados tratados no âmbito da prestação dos serviços de advocacia.\r\n"
  +"Igualmente, a GreenDeals conservará os dados consoante os prazos de prescrição para a propositura de ações judiciais.\r\n"
  +"Uma vez atingido o prazo máximo de conservação, os seus dados pessoais serão anonimizados de forma irreversível (podendo os dados anonimizados ser conservados) ou serão destruídos de forma segura.\r\n"
  +"Com quem partilhamos os seus dados pessoais\r\n"
  +"Podemos partilhar os seus dados pessoais com terceiros, de acordo com as disposições contratuais e legais em vigor, incluindo:\r\n"
  +"    Autoridades governamentais e judiciais competentes, como sendo os Tribunais ou a Autoridades Tributária;\r\n"
  +"    Os nossos consultores e auditores profissionais;\r\n"
  +"    Fornecedores com os quais a GreenDeals contrata determinados serviços de suporte, tais como o tratamento de texto, traduções, cópias, revisões de documentos;\r\n"
  +"    Prestadores de serviços de IT;\r\n"
  +"    Terceiros envolvidos no decurso dos serviços que fornecemos aos clientes e com o seu consentimento prévio, tais como advogados, agentes de execução, consultores locais e outros;\r\n"
  +"Sempre que os seus dados sejam transmitidos a subcontratantes, a GreenDeals tomará as medidas contratuais necessárias para garantir que os subcontratantes respeitam e protegem os seus dados pessoais, recorrendo apenas a subcontratantes que apresentem garantias suficientes de execução de medidas técnicas e organizativas adequadas para esse efeito.\r\n"
  +"Quando necessário, ou pelas razões expostas nesta política, os dados pessoais também podem ser partilhados com autoridades reguladoras, tribunais e entidades oficiais. Embora seja improvável, podemos ser obrigados a divulgar os seus dados para cumprir exigências legais. Faremos esforços razoáveis para notificá-lo antes dessa partilha, a não ser que sejamos legalmente impedidos de o fazer.\r\n"
+"A GreenDeals NÃO VENDE, ALUGA OU DISPONIBILIZA DADOS PESSOAIS COMERCIALMENTE A TERCEIROS.\r\n"
+"Como protegemos os seus dados pessoais\r\n"
+"Utilizamos uma variedade de medidas de segurança técnicas e organizativas para ajudar a proteger os seus dados pessoais contra a destruição, a perda, a alteração, a divulgação e o acesso não autorizados, de acordo com as leis de proteção de dados aplicáveis.\r\n"
+"Para que países transferimos os seus dados pessoais\r\n"
+"Para prestarmos os nossos serviços, pode ser necessária a transferência dos seus dados pessoais para locais fora de Portugal.\r\n"
+"Logo, a GreenDeals pode ter de transferir os seus dados pessoais para um país terceiro fora do Espaço Económico Europeu (“EEE”) e que não integre a lista de países que a Comissão Europeia já considerou reunirem níveis de proteção de dados pessoais adequados. Nesses casos, a GreenDeals assegurará que as transferências de dados se realizam no estrito cumprimento das normas legais aplicáveis, designadamente o capítulo V do RGPD.\r\n"
+"Os seus direitos em relação aos seus dados pessoais\r\n"
+"Como titular dos dados tratados pela GreenDeals pode, em qualquer momento, dentro os limites legais, exercer os direitos abaixo identificados mediante envio de comunicação escrita para a GreenDeals para dadospessoais@GreenDealslegal.pt.  \r\n"
+"    Direito de Acesso - direito a obter a confirmação de quais são os seus dados pessoais que são tratados e informação sobre os mesmos, como por exemplo, quais as finalidades do tratamento, quais os prazos de conservação, entre outros;\r\n"
+"    Direito de Retificação - direito de solicitar a retificação dos seus dados pessoais que se encontrem inexatos ou solicitar que os dados pessoais incompletos sejam completados, como por exemplo a morada, o NIF, o e-mail, os contactos telefónicos, ou outros;\r\n"
+"    Direito ao Apagamento dos dados ou “direito a ser esquecido” - direito de obter o apagamento dos seus dados pessoais, desde que não se verifiquem fundamentos válidos para a sua conservação, como por exemplo os casos em que a GreenDeals tem de conservar os dados para cumprir uma obrigação legal ou porque se encontra em curso um processo judicial;\r\n"
+"    Direito à Portabilidade - direito de receber os dados que nos forneceu em formato digital de uso corrente e de leitura automática ou de solicitar a transmissão direta dos seus dados para outra entidade que passe a ser o novo responsável pelo tratamento dos seus dados pessoais, mas neste caso apenas se for tecnicamente possível;\r\n"
+"    Direito a Retirar o Consentimento - direito de retirar o seu consentimento, a qualquer momento, para um tratamento de dados pessoais, como por exemplo no caso de tratamento de dados para fins de marketing, sem comprometer a licitude do tratamento efetuado com base no consentimento previamente dado;\r\n"
+"    Direito de Oposição - direito de se opor, a qualquer momento, a um tratamento de dados, desde que não se verifiquem interesses legítimos que prevaleçam sobre os seus interesses, direitos e liberdades, como por exemplo de defesa de um direito num processo judicial; e\r\n"
+"    Direito de Limitação - direito a solicitar a limitação do tratamento dos seus dados pessoais, sob a forma de: (i) suspensão do tratamento ou (ii) limitação do âmbito do tratamento a certas categorias de dados ou finalidades de tratamento.\r\n"
+"A comunicação anteriormente referida deve conter o seu nome completo, cópia do cartão do cidadão ou outro documento oficial de identificação, ou da pessoa que o representa, de acordo com os termos legais aplicáveis, o endereço para fins de notificação e a petição em concreto.\r\n"
+"O exercício dos direitos é gratuito, exceto se se tratar de um pedido manifestamente infundado ou excessivo, caso em que poderá ser cobrada uma taxa razoável tendo em conta os custos.\r\n"
+"As informações devem ser prestadas por escrito, mas, se o solicitar, podem ser prestadas oralmente. Neste caso, a GreenDeals deve verificar a sua identidade por outros meios que não orais.\r\n"
+"A resposta aos pedidos deverá ser prestada, em regra, no prazo máximo de 30 dias, salvo se for um pedido especialmente complexo ou uma multiplicidade de pedidos.\r\n"
+"Em acréscimo aos direitos anteriormente mencionados, a GreenDeals informa que dispõe, ainda, do Direito a Reclamar, ou seja, do direito de apresentar reclamação à autoridade de controlo, a CNPD (www.cnpd.pt), caso considere que a GreenDeals não cumpriu os requisitos do RGPD ou da legislação nacional aplicável no que diz respeito aos seus dados pessoais.\r\n"
+"Para além disso, tem o direito de intentar uma ação judicial, sem prejuízo de qualquer outra via de recurso administrativo ou extrajudicial contra a GreenDeals ou subcontratante desta, caso considere ter havido violação dos seus direitos.\r\n"
+"[1] Designadamente o Regulamento (UE) 2016/679 do Parlamento Europeu e do Conselho de 27 de abril de 2016 relativo à proteção das pessoas singulares no que diz respeito ao tratamento de dados pessoais e à livre circulação desses dados e que revoga a Diretiva 95/46/CE (Regulamento Geral sobre a Proteção de Dados ou “RGPD”) e a Lei n.º 58/2019, de 8 de agosto que assegura a execução, na ordem jurídica portuguesa, do RGPD (“Lei n.º 58/2019”).";
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {

  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
})
