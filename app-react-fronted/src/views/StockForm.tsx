import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { Form } from "react-bootstrap";

// backend notes
// 'ticker' => $request_data['ticker'],
// 'pe' => $metric['peAnnual'] ?? 0.0,
// 'debt_to_equity' => $metric['longTermDebt/equityAnnual'] ?? 0.0,
// 'dividend_yield' => $metric['dividendYieldIndicatedAnnual'] ?? 0.0,
// 'vs_sp500' => $metric['priceRelativeToS&P50052Week'] ?? 0.0,

type Props = {};

function StockForm({}: Props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setNotification } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any | null>(null);
    null;
    const [stock, setStock] = useState({
        id: null,
        ticker: "",
        pe: "",
        debt_to_equity: "",
        dividend_yield: "",
        vs_sp500: "",
        use_finnhub: true,
    });
    // const { id } = useParams();
    // this is getting all the params from the endpoint call and destructure them into id
    // so id will be available only on Edit: "/stocks/:id"
    // but not on New "/stocks/new"
    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/stocks/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setStock(data);
                })
                .catch(() => setLoading(false));
        }, []);
    }

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (stock.id) {
            console.log(stock);
            axiosClient
                .put(`/stocks/${stock.id}`, stock)
                .then(() => {
                    setNotification(
                        `Stock ${stock.ticker} was successfully updated`
                    );
                    navigate("/stocks");
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                        setErrors(response.data.errors);
                    } else {
                        // just rebuild the structure above setting the message
                        setErrors({
                            message: [response.data.message],
                        });
                    }
                });
        } else {
            console.log(stock);
            axiosClient
                .post(`/stocks`, stock)
                .then(() => {
                    setNotification(
                        `Stock ${stock.ticker} was successfully created`
                    );
                    navigate("/stocks");
                })
                .catch((err) => {
                    console.log(err);
                    const response = err.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                        setErrors(response.data.errors);
                    } else {
                        // just rebuild the structure above setting the message
                        setErrors({
                            message: [response.data.message],
                        });
                    }
                });
        }
    };

    return (
        <>
            {stock.id && <h1>Update Stock: {stock.ticker}</h1>}
            {!stock.id && <h1>Create Stock</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading ...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <Form onSubmit={onSubmit}>
                        <input
                            value={stock.ticker}
                            type="text"
                            placeholder="Ticker"
                            onChange={(event) =>
                                setStock({
                                    ...stock,
                                    ticker: event.target.value,
                                })
                            }
                        />
                        <input
                            value={stock.pe}
                            type="float"
                            placeholder="pe"
                            onChange={(event) =>
                                setStock({ ...stock, pe: event.target.value })
                            }
                        />
                        <input
                            value={stock.debt_to_equity}
                            type="float"
                            placeholder="debt_to_equity"
                            onChange={(event) =>
                                setStock({
                                    ...stock,
                                    debt_to_equity: event.target.value,
                                })
                            }
                        />
                        <input
                            value={stock.dividend_yield}
                            type="float"
                            placeholder="dividend_yield"
                            onChange={(event) =>
                                setStock({
                                    ...stock,
                                    dividend_yield: event.target.value,
                                })
                            }
                        />
                        <input
                            value={stock.vs_sp500}
                            type="float"
                            placeholder="vs_sp500"
                            onChange={(event) =>
                                setStock({
                                    ...stock,
                                    vs_sp500: event.target.value,
                                })
                            }
                        />
                        <header>
                            <div className="nowrap">
                                Look up stock details from FinnHub
                            </div>
                            <input
                                type="checkbox"
                                name="checkbox"
                                value="use_finnhub"
                                onChange={(event) =>
                                    setStock({
                                        ...stock,
                                        use_finnhub: event.target.checked,
                                    })
                                }
                            />
                        </header>
                        <br />
                        <button className="btn">Save</button>
                    </Form>
                )}
            </div>
        </>
    );
}

export default StockForm;
