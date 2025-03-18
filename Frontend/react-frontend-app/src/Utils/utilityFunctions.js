export function checkIfValidName(string) {
  const pattern = /^[\p{L}]*$/u;
  return pattern.test(string);
}

export function checkIfValidUsername(string) {
  const pattern = /^[a-zA-Z0-9-_]*$/;
  return pattern.test(string);
}

export function checkIfValidPassword(string) {
  const pattern = /^[a-zA-Z0-9-_+*~^]*$/;
  return pattern.test(string);
}

// Função para verificar se uma string é um número
export function checkIfNumeric(string) {
  return (
    !isNaN(string) && // Usa coerção de tipo para analisar toda a string
    !isNaN(parseFloat(string))
  ); // Garante que strings de espaços em branco falhem
}

export function sortProductsByDate(products) {
  products.sort((a, b) => {
    const dateProductA = new Date(
      a.date[0],
      a.date[1] - 1, // Adjust month to be 0-indexed
      a.date[2],
      a.date[3],
      a.date[4],
      a.date[5]
    );
    const dateProductB = new Date(
      b.date[0],
      b.date[1] - 1,
      b.date[2],
      b.date[3],
      b.date[4],
      b.date[5]
    );

    return dateProductA - dateProductB;
  });
  return products;
}
