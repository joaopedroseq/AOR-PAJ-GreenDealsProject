import { useState, useEffect } from "react";
import useProductStore from "../Stores/useProductStore"; 

function useWebSocketProducts() {
  const WS_URL = "ws://localhost:8080/sequeira-proj5/websocket/products/";
  const [websocket, setWebSocket] = useState(null);


  const matchesFilters = (product) => {
    const filters = useProductStore.getState().filters;
    for (const [key, value] of Object.entries(filters)) {
      console.log(key + value);
      if (key === "category" && value !== null) {
        if (product[key]?.nome !== value) {  // Using optional chaining to avoid crashes
          return false;
        }
        continue;
      }
  
      if (value === null || value === undefined) {
        console.log("comparing null")
        if (key === "state" && product[key] === "DRAFT") {
          return false; // If state is null, product is DRAFT
        }
        if(key === "excluded") {
          console.log("comparing exclusion");
          return false; //if the excluded is null, product exclusion must be false
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
  const handleProduct = (product) => {
    console.log("Received product update:", product); // Log incoming product
  
    useProductStore.setState((state) => {
      console.log("Current products in store:", state.products); // Log current store state
  
      // If the product does not match filters, remove it
      if (!matchesFilters(product)) {
        console.log(`Product ${product.id} does NOT match filters, removing it.`);
        return { products: state.products.filter((p) => p.id !== product.id) };
      }
  
      // Check if the product already exists
      const exists = state.products.some((p) => p.id === product.id);
      console.log(`Does product ${product.id} already exist in store?`, exists);
  
      // If exists, replace it; if not, add it
      const updatedProducts = exists
        ? state.products.map((p) => {
            if (p.id === product.id) {
              console.log(`Updating product ${product.id} in store.`);
              return product;
            }
            return p;
          })
        : [...state.products, product];
  
      console.log("Updated products list:", updatedProducts); // Log final updated state
      return { products: updatedProducts };
    });
  };

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "NEW":
          handleProduct(data.product); // Call function instead of a hook
          break;
        case "UPDATE":
          handleProduct(data.product);
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