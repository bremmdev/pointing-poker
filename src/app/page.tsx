import { createSession } from "./_actions/session";

export default function Home() {
  return (
    <form action={createSession}>
      <button type="submit" className="w-fit items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-50 border border-orange-600 text-slate-950 hover:bg-orange-100 h-10 px-4 py-2 flex gap-2">Create session</button>
    </form>
  );
}
