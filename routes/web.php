<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\StaffAuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Customer Authentication Routes (Fortify)
Route::prefix('customer')->name('customer.')->group(function () {
    $limiter = config('fortify.limiters.login');

    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
        ->middleware(['guest:web'])
        ->name('login');

    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware(array_filter([
            'guest:web',
            $limiter ? 'throttle:'.$limiter : null,
        ]));

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

// Staff Authentication Routes
Route::prefix('staff')->name('staff.')->group(function () {
    Route::get('/login', [StaffAuthController::class, 'login'])
        ->middleware('guest:staff')
        ->name('login');

    Route::post('/login', [StaffAuthController::class, 'authenticate'])
        ->middleware('guest:staff');
        
    Route::post('/logout', [StaffAuthController::class, 'logout'])
        ->middleware('auth:staff')
        ->name('logout');

    Route::get('/dashboard', function () {
        return Inertia::render('Staff/Dashboard');
    })->middleware('auth:staff')->name('dashboard');

    Route::resource('stores', \App\Http\Controllers\StoreController::class)
        ->middleware('auth:staff');
});
