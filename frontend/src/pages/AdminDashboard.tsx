import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [pendingLawyers, setPendingLawyers] = useState<any[]>([]);
    const [rate, setRate] = useState<number>(0);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await api.get('/lawyers/pending');
            setPendingLawyers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerify = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
        try {
            await api.put(`/lawyers/verify/${id}`, { status, authorizedRate: rate });
            alert(`Lawyer ${status}`);
            fetchPending();
        } catch (error) {
            console.error(error);
            alert('Action failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-navy text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <button onClick={() => { logout(); navigate('/'); }} className="text-sm bg-white text-navy px-3 py-1 rounded">Logout</button>
            </nav>
            <div className="p-8">
                <h2 className="text-3xl font-bold text-navy mb-6">Pending Lawyer Applications</h2>

                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Enrollment No.</th>
                                <th className="p-4">Certificate</th>
                                <th className="p-4">Set Rate</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingLawyers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">No pending applications</td>
                                </tr>
                            ) : (
                                pendingLawyers.map((profile) => (
                                    <tr key={profile.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{profile.user?.full_name}</td>
                                        <td className="p-4">{profile.user?.email}</td>
                                        <td className="p-4">{profile.enrollment_number}</td>
                                        <td className="p-4">
                                            {profile.certificate_url ? (
                                                <a href={profile.certificate_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View</a>
                                            ) : (
                                                <span className="text-gray-400">Not uploaded</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                className="border p-1 w-24 rounded"
                                                placeholder="Rate"
                                                onChange={(e) => setRate(Number(e.target.value))}
                                            />
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleVerify(profile.id, 'VERIFIED')}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleVerify(profile.id, 'REJECTED')}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
