<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStockRequest;
use App\Http\Requests\UpdateStockRequest;
use App\Http\Resources\StockResource;
use App\Models\Stock;

use Finnhub\Configuration;
use Finnhub\Api\DefaultApi;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

use function Laravel\Prompts\error;

class StockController extends Controller
{
    private $finnhub_client;
    public function __construct()
    {
        $config = Configuration::getDefaultConfiguration()->setApiKey('token', env('FINNHUB_KEY', ""));
        $http_client = new Client();
        $this->finnhub_client = new DefaultApi($http_client, $config);
    }

    private function query_finnhub_basic_financials(String $ticker)
    {
        $data = $this->finnhub_client->companyBasicFinancials($ticker, 'metric');
        $metric = $data->getMetric();
        $stock_data = [
            'ticker' => $ticker,
            'pe' => $metric['peAnnual'] ?? 0.0,
            'debt_to_equity' => $metric['longTermDebt/equityAnnual'] ?? 0.0,
            'dividend_yield' => $metric['dividendYieldIndicatedAnnual'] ?? 0.0,
            'vs_sp500' => $metric['priceRelativeToS&P50052Week'] ?? 0.0,
        ];
        error_log("logging queried data from finnhub:");
        error_log(implode(", ", array_keys($stock_data)));
        error_log(implode(", ", $stock_data));
        return $stock_data;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $request->query() returns an associative array with keys/values
        // passed as query parameters
        $attributes = $request->query();
        $filtered_attributes = array_filter($attributes, function ($entry) {
            return ($entry != '');
        });
        $dataAttributes = array_map(function ($value, $key) {
            return $key . ' ' . $value;
        }, array_values($filtered_attributes), array_keys($filtered_attributes));
        $query_string = implode(", ", $dataAttributes);
        error_log($query_string);
        if ($query_string != '') {
            return StockResource::collection(Stock::query()->orderByRaw($query_string)->paginate(10));
        } else {
            return StockResource::collection(Stock::query()->paginate(10));
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockRequest $request)
    {
        $request_data = $request->validated();
        $stock_data = $this->query_finnhub_basic_financials($request_data['ticker']);
        $stock = Stock::create($stock_data);
        return response(new StockResource($stock), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        return new StockResource($stock);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockRequest $request, Stock $stock)
    {


        $request_data = $request->validated();

        if (array_key_exists("use_finnhub", $request_data)) {
            // if use_finnhub is in the request
            $stock_data = $this->query_finnhub_basic_financials($request_data['ticker']);
            $stock->update($stock_data);
            return new StockResource($stock);
        } else {
            // simply save what has been provided from the UI
            $stock->update($request_data);
            error_log("logging backend query to update stock...");
            error_log(implode(", ", array_keys($request_data)));
            error_log(implode(", ", $request_data));
            return new StockResource($stock);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        $stock->delete();
        return response("", 204);
    }
}
