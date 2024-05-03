import { AnswerOptions } from "@/types/types";
import CheckIcon from "@/assets/check.svg";
import Image from "next/image";

type Props = {
  onVote: (vote: string) => void;
  currAnswer?: string;
  answerOptions: AnswerOptions;
  allAnswers: Array<string | undefined>;
};

const PollVote = ({ onVote, currAnswer, answerOptions, allAnswers }: Props) => {
  const totalVotes = allAnswers.filter((a) => a !== undefined).length;
  const whoHasVotes = `${totalVotes} / ${allAnswers.length} votes`;

  return (
    <div className="flex gap-3 flex-wrap mb-0 mt-8">
      <p className="font-bold text-slate-950 -mt-2">{whoHasVotes}</p>
      {answerOptions.map((option) => {
        //get the key and value of the object
        const answerKey = Object.keys(option)[0];
        const answerVal = Object.values(option)[0];
        //count the votes for this answer
        const voteCount = allAnswers.filter((a) => a === answerKey).length;
        //calculate the percentage of votes
        const percentage =
          totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100;

        return (
          <div
            key={answerKey}
            className="flex gap-2 items-center font-bold w-full"
          >
            {answerKey === currAnswer && (
              <Image
                src={CheckIcon}
                alt="Check Icon"
                width={24}
                height={24}
                className="absolute left-2"
              />
            )}
            <button
              onClick={() => onVote(answerKey)}
              className="text-left p-2 bg-white w-full rounded-lg text-slate-950 border border-orange-600 flex-1 hover:bg-orange-100 relative"
            >
              {answerVal}
              <div
                className="absolute left-0 bottom-0 top-0 rounded-md bg-orange-600/30"
                style={{ width: `${percentage}%` }}
              ></div>
            </button>
            <span className="w-12 text-right">
              {`${percentage.toFixed(0)}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PollVote;
