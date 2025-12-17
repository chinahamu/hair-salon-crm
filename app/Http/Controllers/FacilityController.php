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
        $storeId = $request->session()->get('selected_store_id');
        $facilities = Facility::where('store_id', $storeId)->get();

        return Inertia::render('Staff/Facilities/Index', [
            'facilities' => $facilities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Staff/Facilities/Create');
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

        $storeId = $request->session()->get('selected_store_id');

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
    public function edit(Facility $facility)
    {
        return Inertia::render('Staff/Facilities/Edit', [
            'facility' => $facility,
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
