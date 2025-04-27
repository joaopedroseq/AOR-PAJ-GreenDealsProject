import { useState, useEffect } from "react";
import useProductStore from "../Stores/useProductStore";
import useStatsStore from "../Stores/useStatsStore";

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
  


  const handleProduct = (product) => {
    useProductStore.setState((state) => {
      if (!matchesFilters(product)) {
        console.log(`Product ${product.id} does NOT match filters, removing it.`);
        return { products: state.products.filter((p) => p.id !== product.id) };
      }
  
      // Check if the product already exists
      const exists = state.products.some((p) => p.id === product.id);
  
      // If exists, replace it; if not, add it
      const updatedProducts = exists
        ? state.products.map((p) => {
            if (p.id === product.id) {
              return product;
            }
            return p;
          })
        : [...state.products, product];
      console.log("Updated products list:", updatedProducts); // Log final updated state
      return { products: updatedProducts };
    });
  };

  const handleUpdateStats = (product) => {
    console.log(product);
    let productState = product.state;
    useStatsStore.setState((state) => ({
      productStats: {
        ...state.productStats, // Preserve existing stats
        totalProducts: state.productStats.totalProducts + 1,
        productsByState: {
          ...state.productStats.productsByState, // Keep existing states
          [productState]: (state.productStats.productsByState[productState] || 0) + 1, // Increment count safely
        },
        productsByCategory: state.productStats.productsByCategory.map((cat) =>
          cat.nome === product.category.nome
            ? { ...cat, productCount: cat.productCount + 1 } // Increment productCount
            : cat
        ),
        topLocations: {
          ...state.productStats.topLocations, // Keep existing states
          [product.location]: (state.productStats.topLocations[product.location] || 0) + 1, // Increment count safely
        },
      },
    }));
  };



  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "NEW":
          handleProduct(data.product); 
          handleUpdateStats(data.product)
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