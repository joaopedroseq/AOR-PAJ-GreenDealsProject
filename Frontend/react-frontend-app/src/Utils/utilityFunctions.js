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

export function transformArrayDatetoDate(arrayDate){
  const date = new Date(
    arrayDate[0],
    arrayDate[1] - 1, //ajustado pois o mês é como GregorianCalendar
    arrayDate[2],
    arrayDate[3],
    arrayDate[4],
    arrayDate[5]
  );
  return date;
}

//Function to receive a javascript date and return as a string in the format of DD/MM/YYYY
export function dateToFormattedDate(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}


/**
 * @deprecated This method is deprecated as default fetch already sorts by date.
 */
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
