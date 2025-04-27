import axios from "axios";

const API_BASE_URL = "http://localhost:8080/sequeira-proj5/rest/config";

export const getLatestConfiguration = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/latest-configuration`, {
      headers: { "Accept": "application/json" } 
    });
    return response.data.authenticationExpirationTime;

  } catch (error) {
    console.error("Failed to fetch latest configuration:", error);
    throw new Error("errorFetchingConfiguration");
  }
};