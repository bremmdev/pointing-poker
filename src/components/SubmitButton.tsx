"use client";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  type: "poker" | "poll";
};

const SubmitButton = ({ type }: SubmitButtonProps) => {
  const buttonText = type === "poker" ? "Create Poker Session" : "Create Poll";
  const buttonLoadingText =
    type === "poker" ? "Creating session..." : "Creating poll...";

  const colorClasses = {
    poker: "bg-orange-50 border border-orange-600 hover:bg-orange-100",
    poll: "bg-orange-200 border border-orange-600  hover:bg-orange-300/70",
  };

  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`w-fit items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-slate-950 ${colorClasses[type]} h-10 px-4 py-2 flex gap-2`}
      disabled={pending}
    >
      {pending ? buttonLoadingText : buttonText}
    </button>
  );
};

export default SubmitButton;
