export function checkIfValidName(string) {
  const pattern = /^[\p{L}]*$/u
  return pattern.test(string);
};

export function checkIfValidUsername(string) {
  const pattern = /^[a-zA-Z0-9-_]*$/;
  return pattern.test(string);
};

export function checkIfValidPassword(string) {
  const pattern = /^[a-zA-Z0-9-_+*~^]*$/;
  return pattern.test(string);
};

// Função para verificar se uma string é um número
export function checkIfNumeric(string) {
    return (
      !isNaN(string) && // Usa coerção de tipo para analisar toda a string
      !isNaN(parseFloat(string))
    ); // Garante que strings de espaços em branco falhem
  }
