import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { showErrorToast } from "../../Utils/ToastConfig/toastConfig";

jest.mock("../../Utils/ToastConfig/toastConfig", () => ({
  showErrorToast: jest.fn(),
}));

describe("DeleteCategoryModal", () => {
  const sampleCategory = {
    name: "Test Category",
    products: [{ id: 1 }, { id: 2 }],
  };

  test("renders the modal when isOpen is true", () => {
    const { getByText } = render(
      <DeleteCategoryModal
        Category={sampleCategory}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText("Apagar categoria")).toBeInTheDocument();
    expect(screen.getByText("Deseja apagar a categoria Test Category?")).toBeInTheDocument();
  });

  test("does not render the modal when isOpen is false", () => {
    const { queryByText } = render(
      <DeleteCategoryModal
        Category={sampleCategory}
        isOpen={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.queryByText("Apagar categoria")).not.toBeInTheDocument();
  });

  test("calls onClose when the Cancelar button is clicked", () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <DeleteCategoryModal
        Category={sampleCategory}
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("calls onConfirm when the Confirmo button is clicked", async () => {
    const onConfirmMock = jest.fn().mockResolvedValue();
    const { getByText } = render(
      <DeleteCategoryModal
        Category={sampleCategory}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.click(screen.getByText("Confirmo"));

    await waitFor(() => {
      expect(onConfirmMock).toHaveBeenCalled();
    });
  });

  test("shows an error toast if onConfirm throws an error", async () => {
    const onConfirmMock = jest.fn().mockRejectedValue(new Error("Failed to confirm"));
    const { getByText } = render(
      <DeleteCategoryModal
        Category={sampleCategory}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.click(screen.getByText("Confirmo"));

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith("Algo correu mal");
    });
  });

  test("does not show product warning if category has no products", () => {
    const emptyCategory = { name: "Empty Category", products: [] };
    const { queryByText } = render(
      <DeleteCategoryModal
        Category={emptyCategory}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(
        screen.queryByText("Esta categoria tem 2 produtos que ficarão sem qualquer categoria - empty.")
    ).not.toBeInTheDocument();
  });
});