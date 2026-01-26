import React, { useState } from 'react';
import {
    Zap, Flame, Droplet, Trash2,
    Home, User, LogOut, Bell,
    CreditCard, FileText, AlertCircle,
    Search, CheckCircle, PlusCircle,
    TrendingUp, Calendar, Download,
    ChevronRight, Activity
} from 'lucide-react';

const DashboardScreen = ({
    user,
    serviceType: propServiceType,
    onLogout,
    onNavigate,
    t
}) => {
    const [showNotifications, setShowNotifications] = useState(false);

    // Default to 'electricity' if no service type selected (global registration)
    const serviceType = propServiceType || 'electricity';

    const serviceIcons = {
        electricity: Zap,
        gas: Flame,
        water: Droplet,
        waste: Trash2,
    };

    const serviceColors = {
        electricity: 'from-yellow-400 to-orange-500',
        gas: 'from-red-400 to-pink-500',
        water: 'from-blue-400 to-cyan-500',
        waste: 'from-green-400 to-emerald-500',
    };

    const ServiceIcon = serviceIcons[serviceType] || Zap;

    // Mock data
    const billData = {
        amount: '₹2,450',
        dueDate: '25 Jan 2026',
        status: 'pending',
        consumption: '245 kWh',
    };

    const quickActions = [
        { id: 'payment', icon: CreditCard, label: t.payBill, color: 'bg-emerald-500' },
        { id: 'complaint', icon: AlertCircle, label: t.complaints, color: 'bg-red-500' },
        { id: 'newConnection', icon: PlusCircle, label: t.newConnection, color: 'bg-blue-500' },
        { id: 'viewBill', icon: FileText, label: t.viewBill, color: 'bg-purple-500' },
    ];

    const recentActivity = [
        { id: 1, type: 'payment', desc: 'Bill payment - Dec 2025', amount: '₹2,180', date: '15 Dec', status: 'success' },
        { id: 2, type: 'complaint', desc: 'Power outage reported', amount: null, date: '10 Dec', status: 'resolved' },
        { id: 3, type: 'payment', desc: 'Bill payment - Nov 2025', amount: '₹2,050', date: '14 Nov', status: 'success' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${serviceColors[serviceType]}`}>
                            <ServiceIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{t.dashboard}</h1>
                            <p className="text-white/50 text-sm">{t[serviceType]}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-3 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                                2
                            </span>
                        </button>

                        {/* User Menu */}
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2 pr-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-white font-medium text-sm">{user.name}</p>
                                <p className="text-white/50 text-xs">{user.consumerId}</p>
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={onLogout}
                            className="p-3 rounded-xl bg-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Current Bill Card */}
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${serviceColors[serviceType]} p-8 mb-8`}>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <p className="text-white/70 text-sm font-medium mb-1">Current Bill Amount</p>
                            <h2 className="text-5xl font-bold text-white mb-4">{billData.amount}</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                                    <Calendar className="w-4 h-4 text-white/70" />
                                    <span className="text-white text-sm">Due: {billData.dueDate}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                                    <Activity className="w-4 h-4 text-white/70" />
                                    <span className="text-white text-sm">{billData.consumption}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onNavigate('payment')}
                            className="bg-white text-purple-900 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            {t.payNow}
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute right-20 bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {quickActions.map(({ id, icon: Icon, label, color }) => (
                        <button
                            key={id}
                            onClick={() => onNavigate(id)}
                            className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 
                hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                            <div className={`inline-flex p-3 rounded-xl ${color} mb-4 
                group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-white font-medium">{label}</p>
                        </button>
                    ))}
                </div>

                {/* Account Details & Recent Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Account Details */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-400" />
                            {t.accountDetails}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-white/60">Consumer ID</span>
                                <span className="text-white font-medium">{user.consumerId}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-white/60">Name</span>
                                <span className="text-white font-medium">{user.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-white/60">Mobile</span>
                                <span className="text-white font-medium">{user.mobile}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-white/60">Service Type</span>
                                <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${serviceColors[serviceType]} text-white text-sm font-medium`}>
                                    {t[serviceType]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-400" />
                            {t.recentActivity}
                        </h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.status === 'success' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                                            }`}>
                                            {activity.type === 'payment' ? (
                                                <CreditCard className={`w-5 h-5 ${activity.status === 'success' ? 'text-emerald-400' : 'text-blue-400'
                                                    }`} />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-blue-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{activity.desc}</p>
                                            <p className="text-white/50 text-xs">{activity.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {activity.amount && (
                                            <p className="text-emerald-400 font-medium">{activity.amount}</p>
                                        )}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${activity.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                                            activity.status === 'resolved' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardScreen;
