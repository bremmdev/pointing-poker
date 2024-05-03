import type * as Party from "partykit/server";

type Participant = {
  id: string;
  name: string;
  voteAnswer?: string;
};

type Option = {
  [key: string]: string;
};

type CreatePollRequest = {
  type: "poll";
  pollId: string;
  data: {
    question: string;
    [key: string]: string;
  };
};

type Poll = {
  id: string;
  question: string;
  options: Array<Option>;
};

type Message =
  | {
      type: "join";
      name: string;
    }
  | {
      type: "vote";
      voteAnswer: string;
    }
  | {
      type: "clear";
    }
  | {
      type: "show";
    }
  | {
      type: "sync";
      participants: Array<Participant>;
    };

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  participants: Array<Participant> = [];
  poll: Poll | undefined;

  async onRequest(req: Party.Request): Promise<Response> {
    if (req.method === "POST") {
      const data = (await req.json()) as CreatePollRequest;
      if (data.type !== "poll") {
        return new Response("Invalid request", { status: 400 });
      }

      //strip question from the options and create an array of objects with the options
      const optionsWithoutQuestion = Object.entries(data.data)
        .filter(([key]) => key !== "question")
        .map(([key, value]) => {
          return { [key]: value };
        });

      this.poll = {
        id: data.pollId,
        question: data.data.question,
        options: optionsWithoutQuestion,
      };

      return new Response(JSON.stringify({ pollId: data.pollId }), {
        status: 200,
      });
    }
    return new Response("Method not allowed", { status: 405 });
  }

  onConnect(
    connection: Party.Connection<unknown>,
    ctx: Party.ConnectionContext
  ): void | Promise<void> {
    //send the poll data to the participant
    if (this.poll) {
      connection.send(
        JSON.stringify({
          type: "getPoll",
          poll: this.poll,
        })
      );
    }
  }

  onMessage(message: string, sender: Party.Connection) {
    const data: Message = JSON.parse(message);
    if (data.type === "join") {
      this.participants.push({
        id: sender.id,
        name: data.name,
      });

      //broadcast the updated participants list to all participants
      this.room.broadcast(
        JSON.stringify({ type: "sync", participants: this.participants })
      );
    }

    if (data.type === "vote") {
      const participant = this.participants.find((p) => p.id === sender.id);
      if (participant) {
        participant.voteAnswer = data.voteAnswer;
        this.room.broadcast(
          JSON.stringify({ type: "sync", participants: this.participants })
        );
      }
    }

    if (data.type === "clear") {
      this.participants.forEach((p) => (p.voteAnswer = undefined));
      this.room.broadcast(
        JSON.stringify({ type: "sync", participants: this.participants })
      );
    }

    if (data.type === "show") {
      //show the votes and set the voteAnswer to N/A for participants without a vote
      this.participants.forEach((p) => {
        if (p.voteAnswer === undefined) {
          p.voteAnswer = "N/A";
        }
      });

      this.room.broadcast(
        JSON.stringify({ type: "sync", participants: this.participants })
      );
    }
  }

  //when a participant leaves the room
  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    this.participants = this.participants.filter((p) => p.id !== connection.id);
    this.room.broadcast(
      JSON.stringify({ type: "sync", participants: this.participants })
    );
  }
}

Server satisfies Party.Worker;
