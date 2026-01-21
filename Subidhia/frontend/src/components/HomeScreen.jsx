import React, { useState, useEffect } from 'react';
import {
    Zap, Flame, Droplet, Trash2,
    Home, User, LogOut, Bell,
    CreditCard, FileText, AlertCircle,
    Search, CheckCircle, XCircle,
    ChevronRight, Globe, Phone, Shield,
    Building, Settings, BarChart2, Users,
    ChevronDown
} from 'lucide-react';
import { LANGUAGES, translations } from '../translations';

const HomeScreen = ({ onServiceSelect, t, lang, setLang }) => {
    const [showLangMenu, setShowLangMenu] = useState(false);

    const services = [
        { id: 'electricity', icon: Zap, color: 'from-yellow-400 to-orange-500', bgGlow: 'shadow-yellow-500/30' },
        { id: 'gas', icon: Flame, color: 'from-red-400 to-pink-500', bgGlow: 'shadow-red-500/30' },
        { id: 'water', icon: Droplet, color: 'from-blue-400 to-cyan-500', bgGlow: 'shadow-blue-500/30' },
        { id: 'waste', icon: Trash2, color: 'from-green-400 to-emerald-500', bgGlow: 'shadow-green-500/30' },
    ];

    // Group languages by region for better UX
    const generalLanguages = ['en', 'hi', 'ta'];
    const assamLanguages = ['as', 'bn', 'brx', 'kha'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
            {/* Language Selector - Enhanced for multiple languages */}
            <div className="absolute top-6 right-6">
                <div className="relative">
                    <button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 hover:bg-white/20 transition-all"
                    >
                        <Globe className="w-5 h-5 text-white/70" />
                        <span className="text-white font-medium">{LANGUAGES[lang]?.name || 'English'}</span>
                        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showLangMenu && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50">
                            {/* General Languages */}
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                                    General
                                </div>
                                {generalLanguages.map((code) => (
                                    <button
                                        key={code}
                                        onClick={() => { setLang(code); setShowLangMenu(false); }}
                                        className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all flex items-center justify-between ${lang === code
                                                ? 'bg-purple-500/30 text-white'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <span>{LANGUAGES[code]?.name}</span>
                                        {lang === code && <CheckCircle className="w-4 h-4 text-purple-400" />}
                                    </button>
                                ))}
                            </div>

                            {/* Assam Languages */}
                            <div className="border-t border-white/10 p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                                    <span>🏔️</span> Assam Languages
                                </div>
                                {assamLanguages.map((code) => (
                                    <button
                                        key={code}
                                        onClick={() => { setLang(code); setShowLangMenu(false); }}
                                        className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all flex items-center justify-between ${lang === code
                                                ? 'bg-purple-500/30 text-white'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <span>{LANGUAGES[code]?.name}</span>
                                        {lang === code && <CheckCircle className="w-4 h-4 text-purple-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Logo & Title */}
            <div className="text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 mb-6">
                    <Building className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
                    सुविधा <span className="text-purple-400">SUVIDHA</span>
                </h1>
                <p className="text-xl text-white/60 max-w-md">
                    {t.subtitle}
                </p>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
                {services.map(({ id, icon: Icon, color, bgGlow }) => (
                    <button
                        key={id}
                        onClick={() => onServiceSelect(id)}
                        className={`group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 
              hover:bg-white/10 hover:border-white/20 hover:scale-105 
              transition-all duration-300 ${bgGlow} hover:shadow-2xl`}
                    >
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${color} mb-4 
              group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-1">{t[id]}</h3>
                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30 
              group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>

            {/* Quick Access */}
            <div className="mt-12 flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white/70 
          hover:bg-white/20 hover:text-white transition-all backdrop-blur-lg">
                    <Phone className="w-5 h-5" />
                    <span>Helpline: 1800-XXX-XXXX</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white/70 
          hover:bg-white/20 hover:text-white transition-all backdrop-blur-lg">
                    <Shield className="w-5 h-5" />
                    <span>Need Help?</span>
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
