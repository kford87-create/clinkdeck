import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env first.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  // Safety: this script wipes all data and reseeds. Refuse to run in prod
  // unless someone explicitly opts in.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_DESTRUCTIVE_SEED !== "yes-i-am-sure"
  ) {
    throw new Error(
      "Refusing to run destructive seed in production. Set ALLOW_DESTRUCTIVE_SEED=yes-i-am-sure to bypass."
    );
  }

  await prisma.inquiryMessage.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.session.deleteMany();
  await prisma.magicLink.deleteMany();
  await prisma.user.deleteMany();

  // ---------- Creators ----------
  const maya = await prisma.user.create({
    data: {
      email: "maya@example.com",
      handle: "maya-builds",
      name: "Maya Okonkwo",
      bio: "Full-stack AI engineer. I build production agents for ops-heavy teams. Previously at Stripe, Anthropic.",
      avatarColor: "#f43f5e",
      websiteUrl: "https://example.com/maya",
      calLink: "https://cal.com/maya-builds",
      onboarded: true,
    },
  });

  const dax = await prisma.user.create({
    data: {
      email: "dax@example.com",
      handle: "daxhq",
      name: "Dax Hernandez",
      bio: "Voice + telephony AI. I ship dialer agents that close deals.",
      avatarColor: "#0ea5e9",
      calLink: "https://cal.com/dax",
      onboarded: true,
    },
  });

  const lin = await prisma.user.create({
    data: {
      email: "lin@example.com",
      handle: "lin-makes",
      name: "Lin Tanaka",
      bio: "Workflow automation for e-commerce. Shopify, Klaviyo, Gorgias.",
      avatarColor: "#a855f7",
      onboarded: true,
    },
  });

  // ---------- Buyers ----------
  const buyerJordan = await prisma.user.create({
    data: {
      email: "jordan@example.com",
      handle: "jordan-buyer",
      name: "Jordan Reyes",
      bio: "VP of Operations at a Series B logistics company. Looking for AI tooling that frees up our customer ops team.",
      avatarColor: "#f59e0b",
      onboarded: true,
    },
  });

  const buyerPriya = await prisma.user.create({
    data: {
      email: "priya@example.com",
      handle: "priya-co",
      name: "Priya Shah",
      bio: "Founder of a DTC home-goods brand. $8M ARR. Want to automate post-purchase ops and review collection.",
      avatarColor: "#ec4899",
      onboarded: true,
    },
  });

  // ---------- Listings ----------
  const inboxAgent = await prisma.listing.create({
    data: {
      slug: "ops-inbox-agent",
      title: "Ops Inbox Agent",
      summary:
        "Drains your shared support inbox. Triages, drafts, resolves 70% of tickets and escalates the rest with full context.",
      problem:
        "Ops teams drown in repetitive email — refund requests, missing deliveries, login resets — and there's never enough headcount.",
      builtWith: "Claude Sonnet · Next.js · Postgres · Resend",
      buildTime: "About 4 weeks",
      hardestPart:
        "Building the right human-in-the-loop. Ops teams won't trust auto-send until they've seen 200 drafts and corrected maybe 10. I shipped the approval queue first, auto-send later.",
      archetype: "TRIAGE",
      visualLabels: JSON.stringify({
        inputName: "Support tickets",
        signal: "Sentiment + customer history",
        buckets: ["Auto-reply", "Escalate", "Refund"],
      }),
      themeColor: "#f43f5e",
      tags: "claude, support, ops",
      featuredUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      creatorId: maya.id,
    },
  });

  await prisma.listing.create({
    data: {
      slug: "voice-dialer",
      title: "Outbound Dialer Agent",
      summary:
        "Calls cold leads, qualifies on the call, and books meetings to your calendar. Voicemail, gatekeepers, the works.",
      problem:
        "B2B teams already have a calling motion but can't staff the SDR seat. Off-the-shelf bots sound terrible.",
      builtWith: "Twilio · Claude Haiku · Cartesia",
      buildTime: "About 8 weeks",
      hardestPart:
        "Latency. Anything over 400ms feels like a bot, so we sweat every millisecond on the conversation loop.",
      archetype: "VOICE_LOOP",
      visualLabels: JSON.stringify({
        userSays: "I'm getting a call about a refund",
        agentThinks: "Looks up order · checks return policy",
        agentSays: "I see your order — I can refund $45 right now",
      }),
      themeColor: "#0ea5e9",
      tags: "voice, claude, sales",
      featuredUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      creatorId: dax.id,
    },
  });

  await prisma.listing.create({
    data: {
      slug: "post-purchase-flow",
      title: "Post-Purchase Flow",
      summary:
        "Shopify-native review collection that times each request per SKU and triages negative replies before they hit the public review.",
      problem:
        "Most review tools fire on a fixed delay. Some products review well at 4 days, others at 3 weeks. Generic timing kills response rate.",
      builtWith: "Shopify · Klaviyo · Claude · Postgres",
      buildTime: "About 5 weeks",
      hardestPart:
        "Klaviyo's send API is great but their reporting webhooks are flaky — I had to build a separate poller to be sure I knew what landed.",
      archetype: "PIPELINE",
      visualLabels: JSON.stringify({
        inputName: "New order",
        steps: ["Wait per-SKU", "Draft request", "Triage reply"],
        outputName: "Public 5★ review",
      }),
      themeColor: "#22c55e",
      tags: "ecommerce, claude",
      creatorId: lin.id,
    },
  });

  await prisma.listing.create({
    data: {
      slug: "lead-grader",
      title: "Lead Grader",
      summary:
        "Watches your CRM, enriches each new lead, scores against your ICP, and routes the hot ones to the right rep instantly.",
      problem:
        "Sales reps waste hours qualifying leads manually. Most leads are cold, but the ones that aren't deserve a 5-minute response.",
      builtWith: "Modal · GPT-4.1 · Slack · HubSpot",
      buildTime: "About 3 weeks",
      hardestPart:
        "ICPs change quarterly. I built an eval mode that re-runs the last 30 days of leads against any new ICP rule so reps can see what'd change.",
      archetype: "SCORE_ROUTE",
      visualLabels: JSON.stringify({
        inputName: "New CRM lead",
        scoreLabel: "Likelihood to convert",
        tiers: ["Hot", "Warm", "Cold"],
      }),
      themeColor: "#a855f7",
      tags: "openai, sales",
      creatorId: maya.id,
    },
  });

  await prisma.listing.create({
    data: {
      slug: "video-script-gen",
      title: "Video Script Generator",
      summary:
        "Turns a one-line product idea into a 60-second script with three hook variants and a brand-voice pass.",
      problem:
        "Founders keep ad creative bottle-necked behind a copywriter. Generic LLM output feels off-brand and hookless.",
      builtWith: "Claude Sonnet · Vercel · Custom brand-voice prompts",
      buildTime: "A weekend, then a few weekends polishing",
      hardestPart:
        "Brand voice. Out of the box LLMs sound like LLMs. I built a small style-bank that the prompt pulls from per-brand.",
      archetype: "GENERATIVE",
      visualLabels: JSON.stringify({
        promptName: "1-line product description",
        artifactName: "60-second video script",
        qualitySignal: "Brand voice + 3 hook variants",
      }),
      themeColor: "#f97316",
      tags: "claude, content",
      creatorId: lin.id,
    },
  });

  // ---------- Sample inquiries ----------
  await prisma.inquiry.create({
    data: {
      listingId: inboxAgent.id,
      buyerId: buyerJordan.id,
      creatorId: maya.id,
      subject: "Re: Ops Inbox Agent — for our Zendesk volume",
      budget: "$25k – $50k",
      timeline: "Within 1 month",
      goal: "Hi Maya — we run about 12k tickets/month through Zendesk, mostly logistics-related. Off-the-shelf tools underperform on our long-tail edge cases. Would love to talk about a custom build.",
      status: "REPLIED",
      messages: {
        create: [
          {
            senderId: buyerJordan.id,
            body: "Hi Maya — we run about 12k tickets/month through Zendesk, mostly logistics-related. Off-the-shelf tools underperform on our long-tail edge cases. Would love to talk about a custom build.",
          },
          {
            senderId: maya.id,
            body: "Hey Jordan — 12k/mo is right in the sweet spot. The standard engagement covers Zendesk integration + your top 5 ticket types automated end-to-end + the human approval queue. Adds about 4 weeks. Want to get on a call this Thursday?",
          },
        ],
      },
    },
  });

  await prisma.inquiry.create({
    data: {
      listingId: inboxAgent.id,
      buyerId: buyerPriya.id,
      creatorId: maya.id,
      subject: "Re: Ops Inbox Agent — for DTC support",
      budget: "$10k – $25k",
      timeline: "1–3 months",
      goal: "Hi! We're a $8M DTC home-goods brand. Drowning in 'where's my order' tickets. Curious whether your agent fits or if you'd recommend something simpler.",
      status: "NEW",
      messages: {
        create: {
          senderId: buyerPriya.id,
          body: "Hi! We're a $8M DTC home-goods brand. Drowning in 'where's my order' tickets. Curious whether your agent fits or if you'd recommend something simpler.",
        },
      },
    },
  });

  console.log("Seeded.");
  console.log("5 listings · 3 makers · 2 buyers · 2 sample inquiries");
  console.log("Open at http://localhost:3000");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
