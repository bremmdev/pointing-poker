"use server";

import { redirect } from "next/navigation";

export async function createSession() {
  const sessionId = crypto.randomUUID().replace(/-/g, "");
  redirect(`/session/${sessionId}`);
}
