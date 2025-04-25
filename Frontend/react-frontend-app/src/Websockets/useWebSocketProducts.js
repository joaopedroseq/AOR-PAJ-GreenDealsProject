import { useState, useEffect } from "react";
import useProductStore from "../Stores/useProductStore"; 

function useWebSocketProducts() {
  const WS_URL = "ws://localhost:8080/sequeira-proj5/websocket/products/";
  const [websocket, setWebSocket] = useState(null);


  const matchesFilters = (product) => {
    const filters = useProductStore.getState().filters;


    for (const [key, value] of Object.entries(filters)) {

      if (key === "category" && value !== null) {
        if (product[key]?.nome !== value) {  // Using optional chaining to avoid crashes
          console.log("Category mismatch! Expected:", value, "Received:", product[key].nome);
          return false;
        }
        console.log("Category matches!");
        continue;
      }
      
      if (value === null || value === undefined) {
        if (key === "state" && product[key] === "DRAFT") {
          return false; // If state is null, product is DRAFT
        }
        continue; // Skip filters that are not set
      }
      
      if (product[key] !== value) {
        return false; // If any value doesn't match, ignore product
      }
    }
    return true; // If all filters match, return true
  };
  


  // Handle incoming WebSocket product
  // Handle incoming WebSocket product
  const handleNewProduct = (product) => {
    if (matchesFilters(product)) {
      useProductStore.setState((state) => ({
        products: [...state.products, product], // Append product properly
      }));
  }};


  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "NEW":
          handleNewProduct(data.product); // Call function instead of a hook
          break;
        case "UPDATE":
          console.log("Product update:", data);
          break;
        case "PING":
          ws.send(JSON.stringify({ type: "PONG" }));
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    setWebSocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    console.log("Current Filters in WebSocket Hook:", useProductStore.getState().filters);
  }, []);
  
  return { websocket };
}

export default useWebSocketProducts;