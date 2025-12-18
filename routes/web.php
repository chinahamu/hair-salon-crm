<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\StaffAuthController;
use App\Http\Controllers\Staff\DashboardController;

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

Route::get('/reserve/{store_code}', [\App\Http\Controllers\GuestReservationController::class, 'index'])->name('guest.reservation.index');
Route::get('/reserve/{store_code}/availability', [\App\Http\Controllers\GuestReservationController::class, 'getAvailability'])->name('guest.reservation.availability');
Route::get('/reserve/{store_code}/menus', [\App\Http\Controllers\GuestReservationController::class, 'step2Menu'])->name('guest.reservation.menus');
Route::get('/reserve/{store_code}/staff', [\App\Http\Controllers\GuestReservationController::class, 'step3Staff'])->name('guest.reservation.staff');
Route::get('/reserve/{store_code}/confirm', [\App\Http\Controllers\GuestReservationController::class, 'step4Confirm'])->name('guest.reservation.confirm');
Route::post('/reserve/{store_code}/confirm', [\App\Http\Controllers\GuestReservationController::class, 'store'])->name('guest.reservation.store');
Route::get('/reserve/{store_code}/complete', [\App\Http\Controllers\GuestReservationController::class, 'complete'])->name('guest.reservation.complete');

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

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('auth:staff')
        ->name('dashboard');

    Route::post('/dashboard/store', [DashboardController::class, 'selectStore'])
        ->middleware('auth:staff')
        ->name('dashboard.store');

    Route::resource('stores', \App\Http\Controllers\StoreController::class)
        ->middleware('auth:staff');

    Route::resource('menus', \App\Http\Controllers\MenuController::class)
        ->middleware('auth:staff');

    Route::resource('facilities', \App\Http\Controllers\FacilityController::class)
        ->middleware('auth:staff');

    Route::middleware('auth:staff')->group(function () {
        Route::get('/shifts', [\App\Http\Controllers\ShiftController::class, 'index'])->name('shifts.index');
        Route::post('/shifts', [\App\Http\Controllers\ShiftController::class, 'store'])->name('shifts.store');
        Route::delete('/shifts/{shift}', [\App\Http\Controllers\ShiftController::class, 'destroy'])->name('shifts.destroy');
    });

    Route::resource('reservations', \App\Http\Controllers\Staff\ReservationController::class)
        ->middleware('auth:staff');

    Route::resource('customers', \App\Http\Controllers\Staff\CustomerController::class);

    Route::post('/customers/{customer}/medical-records', [\App\Http\Controllers\Staff\MedicalRecordController::class, 'store'])->name('medical-records.store');
    Route::delete('/medical-records/{medicalRecord}', [\App\Http\Controllers\Staff\MedicalRecordController::class, 'destroy'])->name('medical-records.destroy');
});

Route::middleware(['auth:web'])->group(function () {
    Route::get('/reservations/create', [\App\Http\Controllers\ReservationController::class, 'create'])->name('reservations.create');
    Route::post('/reservations', [\App\Http\Controllers\ReservationController::class, 'store'])->name('reservations.store');
});

Route::middleware(['auth:web'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Customer\DashboardController::class, 'index'])->name('dashboard');
});
