export const CLASSIFICATION_META = {
    RED: {
        label: "Urgent",
        dot: "bg-red-500",
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        priority: 0,
    },
    YELLOW: {
        label: "Moderate",
        dot: "bg-yellow-500",
        text: "text-yellow-700",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        priority: 1,
    },
    GREEN: {
        label: "Low priority",
        dot: "bg-green-500",
        text: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
        priority: 2,
    },
};

export const getClassificationMeta = (classification) =>
    CLASSIFICATION_META[classification] || {
        label: classification || "Unknown",
        dot: "bg-gray-400",
        text: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
        priority: 99,
    };

const STATUS_LABELS = {
    ROUTED_PHARMACIST: "Routed to pharmacist",
    ROUTED_DOCTOR: "Routed to doctor",
    SELF_CARE: "Self-care advised",
    PENDING: "Pending review",
};

export const formatStatus = (status) =>
    STATUS_LABELS[status] ||
    (status
        ? status
            .toLowerCase()
            .split("_")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" ")
        : "Unknown");

export const formatProtocolName = (protocolId) => {
    if (!protocolId) return "Unknown Symptoms";
    return protocolId
        .replace(/_v\d+$/i, "")
        .split("_")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");
};

export const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};