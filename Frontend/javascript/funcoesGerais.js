export async function fetchRequest(endpoint, requestType, body = null) {
  const baseUrl = "http://localhost:8080/osorio-sequeira-proj3/rest";
  const url = `${baseUrl}${endpoint}`;
  const token = sessionStorage.getItem("token");
  let headers = {};
  if (sessionStorage.getItem("token")) {
    headers = {
      "Content-Type": "application/json",
      token: `${token}`,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }
  const options = {
    method: requestType,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        // Throw an error with the JSON response
        throw {
          status: response.status,
          message: data.message || response.statusText,
        };
      }
      return data;
    } else {
      // No JSON body; return an empty object or response text (optional)
      return null;
    }
  } catch (error) {
    console.error("Fetch request failed:", error);
    throw error;
  }
}

export function redirectIfNotLogged() {
  if (!sessionStorage.getItem("token")) {
    alert("Para aceder a esta página, necessita de estar autenticado.");
    window.location.href = "index.html";
  }
}

export async function checkIfAdmin() {
  if (!sessionStorage.getItem("token")) {
    return false;
  } else {
    console.log("checkIfAdmin");
    try {
      const userLogged = await fetchRequest("/user/user", "GET");
      if (userLogged.admin === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Ocorreu um erro: " + error.message);
    }
  }
}

//Função para verificar se um string é válido (não tem caracteres especiais nem espaços)
export function checkIfValid(string) {
  const pattern = /^[a-zA-Z0-9\s-_]*$/;
  return pattern.test(string);
}

