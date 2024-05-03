"use client";

import React from "react";
import usePartySocket from "partysocket/react";
import type { Participant, AnswerOptions } from "@/types/types";
import PollVote from "@/components/PollVote";
import CopyIcon from "@/assets/copy.svg";
import Image from "next/image";
import { toast } from "sonner";

export default function SessionPage({
  params,
}: {
  params: { pollId: string };
}) {
  const [name, setName] = React.useState("");
  const [hasJoined, setHasJoined] = React.useState(false);
  const [participants, setParticipants] = React.useState<Array<Participant>>(
    []
  );
  const [question, setQuestion] = React.useState("");
  const [answerOptions, setAnswerOptions] = React.useState<AnswerOptions>([]);

  const ws = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTY_HOST || "http://localhost:1999",
    room: params.pollId,

    // in addition, you can provide socket lifecycle event handlers
    // (equivalent to using ws.addEventListener in an effect hook)
    onOpen(e) {},
    onMessage(e) {
      const msg = JSON.parse(e.data);
      if (msg.type === "sync") {
        setParticipants(msg.participants);
      }

      if (msg.type === "getPoll") {
        setQuestion(msg.poll.question);
        setAnswerOptions(msg.poll.options as AnswerOptions);
      }
    },
    onClose() {},
    onError(e) {
      console.log("error");
    },
  });

  async function handleJoinSession(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const { name } = data;

    if (!name) return;

    ws.send(JSON.stringify({ type: "join", name }));
    setHasJoined(true);
  }

  function handleVote(voteAnswer: string) {
    ws.send(JSON.stringify({ type: "vote", voteAnswer }));
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText(window.location.href);
    toast("Session URL copied to clipboard!");
  }

  const currentParticipant = participants.find((p) => p.name === name);
  const participantAmountText =
    participants.length === 1
      ? "There is 1 participant in this session."
      : "There are " + participants.length + " participants in this session.";

  const allAnswers = participants.map((p) => p.voteAnswer);

  if (!hasJoined)
    return (
      <form
        action={handleJoinSession}
        className="bg-orange-50 p-8 rounded-lg border border-orange-600 space-y-4"
      >
        <label htmlFor="name" className="block text-slate-800 font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="bg-slate-50 w-full rounded-md border h-10 border-slate-600 bg-inherit px-4 py-2 placeholder:text-slate-400 placeholder:text-sm placeholder:italic focus:border-orange-600 focus:outline-none"
          name="name"
          value={name}
          placeholder="Enter your name and join the session"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          disabled={name === ""}
          className="w-fit items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-200 border border-orange-600 text-slate-950 hover:bg-orange-300/70 h-10 px-4 py-2 flex gap-2"
        >
          Join Session
        </button>
      </form>
    );

  if (!question)
    return <p className="text-rose-600 font-bold">No poll found for this id</p>;

  return (
    <>
      <button
        onClick={handleCopyUrl}
        className="sm:absolute right-0 top-[2px] w-fit items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-50 border border-orange-600 text-slate-950 hover:bg-orange-100 h-10 px-4 py-2 flex gap-2"
      >
        Copy Session URL
        <Image src={CopyIcon} alt="Copy Icon" width={16} height={16} />
      </button>
      <p className="my-2 text-lg">
        Welcome
        <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-lg mx-1">
          {name}
        </span>
        !
      </p>
      <div className="bg-orange-50 p-10 rounded-lg border border-orange-600 relative">
        <h2 className="text-2xl font-bold text-orange-600 text-center">
          {question}
        </h2>
        <p className="text-center mt-4">{participantAmountText}</p>
        <PollVote
          onVote={handleVote}
          currAnswer={currentParticipant?.voteAnswer}
          answerOptions={answerOptions}
          allAnswers={allAnswers}
        />
      </div>
    </>
  );
}
