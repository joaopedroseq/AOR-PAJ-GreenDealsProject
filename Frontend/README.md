#TO DO
## UI:
- animação para transição entre páginas
- implementar loading em todos os fetchs
- implementar breadcrumbs;

## Frontend:
IMPORTANTE:
- implementar mensagem com token de ativação com tempo para ativar conta;
- internacionalização - com categorias;
- internacionalização - alterar formulário para adicionar categorias;
- Websockets;
- session timeout: implementar da seguinte forma, assim que houver um pedido ao backend com authentication token, e este devolver expirado - então o frontend faz logout. Pensar numa forma de avisar o utilizador que este tem X minutos até o token expirar e perguntar se pretende renovar o token...
- compartimentalizar componentes e funções - handles, renders, etc para tudo!!!Muito importante;
- nos erros implementar loop em vez de conjunt de if's;
- implementar em condições [ condição && ...]


Features:
- descobrir o porquê de ele chamar o header 2x no carregamento da App (deverá ter a ver com o useEffect de buscar categories e buscar informações de utilizador)
- implementar interceptors
- mudar os processos de cada componente para handles
- implementar recuperar (contrário de excluir) utilizador;


## Backend:
IMPORTANTE:
- websockets
- paginação de produtos;
- implementar timer para apagar utilizadores expirados;
- ver uma forma de haver apenas uma autenticação para vários websockets
- mudar query the if exists para COUNT em vez de select
- implementar indexação;
- implementar refresh the autenticação;

Features:
- implementar recuperar (contrário de exluir) utilizador
- refazer os endpoints de acordo com as boas práticas/
- implementar paginação de produtos/
- tratar dos bad requests/
- implementar uma forma de apagar todos os tokens no fecho do servidor;
- implementar QueryApi para utilizadores;