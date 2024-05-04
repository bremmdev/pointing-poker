import Poll from "@/components/Poll";

export default async function SessionPage({
  params,
}: {
  params: { pollId: string };
}) {
  const partyURL = process.env.NEXT_PUBLIC_PARTY_HOST
    ? `https://${process.env.NEXT_PUBLIC_PARTY_HOST}`
    : "http://localhost:1999";

  const res = await fetch(`${partyURL}/party/${params.pollId}`, {
    method: "GET",
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return (
        <p className="text-rose-600 font-bold">No poll found for this id</p>
      );
    }
    return <p className="text-rose-600 font-bold">Something went wrong</p>;
  }

  const poll = await res.json();

  return (
    <Poll
      pollId={params.pollId}
      question={poll.question}
      answerOptions={poll.options}
    />
  );
}
