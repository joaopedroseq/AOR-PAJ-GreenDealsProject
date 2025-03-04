

export const baseUrl = "http://localhost:8080/osorio-sequeira-proj3/rest";

export async function fetchRequest(endpoint, requestType, body = null) {
    const url = `${baseUrl}${endpoint}`;
    const token = sessionStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
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

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            // No JSON body; return an empty object or response text (optional)
            return null; 
        }
    } catch (error) {
        console.error('Fetch request failed:', error);
        throw error;
    }
}


