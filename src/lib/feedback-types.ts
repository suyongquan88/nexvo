export const FEEDBACK_TYPES = [
  {
    value: "feedback",
    label: "Feedback",
    description: "Share how Nexvo is working for you",
    icon: "💬",
  },
  {
    value: "suggestion",
    label: "Suggestion",
    description: "Ideas to improve Nexvo",
    icon: "✨",
  },
  {
    value: "issue",
    label: "Report issue",
    description: "Flag a problem with a recommendation",
    icon: "⚠️",
  },
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

export const ISSUE_CATEGORIES = [
  { value: "incorrect", label: "Incorrect or misleading" },
  { value: "not_relevant", label: "Not relevant to my question" },
  { value: "low_trust", label: "Trust score seems wrong" },
  { value: "safety", label: "Safety or policy concern" },
  { value: "other", label: "Other" },
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]["value"];

export type FeedbackSubmission = {
  type: FeedbackType;
  message: string;
  email?: string;
  issueCategory?: IssueCategory;
  recommendationContext?: {
    question: string;
    productName: string;
  };
  submittedAt: string;
};
