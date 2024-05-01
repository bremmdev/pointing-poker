import SubmitButton from "@/components/SubmitButton";
import { createSession } from "./_actions/session";

export default function Home() {
  return (
    <form action={createSession}>
      <SubmitButton />
    </form>
  );
}
