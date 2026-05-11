import { requireOnboardedUser } from "@/app/lib/auth";
import SettingsForm from "./SettingsForm";

export default async function Settings() {
  const me = await requireOnboardedUser();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Your profile</h1>
        <p className="text-zinc-500 mt-1">
          This is what shows up on your maker page and next to your inquiries.
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <SettingsForm
          defaults={{
            name: me.name,
            handle: me.handle,
            bio: me.bio ?? "",
            avatarColor: me.avatarColor,
            websiteUrl: me.websiteUrl ?? "",
            calLink: me.calLink ?? "",
          }}
        />
      </div>
    </div>
  );
}
