"use client";

import { useActionState, useState } from "react";
import {
  ARCHETYPES,
  ARCHETYPE_META,
  ARCHETYPE_FIELDS,
  type Archetype,
} from "@/app/lib/archetypes";
import Triage from "@/app/components/visuals/Triage";
import Pipeline from "@/app/components/visuals/Pipeline";
import ScoreRoute from "@/app/components/visuals/ScoreRoute";
import VoiceLoop from "@/app/components/visuals/VoiceLoop";
import Generative from "@/app/components/visuals/Generative";
import {
  type ActionState,
  initialActionState,
} from "@/app/lib/action-state";

type FormState = Record<string, string>;

const SAMPLE_LABELS: Record<Archetype, FormState> = {
  TRIAGE: {
    inputName: "Support tickets",
    signal: "Sentiment + customer history",
    buckets: "Auto-reply, Escalate, Refund",
  },
  PIPELINE: {
    inputName: "A new lead",
    steps: "Enrich, Score, Route",
    outputName: "A scored lead in your CRM",
  },
  SCORE_ROUTE: {
    inputName: "An incoming lead",
    scoreLabel: "Likelihood to convert",
    tiers: "Hot, Warm, Cold",
  },
  VOICE_LOOP: {
    userSays: "I want to reschedule my appointment",
    agentThinks: "Looks up calendar · finds slots",
    agentSays: "I have Tuesday at 2pm or Thursday at 10am",
  },
  GENERATIVE: {
    promptName: "A 1-line product description",
    artifactName: "A 60-second video script",
    qualitySignal: "Brand voice + 3 hook variants",
  },
};

const COLORS = [
  "#f43f5e",
  "#ec4899",
  "#a855f7",
  "#8b5cf6",
  "#0ea5e9",
  "#06b6d4",
  "#10b981",
  "#22c55e",
  "#eab308",
  "#f97316",
];

export type WizardDefaults = {
  listingId?: string;
  title?: string;
  summary?: string;
  problem?: string;
  builtWith?: string;
  buildTime?: string;
  hardestPart?: string;
  tags?: string;
  archetype?: Archetype;
  themeColor?: string;
  labels?: FormState;
};

