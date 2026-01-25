import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [pendingLawyers, setPendingLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending lawyers
  const fetchPending = async () => {
    try {
      const res = await api.get("/admin/pending-lawyers");
      setPendingLawyers(res.data);
    } catch (error) {
      console.error(error);
      alert("Access denied or failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // Approve / Reject lawyer
  const handleVerify = async (
    id: string,
    status: "VERIFIED" | "REJECTED"
  ) => {
    try {
      await api.put("/admin/review-lawyer", {
        lawyerId: id,
        status,
      });

      alert(`Lawyer ${status.toLowerCase()} successfully`);
      fetchPending();
    } catch (error) {
      console.error(error);
      alert("Action failed");
    }
  };

  if (loading) return <h3 className="p-10">Loading...</h3>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-900 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="bg-white text-black px-4 py-1 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Pending Lawyer Verifications
        </h2>

        {pendingLawyers.length === 0 ? (
          <p>No pending lawyers</p>
        ) : (
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Enrollment</th>
                <th className="p-3">Certificate</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingLawyers.map((lawyer) => (
                <tr key={lawyer.id} className="border-t">
                  <td className="p-3">{lawyer.users?.name}</td>
                  <td className="p-3">{lawyer.users?.email}</td>
                  <td className="p-3">{lawyer.enrollment_number}</td>
                  <td className="p-3">
                    {lawyer.certificate_url ? (
                      <a
                        href={lawyer.certificate_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "Not uploaded"
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        handleVerify(lawyer.id, "VERIFIED")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        handleVerify(lawyer.id, "REJECTED")
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
