import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [pendingLawyers, setPendingLawyers] = useState<any[]>([]);
  const [rate, setRate] = useState<number>(0);
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

  // Approve / Reject
  const handleVerify = async (
    id: string,
    status: "VERIFIED" | "REJECTED"
  ) => {
    try {
      await api.put("/admin/review-lawyer", {
        lawyerId: id,
        status,
        authorizedRate: status === "VERIFIED" ? rate : 0,
      });

      alert(`Lawyer ${status}`);
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
                <th className="p-3">Rate</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingLawyers.map((lawyer) => (
                <tr key={lawyer._id} className="border-t">
                  <td className="p-3">{lawyer.user?.name}</td>
                  <td className="p-3">{lawyer.user?.email}</td>
                  <td className="p-3">{lawyer.enrollmentNumber}</td>
                  <td className="p-3">
                    <a
                      href={lawyer.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="border p-1 w-24"
                      onChange={(e) =>
                        setRate(Number(e.target.value))
                      }
                    />
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        handleVerify(lawyer._id, "VERIFIED")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        handleVerify(lawyer._id, "REJECTED")
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
