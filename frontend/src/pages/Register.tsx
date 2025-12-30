import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { type } = useParams(); // 'client' or 'lawyer'
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState(1); // 1: Register, 2: OTP
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        enrollmentNumber: '',
    });
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const isLawyer = type === 'lawyer';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                role: type,
            };

            const res = await api.post('/auth/register', payload);
            // Check if the response has data and id
            if (res.data && (res.data._id || res.data.id)) {
                setUserId(res.data._id || res.data.id);
                setStep(2);
                setError('');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/verify-otp', { userId, otp });
            // Login the user
            login(res.data.token, res.data);

            if (isLawyer) {
                navigate('/lawyer/upload');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-navy text-center mb-6">
                    {isLawyer ? 'Lawyer Registration' : 'Client Registration'}
                </h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <input
                            type="text" placeholder="Full Name" name="name"
                            className="w-full p-2 border rounded"
                            onChange={handleChange} required
                        />
                        <input
                            type="email" placeholder="Email Address" name="email"
                            className="w-full p-2 border rounded"
                            onChange={handleChange} required
                        />
                        <input
                            type="text" placeholder="Phone Number" name="phone"
                            className="w-full p-2 border rounded"
                            onChange={handleChange} required
                        />
                        <input
                            type="password" placeholder="Password" name="password"
                            className="w-full p-2 border rounded"
                            onChange={handleChange} required
                        />

                        {isLawyer && (
                            <input
                                type="text" placeholder="Bar Council Enrollment Number" name="enrollmentNumber"
                                className="w-full p-2 border rounded"
                                onChange={handleChange} required
                            />
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-navy text-white font-bold rounded hover:bg-opacity-90"
                        >
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <p className="text-center text-gray-600 mb-4">Enter the OTP sent to your phone (Mock: 123456)</p>
                        <input
                            type="text" placeholder="Enter OTP"
                            className="w-full p-2 border rounded text-center text-xl tracking-widest"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)} required
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-opacity-90"
                        >
                            Verify & Proceed
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
