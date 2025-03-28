import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryCard from "./CategoryCard";

describe("CategoryCard component", () => {
  const mockCategory = {
    name: "Electronics",
    products: ["Laptop", "Smartphone"],
  };
  const mockOnDelete = jest.fn();

  test("renders the category name and number of products", () => {
    render(<CategoryCard category={mockCategory} onDelete={mockOnDelete} />);

    // Check if the category name is displayed
    expect(screen.getByText("Electronics")).toBeInTheDocument();

    // Check if the number of products is displayed
    expect(screen.getByText("Nº produtos: 2")).toBeInTheDocument();
  });

  test("calls onDelete when the remove button is clicked", () => {
    render(<CategoryCard category={mockCategory} onDelete={mockOnDelete} />);

    const removeButton = screen.getByAltText("exclude category");
    fireEvent.click(removeButton);

    // Assert that the onDelete function is called
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  test("handles categories with no products gracefully", () => {
    const emptyCategory = { name: "Empty Category", products: null };

    render(<CategoryCard category={emptyCategory} onDelete={mockOnDelete} />);

    // Check if the number of products is displayed as 0
    expect(screen.getByText("Nº produtos: 0")).toBeInTheDocument();
  });
});