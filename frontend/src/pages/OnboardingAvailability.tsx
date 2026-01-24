import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OnboardingAvailability = () => {
  const navigate = useNavigate();
  const [available, setAvailable] = useState(true);

  const handleSubmit = () => {
    // 🚨 Backend save will be added later
    // For now, we just redirect
    navigate("/lawyer/dashboard");
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Availability
        </h2>
        <p className="text-sm text-gray-600">
          Control when you are open to receiving client requests
        </p>
      </div>

      {/* AVAILABILITY TOGGLE */}
      <div className="border rounded-xl p-5 bg-gray-50 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">
            Available for Consultations
          </p>
          <p className="text-sm text-gray-600">
            Turn this on when you're ready to receive leads
          </p>
        </div>

        <button
          onClick={() => setAvailable(!available)}
          className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
            available ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`bg-white w-5 h-5 rounded-full shadow transform transition ${
              available ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* INFO BOX */}
      <div className="border rounded-xl p-5 bg-indigo-50 flex gap-3">
        <div className="text-indigo-600 text-xl">✔</div>
        <div>
          <p className="font-medium text-gray-900">
            Ready to Submit!
          </p>
          <p className="text-sm text-gray-600">
            Your profile will be reviewed by our admin team.
            You will be notified once it is approved.
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => navigate("/onboarding/legal")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  );
};

export default OnboardingAvailability;
