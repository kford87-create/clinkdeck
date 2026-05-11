import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import type { InquiryStatus } from "@/app/lib/types";
import StatusBadge from "@/app/components/StatusBadge";

export default async function InquiryInbox() {
  const me = await getCurrentUser();
  if (!me) redirect("/");

  const [received, sent] = await Promise.all([
    prisma.inquiry.findMany({
      where: { creatorId: me.id },
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { slug: true, title: true } },
        buyer: true,
        _count: { select: { messages: true } },
      },
    }),
    prisma.inquiry.findMany({
      where: { buyerId: me.id },
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { slug: true, title: true } },
        creator: true,
        _count: { select: { messages: true } },
      },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Inquiries</h1>

      <section className="mb-10">
        <h2 className="text-base font-semibold mb-3">
          Received ({received.length})
        </h2>
        {received.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">
            No inquiries received yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {received.map((i) => (
              <Link
                key={i.id}
                href={`/inquiries/${i.id}`}
                className="block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-medium">{i.subject}</div>
                  <StatusBadge status={i.status as InquiryStatus} />
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {i.buyer.name} on{" "}
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {i.listing.title}
                  </span>{" "}
                  · {i.budget} · {i.timeline}
                </div>
              </Link>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3">Sent ({sent.length})</h2>
        {sent.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">
            You haven&apos;t reached out to anyone yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {sent.map((i) => (
              <Link
                key={i.id}
                href={`/inquiries/${i.id}`}
                className="block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-medium">{i.subject}</div>
                  <StatusBadge status={i.status as InquiryStatus} />
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  to {i.creator.name} ·{" "}
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {i.listing.title}
                  </span>{" "}
                  · {i.budget} · {i.timeline}
                </div>
              </Link>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
