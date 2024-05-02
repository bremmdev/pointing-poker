"use server";

import { redirect } from "next/navigation";

export async function createPokerSession() {
  const sessionId = crypto.randomUUID().replace(/-/g, "");
  redirect(`/session/${sessionId}`);
}

export async function createPoll(formdata: FormData) {
  const pollId = crypto.randomUUID().replace(/-/g, "");

  const data = Object.fromEntries(formdata.entries());

  if (!data.question) {
    return { error: "Question is required" };
  }

  //strip empty answer options
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => value !== "")
  );

  //create a poll in the server
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_PARTY_HOST || "http://localhost:1999"
    }/party/${pollId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "poll",
        pollId,
        data: filteredData,
      }),
    }
  );

  if (!res.ok) {
    return { error: "Failed to create poll" };
  }

  redirect(`/poll/${pollId}`);
}
