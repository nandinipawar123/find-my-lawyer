import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LawyerUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMsg('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('certificate', file); // 🔑 must match backend

      await api.post('/lawyers/upload-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMsg('Documents uploaded successfully. Pending admin verification.');

      setTimeout(() => {
        navigate('/lawyer/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMsg('Upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">
          Upload Lawyer Certificate
        </h2>

        <p className="mb-6 text-gray-600">
          Upload your Bar Council certificate (PDF / JPG / PNG).
        </p>

        {msg && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {msg}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-copper text-white font-bold rounded"
          >
            Upload Certificate
          </button>
        </form>
      </div>
    </div>
  );
};

export default LawyerUpload;
