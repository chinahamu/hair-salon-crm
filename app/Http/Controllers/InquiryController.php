<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\InquiryReceived;
use Inertia\Inertia;

class InquiryController extends Controller
{
    public function index()
    {
        return Inertia::render('Inquiry/Index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $data = $request->only(['name', 'email', 'subject', 'message']);

        // Send email to admin
        Mail::to('info@meta-alchemist.co.jp')->send(new InquiryReceived($data));

        return redirect()->route('inquiry.complete');
    }

    public function complete()
    {
        return Inertia::render('Inquiry/Complete');
    }
}
