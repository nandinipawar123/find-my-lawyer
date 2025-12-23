import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login API call
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-3xl font-bold text-navy mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 w-full max-w-sm border border-gray-100">
        <div className="mb-4">
          <label className="block text-navy text-sm font-bold mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-navy leading-tight focus:outline-none focus:ring-2 focus:ring-orange" />
        </div>
        <div className="mb-6">
          <label className="block text-navy text-sm font-bold mb-2">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-navy leading-tight focus:outline-none focus:ring-2 focus:ring-orange" />
        </div>
        <button type="submit" className="bg-navy hover:bg-orange text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange w-full transition-colors">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
