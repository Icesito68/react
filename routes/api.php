<?php

use App\Http\Controllers\Api\ProductController;
use GuzzleHttp\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/products', [ProductController::class, 'index'])->Middleware('auth:sanctum');

Route::delete('/products/{product}', [ProductController::class, 'destroy'])->middleware('auth:sanctum');