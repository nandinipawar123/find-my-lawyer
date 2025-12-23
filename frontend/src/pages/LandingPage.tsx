import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-5xl font-extrabold text-navy mb-4">FindMyLawyer</h1>
      <p className="text-xl text-navy mb-8 font-medium">Connecting Clients with Verified Legal Experts</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link to="/login" className="bg-navy text-white py-3 rounded-lg text-center font-semibold shadow hover:bg-orange transition-colors">Login</Link>
        <Link to="/register-client" className="bg-orange text-white py-3 rounded-lg text-center font-semibold shadow hover:bg-copper transition-colors">Register as Client</Link>
        <Link to="/register-lawyer" className="bg-copper text-white py-3 rounded-lg text-center font-semibold shadow hover:bg-orange transition-colors">Register as Lawyer</Link>
      </div>
    </div>
  );
};

export default LandingPage;
