import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
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
    const [authToken, setAuthToken] = useState(null);

    const t = translations[lang] || translations.en;

    // Check for existing session on mount
    useEffect(() => {
        const token = localStorage.getItem('suvidha_token');
        const savedUser = localStorage.getItem('suvidha_user');
        if (token && savedUser) {
            setAuthToken(token);
            setUser(JSON.parse(savedUser));
            setScreen('dashboard');
        }
    }, []);

    const handleServiceSelect = (service) => {
        setServiceType(service);
        setScreen('login');
    };

    const handleLogin = (userData, token) => {
        setUser(userData);
        if (token) {
            setAuthToken(token);
            localStorage.setItem('suvidha_token', token);
            localStorage.setItem('suvidha_user', JSON.stringify(userData));
        }
        setScreen('dashboard');
    };

    const handleRegisterSuccess = (userData, token) => {
        setUser(userData);
        if (token) {
            setAuthToken(token);
            localStorage.setItem('suvidha_token', token);
            localStorage.setItem('suvidha_user', JSON.stringify(userData));
        }
        setScreen('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setAuthToken(null);
        setServiceType(null);
        localStorage.removeItem('suvidha_token');
        localStorage.removeItem('suvidha_user');
        setScreen('home');
    };

    const handleNavigate = (destination) => {
        setScreen(destination);
    };

    const handleBack = () => {
        if (screen === 'login' || screen === 'register') {
            setScreen('home');
            setServiceType(null);
        } else {
            setScreen('dashboard');
        }
    };

    const handleGoToRegister = () => {
        setScreen('register');
    };

    const handleGoToLogin = () => {
        setScreen('login');
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
                    onRegister={handleGoToRegister}
                    t={t}
                />
            )}

            {screen === 'register' && (
                <RegisterScreen
                    onBack={handleBack}
                    onLogin={handleGoToLogin}
                    onRegisterSuccess={handleRegisterSuccess}
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
