import React from "react";
import { render, fireEvent,screen } from "@testing-library/react";
import ConfirmationModal from "./ConfirmationModal";

describe("ConfirmationModal", () => {
  it("renders the modal when isOpen is true", () => {
    const { getByText } = render(
      <ConfirmationModal
        title="Test Title"
        message="Test Message"
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  it("does not render the modal when isOpen is false", () => {
    const { queryByText } = render(
      <ConfirmationModal
        title="Test Title"
        message="Test Message"
        isOpen={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();
  });

  it("calls onClose when the Cancelar button is clicked", () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <ConfirmationModal
        title="Test Title"
        message="Test Message"
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("calls onConfirm when the Confirmar button is clicked", async () => {
    const onConfirmMock = jest.fn();
    const { getByText } = render(
      <ConfirmationModal
        title="Test Title"
        message="Test Message"
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.click(screen.getByText("Confirmar"));
    expect(onConfirmMock).toHaveBeenCalled();
  });
});