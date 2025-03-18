import { useState, useEffect } from 'react';
import { create } from "zustand";
import { fetchCategories } from "../api/categoryApi";

/*
export const useCategoriesStore = () => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const getAllCategories = async () => {
    try {
      const allCategories = await fetchCategories();
      setCategories({ categories: allCategories });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },
  [categories];
};

export default useCategoriesStore;
*/