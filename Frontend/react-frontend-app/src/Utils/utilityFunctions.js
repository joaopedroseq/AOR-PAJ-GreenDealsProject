export function checkIfValid(string) {
  const pattern = /^[a-zA-Z0-9\s-_]*$/;
  return pattern.test(string);
};

// Função para verificar se uma string é um número
export function checkIfNumeric(string) {
    return (
      !isNaN(string) && // Usa coerção de tipo para analisar toda a string
      !isNaN(parseFloat(string))
    ); // Garante que strings de espaços em branco falhem
  }
