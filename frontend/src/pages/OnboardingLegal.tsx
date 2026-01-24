import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OnboardingLegal = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Legal & Fees
        </h2>
        <p className="text-sm text-gray-600">
          Review and accept platform terms before proceeding
        </p>
      </div>

      {/* TERMS CARD */}
      <div className="border rounded-xl p-5 bg-gray-50 space-y-4">
        <p className="text-sm text-gray-800 font-medium">
          Platform Fee: <span className="font-semibold">20%</span> per completed consultation
        </p>

        <p className="text-sm text-gray-600">
          This fee covers payment processing, lead generation,
          platform maintenance, and customer support.
        </p>

        <label className="flex items-center gap-3 text-sm text-gray-800">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-4 h-4"
          />
          I accept the platform terms and fee structure
        </label>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => navigate("/onboarding/photo")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
        >
          Back
        </button>

        <button
          disabled={!accepted}
          onClick={() => navigate("/onboarding/availability")}
          className={`px-6 py-2 rounded-lg text-white ${
            accepted
              ? "bg-indigo-600"
              : "bg-indigo-300 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OnboardingLegal;
