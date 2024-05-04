export type Participant = {
  id: string;
  name: string;
  voteAnswer?: string;
};

export type Option = {
  [key: string]: string;
};

export type CreatePollRequest = {
  type: "poll";
  pollId: string;
  data: {
    question: string;
    [key: string]: string;
  };
};

export type Poll = {
  id: string;
  question: string;
  options: Array<Option>;
};

export type Message =
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