import React, { useState } from 'react';

const RegisterClientPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to send OTP
    setStep(2);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to verify OTP and complete registration
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-3xl font-bold text-navy mb-6">Register as Client</h2>
      {step === 1 ? (
        <form onSubmit={handleRegister} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 w-full max-w-sm border border-gray-100">
          <div className="mb-4">
            <label className="block text-navy text-sm font-bold mb-2">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-navy focus:outline-none focus:ring-2 focus:ring-orange" />
          </div>
          <div className="mb-4">
            <label className="block text-navy text-sm font-bold mb-2">Contact Number</label>
            <input type="text" value={contactNumber} onChange={e => setContactNumber(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-navy focus:outline-none focus:ring-2 focus:ring-orange" />
          </div>
          <div className="mb-4">
            <label className="block text-navy text-sm font-bold mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-navy focus:outline-none focus:ring-2 focus:ring-orange" />
          </div>
          <div className="mb-6">
            <label className="block text-navy text-sm font-bold mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-navy focus:outline-none focus:ring-2 focus:ring-orange" />
          </div>
          <button type="submit" className="bg-orange hover:bg-copper text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 w-full max-w-sm border border-gray-100">
          <div className="mb-4">
            <label className="block text-navy text-sm font-bold mb-2">Enter OTP</label>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-navy focus:outline-none focus:ring-2 focus:ring-orange" />
          </div>
          <button type="submit" className="bg-navy hover:bg-orange text-white font-bold py-2 px-4 rounded-lg w-full transition-colors">Verify & Register</button>
        </form>
      )}
    </div>
  );
};

export default RegisterClientPage;
