import React, { useState } from 'react';
import {
    BarChart2, Users, CreditCard, AlertCircle,
    TrendingUp, TrendingDown, Activity, Clock,
    Zap, Flame, Droplet, Trash2, LogOut,
    Settings, Bell, Search, Calendar,
    ChevronRight, CheckCircle, XCircle
} from 'lucide-react';

const AdminDashboard = ({ onLogout, t }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');

    const stats = [
        {
            id: 'transactions',
            label: t.totalTransactions,
            value: '1,247',
            change: '+12.5%',
            trend: 'up',
            icon: CreditCard,
            color: 'from-emerald-400 to-teal-500'
        },
        {
            id: 'complaints',
            label: t.activeComplaints,
            value: '89',
            change: '-8.2%',
            trend: 'down',
            icon: AlertCircle,
            color: 'from-red-400 to-pink-500'
        },
        {
            id: 'collection',
            label: t.todayCollection,
            value: '₹12.5L',
            change: '+18.3%',
            trend: 'up',
            icon: TrendingUp,
            color: 'from-purple-400 to-indigo-500'
        },
        {
            id: 'usage',
            label: t.kioskUsage,
            value: '3,892',
            change: '+5.7%',
            trend: 'up',
            icon: Users,
            color: 'from-blue-400 to-cyan-500'
        },
    ];

    const serviceStats = [
        { service: 'electricity', icon: Zap, transactions: 456, amount: '₹4.8L', complaints: 23 },
        { service: 'gas', icon: Flame, transactions: 312, amount: '₹2.1L', complaints: 18 },
        { service: 'water', icon: Droplet, transactions: 289, amount: '₹1.9L', complaints: 31 },
        { service: 'waste', icon: Trash2, transactions: 190, amount: '₹0.8L', complaints: 17 },
    ];

    const recentActivities = [
        { id: 1, type: 'payment', user: 'John Doe', amount: '₹2,450', service: 'electricity', time: '2 min ago', status: 'success' },
        { id: 2, type: 'complaint', user: 'Jane Smith', amount: null, service: 'water', time: '5 min ago', status: 'new' },
        { id: 3, type: 'payment', user: 'Mike Johnson', amount: '₹1,890', service: 'gas', time: '8 min ago', status: 'success' },
        { id: 4, type: 'connection', user: 'Sarah Wilson', amount: null, service: 'electricity', time: '12 min ago', status: 'pending' },
        { id: 5, type: 'payment', user: 'Tom Brown', amount: '₹3,200', service: 'water', time: '15 min ago', status: 'failed' },
    ];

    const pendingComplaints = [
        { id: 'CMP12345', type: 'Power Outage', location: 'Sector 15', priority: 'high', time: '30 min' },
        { id: 'CMP12346', type: 'Water Supply', location: 'Block A', priority: 'medium', time: '1 hr' },
        { id: 'CMP12347', type: 'Gas Leak', location: 'Market Road', priority: 'critical', time: '45 min' },
        { id: 'CMP12348', type: 'Billing Issue', location: 'Phase 2', priority: 'low', time: '2 hr' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-emerald-500/20 text-emerald-400';
            case 'failed': return 'bg-red-500/20 text-red-400';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'new': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-500 text-white';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-yellow-500 text-white';
            case 'low': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                            <BarChart2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{t.adminDashboard}</h1>
                            <p className="text-white/50 text-sm">SUVIDHA Kiosk Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-12 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/30 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all w-64"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-3 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                                5
                            </span>
                        </button>

                        {/* Settings */}
                        <button className="p-3 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all">
                            <Settings className="w-5 h-5" />
                        </button>

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

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Period Selector */}
                <div className="flex items-center gap-4 mb-8">
                    {['today', 'week', 'month', 'year'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedPeriod === period
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map(({ id, label, value, change, trend, icon: Icon, color }) => (
                        <div key={id} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                                    }`}>
                                    {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {change}
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{value}</p>
                            <p className="text-white/50 text-sm">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Service-wise Stats */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-6">Service-wise Statistics</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-white/10">
                                    <th className="pb-4 text-white/60 font-medium">Service</th>
                                    <th className="pb-4 text-white/60 font-medium">Transactions</th>
                                    <th className="pb-4 text-white/60 font-medium">Collection</th>
                                    <th className="pb-4 text-white/60 font-medium">Complaints</th>
                                    <th className="pb-4 text-white/60 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceStats.map(({ service, icon: Icon, transactions, amount, complaints }) => (
                                    <tr key={service} className="border-b border-white/5">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-white/10">
                                                    <Icon className="w-5 h-5 text-white/70" />
                                                </div>
                                                <span className="text-white font-medium capitalize">{service}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-white">{transactions}</td>
                                        <td className="py-4 text-emerald-400 font-medium">{amount}</td>
                                        <td className="py-4 text-white">{complaints}</td>
                                        <td className="py-4">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-400" />
                                Recent Activity
                            </h3>
                            <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(activity.status)}`}>
                                            {activity.status === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                                activity.status === 'failed' ? <XCircle className="w-5 h-5" /> :
                                                    <Clock className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{activity.user}</p>
                                            <p className="text-white/50 text-xs capitalize">{activity.type} • {activity.service}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {activity.amount && <p className="text-white font-medium">{activity.amount}</p>}
                                        <p className="text-white/40 text-xs">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Complaints */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                Pending Complaints
                            </h3>
                            <button className="text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1">
                                Manage <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {pendingComplaints.map((complaint) => (
                                <div key={complaint.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-white text-sm font-medium">{complaint.type}</p>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                                                {complaint.priority}
                                            </span>
                                        </div>
                                        <p className="text-white/50 text-xs">{complaint.id} • {complaint.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-white/40 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {complaint.time}
                                        </div>
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

export default AdminDashboard;
