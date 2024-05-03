export type Participant = {
  id: string;
  name: string;
  voteAnswer?: string;
};

export type AnswerOptions = Array<{ [key: string]: string }>;