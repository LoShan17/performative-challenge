import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Stocks from "../views/Stocks";
import StockForm from "../views/StockForm";
import { MemoryRouter } from "react-router-dom";

describe("<Stocks />", () => {
    test("should display the default Stock page", () => {
        render(
            <MemoryRouter>
                <StockForm />
            </MemoryRouter>
        );
        const element = screen.getByRole("checkbox");
        expect(element).toBeInTheDocument();
    });

    test("should show error message when all the fields are not entered", async () => {
        render(
            <MemoryRouter>
                <Stocks />
            </MemoryRouter>
        );
        const buttonElement = screen.getByRole("textbox");
        userEvent.click(buttonElement);
        screen.debug();
    });
});
