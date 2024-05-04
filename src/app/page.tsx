import SubmitButton from "@/components/SubmitButton";
import { createPokerSession, createPoll } from "./_actions/session";
import PollMaker from "@/components/PollMaker";

export default function Home() {
  return (
    <>
      <section aria-label="intro" className="space-y-4">
        <p>
          Welcome to
          <span className="text-orange-600 font-bold"> Pointing Poker</span>, a
          real-time pointing poker application for estimating project management
          tasks in agile environments. Use the button to create a poker session
          or join an existing session by clicking on the link provided by the
          session creator.
        </p>

        <form action={createPokerSession}>
          <SubmitButton type="poker" />
        </form>
      </section>

      <PollMaker />
    </>
  );
}
