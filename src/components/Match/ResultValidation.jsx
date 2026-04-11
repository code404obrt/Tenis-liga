import { Check, Clock, X } from "lucide-react";

export default function ResultValidation({ scoresValid = false, reason = null }) {
  return (
    <div className="space-y-2">
      <Row
        label={
          scoresValid
            ? "Set scores are valid for best-of-3 match"
            : reason
            ? `Invalid scores: ${reason}`
            : "Enter valid set scores (e.g. 6-3, 6-4)"
        }
        state={scoresValid ? "ok" : reason ? "error" : "pending"}
      />
      <Row label="Opponent confirmed score" state="pending" />
    </div>
  );
}

function Row({ label, state }) {
  const isOk = state === "ok";
  const isError = state === "error";
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={
          isOk ? "text-tennis-light" : isError ? "text-red-400" : "text-gray-400"
        }
      >
        {isOk ? <Check size={18} /> : isError ? <X size={18} /> : <Clock size={18} />}
      </span>
      <span className={isOk ? "text-gray-900" : isError ? "text-red-500" : "text-gray-500"}>
        {label}
      </span>
    </div>
  );
}
