import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

// backend notes
// 'ticker' => $request_data['ticker'],
// 'pe' => $metric['peAnnual'] ?? 0.0,
// 'debt_to_equity' => $metric['longTermDebt/equityAnnual'] ?? 0.0,
// 'dividend_yield' => $metric['dividendYieldIndicatedAnnual'] ?? 0.0,
// 'vs_sp500' => $metric['priceRelativeToS&P50052Week'] ?? 0.0,

function Stocks() {
    // it is important to set the type of stocks to Array of any
    // not to get compile error in the HTML below when expanding stock fields
    const [stocks, setStocks] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

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
        axiosClient
            .get("/stocks")
            .then(({ data }) => {
                {
                    console.log(data);
                    setStocks(data.data);
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
                <Link to="/stocks/new" className="btn-add">
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ticker</th>
                            <th>P/E</th>
                            <th>Debt to Equity</th>
                            <th>Dividend Yield</th>
                            <th>1 Year vs SP500</th>
                            <th>created at</th>
                            <th>updated at</th>
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
                            {stocks.map((stock) => (
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
