import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const columnsNames: any = {
    id: "ID",
    ticker: "Ticker",
    pe: "P/E",
    debt_to_equity: "Debt to Equity",
    dividend_yield: "Dividend Yield",
    vs_sp500: "1 Year vs SP500",
    created_at: "created at",
    updated_at: "updated at",
};

function objectToQueryString(obj: any) {
    const keys = Object.keys(obj);
    const keyValuePairs = keys.map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    });
    return keyValuePairs.join("&");
}

type HeaderCellProps = {
    children?: string;
    column: any | string;
    sorting: any;
    sortTable: (newSorting: any) => void;
};

const HeaderCell = ({ column, sorting, sortTable }: HeaderCellProps) => {
    const isDescSorting = sorting[column] === "DESC";
    const isAscSorting = sorting[column] === "ASC";
    const noSorting = sorting[column] === "";
    const futureSortingOrder = () => {
        if (isDescSorting) {
            return "ASC";
        } else if (isAscSorting) {
            return "";
        } else if (noSorting) {
            return "DESC";
        }
    };
    return (
        <th
            key={columnsNames[column]}
            onClick={() => sortTable({ column, order: futureSortingOrder() })}
        >
            {columnsNames[column]}
            {isDescSorting && <span>▼</span>}
            {isAscSorting && <span>▲</span>}
        </th>
    );
};

function Stocks() {
    const sortTable = (newSorting: any) => {
        const newFullSorting = columnsSorting;
        newFullSorting[newSorting.column] = newSorting.order;
        setColumnsSorting(newFullSorting);
        getStocks();
    };
    // it is important to set the type of stocks to Array of any
    // not to get compile error in the HTML below when expanding stock fields
    const [stocks, setStocks] = useState<Array<any>>([]);
    const [render_stocks, setRenderStocks] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    const [_, setSearch] = useState("");
    const [columnsSorting, setColumnsSorting] = useState<any>({
        id: "DESC",
        ticker: "",
        pe: "",
        debt_to_equity: "",
        dividend_yield: "",
        vs_sp500: "",
        created_at: "",
        updated_at: "",
    });

    const handleSearch = (event: any) => {
        setSearch(event.target.value);
        const current_search = event.target.value;
        setRenderStocks(
            stocks.filter((item) =>
                item.ticker.toLowerCase().includes(current_search.toLowerCase())
            )
        );
    };

    useEffect(() => {
        getStocks();
    }, []);

    const onDelete = (stock: any) => {
        if (!window.confirm("Are you sure you want to delete this stock?")) {
            return;
        }
        axiosClient.delete(`/stocks/${stock.id}`).then(() => {
            setNotification(`Stock ${stock.ticker} was successfully deleted`);
            getStocks();
        });
    };

    const getStocks = () => {
        setLoading(true);
        // console.log(columnsSorting);
        const string_params = objectToQueryString(columnsSorting);
        // console.log(string_params);
        axiosClient
            .get("/stocks?" + string_params)
            .then(({ data }) => {
                {
                    // console.log(data);
                    setStocks(data.data);
                    setRenderStocks(data.data);
                    setLoading(false);
                }
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Stocks</h1>
                <label htmlFor="search">
                    Search by Ticker:
                    <input id="search" type="text" onChange={handleSearch} />
                </label>
                <Link to="/stocks/new" className="btn-add">
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            {Object.keys(columnsNames).map((column: any) => (
                                <HeaderCell
                                    key={column}
                                    column={column}
                                    sorting={columnsSorting}
                                    sortTable={sortTable}
                                ></HeaderCell>
                            ))}
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Loading ...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {render_stocks.map((stock) => (
                                <tr key={stock.id}>
                                    <td>{stock.id}</td>
                                    <td>{stock.ticker}</td>
                                    <td>{stock.pe}</td>
                                    <td>{stock.debt_to_equity}</td>
                                    <td>{stock.dividend_yield}</td>
                                    <td>{stock.vs_sp500}</td>
                                    <td>{stock.created_at}</td>
                                    <td>{stock.updated_at}</td>
                                    <td>
                                        <Link
                                            className="btn-edit"
                                            to={"/stocks/" + stock.id}
                                        >
                                            Edit
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={(_) => onDelete(stock)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}

export default Stocks;
