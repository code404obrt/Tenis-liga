import { Check, Clock } from "lucide-react";

// Shows the two result-check rows from the New Match screen:
// 1. Set scores valid for best-of-3
// 2. Opponent confirmed (always pending until opponent acts)
export default function ResultValidation({ scoresValid = false }) {
  return (
    <div className="space-y-2">
      <Row
        label="Set scores are valid for best-of-3 match"
        state={scoresValid ? "ok" : "pending"}
      />
      <Row label="Opponent confirmed score" state="pending" />
    </div>
  );
}

function Row({ label, state }) {
  const isOk = state === "ok";
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={
          isOk
            ? "text-tennis-light"
            : "text-gray-400"
        }
      >
        {isOk ? <Check size={18} /> : <Clock size={18} />}
      </span>
      <span className={isOk ? "text-gray-900" : "text-gray-500"}>{label}</span>
    </div>
  );
}
