<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;

use App\Models\Consumable;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {


        $consumables = Consumable::with('stock')->get()->map(function ($consumable) {
            return [
                'id' => $consumable->id,
                'name' => $consumable->name,
                'type' => 'consumable',
                'type_label' => '消耗品',
                'unit' => $consumable->unit,
                'stock' => $consumable->stock ? $consumable->stock->quantity : 0,
            ];
        });

        $items = $consumables;

        return Inertia::render('Staff/Inventories/Index', [
            'items' => $items,
        ]);
    }

    public function create()
    {

        $consumables = Consumable::all()->map(function ($c) {
            return ['id' => $c->id, 'name' => $c->name, 'type' => 'consumable'];
        });

        return Inertia::render('Staff/Inventories/Create', [
            'consumables' => $consumables,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_type' => 'required|in:consumable',
            'item_id' => 'required|integer',
            'quantity' => 'required|integer',
            'operation' => 'required|in:add,subtract,set',
        ]);

        $modelClass = Consumable::class;
        $item = $modelClass::findOrFail($validated['item_id']);

        $stock = $item->stock()->firstOrCreate([], ['quantity' => 0]);

        if ($validated['operation'] === 'add') {
            $stock->quantity += $validated['quantity'];
        } elseif ($validated['operation'] === 'subtract') {
            $stock->quantity = max(0, $stock->quantity - $validated['quantity']);
        } elseif ($validated['operation'] === 'set') {
            $stock->quantity = $validated['quantity'];
        }

        $stock->save();

        return redirect()->route('staff.inventories.index')
            ->with('success', '在庫を更新しました。');
    }
}
