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

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return StockResource::collection(Stock::query()->orderBy('id', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockRequest $request)
    {
        $request_data = $request->validated();
        $config = Configuration::getDefaultConfiguration()->setApiKey('token', env('FINNHUB_KEY', ""));
        $http_client = new Client();
        $client = new DefaultApi($http_client, $config);
        $data = $client->companyBasicFinancials($request_data['ticker'], 'metric');
        $metric = $data->getMetric();
        $stock_data = [
            'ticker' => $request_data['ticker'],
            'pe' => $metric['peAnnual'] ?? 0.0,
            'debt_to_equity' => $metric['longTermDebt/equityAnnual'] ?? 0.0,
            'dividend_yield' => $metric['dividendYieldIndicatedAnnual'] ?? 0.0,
            'vs_sp500' => $metric['priceRelativeToS&P50052Week'] ?? 0.0,
        ];
        error_log("logging queried data from finhub, creating stock resource...");
        error_log(implode(", ", array_keys($stock_data)));
        error_log(implode(", ", $stock_data) . "<br>");
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
        $data = $request->validated();
        $stock->update($data);
        return new StockResource($stock);
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
