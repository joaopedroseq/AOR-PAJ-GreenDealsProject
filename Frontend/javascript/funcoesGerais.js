

export const baseUrl = "http://localhost:8080/osorio-sequeira-proj3/rest";

export async function fetchRequest(endpoint, requestType, body = null) {
    const url = `${baseUrl}${endpoint}`;
    const token = sessionStorage.getItem("token");
    const headers = {
        "Content-Type" : "application/json",
        "token": `${token}`
    };

    const options = {
        method: requestType,
        headers: headers,
        body: body ? JSON.stringify(body) : null
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch request failed:', error);
        throw error;
    }
}