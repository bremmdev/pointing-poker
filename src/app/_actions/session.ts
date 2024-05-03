"use server";

import { redirect } from "next/navigation";

export async function createPokerSession() {
  const sessionId = crypto.randomUUID().replace(/-/g, "");
  redirect(`/session/${sessionId}`);
}

export async function createPoll(previousState: any, formdata: FormData) {
  const pollId = crypto.randomUUID().replace(/-/g, "");

  const data = Object.fromEntries(formdata.entries());

  if (!data.question) {
    return { error: "Question is required" };
  }

  //strip empty answer options
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => value !== "")
  );

  //needs to have at least 2 answer options
  if (Object.keys(filteredData).length < 3) {
    return { error: "At least 2 answer options are required" };
  }

  const partyURL = process.env.NEXT_PUBLIC_PARTY_HOST
    ? `https://${process.env.NEXT_PUBLIC_PARTY_HOST}`
    : "http://localhost:1999";

  //create a poll in the server
  const res = await fetch(`${partyURL}/party/${pollId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "poll",
      pollId,
      data: filteredData,
    }),
  });

  if (!res.ok) {
    return { error: "Failed to create poll" };
  }

  redirect(`/poll/${pollId}`);
}
