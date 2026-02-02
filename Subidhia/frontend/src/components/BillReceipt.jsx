import React, { useRef, useState } from 'react';
import {
    CheckCircle, Download, Printer, Mail, Smartphone,
    ArrowLeft, FileText, Calendar, CreditCard, User,
    Building2, Zap, Flame, Droplets, Trash2, Loader2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

const BillReceipt = ({
    user,
    serviceType,
    billAmount,
    transactionId,
    paymentMethod,
    billDetails,
    onBack,
    t
}) => {
    const receiptRef = useRef(null);
    const [sending, setSending] = useState({ email: false, sms: false });
    const [sendStatus, setSendStatus] = useState({ email: null, sms: null });

    const serviceIcons = {
        electricity: Zap,
        gas: Flame,
        water: Droplets,
        waste: Trash2,
    };

    const serviceColors = {
        electricity: 'from-yellow-400 to-orange-500',
        gas: 'from-red-400 to-pink-500',
        water: 'from-blue-400 to-cyan-500',
        waste: 'from-green-400 to-emerald-500',
    };

    const ServiceIcon = serviceIcons[serviceType] || Zap;
    const paymentDate = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    // Generate PDF from receipt
    const generatePDF = async () => {
        const element = receiptRef.current;
        const opt = {
            margin: 0.5,
            filename: `SUVIDHA_Receipt_${transactionId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        return html2pdf().set(opt).from(element).toPdf().get('pdf');
    };

    // Download PDF
    const handleDownload = async () => {
        const element = receiptRef.current;
        const opt = {
            margin: 0.5,
            filename: `SUVIDHA_Receipt_${transactionId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
    };

    // Print receipt
    const handlePrint = () => {
        const printContent = receiptRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>SUVIDHA Receipt - ${transactionId}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
                    .receipt-container { max-width: 600px; margin: 0 auto; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    // Send to Email
    const handleSendEmail = async () => {
        setSending(prev => ({ ...prev, email: true }));
        try {
            const response = await fetch('/api/receipt/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email: user?.email,
                    transactionId,
                    billAmount,
                    serviceType,
                    paymentDate,
                    userName: user?.name,
                    consumerId: user?.consumerId
                })
            });

            if (response.ok) {
                setSendStatus(prev => ({ ...prev, email: 'success' }));
            } else {
                setSendStatus(prev => ({ ...prev, email: 'error' }));
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setSendStatus(prev => ({ ...prev, email: 'error' }));
        } finally {
            setSending(prev => ({ ...prev, email: false }));
            setTimeout(() => setSendStatus(prev => ({ ...prev, email: null })), 3000);
        }
    };

    // Send to Mobile (SMS)
    const handleSendSMS = async () => {
        setSending(prev => ({ ...prev, sms: true }));
        try {
            const response = await fetch('/api/receipt/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    mobile: user?.mobile,
                    transactionId,
                    billAmount,
                    serviceType
                })
            });

            if (response.ok) {
                setSendStatus(prev => ({ ...prev, sms: 'success' }));
            } else {
                setSendStatus(prev => ({ ...prev, sms: 'error' }));
            }
        } catch (error) {
            console.error('Error sending SMS:', error);
            setSendStatus(prev => ({ ...prev, sms: 'error' }));
        } finally {
            setSending(prev => ({ ...prev, sms: false }));
            setTimeout(() => setSendStatus(prev => ({ ...prev, sms: null })), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Success Animation */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-4 animate-bounce">
                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {t?.success || 'Payment Successful!'}
                    </h2>
                    <p className="text-white/60">
                        {t?.receiptGenerated || 'Your receipt has been generated'}
                    </p>
                </div>

                {/* Receipt Card - This is what gets converted to PDF */}
                <div
                    ref={receiptRef}
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    {/* Receipt Header */}
                    <div className={`bg-gradient-to-r ${serviceColors[serviceType]} p-6 text-white`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <ServiceIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">SUVIDHA</h3>
                                    <p className="text-white/80 text-sm">Payment Receipt</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white/80 text-xs">Receipt No.</p>
                                <p className="font-mono font-bold">{transactionId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Body */}
                    <div className="p-6 space-y-6">
                        {/* Amount Section */}
                        <div className="text-center py-4 border-b-2 border-dashed border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">Amount Paid</p>
                            <p className="text-4xl font-bold text-gray-800">₹{billAmount?.toLocaleString('en-IN')}</p>
                        </div>

                        {/* Transaction Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">{t?.paymentDate || 'Payment Date'}</p>
                                    <p className="font-semibold text-gray-800 text-sm">{paymentDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">{t?.paymentMethod || 'Payment Method'}</p>
                                    <p className="font-semibold text-gray-800 text-sm uppercase">{paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Customer Details */}
                        <div className="space-y-3">
                            <h4 className="text-gray-600 font-semibold text-sm uppercase tracking-wide">
                                {t?.customerDetails || 'Customer Details'}
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{user?.name || 'Customer'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{user?.consumerId || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{user?.mobile || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{user?.email || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Service Details */}
                        <div className="space-y-3">
                            <h4 className="text-gray-600 font-semibold text-sm uppercase tracking-wide">
                                {t?.serviceDetails || 'Service Details'}
                            </h4>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{t?.serviceType || 'Service Type'}</span>
                                <span className="font-semibold text-gray-800 capitalize">
                                    {t?.[serviceType] || serviceType}
                                </span>
                            </div>
                            {billDetails?.billId && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{t?.billId || 'Bill ID'}</span>
                                    <span className="font-semibold text-gray-800">{billDetails.billId}</span>
                                </div>
                            )}
                            {billDetails?.billingPeriod && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{t?.billingPeriod || 'Billing Period'}</span>
                                    <span className="font-semibold text-gray-800">{billDetails.billingPeriod}</span>
                                </div>
                            )}
                            {billDetails?.consumption && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{t?.consumption || 'Consumption'}</span>
                                    <span className="font-semibold text-gray-800">{billDetails.consumption}</span>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 -mx-6 -mb-6 mt-6 p-4 text-center">
                            <p className="text-gray-500 text-xs">
                                Thank you for using SUVIDHA Kiosk
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                This is a computer-generated receipt and does not require signature
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-4">
                    {/* Primary Actions - Send Options */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleSendSMS}
                            disabled={sending.sms}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all
                                ${sendStatus.sms === 'success'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                    : sendStatus.sms === 'error'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {sending.sms ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Smartphone className="w-5 h-5" />
                            )}
                            <span className="font-medium">
                                {sendStatus.sms === 'success'
                                    ? (t?.sent || 'Sent!')
                                    : (t?.sendToMobile || 'Send to Mobile')}
                            </span>
                        </button>

                        <button
                            onClick={handleSendEmail}
                            disabled={sending.email}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all
                                ${sendStatus.email === 'success'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                    : sendStatus.email === 'error'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {sending.email ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Mail className="w-5 h-5" />
                            )}
                            <span className="font-medium">
                                {sendStatus.email === 'success'
                                    ? (t?.sent || 'Sent!')
                                    : (t?.sendToEmail || 'Send to Email')}
                            </span>
                        </button>
                    </div>

                    {/* Secondary Actions - Print & Download */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white 
                                hover:bg-white/20 border border-white/10 transition-all"
                        >
                            <Printer className="w-5 h-5" />
                            <span className="font-medium">{t?.printReceipt || 'Print Receipt'}</span>
                        </button>

                        <button
                            onClick={handleDownload}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r 
                                ${serviceColors[serviceType]} text-white font-semibold hover:opacity-90 transition-all`}
                        >
                            <Download className="w-5 h-5" />
                            <span>{t?.downloadPDF || 'Download PDF'}</span>
                        </button>
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                            text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>{t?.back || 'Back to Dashboard'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillReceipt;
