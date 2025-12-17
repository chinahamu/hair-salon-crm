<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
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

        $menus = [];
        if ($selectedStore) {
            $menus = $selectedStore->menus()->orderBy('id', 'desc')->get();
        }

        return Inertia::render('Menu/Index', [
            'menus' => $menus,
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
            'price' => 'required|integer|min:0',
            'duration' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $selectedStoreId = $request->session()->get('staff_selected_store_id');
        if (!$selectedStoreId) {
            return back()->with('error', '店舗が選択されていません。');
        }

        $store = Store::where('id', $selectedStoreId)
             ->where('organization_id', auth()->guard('staff')->user()->organization_id)
             ->firstOrFail();

        $store->menus()->create($request->all());

        return redirect()->back()->with('success', 'メニューを作成しました。');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'duration' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        // Authorization check: Ensure menu belongs to a store in staff's organization
        if ($menu->store->organization_id !== auth()->guard('staff')->user()->organization_id) {
            abort(403);
        }

        $menu->update($request->all());

        return redirect()->back()->with('success', 'メニューを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        if ($menu->store->organization_id !== auth()->guard('staff')->user()->organization_id) {
            abort(403);
        }

        $menu->delete();

        return redirect()->back()->with('success', 'メニューを削除しました。');
    }
}
