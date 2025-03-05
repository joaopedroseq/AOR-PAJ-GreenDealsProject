
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
        throw { status: response.status, message: data.message || response.statusText };
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
