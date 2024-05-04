"use client";

import React from "react";
import { createPoll } from "@/app/_actions/session";
import SubmitButton from "@/components/SubmitButton";
import { useFormState } from "react-dom";

const PollMaker = () => {
  const [question, setQuestion] = React.useState("");
  const [showPollForm, setShowPollForm] = React.useState(false);
  const [answerCount, setAnswerCount] = React.useState(2);

  const [state, formAction] = useFormState(createPoll, null);

  return (
    <section aria-label="poll" className="space-y-4">
      <h2 className="text-2xl text-orange-600 font-bold tracking-tighter">
        Poll
      </h2>
      <p>
        Create a poll to gather feedback from your team. Use the button to
        create a poll. Share the link with your team to gather feedback.
      </p>

      {!showPollForm && (
        <button
          onClick={() => setShowPollForm(true)}
          className="w-fit items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-50 border border-orange-600 text-slate-950 hover:bg-orange-100 h-10 px-4 py-2 flex gap-2"
        >
          Start Poll
        </button>
      )}

      {showPollForm && (
        <form
          action={formAction}
          className="animate-fadeIn bg-orange-50 p-8 rounded-lg border border-orange-600 space-y-4"
        >
          <label htmlFor="question" className="blocktext-slate-800 font-medium">
            Question
          </label>
          <input
            type="text"
            id="name"
            className="bg-slate-50 w-full rounded-md border h-10 border-slate-600 bg-inherit px-4 py-2 placeholder:text-slate-400 placeholder:text-sm placeholder:italic focus:border-orange-600 focus:outline-none"
            name="question"
            value={question}
            placeholder="Enter the question/title of the poll"
            onChange={(e) => setQuestion(e.target.value)}
          />

          {Array.from({ length: answerCount }).map((_, index) => (
            <div key={index} className="my-4">
              <label
                htmlFor={`answer-${index + 1}`}
                className="block text-slate-800 font-medium my-3"
              >
                Answer {index + 1}
              </label>

              <input
                type="text"
                id={`answer-${index + 1}`}
                className="bg-slate-50 w-full rounded-md border h-10 border-slate-600 bg-inherit px-4 py-2 placeholder:text-slate-400 placeholder:text-sm placeholder:italic focus:border-orange-600 focus:outline-none"
                name={`answer-${index + 1}`}
                placeholder={`Enter answer ${index + 1}`}
              />
              {index === answerCount - 1 && (
                <button
                  onClick={() => setAnswerCount(answerCount + 1)}
                  className="my-4 w-fit items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-orange-600 text-slate-950 hover:bg-slate-100 h-10 px-4 py-2 flex gap-2"
                >
                  Add Answer Option
                </button>
              )}
            </div>
          ))}

          {state?.error && (
            <p className="text-rose-500 font-bold my-4">{state.error}</p>
          )}
          <SubmitButton type="poll" />
        </form>
      )}
    </section>
  );
};

export default PollMaker;
