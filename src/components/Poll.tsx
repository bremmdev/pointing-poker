"use client";

import React from 'react'
import usePartySocket from "partysocket/react";
import type { Participant, AnswerOptions } from "@/types/types";
import PollVote from "@/components/PollVote";
import CopyIcon from "@/assets/copy.svg";
import Image from "next/image";
import { toast } from "sonner";

type Props = {
  pollId: string;
  question: string;
  answerOptions: AnswerOptions;
}

const Poll = ({pollId, question, answerOptions}: Props) => {
  const [participants, setParticipants] = React.useState<Array<Participant>>(
    []
  );
  const [currentAnswer, setCurrentAnswer] = React.useState<string | undefined>(undefined);

  const ws = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTY_HOST || "http://localhost:1999",
    room: pollId,

    // in addition, you can provide socket lifecycle event handlers
    // (equivalent to using ws.addEventListener in an effect hook)
    onOpen(e) {
      // join the poll room, for polls we don't need to provide a name
      ws.send(JSON.stringify({ type: "join", name: "poll"}));
    },
    onMessage(e) {
      const msg = JSON.parse(e.data);
      if (msg.type === "sync") {
        setParticipants(msg.participants);
      }
    },
    onClose() {},
    onError(e) {
      console.log("error");
    },
  });

  function handleVote(voteAnswer: string) {
    setCurrentAnswer(voteAnswer);
    ws.send(JSON.stringify({ type: "vote", voteAnswer }));
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText(window.location.href);
    toast("Session URL copied to clipboard!");
  }

  const participantAmountText =
    participants.length === 1
      ? "There is 1 participant in this session."
      : "There are " + participants.length + " participants in this session.";

  const allAnswers = participants.map((p) => p.voteAnswer);

  return (
    <>
      <button
        onClick={handleCopyUrl}
        className="sm:absolute right-0 top-[2px] w-fit items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-50 border border-orange-600 text-slate-950 hover:bg-orange-100 h-10 px-4 py-2 flex gap-2"
      >
        Copy Session URL
        <Image src={CopyIcon} alt="Copy Icon" width={16} height={16} />
      </button>
      <div className="bg-orange-50 p-10 rounded-lg border border-orange-600 relative">
        <h2 className="text-2xl font-bold text-orange-600 text-center">
          {question}
        </h2>
        <p className="text-center mt-4">{participantAmountText}</p>
        <PollVote
          onVote={handleVote}
          currAnswer={currentAnswer}
          answerOptions={answerOptions}
          allAnswers={allAnswers}
        />
      </div>
    </>
  );
}

export default Poll