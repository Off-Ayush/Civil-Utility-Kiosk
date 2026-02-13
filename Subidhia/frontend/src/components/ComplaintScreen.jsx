import React, { useState } from 'react';
import {
    AlertCircle, ArrowLeft, Upload,
    CheckCircle, Loader2, Camera,
    Zap, Flame, Droplet, Trash2
} from 'lucide-react';

const ComplaintScreen = ({ user, serviceType: propServiceType, onBack, t }) => {
    // Default to 'electricity' if no service type selected
    const serviceType = propServiceType || 'electricity';
    const [complaintType, setComplaintType] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [trackingId, setTrackingId] = useState('');

    const serviceColors = {
        electricity: 'from-yellow-400 to-orange-500',
        gas: 'from-red-400 to-pink-500',
        water: 'from-blue-400 to-cyan-500',
        waste: 'from-green-400 to-emerald-500',
    };

    const complaintTypes = {
        electricity: ['powerOutage', 'billing', 'meterFault'],
        gas: ['gasLeak', 'lowPressure', 'billing'],
        water: ['waterSupply', 'qualityIssue', 'billing'],
        waste: ['missedCollection', 'illegalDumping'],
    };

    const handleSubmit = () => {
        if (!complaintType || !description) return;

        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            setTrackingId(`CMP${Date.now().toString().slice(-8)}`);
        }, 2000);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Complaint Registered!</h2>
                    <p className="text-white/60 mb-6">Your complaint has been successfully submitted.</p>

                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 mb-8">
                        <p className="text-white/60 text-sm mb-2">{t.trackingId}</p>
                        <p className="text-2xl font-bold text-purple-400 font-mono">{trackingId}</p>
                        <p className="text-white/40 text-xs mt-2">Save this ID to track your complaint status</p>
                    </div>

                    <button
                        onClick={onBack}
                        className={`px-8 py-3 rounded-xl bg-gradient-to-r ${serviceColors[serviceType]} text-white font-semibold hover:opacity-90 transition-all`}
                    >
                        {t.back}
                    </button>
                </div>
            </div>
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

                {/* Complaint Form */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                    <div className="text-center mb-8">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${serviceColors[serviceType]} mb-4`}>
                            <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{t.complaints}</h2>
                        <p className="text-white/60">{t[serviceType]} - Report an Issue</p>
                    </div>

                    <div className="space-y-6">
                        {/* Complaint Type */}
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-3">{t.complaintType}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {complaintTypes[serviceType].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setComplaintType(type)}
                                        className={`p-4 rounded-xl border transition-all text-center ${complaintType === type
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{t[type]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">{t.description}</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your issue in detail..."
                                rows={4}
                                className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">{t.uploadDoc}</label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept="image/*,.pdf"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    {file ? (
                                        <div className="flex items-center justify-center gap-2 text-emerald-400">
                                            <CheckCircle className="w-6 h-6" />
                                            <span>{file.name}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-3">
                                                <Upload className="w-10 h-10 text-white/40 mx-auto" />
                                            </div>
                                            <p className="text-white/60 text-sm">Click to upload or drag and drop</p>
                                            <p className="text-white/30 text-xs mt-1">PNG, JPG or PDF (max. 5MB)</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Camera Button (for mobile) */}
                        <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 
              hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Camera className="w-5 h-5" />
                            <span>Take Photo</span>
                        </button>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!complaintType || !description || processing}
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
                                <span>{t.submit}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintScreen;
