import React, { useState } from 'react';
import { Key, Eye, EyeOff, Shield, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const PasswordReset = ({ user, onClose, onBack }) => {
    const [step, setStep] = useState('otp'); // otp, newPassword, success
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpRequested, setOtpRequested] = useState(false);

    const requestOTP = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                'https://civil-utility-kiosk.onrender.com/api/auth/reset-password/request',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.userId,
                        aadhaarNumber: user.aadhaarNumber
                    })
                }
            );

            const data = await response.json();
            if (data.success) {
                setOtpRequested(true);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        if (otp !== '9898') {
            setError('Invalid OTP. Please use master OTP: 9898');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                'https://civil-utility-kiosk.onrender.com/api/auth/reset-password/verify-otp',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.userId,
                        otp
                    })
                }
            );

            const data = await response.json();
            if (data.success && data.verified) {
                setStep('newPassword');
            } else {
                setError(data.message || 'OTP verification failed');
            }
        } catch (err) {
            setError('Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                'https://civil-utility-kiosk.onrender.com/api/auth/reset-password/confirm',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.userId,
                        newPassword
                    })
                }
            );

            const data = await response.json();
            if (data.success) {
                setStep('success');
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError(data.message || 'Password reset failed');
            }
        } catch (err) {
            setError('Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}>
            <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl border border-white/20 
                p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                            <Key className="w-6 h-6 text-white" />
                        </div>
                        Reset Password
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Success State */}
                {step === 'success' && (
                    <div className="text-center py-12">
                        <div className="inline-flex p-4 rounded-full bg-emerald-500/20 mb-4">
                            <CheckCircle className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Password Reset Successful!</h3>
                        <p className="text-white/60">You can now login with your new password</p>
                    </div>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                    <form onSubmit={verifyOTP} className="space-y-6">
                        {/* Aadhaar Display (Read-only) */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                            <p className="text-white/60 text-sm mb-1">Aadhaar Number (Verified)</p>
                            <p className="text-white font-medium text-lg">{user.maskedAadhaar}</p>
                            <p className="text-white/40 text-xs mt-2">
                                <Shield className="w-3 h-3 inline mr-1" />
                                Aadhaar number cannot be modified
                            </p>
                        </div>

                        {/* OTP Request */}
                        {!otpRequested ? (
                            <div>
                                <p className="text-white/80 mb-4">Click below to receive OTP for password reset</p>
                                <button
                                    type="button"
                                    onClick={requestOTP}
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                                        text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all 
                                        disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request OTP'}
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">
                                    Enter OTP (Master OTP: 9898)
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength="6"
                                    className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-xl text-white 
                                        placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 
                                        outline-none transition-all text-center text-2xl tracking-widest"
                                    autoFocus
                                />
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {otpRequested && (
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 4}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                                    text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all 
                                    disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
                            </button>
                        )}
                    </form>
                )}

                {/* New Password Step */}
                {step === 'newPassword' && (
                    <form onSubmit={resetPassword} className="space-y-6">
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/10 rounded-xl 
                                        text-white placeholder-white/30 focus:border-purple-500 focus:ring-2 
                                        focus:ring-purple-500/20 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/10 rounded-xl 
                                        text-white placeholder-white/30 focus:border-purple-500 focus:ring-2 
                                        focus:ring-purple-500/20 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !newPassword || !confirmPassword}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                                text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all 
                                disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PasswordReset;
