import type * as Party from "partykit/server";

type Participant = {
  id: string;
  name: string;
  score?: string;
};

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  participants: Array<Participant> = [];

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);
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
  }

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    this.participants = this.participants.filter((p) => p.id !== connection.id);
    this.room.broadcast(
      JSON.stringify({ type: "sync", participants: this.participants })
    );
  }
}

Server satisfies Party.Worker;
