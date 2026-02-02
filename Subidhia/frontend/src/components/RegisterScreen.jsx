import React, { useState } from 'react';
import {
    User, Lock, ArrowLeft, Shield, Phone, Eye, EyeOff, Loader2,
    Mail, MapPin, Camera, CheckCircle, AlertCircle, ArrowRight,
    CreditCard, Home, Building, ChevronLeft
} from 'lucide-react';

// Indian states list
const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const RegisterScreen = ({ onBack, onLogin, onRegisterSuccess, t }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);
    const [aadhaarVerified, setAadhaarVerified] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        aadhaarNumber: '',
        name: '',
        email: '',
        mobile: '',
        alternateMobile: '',
        dateOfBirth: '',
        gender: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
        password: '',
        confirmPassword: '',
        profilePhoto: null
    });

    // Validation errors
    const [validationErrors, setValidationErrors] = useState({});

    const steps = [
        { number: 1, title: 'Aadhaar', icon: CreditCard },
        { number: 2, title: 'Personal', icon: User },
        { number: 3, title: 'Address', icon: Home },
        { number: 4, title: 'Security', icon: Lock },
        { number: 5, title: 'Review', icon: CheckCircle }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Profile photo must be less than 2MB');
                return;
            }
            setFormData(prev => ({ ...prev, profilePhoto: file }));
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    // Aadhaar format validation (12 digits, no leading 0 or 1)
    const validateAadhaar = (aadhaar) => {
        const cleaned = aadhaar.replace(/[\s-]/g, '');
        if (!/^\d{12}$/.test(cleaned)) {
            return 'Aadhaar must be exactly 12 digits';
        }
        if (['0', '1'].includes(cleaned[0])) {
            return 'Aadhaar cannot start with 0 or 1';
        }
        if (/^(\d)\1{11}$/.test(cleaned)) {
            return 'Invalid Aadhaar number';
        }
        return null;
    };

    // Password strength validation
    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
        if (!/\d/.test(password)) errors.push('One number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character');
        return errors;
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    };

    const verifyAadhaar = async () => {
        const aadhaarError = validateAadhaar(formData.aadhaarNumber);
        if (aadhaarError) {
            setValidationErrors({ aadhaarNumber: aadhaarError });
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://civil-utility-kiosk.onrender.com/api/auth/verify-aadhaar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aadhaarNumber: formData.aadhaarNumber })
            });

            const data = await response.json();

            if (data.isAlreadyRegistered) {
                setError('This Aadhaar is already registered. Please login instead.');
                return;
            }

            if (data.success) {
                setAadhaarVerified(true);
                setSuccess('Aadhaar verified successfully!');
                setTimeout(() => {
                    setSuccess('');
                    setStep(2);
                }, 1500);
            } else {
                setError(data.message || 'Aadhaar verification failed');
            }
        } catch (err) {
            // In development, allow proceeding even if backend is not running
            console.warn('Backend not available, proceeding in demo mode');
            const aadhaarError = validateAadhaar(formData.aadhaarNumber);
            if (!aadhaarError) {
                setAadhaarVerified(true);
                setSuccess('Aadhaar format verified (demo mode)');
                setTimeout(() => {
                    setSuccess('');
                    setStep(2);
                }, 1500);
            }
        } finally {
            setLoading(false);
        }
    };

    const validateStep = (stepNumber) => {
        const errors = {};

        switch (stepNumber) {
            case 2: // Personal details
                if (!formData.name.trim()) errors.name = 'Name is required';
                if (!formData.email.trim()) errors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
                if (!formData.mobile.trim()) errors.mobile = 'Mobile is required';
                else if (!/^[6-9]\d{9}$/.test(formData.mobile)) errors.mobile = 'Invalid mobile number';
                break;

            case 3: // Address
                if (!formData.addressLine1.trim()) errors.addressLine1 = 'Address is required';
                if (!formData.city.trim()) errors.city = 'City is required';
                if (!formData.district.trim()) errors.district = 'District is required';
                if (!formData.state) errors.state = 'State is required';
                if (!formData.pincode.trim()) errors.pincode = 'Pincode is required';
                else if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = 'Pincode must be 6 digits';
                break;

            case 4: // Security
                const pwdErrors = validatePassword(formData.password);
                if (pwdErrors.length > 0) errors.password = `Missing: ${pwdErrors.join(', ')}`;
                if (formData.password !== formData.confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
                }
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, 5));
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'profilePhoto' && formData[key]) {
                    submitData.append('profilePhoto', formData[key]);
                } else if (formData[key]) {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await fetch('https://civil-utility-kiosk.onrender.com/api/auth/register', {
                method: 'POST',
                body: submitData
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Registration successful! Redirecting to dashboard...');
                setTimeout(() => {
                    if (onRegisterSuccess) {
                        onRegisterSuccess(data.user, data.token);
                    }
                }, 2000);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatAadhaar = (value) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 12);
        const parts = cleaned.match(/.{1,4}/g) || [];
        return parts.join(' ');
    };

    const renderStepIndicator = () => (
        <div className="flex justify-between mb-8 px-4">
            {steps.map((s, index) => (
                <div key={s.number} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                        ${step >= s.number
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                            : 'bg-white/10 text-white/40'}`}>
                        {step > s.number ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <s.icon className="w-5 h-5" />
                        )}
                    </div>
                    <span className={`text-xs mt-2 ${step >= s.number ? 'text-white' : 'text-white/40'}`}>
                        {s.title}
                    </span>
                    {index < steps.length - 1 && (
                        <div className={`hidden md:block absolute h-0.5 w-16 top-5 left-1/2
                            ${step > s.number ? 'bg-purple-500' : 'bg-white/10'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Enter Aadhaar Number</h2>
                <p className="text-white/60">Your 12-digit Aadhaar will be verified</p>
            </div>

            <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Aadhaar Number *</label>
                <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        name="aadhaarNumber"
                        value={formatAadhaar(formData.aadhaarNumber)}
                        onChange={(e) => handleChange({
                            target: {
                                name: 'aadhaarNumber',
                                value: e.target.value.replace(/\s/g, '')
                            }
                        })}
                        placeholder="XXXX XXXX XXXX"
                        maxLength={14}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white text-lg tracking-widest
                            placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                            ${validationErrors.aadhaarNumber ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                    />
                    {aadhaarVerified && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                </div>
                {validationErrors.aadhaarNumber && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {validationErrors.aadhaarNumber}
                    </p>
                )}
                <p className="text-white/40 text-xs mt-2">
                    Aadhaar is a 12-digit unique identity number issued by UIDAI
                </p>
            </div>

            <button
                onClick={verifyAadhaar}
                disabled={loading || formData.aadhaarNumber.length !== 12}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold
                    hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                    </>
                ) : (
                    <>
                        <Shield className="w-5 h-5" />
                        <span>Verify Aadhaar</span>
                    </>
                )}
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Personal Details</h2>
                <p className="text-white/60">Enter your personal information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm font-medium mb-2">Full Name *</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white
                                placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                                ${validationErrors.name ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                        />
                    </div>
                    {validationErrors.name && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Email *</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white
                                placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                                ${validationErrors.email ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                        />
                    </div>
                    {validationErrors.email && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Mobile Number *</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white
                                placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                                ${validationErrors.mobile ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                        />
                    </div>
                    {validationErrors.mobile && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.mobile}</p>
                    )}
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Alternate Mobile</label>
                    <input
                        type="tel"
                        name="alternateMobile"
                        value={formData.alternateMobile}
                        onChange={handleChange}
                        placeholder="Optional"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white
                            placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white
                            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white
                            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                    >
                        <option value="" className="bg-slate-800">Select Gender</option>
                        <option value="male" className="bg-slate-800">Male</option>
                        <option value="female" className="bg-slate-800">Female</option>
                        <option value="other" className="bg-slate-800">Other</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Residential Address</h2>
                <p className="text-white/60">Your permanent residential address</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm font-medium mb-2">Address Line 1 *</label>
                    <div className="relative">
                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            placeholder="House/Flat No., Building Name, Street"
                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white
                                placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                                ${validationErrors.addressLine1 ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                        />
                    </div>
                    {validationErrors.addressLine1 && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.addressLine1}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm font-medium mb-2">Address Line 2</label>
                    <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        placeholder="Area, Locality (Optional)"
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white
                            placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Landmark</label>
                    <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        placeholder="Near (Optional)"
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white
                            placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Pincode *</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white
                                placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                                ${validationErrors.pincode ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                        />
                    </div>
                    {validationErrors.pincode && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.pincode}</p>
                    )}
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white
                            placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                            ${validationErrors.city ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                    />
                    {validationErrors.city && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.city}</p>
                    )}
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">District *</label>
                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="District"
                        className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white
                            placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                            ${validationErrors.district ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                    />
                    {validationErrors.district && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.district}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm font-medium mb-2">State *</label>
                    <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white
                                focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                                ${validationErrors.state ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                        >
                            <option value="" className="bg-slate-800">Select State</option>
                            {INDIAN_STATES.map(state => (
                                <option key={state} value={state} className="bg-slate-800">{state}</option>
                            ))}
                        </select>
                    </div>
                    {validationErrors.state && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.state}</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => {
        const passwordStrength = getPasswordStrength(formData.password);
        const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
        const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

        return (
            <div className="space-y-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Security & Photo</h2>
                    <p className="text-white/60">Set your password and upload profile photo</p>
                </div>

                {/* Profile Photo Upload */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        {profilePreview ? (
                            <img
                                src={profilePreview}
                                alt="Profile Preview"
                                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-white/30
                                flex items-center justify-center">
                                <Camera className="w-8 h-8 text-white/40" />
                            </div>
                        )}
                        <label className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full cursor-pointer
                            hover:bg-purple-600 transition-colors">
                            <Camera className="w-4 h-4 text-white" />
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="text-white/40 text-sm mt-2">Profile Photo (Optional)</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl text-white
                                    placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                                    ${validationErrors.password ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded ${i <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white/10'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs ${strengthColors[passwordStrength - 1]?.replace('bg-', 'text-') || 'text-white/40'}`}>
                                    {strengthLabels[passwordStrength - 1] || 'Enter password'}
                                </p>
                            </div>
                        )}

                        {validationErrors.password && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">Confirm Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl text-white
                                    placeholder-white/30 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all
                                    ${validationErrors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Passwords match
                            </p>
                        )}
                        {validationErrors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl text-white/60 text-sm">
                    <p className="font-medium text-white/80 mb-2">Password Requirements:</p>
                    <ul className="space-y-1">
                        <li className={formData.password.length >= 8 ? 'text-green-400' : ''}>
                            ✓ At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}>
                            ✓ One uppercase letter
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'text-green-400' : ''}>
                            ✓ One lowercase letter
                        </li>
                        <li className={/\d/.test(formData.password) ? 'text-green-400' : ''}>
                            ✓ One number
                        </li>
                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-400' : ''}>
                            ✓ One special character
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    const renderStep5 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Review & Submit</h2>
                <p className="text-white/60">Please verify your information before submitting</p>
            </div>

            <div className="space-y-4">
                {/* Aadhaar */}
                <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-orange-400" />
                            Aadhaar Number
                        </h3>
                        {aadhaarVerified && (
                            <span className="text-green-400 text-sm flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Verified
                            </span>
                        )}
                    </div>
                    <p className="text-white/70">{formatAadhaar(formData.aadhaarNumber)}</p>
                </div>

                {/* Personal Details */}
                <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-purple-400" />
                        Personal Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-white/50">Name:</span> <span className="text-white/90">{formData.name}</span></div>
                        <div><span className="text-white/50">Email:</span> <span className="text-white/90">{formData.email}</span></div>
                        <div><span className="text-white/50">Mobile:</span> <span className="text-white/90">{formData.mobile}</span></div>
                        {formData.gender && <div><span className="text-white/50">Gender:</span> <span className="text-white/90 capitalize">{formData.gender}</span></div>}
                    </div>
                </div>

                {/* Address */}
                <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                        <Home className="w-4 h-4 text-blue-400" />
                        Residential Address
                    </h3>
                    <p className="text-white/70 text-sm">
                        {formData.addressLine1}
                        {formData.addressLine2 && `, ${formData.addressLine2}`}
                        {formData.landmark && `, Near ${formData.landmark}`}
                        <br />
                        {formData.city}, {formData.district}, {formData.state} - {formData.pincode}
                    </p>
                </div>

                {/* Profile Photo */}
                {profilePreview && (
                    <div className="p-4 bg-white/5 rounded-xl flex items-center gap-4">
                        <img src={profilePreview} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <h3 className="text-white font-medium">Profile Photo</h3>
                            <p className="text-white/50 text-sm">Uploaded successfully</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-sm">
                    By clicking "Complete Registration", you agree to our Terms of Service and Privacy Policy.
                    Your information will be securely stored and used only for service-related communications.
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl">
                {/* Back Button */}
                <button
                    onClick={step > 1 ? prevStep : onBack}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{step > 1 ? 'Previous Step' : 'Back to Login'}</span>
                </button>

                {/* Registration Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl">
                    {/* Step Indicator */}
                    {renderStepIndicator()}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            {success}
                        </div>
                    )}

                    {/* Step Content */}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderStep5()}

                    {/* Navigation Buttons */}
                    {step > 1 && (
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={prevStep}
                                className="flex-1 py-4 rounded-xl bg-white/10 text-white font-semibold
                                    hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Back
                            </button>

                            {step < 5 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold
                                        hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Next
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold
                                        hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                        flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Complete Registration
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-white/50 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={onLogin}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
