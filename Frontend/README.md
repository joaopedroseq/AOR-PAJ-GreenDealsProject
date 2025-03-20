#TO DO
## UI:
- animação para transição entre páginas
- implementar loading em todos os fetchs
- acertar o tamanho dos produtos na página de detail

## Frontend:
- descobrir o porquê de ele chamar o header 2x no carregamento da App (deverá ter a ver com o useEffect de buscar categories e buscar informações de utilizador)
- pensar em implementar uma forma de não fazer fetch de todos os produtos sempre que o utilizador vai para homepage;
- implementar interceptors
- comentar todo o frontend - decidir se ingles (parece que veio do copilot) ou se portugues

## Backend:
- alterar método de fazer update a um produto de POST para PACH de forma a que o update para produto disponível/
não altere a data de edição/
- refazer os endpoints de acordo com as boas práticas/
- implementar paginação de produtos/
- tratar dos bad requests/
- implementar uma forma de apagar todos os tokens no fecho do servidor;