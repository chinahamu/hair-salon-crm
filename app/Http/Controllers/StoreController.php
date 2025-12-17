<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Only show stores belonging to the staff's organization
        $stores = Store::where('organization_id', auth()->guard('staff')->user()->organization_id)->get();
        return Inertia::render('Staff/Store/Index', [
            'stores' => $stores
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Staff/Store/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
        ]);

        // Assign to the staff's organization
        $validated['organization_id'] = auth()->guard('staff')->user()->organization_id;

        Store::create($validated);

        return redirect()->route('staff.stores.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        // Ensure the store belongs to the staff's organization
        if ($store->organization_id !== auth()->guard('staff')->user()->organization_id) {
            abort(403);
        }

        return Inertia::render('Staff/Store/Edit', [
            'store' => $store
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        // Ensure the store belongs to the staff's organization
        if ($store->organization_id !== auth()->guard('staff')->user()->organization_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
        ]);

        $store->update($validated);

        return redirect()->route('staff.stores.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        // Ensure the store belongs to the staff's organization
        if ($store->organization_id !== auth()->guard('staff')->user()->organization_id) {
            abort(403);
        }

        $store->delete();

        return redirect()->route('staff.stores.index');
    }
}
