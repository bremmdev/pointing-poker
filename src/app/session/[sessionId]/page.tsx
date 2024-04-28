"use client";

import React from "react";
import usePartySocket from "partysocket/react";
import type { Participant } from "@/types/types";
import Participants from "@/components/Participants";
import Vote from "@/components/Vote";

export default function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const [name, setName] = React.useState("");
  const [hasJoined, setHasJoined] = React.useState(false);
  const [participants, setParticipants] = React.useState<Array<Participant>>(
    []
  );

  const ws = usePartySocket({
    // usePartySocket takes the same arguments as PartySocket.
    host: process.env.NEXT_PUBLIC_PARTY_HOST || "http://localhost:1999",
    room: params.sessionId,

    // in addition, you can provide socket lifecycle event handlers
    // (equivalent to using ws.addEventListener in an effect hook)
    onOpen() {},
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

  async function handleJoinSession(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const { name } = data;

    if (!name) return;

    ws.send(JSON.stringify({ type: "join", name }));
    setHasJoined(true);
  }

  function handleVote(score: string) {
    ws.send(JSON.stringify({ type: "vote", score }));
  }

  const currentParticipant = participants.find((p) => p.name === name);

  if (!hasJoined)
    return (
      <form
        action={handleJoinSession}
        className="bg-orange-50 p-8 rounded-lg border border-orange-600 space-y-4"
      >
        <label htmlFor="name" className="block text-slate-800">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="w-full rounded-md border h-10 border-slate-600 bg-inherit px-4 py-2 placeholder:text-slate-400 placeholder:text-sm placeholder:italic focus:border-orange-600 focus:outline-none"
          name="name"
          value={name}
          placeholder="Enter your name and join the session"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          disabled={name === ""}
          className="w-fit items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-400 text-slate-950 hover:bg-orange-400/80 h-10 px-4 py-2 flex gap-2"
        >
          Join session
        </button>
      </form>
    );

  return (
    <>
      <p className="my-2 text-lg">
        Welcome
        <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-lg mx-1">
          {name}
        </span>
        !
      </p>
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-600">
        <Participants participants={participants} />
        <Vote onVote={handleVote} currScore={currentParticipant?.score} />
      </div>
    </>
  );
}
