import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { type } = useParams(); // client | lawyer
    const navigate = useNavigate();
    const { login } = useAuth();

    const isLawyer = type === 'lawyer';

    const [step, setStep] = useState(1); // 1: send otp, 2: verify otp, 3: register
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        enrollmentNumber: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // STEP 1: SEND OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/send-otp', { phone: formData.phone });
            setStep(2);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    // STEP 2: VERIFY OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/verify-otp', {
                phone: formData.phone,
                otp,
            });
            setOtpVerified(true);
            setStep(3);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP');
        }
    };

    // STEP 3: REGISTER USER
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = '/auth/register';

            const payload = isLawyer
                ? {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    enrollmentNumber: formData.enrollmentNumber,
                }
                : {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                };

            const res = await api.post(endpoint, payload);

            login(res.data.token, res.data.user);

            if (isLawyer) {
                navigate('/lawyer/upload');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold text-navy text-center mb-6">
                    {isLawyer ? 'Lawyer Registration' : 'Client Registration'}
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <input name="name" placeholder="Full Name" required className="w-full p-2 border rounded" onChange={handleChange} />
                        <input name="email" type="email" placeholder="Email" required className="w-full p-2 border rounded" onChange={handleChange} />
                        <input name="phone" placeholder="Phone Number" required className="w-full p-2 border rounded" onChange={handleChange} />
                        <input name="password" type="password" placeholder="Password" required className="w-full p-2 border rounded" onChange={handleChange} />

                        {isLawyer && (
                            <input
                                name="enrollmentNumber"
                                placeholder="Bar Council Enrollment Number"
                                required
                                className="w-full p-2 border rounded"
                                onChange={handleChange}
                            />
                        )}

                        <button className="w-full py-3 bg-navy text-white rounded">
                            Send OTP
                        </button>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <input
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 border rounded text-center"
                            required
                        />
                        <button className="w-full py-3 bg-green-600 text-white rounded">
                            Verify OTP
                        </button>
                    </form>
                )}

                {/* STEP 3 */}
                {step === 3 && otpVerified && (
                    <form onSubmit={handleRegister}>
                        <button className="w-full py-3 bg-blue-600 text-white rounded">
                            Complete Registration
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