type WizardProps = {
  action: (
    prev: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  defaults?: WizardDefaults;
  submitLabel?: string;
  cancelHref?: string;
};

export default function ListingWizard({
  action,
  defaults = {},
  submitLabel = "Publish build",
  cancelHref = "/",
}: WizardProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialActionState
  );
  const fieldErrors = !state.ok ? state.fieldErrors ?? {} : {};
  const [archetype, setArchetype] = useState<Archetype>(
    defaults.archetype ?? "TRIAGE"
  );
  const [labelsByArchetype, setLabelsByArchetype] = useState<
    Record<Archetype, FormState>
  >(() => {
    const initial: Record<Archetype, FormState> = {
      TRIAGE: {},
      PIPELINE: {},
      SCORE_ROUTE: {},
      VOICE_LOOP: {},
      GENERATIVE: {},
    };
    if (defaults.archetype && defaults.labels) {
      initial[defaults.archetype] = { ...defaults.labels };
    }
    return initial;
  });
  const [themeColor, setThemeColor] = useState<string>(
    defaults.themeColor ?? "#0ea5e9"
  );

  const labels = labelsByArchetype[archetype];

  function setLabel(key: string, value: string) {
    setLabelsByArchetype((prev) => ({
      ...prev,
      [archetype]: { ...prev[archetype], [key]: value },
    }));
  }

  return (
    <form action={formAction} className="space-y-6">
      {defaults.listingId && (
        <input type="hidden" name="listingId" value={defaults.listingId} />
      )}
      <input type="hidden" name="archetype" value={archetype} />
      <input type="hidden" name="themeColor" value={themeColor} />

      {!state.ok && state.error && (
        <div className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <Group title="The basics">
        <Field
          label="Title"
          name="title"
          placeholder="e.g. Outbound Dialer Agent"
          help="What's it called? Short and clear."
          defaultValue={defaults.title}
          error={fieldErrors.title}
          required
        />
        <Textarea
          label="One-liner"
          name="summary"
          placeholder="e.g. A voice agent that calls cold leads, qualifies, and books meetings to your calendar."
          help="One sentence. The first thing buyers will read."
          rows={2}
          defaultValue={defaults.summary}
          error={fieldErrors.summary}
          required
        />
      </Group>

      <Group title="Pick the visual">
        <p className="text-sm text-zinc-500 -mt-2 mb-1">
          Clinkdeck will animate this on your listing. Pick the closest match.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {ARCHETYPES.map((a) => {
            const selected = a === archetype;
            return (
              <button
                key={a}
                type="button"
                onClick={() => setArchetype(a)}
                className={`text-left rounded-xl border-2 p-3 transition-colors ${
                  selected
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                <div className="font-semibold text-sm">
                  {ARCHETYPE_META[a].name}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {ARCHETYPE_META[a].tagline}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <ColorPicker selected={themeColor} onChange={setThemeColor} />
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
            Live preview
          </div>
          <Preview
            archetype={archetype}
            labels={labels}
            themeColor={themeColor}
          />
        </div>
      </Group>

      <Group title="Label the visual">
        {ARCHETYPE_FIELDS[archetype].map((field) => {
          const sample = SAMPLE_LABELS[archetype][field.key] ?? "";
          return (
            <Field
              key={`${archetype}-${field.key}`}
              label={field.label}
              name={field.key}
              placeholder={sample}
              help={field.help}
              value={labels[field.key] ?? ""}
              onChange={(v) => setLabel(field.key, v)}
              error={fieldErrors[field.key]}
              required
            />
          );
        })}
      </Group>

      <Group title="Build story (optional)">
        <p className="text-sm text-zinc-500 -mt-2 mb-1">
          Skippable. Adds context for buyers but you can come back to fill
          these in.
        </p>
        <Textarea
          label="What problem does this solve?"
          name="problem"
          placeholder="e.g. Sales teams can't staff a full SDR seat but still need someone to call cold leads."
          rows={3}
          defaultValue={defaults.problem}
          error={fieldErrors.problem}
        />
        <Field
          label="What did you build it with?"
          name="builtWith"
          placeholder="e.g. Lovable + Claude · Cursor + Modal · v0 + Supabase · just GPT"
          help="The tools you used. Plain English."
          defaultValue={defaults.builtWith}
          error={fieldErrors.builtWith}
          required
        />
        <Field
          label="How long did it take?"
          name="buildTime"
          placeholder="e.g. A weekend · ~3 weeks · two months on and off"
          defaultValue={defaults.buildTime}
          error={fieldErrors.buildTime}
        />
        <Textarea
          label="What was the hardest part?"
          name="hardestPart"
          placeholder="e.g. Getting voice latency under 400ms. Anything over that and it sounded like a bot."
          rows={3}
          defaultValue={defaults.hardestPart}
          error={fieldErrors.hardestPart}
        />
      </Group>

      <Group title="Tags (optional)">
        <Field
          label="Tags"
          name="tags"
          placeholder="claude, voice, sales"
          help="Comma-separated. Keep it short."
          defaultValue={defaults.tags}
        />
      </Group>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <a
          href={cancelHref}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}

function Preview({
  archetype,
  labels,
  themeColor,
}: {
  archetype: Archetype;
  labels: FormState;
  themeColor: string;
}) {
  const get = (key: string) =>
    labels[key]?.trim() || SAMPLE_LABELS[archetype][key] || "";

  switch (archetype) {
    case "TRIAGE":
      return (
        <Triage
          themeColor={themeColor}
          inputName={get("inputName")}
          signal={get("signal")}
          buckets={splitList(get("buckets"))}
        />
      );
    case "PIPELINE":
      return (
        <Pipeline
          themeColor={themeColor}
          inputName={get("inputName")}
          outputName={get("outputName")}
          steps={splitList(get("steps"))}
        />
      );
    case "SCORE_ROUTE":
      return (
        <ScoreRoute
          themeColor={themeColor}
          inputName={get("inputName")}
          scoreLabel={get("scoreLabel")}
          tiers={splitList(get("tiers"))}
        />
      );
    case "VOICE_LOOP":
      return (
        <VoiceLoop
          themeColor={themeColor}
          userSays={get("userSays")}
          agentThinks={get("agentThinks")}
          agentSays={get("agentSays")}
        />
      );
    case "GENERATIVE":
      return (
        <Generative
          themeColor={themeColor}
          promptName={get("promptName")}
          artifactName={get("artifactName")}
          qualitySignal={get("qualitySignal")}
        />
      );
  }
}

function splitList(s: string): string[] {
  return s
    .split(/[,·•]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
      <legend className="px-2 text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  placeholder,
  help,
  required = false,
  value,
  onChange,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label}
        {!required && (
          <span className="text-zinc-400 ml-1 text-xs">(optional)</span>
        )}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        {...(onChange
          ? { value: value ?? "", onChange: (e) => onChange(e.target.value) }
          : { defaultValue: defaultValue ?? "" })}
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {error && (
        <span className="block text-xs text-rose-600 mt-1">{error}</span>
      )}
      {help && !error && (
        <span className="block text-xs text-zinc-500 mt-1">{help}</span>
      )}
    </label>
  );
}

function Textarea({
  label,
  name,
  placeholder,
  help,
  rows = 3,
  required = false,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  placeholder?: string;
  help?: string;
  rows?: number;
  required?: boolean;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label}
        {!required && (
          <span className="text-zinc-400 ml-1 text-xs">(optional)</span>
        )}
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          error ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
        }`}
      />
      {error && (
        <span className="block text-xs text-rose-600 mt-1">{error}</span>
      )}
      {help && !error && (
        <span className="block text-xs text-zinc-500 mt-1">{help}</span>
      )}
    </label>
  );
}

function ColorPicker({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (c: string) => void;
}) {
  return (
    <div>
      <span className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
        Theme color
      </span>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`h-7 w-7 rounded-full transition-all ring-2 ${
              c.toLowerCase() === selected.toLowerCase()
                ? "ring-zinc-900 dark:ring-white"
                : "ring-transparent"
            }`}
            style={{ background: c }}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>
    </div>
  );
}
