import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, CreditCard, X, Key, Mail } from 'lucide-react';
import PasswordReset from './PasswordReset';

const UserProfile = ({ user, onClose }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(
                `https://civil-utility-kiosk.onrender.com/api/auth/profile/${user.userId}`
            );
            const data = await response.json();
            if (data.success) {
                setProfileData(data.user);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (showPasswordReset) {
        return (
            <PasswordReset
                user={profileData || user}
                onClose={() => setShowPasswordReset(false)}
                onBack={() => setShowPasswordReset(false)}
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}>
            <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl border border-white/20 
                p-8 max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        User Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="text-white/60 text-center py-12">Loading profile...</div>
                ) : profileData ? (
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Full Name</p>
                                    <p className="text-white font-medium">{profileData.name}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Consumer ID</p>
                                    <p className="text-white font-medium">{profileData.consumerId}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Mobile Number
                                    </p>
                                    <p className="text-white font-medium">{profileData.mobile}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </p>
                                    <p className="text-white font-medium">{profileData.email}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Aadhaar Number
                                    </p>
                                    <p className="text-white font-medium">{profileData.maskedAadhaar}</p>
                                </div>
                                {profileData.alternateMobile && (
                                    <div>
                                        <p className="text-white/60 text-sm mb-1">Alternate Mobile</p>
                                        <p className="text-white font-medium">{profileData.alternateMobile}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Address
                            </h3>
                            <div className="text-white/80 space-y-1">
                                <p>{profileData.address.line1}</p>
                                {profileData.address.line2 && <p>{profileData.address.line2}</p>}
                                {profileData.address.landmark && <p>Landmark: {profileData.address.landmark}</p>}
                                <p>{profileData.address.city}, {profileData.address.district}</p>
                                <p>{profileData.address.state} - {profileData.address.pincode}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowPasswordReset(true)}
                                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                                    text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all 
                                    flex items-center justify-center gap-2"
                            >
                                <Key className="w-5 h-5" />
                                Reset Password
                            </button>
                            <button
                                onClick={onClose}
                                className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold 
                                    hover:bg-white/20 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-white/60 text-center py-12">Failed to load profile</div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
