import React, { useState } from "react";

const RegisterLawyerPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register-lawyer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          phone: contactNumber,
          enrollmentNumber,
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Registered successfully");
    } catch (err) {
      setMessage("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-xl px-8 py-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-4">
          Lawyer Registration
        </h2>

        {message && (
          <p className="text-center text-red-600 mb-4">{message}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="input"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />

        <input
          type="text"
          placeholder="Phone"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          required
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />

        <input
          type="text"
          placeholder="Enrollment Number"
          value={enrollmentNumber}
          onChange={(e) => setEnrollmentNumber(e.target.value)}
          required
          className="input"
        />

        <button
          type="submit"
          className="bg-blue-700 text-white py-2 rounded w-full mt-4"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterLawyerPage;
