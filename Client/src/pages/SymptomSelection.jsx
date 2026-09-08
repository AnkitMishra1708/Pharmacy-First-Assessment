import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Thermometer, Clock, Info, Stethoscope, Pill, CheckCircle2 } from "lucide-react";
import { allConditionApi, intakeApi } from "../api/triage";
import { useAuth } from "../Context/Authcontext";

export const SymptomSelection = () => {
    const { protocolId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth()

    const [condition, setCondition] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [temperature, setTemperature] = useState("");
    const [duration, setDuration] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchCondition = async () => {
            try {
                const res = await allConditionApi();
                const match = res.data.data.find(
                    (c) => c.protocol_id === protocolId
                );

                if (!match) {
                    setError("Condition not found.");
                } else {
                    setCondition(match);
                }
            } catch (err) {
                console.error("Failed to fetch condition:", err);
                setError("Couldn't load this condition. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCondition();
    }, [protocolId]);

    const toggleSymptom = (symptom) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom)
                ? prev.filter((s) => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            patient_id: user._id,
            condition_key: condition.protocol_id,
            answers: {
                temperature_c: temperature ? Number(temperature) : null,
                duration_days: duration ? Number(duration) : null,
                symptoms: selectedSymptoms,
            }
        };

        try {
            const res = await intakeApi(payload);
            console.log(res.data.data);
            setResult(res.data.data);
        } catch (err) {
            console.error("Failed to submit intake:", err);
            setError("Couldn't submit your details. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartOver = () => {
        setResult(null);
        setSelectedSymptoms([]);
        setTemperature("");
        setDuration("");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-lg">
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </p>
                <button
                    onClick={() => navigate("/prescription")}
                    className="mt-4 text-sm font-medium text-black hover:underline"
                >
                    Back to conditions
                </button>
            </div>
        );
    }

    if (result) {
        const message = result?.message || "";
        const lowerMessage = message.toLowerCase();
        const suggestsDoctor = lowerMessage.includes("doctor");
        const suggestsPharmacist = lowerMessage.includes("pharmacist");

        const Icon = suggestsDoctor ? Stethoscope : suggestsPharmacist ? Pill : CheckCircle2;

        return (
            <div className="mx-auto max-w-lg">
                <div className="flex flex-col items-center rounded-md border border-gray-200 px-6 py-10 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black">
                        <Icon size={26} className="text-white" strokeWidth={1.75} />
                    </div>

                    <h2 className="text-lg font-semibold tracking-tight text-black">
                        {suggestsDoctor
                            ? "Please quickly see a doctor"
                            : suggestsPharmacist
                                ? "Your prescription send to pharmacist"
                                : "Recommendation"}
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
                        {message}
                    </p>

                    <div className="mt-8 flex w-full flex-col gap-2">
                        {suggestsDoctor && (
                            <button
                                onClick={() => alert("This feature is coming soon...")}
                                className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 active:opacity-70"
                            >
                                Find a doctor
                            </button>
                        )}
                        <button
                            onClick={() => navigate("/prescription")}
                            className="w-full rounded-md border border-gray-300 py-2.5 text-sm font-medium text-black transition-colors hover:border-black"
                        >
                            Back to conditions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-lg">
            <button
                onClick={() => navigate("/prescription")}
                className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-black"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight text-black">
                    {condition.condition_name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Select the symptoms you're experiencing
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-wrap gap-2">
                    {condition.all_symptoms.map((symptom) => {
                        const isSelected = selectedSymptoms.includes(symptom);
                        return (
                            <button
                                key={symptom}
                                type="button"
                                onClick={() => toggleSymptom(symptom)}
                                className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${isSelected
                                    ? "border-black bg-black text-white"
                                    : "border-gray-300 text-gray-700 hover:border-black"
                                    }`}
                            >
                                {symptom}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <Thermometer size={15} />
                            Temperature (°C)
                            <span className="group relative inline-flex">
                                <Info
                                    size={14}
                                    className="cursor-help text-gray-400 hover:text-black"
                                />
                                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-md bg-black px-3 py-2 text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                    Normal body temperature is around 36.1–37.2°C. Above that
                                    is a mild fever and Above 38°C is a high fever.
                                    <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-black" />
                                </span>
                            </span>
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            placeholder="e.g. 37.5"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                            <Clock size={15} />
                            Duration (days)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g. 3"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={selectedSymptoms.length === 0 || isSubmitting}
                    className="w-full rounded-md bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isSubmitting ? "Submitting..." : "Continue"}
                </button>
            </form>
        </div>
    );
};