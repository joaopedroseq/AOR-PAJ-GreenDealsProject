import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ConfirmPasswordModal from "./ConfirmPasswordModal";
import { checkIfValidPassword } from "../../Utils/UtilityFunctions";
import handleChangeUserInformation from "../../Handles/handleChangeUserInformation";


jest.mock("../../Utils/UtilityFunctions", () => ({
  checkIfValidPassword: jest.fn(),
}));

jest.mock("../../Utils/ToastConfig/toastConfig", () => ({
  showErrorToast: jest.fn(),
}));

describe("ConfirmPasswordModal", () => {
  test("renders the modal when isOpen is true", () => {
    const { getByText } = render(
      <ConfirmPasswordModal
        userInfo={{ name: "User" }}
        updatedUserInfo={{ name: "Updated User" }}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("Confirme a sua password")).toBeInTheDocument();
  });

  test("does not render the modal when isOpen is false", () => {
    const { queryByText } = render(
      <ConfirmPasswordModal
        userInfo={{ name: "User" }}
        updatedUserInfo={{ name: "Updated User" }}
        isOpen={false}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByText("Confirme a sua password")).not.toBeInTheDocument();
  });

  test("calls onClose when the Cancel button is clicked", () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <ConfirmPasswordModal
        userInfo={{ name: "User" }}
        updatedUserInfo={{ name: "Updated User" }}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(onCloseMock).toHaveBeenCalled();
  });
});