import React, { useState, useEffect } from 'react';
import {
    Zap, Flame, Droplet, Trash2,
    Home, User, LogOut, Bell,
    CreditCard, FileText,
    Activity, X, ChevronRight
} from 'lucide-react';

const UnifiedDashboard = ({ user, onLogout, onNavigate, t }) => {
    const [allBills, setAllBills] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);

    const serviceIcons = {
        electricity: { Icon: Zap, color: 'from-yellow-400 to-orange-500', label: 'Electricity' },
        gas: { Icon: Flame, color: 'from-red-400 to-pink-500', label: 'Gas' },
        water: { Icon: Droplet, color: 'from-blue-400 to-cyan-500', label: 'Water' },
        waste: { Icon: Trash2, color: 'from-green-400 to-emerald-500', label: 'Waste Management' },
    };

    useEffect(() => {
        fetchAllBills();
        fetchAllActivities();
    }, []);

    const fetchAllBills = async () => {
        try {
            const token = localStorage.getItem('suvidha_token');
            const response = await fetch(
                `https://civil-utility-kiosk.onrender.com/api/payment/all-bills/${user.userId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            const data = await response.json();
            if (data.success) {
                setAllBills(data.bills || []);
                setTotalAmount(data.totalAmount || 0);
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllActivities = async () => {
        try {
            const response = await fetch(
                `https://civil-utility-kiosk.onrender.com/api/activity/${user.userId}/all`
            );
            const data = await response.json();
            if (data.success) {
                setActivities(data.activities || []);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const handlePayAll = async () => {
        const confirmed = window.confirm(`Pay all bills totaling ₹${totalAmount}?`);
        if (!confirmed) return;

        try {
            alert('Payment gateway would be initiated here. Total: ₹' + totalAmount);
        } catch (error) {
            console.error('Error initiating payment:', error);
        }
    };

    const goToServiceDashboard = (serviceType) => {
        onNavigate('dashboard', serviceType);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                            <Home className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Your Dashboard</h1>
                            <p className="text-white/50 text-sm">All Services</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2 pr-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-white font-medium text-sm">{user.name}</p>
                                <p className="text-white/50 text-xs">{user.consumerId}</p>
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="p-3 rounded-xl bg-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-24 bg-white/5 backdrop-blur-xl border-r border-white/10 min-h-screen p-4 flex flex-col gap-4">
                    <div className="text-white/40 text-xs font-medium mb-2">SERVICES</div>
                    {Object.entries(serviceIcons).map(([key, { Icon, color, label }]) => (
                        <button
                            key={key}
                            onClick={() => goToServiceDashboard(key)}
                            className={`group relative p-4 rounded-xl bg-gradient-to-br ${color} 
                                hover:scale-110 transition-transform cursor-pointer`}
                            title={label}
                        >
                            <Icon className="w-6 h-6 text-white mx-auto" />
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white 
                                px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 
                                transition-opacity pointer-events-none">
                                {label}
                            </div>
                        </button>
                    ))}
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {/* Total Bill Summary */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 mb-8">
                        <div className="relative z-10">
                            <p className="text-white/70 text-sm font-medium mb-1">Total Outstanding</p>
                            <h2 className="text-5xl font-bold text-white mb-6">₹{totalAmount.toLocaleString()}</h2>
                            <button
                                onClick={handlePayAll}
                                className="bg-white text-purple-900 font-semibold px-8 py-4 rounded-xl 
                                    hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <CreditCard className="w-5 h-5" />
                                Pay All Bills
                            </button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                    </div>

                    {/* Bills by Service */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {allBills.map((bill) => {
                            const service = serviceIcons[bill.serviceType];
                            const ServiceIcon = service.Icon;
                            return (
                                <div
                                    key={bill.billId}
                                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 
                                        hover:bg-white/10 transition-all cursor-pointer"
                                    onClick={() => goToServiceDashboard(bill.serviceType)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color}`}>
                                                <ServiceIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{service.label}</h3>
                                                <p className="text-white/50 text-sm">{bill.consumption}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/40" />
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-white/60 text-sm">Amount Due</p>
                                            <p className="text-2xl font-bold text-white">₹{bill.amount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/60 text-sm">Due Date</p>
                                            <p className="text-white text-sm">{new Date(bill.dueDate).toLocaleDateString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Unified Recent Activity */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-400" />
                            Recent Activity (All Services)
                        </h3>
                        <div className="space-y-4">
                            {activities.length === 0 ? (
                                <p className="text-white/40 text-center py-8">No recent activity</p>
                            ) : (
                                activities.slice(0, 10).map((activity) => {
                                    const service = serviceIcons[activity.service_type];
                                    const ServiceIcon = service?.Icon || Activity;
                                    return (
                                        <div
                                            key={activity.activity_id}
                                            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service?.color || 'from-gray-500 to-gray-600'} 
                                                    flex items-center justify-center`}>
                                                    <ServiceIcon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{activity.description}</p>
                                                    <p className="text-white/50 text-xs">
                                                        {new Date(activity.created_at).toLocaleDateString('en-IN')} - {service?.label}
                                                    </p>
                                                </div>
                                            </div>
                                            {activity.amount && (
                                                <p className="text-emerald-400 font-medium">₹{activity.amount}</p>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UnifiedDashboard;
