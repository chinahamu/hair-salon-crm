<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $organization_id = auth()->guard('staff')->user()->organization_id;
        $stores = Store::where('organization_id', $organization_id)->get();

        $selectedStoreId = $request->session()->get('staff_selected_store_id');
        
        $selectedStore = null;
        if ($selectedStoreId) {
            $selectedStore = $stores->firstWhere('id', $selectedStoreId);
        }

        // Default to first store if no selection or invalid selection
        if (!$selectedStore && $stores->isNotEmpty()) {
            $selectedStore = $stores->first();
            $request->session()->put('staff_selected_store_id', $selectedStore->id);
        }

        return Inertia::render('Staff/Dashboard', [
            'stores' => $stores,
            'selectedStore' => $selectedStore,
        ]);
    }

    public function selectStore(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
        ]);

        // Verify the store belongs to the staff's organization
        $store = Store::where('id', $validated['store_id'])
            ->where('organization_id', auth()->guard('staff')->user()->organization_id)
            ->firstOrFail();

        $request->session()->put('staff_selected_store_id', $store->id);

        return back();
    }
}
