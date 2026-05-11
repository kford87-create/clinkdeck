import { z } from "zod";

export const ARCHETYPES = [
  "TRIAGE",
  "PIPELINE",
  "SCORE_ROUTE",
  "VOICE_LOOP",
  "GENERATIVE",
] as const;

export type Archetype = (typeof ARCHETYPES)[number];

export const ARCHETYPE_META: Record<
  Archetype,
  { name: string; tagline: string; goodFor: string }
> = {
  TRIAGE: {
    name: "Triage",
    tagline: "Things come in. Agent looks at each one. Sorts into buckets.",
    goodFor:
      "Inbox agents · ticket routers · classifiers · anything that decides where things go",
  },
  PIPELINE: {
    name: "Pipeline",
    tagline: "An item moves through a sequence of steps and changes along the way.",
    goodFor:
      "Multi-step workflows · ETL · enrichment chains · anything where the output is a transformed version of the input",
  },
  SCORE_ROUTE: {
    name: "Score & Route",
    tagline: "Each thing gets a score. Hot stuff goes one way, cold stuff goes another.",
    goodFor:
      "Lead scoring · prioritization · risk ranking · anything that grades and dispatches",
  },
  VOICE_LOOP: {
    name: "Voice loop",
    tagline: "User says something. Agent thinks. Agent says something back.",
    goodFor:
      "Voice agents · chatbots · phone dialers · any back-and-forth conversation",
  },
  GENERATIVE: {
    name: "Generative",
    tagline: "A prompt comes in. The agent thinks. An artifact comes out.",
    goodFor:
      "Drafting · code gen · content · image / video / doc generation",
  },
};

// Per-archetype label schemas. Wizard renders a different form for each.

export const triageLabels = z.object({
  inputName: z.string().trim().min(1).max(40),
  signal: z.string().trim().min(1).max(80),
  buckets: z
    .array(z.string().trim().min(1).max(30))
    .min(2)
    .max(4),
});
export type TriageLabels = z.infer<typeof triageLabels>;

export const pipelineLabels = z.object({
  inputName: z.string().trim().min(1).max(40),
  outputName: z.string().trim().min(1).max(40),
  steps: z
    .array(z.string().trim().min(1).max(30))
    .min(2)
    .max(4),
});
export type PipelineLabels = z.infer<typeof pipelineLabels>;

export const scoreRouteLabels = z.object({
  inputName: z.string().trim().min(1).max(40),
  scoreLabel: z.string().trim().min(1).max(40),
  tiers: z
    .array(z.string().trim().min(1).max(20))
    .min(2)
    .max(4),
});
export type ScoreRouteLabels = z.infer<typeof scoreRouteLabels>;

export const voiceLoopLabels = z.object({
  userSays: z.string().trim().min(1).max(80),
  agentThinks: z.string().trim().min(1).max(80),
  agentSays: z.string().trim().min(1).max(80),
});
export type VoiceLoopLabels = z.infer<typeof voiceLoopLabels>;

export const generativeLabels = z.object({
  promptName: z.string().trim().min(1).max(40),
  artifactName: z.string().trim().min(1).max(40),
  qualitySignal: z.string().trim().min(1).max(60),
});
export type GenerativeLabels = z.infer<typeof generativeLabels>;

export const archetypeSchemas = {
  TRIAGE: triageLabels,
  PIPELINE: pipelineLabels,
  SCORE_ROUTE: scoreRouteLabels,
  VOICE_LOOP: voiceLoopLabels,
  GENERATIVE: generativeLabels,
} as const;

// What labels does each archetype need? Used by the wizard to render the right form.
export const ARCHETYPE_FIELDS: Record<
  Archetype,
  Array<
    | {
        kind: "single";
        key: string;
        label: string;
        placeholder: string;
        help?: string;
      }
    | {
        kind: "list";
        key: string;
        label: string;
        placeholder: string;
        help?: string;
        min: number;
        max: number;
      }
  >
> = {
  TRIAGE: [
    {
      kind: "single",
      key: "inputName",
      label: "What comes in?",
      placeholder: "Support tickets",
      help: "What is the agent looking at, in plain words.",
    },
    {
      kind: "single",
      key: "signal",
      label: "What does the agent use to decide?",
      placeholder: "Sentiment + customer history",
    },
    {
      kind: "list",
      key: "buckets",
      label: "Where do they get sorted to?",
      placeholder: "Auto-reply · Escalate · Refund",
      help: "2–4 buckets. Comma-separated.",
      min: 2,
      max: 4,
    },
  ],
  PIPELINE: [
    {
      kind: "single",
      key: "inputName",
      label: "What goes in?",
      placeholder: "A new lead",
    },
    {
      kind: "list",
      key: "steps",
      label: "What are the steps?",
      placeholder: "Enrich · Score · Notify rep",
      help: "2–4 steps in order. Comma-separated.",
      min: 2,
      max: 4,
    },
    {
      kind: "single",
      key: "outputName",
      label: "What comes out?",
      placeholder: "A scored, routed lead in your CRM",
    },
  ],
  SCORE_ROUTE: [
    {
      kind: "single",
      key: "inputName",
      label: "What's the item?",
      placeholder: "An incoming lead",
    },
    {
      kind: "single",
      key: "scoreLabel",
      label: "What does the score mean?",
      placeholder: "Likelihood to convert",
    },
    {
      kind: "list",
      key: "tiers",
      label: "What are the tiers?",
      placeholder: "Hot · Warm · Cold",
      help: "2–4 tiers from highest to lowest. Comma-separated.",
      min: 2,
      max: 4,
    },
  ],
  VOICE_LOOP: [
    {
      kind: "single",
      key: "userSays",
      label: "What does the user say?",
      placeholder: "I want to reschedule my appointment",
    },
    {
      kind: "single",
      key: "agentThinks",
      label: "What does the agent do mid-loop?",
      placeholder: "Looks up calendar · finds open slots",
    },
    {
      kind: "single",
      key: "agentSays",
      label: "What does the agent say back?",
      placeholder: "I have Tuesday at 2pm or Thursday at 10am",
    },
  ],
  GENERATIVE: [
    {
      kind: "single",
      key: "promptName",
      label: "What kind of prompt comes in?",
      placeholder: "A 1-line product description",
    },
    {
      kind: "single",
      key: "artifactName",
      label: "What gets generated?",
      placeholder: "A 60-second video script",
    },
    {
      kind: "single",
      key: "qualitySignal",
      label: "What makes it good?",
      placeholder: "Brand voice + 3 hook variants",
    },
  ],
};

export function parseLabels(archetype: Archetype, raw: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const result = archetypeSchemas[archetype].safeParse(parsed);
  return result.success ? result.data : null;
}
