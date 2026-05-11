import Link from "next/link";

export const metadata = {
  title: "Privacy · Clinkdeck",
  description: "How Clinkdeck handles your data.",
};

const lastUpdated = "May 9, 2026";

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
      >
        ← Home
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-3 mb-2">
        Privacy
      </h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated {lastUpdated}</p>

      <div className="prose-like space-y-6 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
        <Section title="What we collect">
          <p>
            When you sign in to Clinkdeck we store your email address. When you
            create a maker profile we store your handle, display name, bio,
            avatar color, and any links you choose to add (website, booking
            link). When you publish a build we store the title, summary, build
            story, archetype labels, theme color, and tags you provide. When
            you send or receive an inquiry we store the conversation contents
            and metadata (subject, budget, timeline).
          </p>
          <p>We don&apos;t store passwords. Sign-in is via emailed magic link.</p>
        </Section>

        <Section title="What we don't collect">
          <p>
            We don&apos;t use third-party analytics, advertising trackers, or
            session replay tools. We don&apos;t share or sell your data with
            anyone. The only data we send outside Clinkdeck is: (a) the contents
            of emails we generate (sign-in links, inquiry notifications) sent
            via our email provider, and (b) outbound HTTPS requests to fetch
            our own assets.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            Your email address is used only to send sign-in links and inquiry
            notifications you&apos;ve opted into by signing up or by
            participating in a thread. Listing content is shown publicly on
            your profile and on listing pages so visitors can find your work.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            One cookie: a session token after you sign in. It&apos;s
            httpOnly, sameSite=lax, and on production it&apos;s
            HTTPS-only. It expires 30 days after your last visit.
          </p>
        </Section>

        <Section title="Deleting your data">
          <p>
            You can delete any individual build from its listing page. To
            delete your account entirely, email{" "}
            <a
              href="mailto:hello@clinkdeck.com"
              className="text-teal-700 hover:underline"
            >
              hello@clinkdeck.com
            </a>{" "}
            and we&apos;ll remove your account, listings, and inquiries
            within 7 days.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we materially change how we handle your data we&apos;ll
            update this page and notify active users by email.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Email{" "}
            <a
              href="mailto:hello@clinkdeck.com"
              className="text-teal-700 hover:underline"
            >
              hello@clinkdeck.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}
