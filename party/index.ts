import type * as Party from "partykit/server";

type Participant = {
  id: string;
  name: string;
  score?: string;
};

type Message =
  | {
      type: "join";
      name: string;
    }
  | {
      type: "vote";
      score: string;
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

  onMessage(message: string, sender: Party.Connection) {
    const data: Message = JSON.parse(message);
    if (data.type === "join") {
      this.participants.push({
        id: sender.id,
        name: data.name,
      });
      //broadcast it to all participants
      this.room.broadcast(
        JSON.stringify({ type: "sync", participants: this.participants })
      );
    }

    if (data.type === "vote") {
      const participant = this.participants.find((p) => p.id === sender.id);
      if (participant) {
        participant.score = data.score;
        this.room.broadcast(
          JSON.stringify({ type: "sync", participants: this.participants })
        );
      }
    }

    if (data.type === "clear") {
      this.participants.forEach((p) => (p.score = undefined));
      this.room.broadcast(
        JSON.stringify({ type: "sync", participants: this.participants })
      );
    }

    if (data.type === "show") {
      //show the votes and set the score to N/A for participants without a vote
      this.participants.forEach((p) => {
        if (p.score === undefined) {
          p.score = "N/A";
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
