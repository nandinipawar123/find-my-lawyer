import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';

const LawyerUpload: React.FC = () => {
    const [msg, setMsg] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleUploadSuccess = (url: string) => {
        setMsg('Documents uploaded successfully! Your account is pending verification.');
        setIsError(false);
        setTimeout(() => {
            navigate('/lawyer/dashboard');
        }, 3000);
    };

    const handleUploadError = (error: string) => {
        setMsg(error);
        setIsError(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-navy mb-4">Upload Credentials</h2>
                <p className="mb-6 text-gray-600">Please upload your Lawyer Certificate for Admin verification.</p>

                {msg && (
                    <div className={`p-3 rounded mb-6 text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {msg}
                    </div>
                )}

                <FileUpload 
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                />
            </div>
        </div>
    );
};

export default LawyerUpload;
