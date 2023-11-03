import { render, screen } from "@testing-library/react";
import Stocks from "../views/Stocks";
import StockForm from "../views/StockForm";
import { MemoryRouter } from "react-router-dom";

// <MemoryRouter> is necessary as a wrapper of the component
// or it will throw and error because a Link (needs a Router wrapper) presence in the component

describe("<Stocks />", () => {
    test("check that heading is present in the Stocks page", () => {
        render(
            <MemoryRouter>
                <StockForm />
            </MemoryRouter>
        );
        const heading = screen.getByRole("heading");
        expect(heading).toBeInTheDocument();
    });

    test("chech there is at least 1 column header", () => {
        render(
            <MemoryRouter>
                <Stocks />
            </MemoryRouter>
        );
        const table = screen.getAllByRole("columnheader");
        expect(table[0]).toBeInTheDocument();
    });

    test("check that the serchbox has been displayed", async () => {
        render(
            <MemoryRouter>
                <Stocks />
            </MemoryRouter>
        );
        const textBox = screen.getByRole("textbox");
        expect(textBox).toBeInTheDocument();
    });
});
