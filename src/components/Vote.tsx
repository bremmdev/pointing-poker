import React from "react";

export const VOTE_OPTIONS = ['0', '0.5', '1', '2', '3', '5', '8', '13', '21', '?'];

type Props = {
  onVote: (vote: string) => void;
  currScore?: string;
};

const Vote = ({ onVote, currScore }: Props) => {
  return (
    <div className="flex gap-3 flex-wrap my-6 mt-8">
      {VOTE_OPTIONS.map((option) => (
        <button
          onClick={() => onVote(option)}
          className={`${
            option === currScore ? "border-2 border-orange-600 bg-orange-50" : "bg-orange-300"
          } w-12 h-12 rounded-full text-slate-950 ${
            option === currScore
              ? "hover:bg-orange-50"
              : "hover:bg-orange-300/70"
          } font-bold text-lg`}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Vote;
