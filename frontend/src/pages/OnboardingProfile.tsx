import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Import full India state–city data
import indiaStatesCities from "../assets/indiaStatesCities.json";

const LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Kannada",
];

const PRACTICE_AREAS = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Corporate Law",
  "Property Law",
  "Tax Law",
  "Labour Law",
  "Consumer Law",
];

const TAGS = [
  "Divorce",
  "Property Dispute",
  "Criminal Defense",
  "Contract Review",
  "Cheque Bounce",
  "Consumer Rights",
  "Employment Issues",
  "Startup Legal",
];

const COURTS = [
  "District Court",
  "High Court",
  "Supreme Court",
  "Family Court",
  "Consumer Court",
  "Sessions Court",
];

const EXPERIENCE_OPTIONS = [
  "0–1 years",
  "2–4 years",
  "5–7 years",
  "8–10 years",
  "10+ years",
];

const OnboardingProfile = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [courts, setCourts] = useState<string[]>([]);

  const toggleSelection = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  return (
    <div className="space-y-10">

      {/* ================= LOCATION & LANGUAGES ================= */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Location & Languages
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Tell us where you practice and how clients can communicate with you
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setCity("");
            }}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Select State</option>
            {Object.keys(indiaStatesCities).map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!state}
            className="border rounded-lg px-3 py-2 disabled:bg-gray-100"
          >
            <option value="">Select City</option>
            {state &&
              indiaStatesCities[state as keyof typeof indiaStatesCities].map(
                (cityName: string) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                )
              )}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() =>
                toggleSelection(lang, languages, setLanguages)
              }
              className={`px-4 py-1.5 rounded-full border text-sm ${
                languages.includes(lang)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      {/* ================= PROFESSIONAL DETAILS ================= */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Professional Details
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Tell clients about your experience and courts you practice in
        </p>

        {/* EXPERIENCE */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">Select experience</option>
            {EXPERIENCE_OPTIONS.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* COURTS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Court(s) of Practice
          </label>

          <div className="flex flex-wrap gap-2">
            {COURTS.map((court) => (
              <button
                key={court}
                type="button"
                onClick={() =>
                  toggleSelection(court, courts, setCourts)
                }
                className={`px-4 py-1.5 rounded-full border text-sm ${
                  courts.includes(court)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {court}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRACTICE AREAS ================= */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Practice Areas
        </h2>

        <div className="flex flex-wrap gap-2">
          {PRACTICE_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() =>
                toggleSelection(area, areas, setAreas)
              }
              className={`px-4 py-1.5 rounded-full border text-sm ${
                areas.includes(area)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </section>

      {/* ================= CASE TYPES ================= */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Cases & Services
        </h2>

        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                toggleSelection(tag, tags, setTags)
              }
              className={`px-4 py-1.5 rounded-full border text-sm ${
                tags.includes(tag)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ================= ACTION ================= */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/onboarding/photo")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OnboardingProfile;
