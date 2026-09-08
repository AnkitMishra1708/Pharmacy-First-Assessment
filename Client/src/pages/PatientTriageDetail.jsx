import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Thermometer,
    Clock,
    ListChecks,
    AlertTriangle,
    CheckCircle2,
    ArrowUpCircle,
    Stethoscope,
} from "lucide-react";
import { fetchProtocolsApi, getTriageByPatientIdApi } from "../api/triage";
import { useAuth } from "../Context/AuthContext";
import { formatStatus, formatProtocolName, formatDateTime } from "../utils/triage";

export const PatientTriageDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [triage, setTriage] = useState(location.state || null);
    const [isLoading, setIsLoading] = useState(!location.state);
    const [error, setError] = useState("");

    const [protocol, setProtocol] = useState(null);
    const [isProtocolLoading, setIsProtocolLoading] = useState(true);
    const [protocolError, setProtocolError] = useState("");

    useEffect(() => {
        if (triage || !user?._id) return;

        const fetchTriage = async () => {
            try {
                const res = await getTriageByPatientIdApi(user._id);
                const match = (res.data.data || []).find((t) => t._id === id);
                if (!match) {
                    setError("Submission not found.");
                } else {
                    setTriage(match);
                }
            } catch (err) {
                console.error("Failed to fetch triage record:", err);
                setError("Couldn't load this submission. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTriage();
    }, [id, triage, user?._id]);

    useEffect(() => {
        if (!triage?.protocol_id) return;

        const fetchProtocol = async () => {
            setIsProtocolLoading(true);
            try {
                const res = await fetchProtocolsApi({ protocolId: triage.protocol_id });
                setProtocol(res.data.data);
            } catch (err) {
                console.error("Failed to fetch protocol:", err);
                setProtocolError("Couldn't load care instructions.");
            } finally {
                setIsProtocolLoading(false);
            }
        };

        fetchProtocol();
    }, [triage?.protocol_id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Loading...</span>
            </div>
        );
    }

    if (error || !triage) {
        return (
            <div className="mx-auto max-w-lg">
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error || "Submission not found."}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 text-sm font-medium text-black hover:underline"
                >
                    Back to your submissions
                </button>
            </div>
        );
    }

    const answers = triage.answers || {};
    const outcome =
        triage.outcome_details && typeof triage.outcome_details === "object"
            ? triage.outcome_details
            : null;
    const isRoutedToDoctor = triage.status === "ROUTED_DOCTOR";

    return (
        <div className="mx-auto max-w-lg">
            <button
                onClick={() => navigate("/")}
                className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-black"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <div className="mb-6">
                <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {formatStatus(triage.status)}
                </span>
                <h1 className="mt-2 text-lg font-semibold tracking-tight text-black">
                    {protocol?.condition_name || formatProtocolName(triage.protocol_id)}
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                    Submitted {formatDateTime(triage.createdAt)}
                </p>
            </div>

            <div className="mb-6 rounded-md border border-gray-200 p-4">
                <h2 className="mb-3 text-sm font-medium text-black">
                    What you reported
                </h2>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Thermometer size={13} />
                            Temperature
                        </p>
                        <p className="mt-1 text-sm font-medium text-black">
                            {answers.temp ?? answers.temperature_c ?? "—"}
                            {(answers.temp ?? answers.temperature_c) != null ? "°C" : ""}
                        </p>
                    </div>
                    <div>
                        <p className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock size={13} />
                            Duration
                        </p>
                        <p className="mt-1 text-sm font-medium text-black">
                            {answers.duration ?? answers.duration_days ?? "—"}
                            {(answers.duration ?? answers.duration_days) != null ? " days" : ""}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-xs text-gray-500">Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                        {(answers.symptoms || answers.symptom || []).map((symptom) => (
                            <span
                                key={symptom}
                                className="rounded-full border border-gray-300 px-3 py-1 text-xs capitalize text-gray-700"
                            >
                                {symptom}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {isRoutedToDoctor ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <h2 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-red-700">
                        <Stethoscope size={16} />
                        Go to a doctor
                    </h2>
                    <p className="text-sm text-red-700">
                        Based on what you reported, this needs a doctor's evaluation rather
                        than a pharmacist review. Please book an appointment or visit a
                        clinic as soon as you can.
                    </p>
                </div>
            ) : (
                <div className="rounded-md border border-gray-200 p-4">
                    <h2 className="mb-2 text-sm font-medium text-black">
                        Pharmacist's outcome
                    </h2>

                    {outcome ? (
                        <div>
                            <span
                                className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${outcome.outcome === "RESOLVED"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-200 text-red-700"
                                    }`}
                            >
                                {outcome.outcome === "RESOLVED" ? (
                                    <CheckCircle2 size={13} />
                                ) : (
                                    <ArrowUpCircle size={13} />
                                )}
                                {outcome.outcome === "RESOLVED" ? "Resolved" : "Escalated"}
                            </span>
                            {outcome.notes && (
                                <p className="mt-1 text-sm text-gray-700">{outcome.notes}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">
                            No outcome recorded yet — a pharmacist hasn't reviewed this submission.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};