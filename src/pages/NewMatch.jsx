import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MatchScoreboard from "../components/Match/MatchScoreboard";
import ResultValidation from "../components/Match/ResultValidation";
import Button from "../components/Common/Button";

export default function NewMatch() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 text-tennis-dark">
          <ArrowLeft size={18} /> Back
        </Link>
        <button className="text-sm text-tennis-light">Live validate</button>
      </div>

      <MatchScoreboard />

      <section>
        <h3 className="font-semibold text-tennis-dark mb-2">Result checks</h3>
        <ResultValidation scoresValid={false} />
      </section>

      <section>
        <h3 className="font-semibold text-tennis-dark mb-2">Details</h3>
        <p className="text-sm text-gray-500">
          TODO — opponent select, surface, date, location
        </p>
      </section>

      <Button size="lg" disabled>
        Submit
      </Button>
    </div>
  );
}
