import React, { useState } from 'react';
import {
    User, Lock, ArrowLeft, Shield,
    Phone, Eye, EyeOff, Loader2
} from 'lucide-react';

const LoginScreen = ({ serviceType, onLogin, onBack, t }) => {
    const [consumerId, setConsumerId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const serviceColors = {
        electricity: 'from-yellow-400 to-orange-500',
        gas: 'from-red-400 to-pink-500',
        water: 'from-blue-400 to-cyan-500',
        waste: 'from-green-400 to-emerald-500',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!consumerId || !password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onLogin({ consumerId, name: 'John Doe', mobile: '+91 9876543210' });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Services</span>
                </button>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${serviceColors[serviceType]} mb-4`}>
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{t.login}</h2>
                        <p className="text-white/60">{t.loginSubtitle}</p>
                        <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${serviceColors[serviceType]} text-white text-sm font-medium mt-3`}>
                            {t[serviceType]}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Consumer ID */}
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">{t.consumerId}</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    placeholder="Enter Consumer ID or Mobile"
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">{t.password}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password or OTP"
                                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl bg-gradient-to-r ${serviceColors[serviceType]} text-white font-semibold 
                hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t.processing}</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    <span>{t.loginBtn}</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick OTP Link */}
                    <div className="mt-6 text-center">
                        <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                            Request OTP instead
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
