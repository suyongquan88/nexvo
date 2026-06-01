export const FEEDBACK_TYPES = [
  {
    value: "suggestion",
    label: "Submit suggestion",
    description: "Ideas to improve Nexvo",
    icon: "✨",
  },
  {
    value: "issue",
    label: "Report issue",
    description: "Something isn’t working as expected",
    icon: "⚠️",
  },
  {
    value: "challenge",
    label: "Challenge recommendation",
    description: "Disagree with a product we suggested",
    icon: "⚖️",
  },
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

export type FeedbackSubmission = {
  type: FeedbackType;
  message: string;
  email?: string;
  submittedAt: string;
};
