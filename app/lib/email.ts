type InquiryEmail = {
  creatorEmail: string;
  creatorName: string;
  creatorHandle: string;
  buyerName: string;
  listingTitle: string;
  subject: string;
  budget: string;
  timeline: string;
  goal: string;
  inquiryId: string;
};

type MagicLinkEmail = {
  to: string;
  link: string;
  appUrl: string;
};

export async function sendMagicLinkEmail(payload: MagicLinkEmail) {
  const subject = "Your sign-in link for Clinkdeck";
  const text = `Click the link below to sign in to Clinkdeck. It expires in 15 minutes and works once.

${payload.link}

If you didn't request this, you can ignore this email.`;
  await deliver({
    to: payload.to,
    subject,
    text,
    debugLabel: "magic link",
  });
}

export async function sendInquiryEmail(payload: InquiryEmail) {
  const subject = `New inquiry on ${strip(payload.listingTitle)}`;
  const inquiryUrl = `${appUrl()}/inquiries/${payload.inquiryId}`;
  const text = `Hey ${strip(payload.creatorName)},

${strip(payload.buyerName)} just sent you an inquiry about "${strip(payload.listingTitle)}".

Subject: ${strip(payload.subject)}
Budget:  ${strip(payload.budget)}
When:    ${strip(payload.timeline)}

What they wrote:
${payload.goal}

Open the thread:
${inquiryUrl}
`;

  const toAddress =
    process.env.NODE_ENV !== "production" && process.env.DEMO_TO_OVERRIDE
      ? process.env.DEMO_TO_OVERRIDE
      : payload.creatorEmail;

  await deliver({
    to: toAddress,
    subject,
    text,
    debugLabel: "inquiry",
  });
}

async function deliver({
  to,
  subject,
  text,
  debugLabel,
}: {
  to: string;
  subject: string;
  text: string;
  debugLabel: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev mode: log to console so the developer can see what would be sent.
    console.log(`\n📨 ${debugLabel} (no RESEND_API_KEY — would email if set)`);
    console.log(`  to:      ${to}`);
    console.log(`  subject: ${subject}`);
    console.log(`  body:`);
    text.split("\n").forEach((line) => console.log(`    ${line}`));
    console.log("");
    return;
  }

  const fromAddress =
    process.env.RESEND_FROM ?? "Clinkdeck <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn(`Resend send failed (${res.status}): ${body}`);
    }
  } catch (err) {
    console.warn("Resend send threw:", err);
  }
}

/** Defensive CRLF strip on user-controlled values used in email subjects/bodies. */
function strip(s: string) {
  return s.replace(/[\r\n]+/g, " ");
}

function appUrl() {
  const fromEnv = process.env.APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error("APP_URL is not set in production.");
  }
  return "http://localhost:3000";
}
