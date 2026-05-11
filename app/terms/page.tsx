import Link from "next/link";

export const metadata = {
  title: "Terms · Clinkdeck",
  description: "Terms of service for Clinkdeck.",
};

const lastUpdated = "May 9, 2026";

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
      >
        ← Home
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-3 mb-2">Terms</h1>
      <p className="text-sm text-zinc-500 mb-8">Last updated {lastUpdated}</p>

      <div className="prose-like space-y-6 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
        <Section title="What Clinkdeck is">
          <p>
            Clinkdeck is a showcase platform for AI builders. You can publish
            listings describing builds you&apos;ve made, and other people can
            send you inquiries about hiring or collaborating. Clinkdeck does not
            facilitate payments, contracts, or escrow — any engagement that
            results from an inquiry happens entirely between you and the
            other party, off the platform.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            You can create an account by entering an email address. You&apos;re
            responsible for keeping access to that email address secure —
            anyone who can read your email can sign in to your account. One
            human, one account.
          </p>
        </Section>

        <Section title="Your content">
          <p>
            You retain ownership of everything you publish. By publishing on
            Clinkdeck you give us a non-exclusive license to display, distribute,
            and generate previews of that content (including OG images) so
            we can show your listing on Clinkdeck and on social platforms when
            it&apos;s shared.
          </p>
          <p>
            Don&apos;t publish content you don&apos;t have the right to
            publish. Don&apos;t publish anyone else&apos;s work as your own.
          </p>
        </Section>

        <Section title="What's not allowed">
          <p>
            No spam, no harassment, no impersonation, no illegal content, no
            content that infringes intellectual property, no malware. We may
            remove listings, suspend accounts, and block IP addresses without
            notice if we see this kind of behavior.
          </p>
          <p>
            Inquiries are gated to signed-in users for a reason: don&apos;t
            use them to send unsolicited sales pitches unrelated to the
            build you&apos;re inquiring about. Repeat offenders lose
            inquiry privileges.
          </p>
        </Section>

        <Section title="No warranty, no liability">
          <p>
            Clinkdeck is provided as-is. We don&apos;t guarantee uptime,
            accuracy, or that the platform will continue to exist. We
            aren&apos;t liable for the outcome of any engagement that comes
            from a Clinkdeck inquiry. Vet who you&apos;re working with the same
            way you would on any other platform.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            If we materially change these terms we&apos;ll update this page
            and notify active users by email. Continued use after a change
            means you accept the updated terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Email{" "}
            <a
              href="mailto:hello@clinkdeck.com"
              className="text-teal-700 hover:underline"
            >
              hello@clinkdeck.com
            </a>{" "}
            with any questions.
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
