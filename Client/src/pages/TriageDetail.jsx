import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Thermometer,
    Clock,
    User,
    ListChecks,
    AlertTriangle,
    Pencil,
    CheckCircle2,
    ArrowUpCircle,
} from "lucide-react";
import { fetchProtocolsApi, getAllTriageApi, logTriageOutcomeApi } from "../api/triage";
import { formatStatus, formatProtocolName, formatDateTime } from "../utils/triage";
import { useAuth } from "../Context/AuthContext";

const OUTCOME_OPTIONS = [
    { value: "RESOLVED", label: "Resolved", icon: CheckCircle2 },
    { value: "ESCALATED", label: "Escalated", icon: ArrowUpCircle },
];

export const TriageDetail = () => {
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

    // Outcome form state
    const [isEditingOutcome, setIsEditingOutcome] = useState(false);
    const [outcomeValue, setOutcomeValue] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);
    const [outcomeError, setOutcomeError] = useState("");

    useEffect(() => {
        if (triage) return;

        const fetchTriage = async () => {
            try {
                const res = await getAllTriageApi();
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
    }, [id, triage]);

    useEffect(() => {
        if (!triage?.protocol_id) return;

        const fetchProtocol = async () => {
            setIsProtocolLoading(true);
            try {
                const payload = { protocolId: triage.protocol_id };
                const res = await fetchProtocolsApi(payload);
                setProtocol(res.data.data);
            } catch (err) {
                console.error("Failed to fetch protocol:", err);
                setProtocolError("Couldn't load protocol details.");
            } finally {
                setIsProtocolLoading(false);
            }
        };

        fetchProtocol();
    }, [triage?.protocol_id]);

    // Prefill the form when opening the editor (either fresh or editing existing outcome)
    const openOutcomeEditor = () => {
        const existing = triage.outcome_details;
        if (existing && typeof existing === "object") {
            setOutcomeValue(existing.outcome || "");
            setNotes(existing.notes || "");
        } else {
            setOutcomeValue("");
            setNotes("");
        }
        setOutcomeError("");
        setIsEditingOutcome(true);
    };

    const handleOutcomeSubmit = async (e) => {
        e.preventDefault();
        if (!outcomeValue) return;

        setIsSubmittingOutcome(true);
        setOutcomeError("");

        const payload = {
            outcome: outcomeValue,
            notes,
            pharmacist_id: user?._id,
        };

        try {
            const res = await logTriageOutcomeApi(triage._id, payload);
            const updated = res.data?.data;

            setTriage((prev) => ({
                ...prev,
                outcome_details: updated?.outcome_details || {
                    outcome: outcomeValue,
                    notes,
                    pharmacist_id: user?._id,
                },
                status: updated?.status || prev.status,
            }));
            setIsEditingOutcome(false);
        } catch (err) {
            console.error("Failed to log outcome:", err);
            setOutcomeError("Couldn't save this outcome. Please try again.");
        } finally {
            setIsSubmittingOutcome(false);
        }
    };

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
                    onClick={() => navigate("/patient")}
                    className="mt-4 text-sm font-medium text-black hover:underline"
                >
                    Back to submissions
                </button>
            </div>
        );
    }

    const answers = triage.answers || {};
    const existingOutcome =
        triage.outcome_details && typeof triage.outcome_details === "object"
            ? triage.outcome_details
            : null;

    return (
        <div className="mx-auto max-w-lg">
            <button
                onClick={() => navigate("/patient")}
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
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="flex items-center gap-1.5 text-gray-500">
                        <User size={14} />
                        Patient ID
                    </p>
                    <p className="mt-1 truncate font-medium text-black">
                        {triage.patient_id}
                    </p>
                </div>
                <div>
                    <p className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={14} />
                        Submitted
                    </p>
                    <p className="mt-1 font-medium text-black">
                        {formatDateTime(triage.createdAt)}
                    </p>
                </div>
            </div>

            <div className="mb-6 rounded-md border border-gray-200 p-4">
                <h2 className="mb-3 text-sm font-medium text-black">
                    Reported details
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

            <div className="mb-6 rounded-md border border-gray-200 p-4">
                <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-black">
                    <ListChecks size={16} />
                    Recommended steps
                </h2>

                {isProtocolLoading && (
                    <div className="flex items-center gap-2 py-4 text-gray-400">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">Loading protocol...</span>
                    </div>
                )}

                {!isProtocolLoading && protocolError && (
                    <p className="text-sm text-red-600">{protocolError}</p>
                )}

                {!isProtocolLoading && !protocolError && protocol && (
                    <>
                        <ol className="mb-5 space-y-2">
                            {(protocol.steps || []).map((step, index) => (
                                <li key={index} className="flex items-center gap-2.5 text-sm text-gray-700">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                                        {index + 1}
                                    </span>
                                    <span className="pt-0.5">
                                        {typeof step === "string" ? step : step.instruction || step.step}
                                    </span>
                                </li>
                            ))}
                        </ol>

                        {protocol.escalation_criteria?.length > 0 && (
                            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-amber-800">
                                    <AlertTriangle size={14} />
                                    Escalate to a doctor if:
                                </p>
                                <ul className="space-y-1">
                                    {protocol.escalation_criteria.map((criterion, index) => (
                                        <li key={index} className="text-sm text-amber-900">
                                            • {typeof criterion === "string" ? criterion : criterion.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="rounded-md border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-black">Outcome</h2>
                    {!isEditingOutcome && (
                        <button
                            onClick={openOutcomeEditor}
                            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-black"
                        >
                            <Pencil size={13} />
                            {existingOutcome ? "Edit" : "Add outcome"}
                        </button>
                    )}
                </div>

                {!isEditingOutcome && existingOutcome && (
                    <div>
                        <span
                            className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${existingOutcome.outcome === "RESOLVED"
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-800"
                                }`}
                        >
                            {existingOutcome.outcome === "RESOLVED" ? (
                                <CheckCircle2 size={13} />
                            ) : (
                                <ArrowUpCircle size={13} />
                            )}
                            {existingOutcome.outcome === "RESOLVED" ? "Resolved" : "Escalated"}
                        </span>
                        {existingOutcome.notes && (
                            <p className="mt-1 text-sm text-gray-700">{existingOutcome.notes}</p>
                        )}
                    </div>
                )}

                {!isEditingOutcome && !existingOutcome && (
                    <p className="text-sm text-gray-400">No outcome recorded yet.</p>
                )}

                {isEditingOutcome && (
                    <form onSubmit={handleOutcomeSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            {OUTCOME_OPTIONS.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setOutcomeValue(value)}
                                    className={`flex items-center justify-center gap-1.5 rounded-md border py-2 text-sm font-medium transition-colors ${outcomeValue === value
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 text-gray-700 hover:border-black"
                                        }`}
                                >
                                    <Icon size={15} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Notes for the patient
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        {outcomeError && (
                            <p className="text-sm text-red-600">{outcomeError}</p>
                        )}

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={!outcomeValue || isSubmittingOutcome}
                                className="flex-1 rounded-md bg-black py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isSubmittingOutcome ? "Sending..." : "Send outcome"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingOutcome(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:border-black"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};