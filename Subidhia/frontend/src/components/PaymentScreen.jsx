import React, { useState } from 'react';
import {
    CreditCard, ArrowLeft, Smartphone,
    Building2, Wallet, CheckCircle,
    Loader2, Shield, QrCode
} from 'lucide-react';
import BillReceipt from './BillReceipt';


const PaymentScreen = ({ user, serviceType: propServiceType, onBack, t }) => {
    // Default to 'electricity' if no service type selected
    const serviceType = propServiceType || 'electricity';
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    const serviceColors = {
        electricity: 'from-yellow-400 to-orange-500',
        gas: 'from-red-400 to-pink-500',
        water: 'from-blue-400 to-cyan-500',
        waste: 'from-green-400 to-emerald-500',
    };

    const billAmount = 2450;

    // Bill details for receipt
    const billDetails = {
        billId: 'BILL001',
        billingPeriod: 'Jan 2026',
        consumption: '245 kWh',
        dueDate: '2026-02-15'
    };

    const paymentMethods = [
        { id: 'upi', icon: Smartphone, label: 'UPI' },
        { id: 'card', icon: CreditCard, label: 'Card' },
        { id: 'netbanking', icon: Building2, label: 'Net Banking' },
        { id: 'wallet', icon: Wallet, label: 'Wallet' },
    ];

    const handlePayment = () => {
        setProcessing(true);
        // Generate transaction ID
        const txnId = `TXN${Date.now()}`;
        setTimeout(() => {
            setProcessing(false);
            setTransactionId(txnId);
            setSuccess(true);
        }, 3000);
    };

    if (success) {
        return (
            <BillReceipt
                user={user}
                serviceType={serviceType}
                billAmount={billAmount}
                transactionId={transactionId}
                paymentMethod={paymentMethod}
                billDetails={billDetails}
                onBack={onBack}
                t={t}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t.back}</span>
                </button>

                {/* Payment Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">{t.makePayment}</h2>
                        <p className="text-white/60">{t[serviceType]} Bill Payment</p>
                    </div>

                    {/* Amount Display */}
                    <div className={`rounded-2xl bg-gradient-to-br ${serviceColors[serviceType]} p-6 mb-8 text-center`}>
                        <p className="text-white/80 text-sm mb-1">{t.amount}</p>
                        <p className="text-4xl font-bold text-white">₹{billAmount}</p>
                    </div>

                    {/* Payment Methods */}
                    <div className="mb-8">
                        <p className="text-white/70 text-sm font-medium mb-4">Select Payment Method</p>
                        <div className="grid grid-cols-4 gap-3">
                            {paymentMethods.map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    onClick={() => setPaymentMethod(id)}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === id
                                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span className="text-sm font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* UPI Payment Form */}
                    {paymentMethod === 'upi' && (
                        <div className="space-y-6 mb-8">
                            {/* QR Code Option */}
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="inline-flex items-center justify-center w-40 h-40 bg-white rounded-xl mb-4">
                                    <QrCode className="w-32 h-32 text-slate-900" />
                                </div>
                                <p className="text-white/60 text-sm">Scan QR code to pay</p>
                            </div>

                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <span className="relative px-4 bg-slate-900 text-white/40 text-sm">OR</span>
                            </div>

                            {/* UPI ID Input */}
                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">Enter UPI ID</label>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="yourname@upi"
                                    className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">Expiry</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 
                      focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">CVV</label>
                                    <input
                                        type="password"
                                        placeholder="***"
                                        maxLength={3}
                                        className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 
                      focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className={`w-full py-4 rounded-xl bg-gradient-to-r ${serviceColors[serviceType]} text-white font-semibold 
              hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2`}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{t.processing}</span>
                            </>
                        ) : (
                            <>
                                <Shield className="w-5 h-5" />
                                <span>{t.payNow} ₹{billAmount}</span>
                            </>
                        )}
                    </button>

                    {/* Security Note */}
                    <p className="text-center text-white/40 text-xs mt-4 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        Secured by 256-bit SSL encryption
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentScreen;
