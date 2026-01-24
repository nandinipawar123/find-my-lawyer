import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OnboardingPhoto = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Add a Profile Photo
        </h2>
        <p className="text-sm text-gray-600">
          Optional, but recommended to build trust with clients
        </p>
      </div>

      {/* PHOTO UPLOAD */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-500 text-center px-4">
              Upload your photo
            </span>
          )}
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <span className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">
            Choose Photo
          </span>
        </label>

        <p className="text-xs text-gray-500">
          JPG or PNG • Max size 5MB
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => navigate("/onboarding/profile")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
        >
          Back
        </button>

        <button
          onClick={() => navigate("/onboarding/legal")}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OnboardingPhoto;
