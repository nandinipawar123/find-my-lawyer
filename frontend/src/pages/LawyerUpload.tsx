import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LawyerUpload = () => {
    const [url, setUrl] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // In real app, this would be a file upload. Here we simulate passing a URL.
            await api.post('/lawyers/upload-certificate', { certificateUrl: url || 'https://mock.com/cert.pdf' });
            setMsg('Documents uploaded. Your account is pending verification.');
            setTimeout(() => {
                navigate('/lawyer/dashboard');
            }, 2000);
        } catch (err) {
            console.error(err);
            setMsg('Upload failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-navy mb-4">Upload Credentials</h2>
                <p className="mb-6 text-gray-600">Please upload your Lawyer Certificate for Admin verification.</p>

                {msg && <div className="bg-green-100 text-green-800 p-2 rounded mb-4">{msg}</div>}

                <form onSubmit={handleUpload} className="space-y-4">
                    {/* Mocking file input as text URL or just a button */}
                    <div className="border-2 border-dashed border-gray-300 p-10 rounded">
                        <p>Drag & Drop your PDF here</p>
                        <p className="text-sm text-gray-400 mt-2">(or enter a URL for mock)</p>
                        <input
                            type="text"
                            placeholder="Document URL (simulate upload)"
                            className="w-full border p-2 mt-4"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full py-3 bg-copper text-white font-bold rounded">
                        Upload Verification Documents
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LawyerUpload;
