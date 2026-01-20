import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import PaymentScreen from './components/PaymentScreen';
import ComplaintScreen from './components/ComplaintScreen';
import AdminDashboard from './components/AdminDashboard';
import { translations } from './translations';

const App = () => {
    const [screen, setScreen] = useState('home');
    const [serviceType, setServiceType] = useState(null);
    const [user, setUser] = useState(null);
    const [lang, setLang] = useState('en');

    const t = translations[lang] || translations.en;

    const handleServiceSelect = (service) => {
        setServiceType(service);
        setScreen('login');
    };

    const handleLogin = (userData) => {
        setUser({ ...userData, consumerId: userData.consumerId || 'CONS123456' });
        setScreen('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setServiceType(null);
        setScreen('home');
    };

    const handleNavigate = (destination) => {
        setScreen(destination);
    };

    const handleBack = () => {
        if (screen === 'login') {
            setScreen('home');
            setServiceType(null);
        } else {
            setScreen('dashboard');
        }
    };

    // Admin access (for demo - in production, use proper auth)
    const isAdmin = user?.consumerId === 'ADMIN';

    if (isAdmin) {
        return <AdminDashboard onLogout={handleLogout} t={t} />;
    }

    return (
        <div className="font-sans antialiased">
            {screen === 'home' && (
                <HomeScreen
                    onServiceSelect={handleServiceSelect}
                    t={t}
                    lang={lang}
                    setLang={setLang}
                />
            )}

            {screen === 'login' && (
                <LoginScreen
                    serviceType={serviceType}
                    onLogin={handleLogin}
                    onBack={handleBack}
                    t={t}
                />
            )}

            {screen === 'dashboard' && user && (
                <DashboardScreen
                    user={user}
                    serviceType={serviceType}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                    t={t}
                />
            )}

            {screen === 'payment' && user && (
                <PaymentScreen
                    user={user}
                    serviceType={serviceType}
                    onBack={() => setScreen('dashboard')}
                    t={t}
                />
            )}

            {screen === 'complaint' && user && (
                <ComplaintScreen
                    user={user}
                    serviceType={serviceType}
                    onBack={() => setScreen('dashboard')}
                    t={t}
                />
            )}
        </div>
    );
};

export default App;
