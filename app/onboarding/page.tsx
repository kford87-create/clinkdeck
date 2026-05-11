import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import OnboardingForm from "./OnboardingForm";

export default async function Onboarding() {
  const me = await getCurrentUser();
  if (!me) redirect("/signin");
  if (me.onboarded) redirect(`/c/${me.handle}`);

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome.</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Two quick things and you&apos;re in.
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <OnboardingForm defaultName={me.name} defaultHandle={me.handle} />
      </div>
    </div>
  );
}
