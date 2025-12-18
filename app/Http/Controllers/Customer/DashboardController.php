<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $nextReservation = \App\Models\Reservation::with(['store', 'staff', 'menus'])
            ->where('user_id', $user->id)
            ->where('start_time', '>=', now())
            ->orderBy('start_time')
            ->first();

        $pastReservations = \App\Models\Reservation::with(['store', 'staff', 'menus'])
            ->where('user_id', $user->id)
            ->where('start_time', '<', now())
            ->orderBy('start_time', 'desc')
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'nextReservation' => $nextReservation,
            'pastReservations' => $pastReservations,
        ]);
    }
}
