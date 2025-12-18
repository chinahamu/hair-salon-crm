<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordImage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MedicalRecordController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, User $customer)
    {
        $validated = $request->validate([
            'visit_date' => 'required|date',
            'content' => 'required|string',
            'images.*' => 'nullable|image|max:10240', // 10MB max
            'reservation_id' => 'nullable|exists:reservations,id',
        ]);

        try {
            DB::transaction(function () use ($validated, $customer, $request) {
                // Create the medical record
                $record = $customer->medicalRecords()->create([
                    'staff_id' => auth()->id(), // Assuming staff is authenticated
                    'reservation_id' => $validated['reservation_id'] ?? null,
                    'visit_date' => $validated['visit_date'],
                    'content' => $validated['content'],
                ]);

                // Handle image uploads
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $image->store('medical_records', 'public');
                        $record->images()->create([
                            'path' => $path,
                            // 'description' => $image->getClientOriginalName(), // Optional
                        ]);
                    }
                }
            });

            return redirect()->back()->with('success', 'Medical record created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create medical record: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MedicalRecord $medicalRecord)
    {
        try {
            DB::transaction(function () use ($medicalRecord) {
                // Delete images from storage
                foreach ($medicalRecord->images as $image) {
                    Storage::disk('public')->delete($image->path);
                }
                
                $medicalRecord->delete();
            });

            return redirect()->back()->with('success', 'Medical record deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete medical record.']);
        }
    }
}
