import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useProductStore from "../Stores/useProductStore";

const RouteListener = () => {
  const location = useLocation();
  const clearFilters = useProductStore((state) => state.clearFilters);

  useEffect(() => {
    window.scrollTo(0, 0);  //fazer scroll para o topo em cada mudança de página
    if (location.pathname === "/") {
      clearFilters();
    }
  }, [location.pathname, clearFilters]);

  return null;
};

export default RouteListener;