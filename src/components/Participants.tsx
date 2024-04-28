import React from "react";
import type { Participant } from "@/types/types";

type Props = {
  participants: Array<Participant>;
};

const Participants = ({ participants }: Props) => {
  const participantAmountText =
    participants.length === 1
      ? "There is 1 participant in this session."
      : "There are " + participants.length + " participants in this session.";

  const hasResult = participants.every(
    (p) => p.score !== undefined && p.score !== ""
  );
  //calculate the average if all participants have voted, do not count the '?' vote
  const resultVal = hasResult
    ? participants.reduce((acc, p) => {
        if (p.score === "?" || p.score === 'N/A') return acc;
        return acc + parseInt(p.score || "0");
      }, 0) /
      participants.filter((p) => p.score !== "?" && p.score !== "N/A").length
    : 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl">Participants</h2>
      <p>{participantAmountText}</p>

      <ul className="flex flex-col gap-2">
        <div className="flex gap-4 font-bold">
          <span className="basis-1/2">Name</span>
          <span>Score</span>
        </div>
        {participants.map((participant) => (
          <li className="flex gap-4" key={participant.id}>
            <span className="basis-1/2">{participant.name}</span>
            {participant.score && (
              <span
                className="animate-fadeIn"
                key={`${participant.name}_${participant.score}`}
              >
                {participant.score}
              </span>
            )}
          </li>
        ))}
      </ul>
      {hasResult && !Number.isNaN(resultVal) && (
        <p className="font-bold bg-orange-100 text-orange-600 rounded-lg w-fit p-2">
          Average: {resultVal.toFixed(2)}
        </p>
      )}
    </section>
  );
};

export default Participants;
