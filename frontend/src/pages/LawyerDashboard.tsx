import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LawyerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [bio, setBio] = useState('');
    const [expertise, setExpertise] = useState('');

    useEffect(() => {
        // Fetch lawyer profile usually - but user object has some data? 
        // No, we need to fetch profile status specifically or trust user object if updated
        // For MVP, lets assume we need to fetch status
        // But our /me endpoint returns User, not LawyerProfile. 
        // We might need a separate endpoint or just handle it gracefully.
        // Actually, let's create a getProfile endpoint or just inferred for now.
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put('/lawyers/profile', { bio, expertise: expertise.split(',') });
            alert('Profile updated!');
        } catch (error) {
            console.error(error);
            alert('Failed to update');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-navy text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Lawyer Portal</h1>
                <button onClick={() => { logout(); navigate('/'); }} className="text-sm bg-white text-navy px-3 py-1 rounded">Logout</button>
            </nav>
            <div className="p-8">
                <h2 className="text-3xl font-bold text-navy mb-4">Welcome, Advocate {user?.name}</h2>

                {/* Simplified Status View - Ideally fetched from backend */}
                <div className="bg-white p-6 rounded shadow mb-6 border-l-4 border-copper">
                    <h3 className="text-xl font-semibold">Account Status</h3>
                    <p className="mt-2 text-gray-600">
                        Check with Admin if your account is not verified yet.
                    </p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block mb-1">Bio</label>
                            <textarea
                                className="w-full border p-2 rounded"
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Expertise (comma separated)</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={expertise}
                                onChange={e => setExpertise(e.target.value)}
                            />
                        </div>
                        <button className="bg-navy text-white px-4 py-2 rounded">Update Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LawyerDashboard;
