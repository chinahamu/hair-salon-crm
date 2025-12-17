<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Facility;
use App\Models\Store;
use Inertia\Inertia;

class FacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $organization_id = auth()->guard('staff')->user()->organization_id;
        $stores = Store::where('organization_id', $organization_id)->get();
        $selectedStoreId = $request->session()->get('staff_selected_store_id');
        
        $selectedStore = null;
        if ($selectedStoreId) {
            $selectedStore = $stores->firstWhere('id', $selectedStoreId);
        }

        if (!$selectedStore && $stores->isNotEmpty()) {
            $selectedStore = $stores->first();
            $request->session()->put('staff_selected_store_id', $selectedStore->id);
        }

        if ($selectedStore) {
            $facilities = Facility::where('store_id', $selectedStore->id)->get();
        } else {
            $facilities = [];
        }

        return Inertia::render('Staff/Facilities/Index', [
            'facilities' => $facilities,
            'stores' => $stores,
            'selectedStore' => $selectedStore,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $organization_id = auth()->guard('staff')->user()->organization_id;
        $stores = Store::where('organization_id', $organization_id)->get();
        $selectedStoreId = $request->session()->get('staff_selected_store_id');
        $selectedStore = $stores->firstWhere('id', $selectedStoreId) ?? $stores->first();

        return Inertia::render('Staff/Facilities/Create', [
            'stores' => $stores,
            'selectedStore' => $selectedStore,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'status' => 'required|string|in:active,inactive',
        ]);

        $storeId = $request->session()->get('staff_selected_store_id');
        if (!$storeId) {
             // Fallback or Error
             return back()->withErrors(['store_id' => '店舗が選択されていません。']);
        }

        Facility::create([
            'store_id' => $storeId,
            'name' => $request->name,
            'type' => $request->type,
            'status' => $request->status,
        ]);

        return redirect()->route('staff.facilities.index')->with('success', '設備を作成しました。');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Facility $facility)
    {
        $organization_id = auth()->guard('staff')->user()->organization_id;
        $stores = Store::where('organization_id', $organization_id)->get();
        $selectedStoreId = $request->session()->get('staff_selected_store_id');
        $selectedStore = $stores->firstWhere('id', $selectedStoreId) ?? $stores->first();

        return Inertia::render('Staff/Facilities/Edit', [
            'facility' => $facility,
             'stores' => $stores,
            'selectedStore' => $selectedStore,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Facility $facility)
    {
         $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'status' => 'required|string|in:active,inactive',
        ]);

        $facility->update($request->only('name', 'type', 'status'));

        return redirect()->route('staff.facilities.index')->with('success', '設備を更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Facility $facility)
    {
        $facility->delete();
        return redirect()->route('staff.facilities.index')->with('success', '設備を削除しました。');
    }
}
