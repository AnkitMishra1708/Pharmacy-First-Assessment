import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { allConditionApi } from "../api/triage";

export const Prescription = () => {
    const navigate = useNavigate();
    const [conditions, setConditions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchConditions = async () => {
            try {
                const res = await allConditionApi();
                const data = res.data.data
                setConditions(data);
            } catch (err) {
                console.error("Failed to fetch conditions:", err);
                setError("Couldn't load conditions. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchConditions();
    }, []);

    const handleSelect = (protocolId) => {
        navigate(`/prescription/${protocolId}`);
    };

    return (
        <div className="mx-auto max-w-lg">
            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight text-black">
                    What are you experiencing?
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Select the condition that best matches your symptoms
                </p>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">Loading conditions...</span>
                </div>
            )}

            {!isLoading && error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            {!isLoading && !error && (
                <div className="flex flex-col divide-y divide-gray-200 rounded-md border border-gray-200">
                    {conditions.map((condition) => (
                        <button
                            key={condition.protocol_id}
                            onClick={() => handleSelect(condition.protocol_id)}
                            className="flex items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50"
                        >
                            <span className="text-sm font-medium text-black">
                                {condition.display_name}
                            </span>
                            <ChevronRight size={18} className="text-gray-400" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};