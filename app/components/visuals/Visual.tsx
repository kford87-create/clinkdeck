import {
  type Archetype,
  parseLabels,
  type TriageLabels,
  type PipelineLabels,
  type ScoreRouteLabels,
  type VoiceLoopLabels,
  type GenerativeLabels,
} from "@/app/lib/archetypes";
import Triage from "./Triage";
import Pipeline from "./Pipeline";
import ScoreRoute from "./ScoreRoute";
import VoiceLoop from "./VoiceLoop";
import Generative from "./Generative";

type VisualProps = {
  archetype: string;
  visualLabels: string;
  themeColor: string;
};

/**
 * Renders the right archetype animation for a given listing.
 * Falls back to a friendly empty state if the labels don't validate.
 */
export default function Visual({
  archetype,
  visualLabels,
  themeColor,
}: VisualProps) {
  const a = archetype as Archetype;
  const labels = parseLabels(a, visualLabels);
  if (!labels) {
    return (
      <div
        className="w-full aspect-video rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-sm text-zinc-500"
        style={{ background: themeColor }}
      >
        Visual unavailable
      </div>
    );
  }

  switch (a) {
    case "TRIAGE":
      return <Triage themeColor={themeColor} {...(labels as TriageLabels)} />;
    case "PIPELINE":
      return (
        <Pipeline themeColor={themeColor} {...(labels as PipelineLabels)} />
      );
    case "SCORE_ROUTE":
      return (
        <ScoreRoute
          themeColor={themeColor}
          {...(labels as ScoreRouteLabels)}
        />
      );
    case "VOICE_LOOP":
      return (
        <VoiceLoop themeColor={themeColor} {...(labels as VoiceLoopLabels)} />
      );
    case "GENERATIVE":
      return (
        <Generative
          themeColor={themeColor}
          {...(labels as GenerativeLabels)}
        />
      );
  }
}
