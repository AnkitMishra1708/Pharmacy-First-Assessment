import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { getTriageByPatientIdApi } from "../api/triage";
import { useAuth } from "../Context/Authcontext";
import { formatStatus, formatProtocolName, formatDateTime } from "../utils/triage";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [triages, setTriages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const fetchMyTriage = async () => {
      try {
        const res = await getTriageByPatientIdApi(user._id);
        const data = res.data.data.sessions || [];
        console.log(data);

        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTriages(sorted);
      } catch (err) {
        console.error("Failed to fetch your triage records:", err);
        setError("Couldn't load your submissions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTriage();
  }, [user?._id]);

  const handleSelect = (triage) => {
    navigate(`/dashboard/${triage._id}`, { state: triage });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-black">
          Your submissions
        </h1>
        <p className="mt-1 text-sm text-gray-500">Most recent first</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      )}

      {!isLoading && error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {!isLoading && !error && triages.length === 0 && (
        <p className="py-16 text-center text-sm text-gray-400">
          You haven't submitted anything yet.
        </p>
      )}

      {!isLoading && !error && triages.length > 0 && (
        <div className="flex flex-col divide-y divide-gray-200 rounded-md border border-gray-200">
          {triages.map((triage) => (
            <button
              key={triage._id}
              onClick={() => handleSelect(triage)}
              className="flex items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-black">
                    {formatProtocolName(triage.protocol_id)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatStatus(triage.status)} ·{" "}
                    {formatDateTime(triage.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {triage.outcome_details?.outcome && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${triage.outcome_details.outcome === "RESOLVED"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-200 text-red-700"
                      }`}
                  >
                    {triage.outcome_details.outcome === "RESOLVED"
                      ? "Resolved"
                      : "Escalated"}
                  </span>
                )}
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};