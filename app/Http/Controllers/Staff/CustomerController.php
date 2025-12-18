<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Staff/Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Staff/Customers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255|unique:users',
            'memo' => 'nullable|string',
            'password' => 'nullable|string', // Password can be set later or auto-generated if needed
        ]);
        
        // If password is not provided, we don't set it (it stays null) or we could set a random one if login is required immediately.
        // For now, allowing null password as per schema plan.

        User::create($validated);

        return redirect()->route('staff.customers.index')
            ->with('success', 'Customer created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $customer)
    {
        return Inertia::render('Staff/Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => ['nullable', 'string', 'email', 'max:255', Rule::unique('users')->ignore($customer->id)],
            'memo' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->route('staff.customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $customer)
    {
        $customer->delete();

        return redirect()->route('staff.customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
    /**
     * Display the specified resource.
     */
    public function show(User $customer)
    {
        $customer->load(['medicalRecords.images', 'medicalRecords.staff', 'reservations.store', 'reservations.staff']);

        return Inertia::render('Staff/Customers/Show', [
            'customer' => $customer,
        ]);
    }
}
