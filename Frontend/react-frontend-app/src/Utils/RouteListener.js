import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useProductStore from "../stores/useProductStore";

const RouteListener = () => {
  const location = useLocation();
  const clearFilters = useProductStore((state) => state.clearFilters);

  useEffect(() => {
    if (location.pathname === "/") {
      clearFilters();
    }
  }, [location.pathname, clearFilters]);

  return null;
};

export default RouteListener;