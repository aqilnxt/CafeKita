<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function show(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        if ($order->status !== 'pending') {
            return redirect()->route('customer.orders.show', $order)
                ->with('error', 'Pesanan ini tidak dapat dibayar.');
        }

        try {
            $snapToken = $this->midtransService->createTransaction($order);
            
            return Inertia::render('Customer/Payments/Show', [
                'order' => $order->load('items.product'),
                'snapToken' => $snapToken,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('customer.orders.show', $order)
                ->with('error', 'Gagal membuat pembayaran: ' . $e->getMessage());
        }
    }

    public function callback(Request $request)
    {
        $payload = $request->all();
        
        try {
            $payment = $this->midtransService->handleCallback($payload);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 