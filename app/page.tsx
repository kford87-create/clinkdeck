import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <header className="wrap hero">
        <span className="pill">
          <span className="dot" /> Becoming an authorized Google reseller — verification in progress
        </span>
        <h1>
          Buy Google products
          <br />
          <span className="grad">from people who get Google.</span>
        </h1>
        <p className="sub">
          Clinkdeck is your single storefront for Google Chrome, Google Cloud, and Google
          Workspace Marketplace products. We&apos;re currently in the process of becoming an
          authorized Google reseller — we are not authorized just yet.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#chrome">
            Browse the catalog →
          </a>
          <a className="btn btn-ghost" href="#cloud">
            Talk to a specialist
          </a>
        </div>
        <div className="rating">
          <span className="stars">★★★★★</span> 4.9 / 5 — trusted by 400+ growing teams
        </div>
      </header>

      {/* TRUST BAR */}
      <div className="trust">
        <div className="wrap trust-row">
          <span>Chrome Enterprise</span>
          <span>Google Cloud</span>
          <span>Workspace</span>
          <span>ChromeOS</span>
          <span>Marketplace Apps</span>
        </div>
      </div>

      {/* PILLARS */}
      <section className="sf-section" id="chrome">
        <p className="eyebrow">Three product families. One vendor.</p>
        <h2 className="h2">Everything Google, in one place</h2>
        <p className="lead">
          Skip the procurement maze. License, deploy, and manage across the entire Google
          ecosystem with a single partner and a single invoice.
        </p>
        <div className="wrap" style={{ padding: 0 }}>
          <div className="pillars">
            <div className="card">
              <div className="ic blue">🌐</div>
              <h3>Google Chrome</h3>
              <p>Chrome Enterprise, ChromeOS devices, and browser management at scale.</p>
              <ul>
                <li>Chrome Enterprise Premium</li>
                <li>ChromeOS &amp; Chromebook fleets</li>
                <li>Central browser policy management</li>
              </ul>
              <div className="more">Explore Chrome →</div>
            </div>
            <div className="card" id="cloud">
              <div className="ic green">☁️</div>
              <h3>Google Cloud</h3>
              <p>GCP infrastructure plus Google Workspace, sized and billed for your team.</p>
              <ul>
                <li>Compute, storage &amp; networking</li>
                <li>Workspace Business &amp; Enterprise</li>
                <li>Committed-use &amp; cost optimization</li>
              </ul>
              <div className="more">Explore Cloud →</div>
            </div>
            <div className="card" id="marketplace">
              <div className="ic multi">🧩</div>
              <h3>Google Marketplace</h3>
              <p>Vetted Workspace Marketplace apps that plug straight into your domain.</p>
              <ul>
                <li>Security &amp; productivity add-ons</li>
                <li>One-click domain-wide install</li>
                <li>Consolidated billing &amp; support</li>
              </ul>
              <div className="more">Explore Marketplace →</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="sf-section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ padding: 0 }}>
          <div className="features">
            <div className="feat">
              <div className="fic">🤝</div>
              <h4>Authorization in progress</h4>
              <p>We&apos;re completing official Google reseller verification — we are not an authorized reseller yet.</p>
            </div>
            <div className="feat">
              <div className="fic">🧾</div>
              <h4>One consolidated invoice</h4>
              <p>Chrome, Cloud, and Marketplace on a single, predictable monthly bill.</p>
            </div>
            <div className="feat">
              <div className="fic">⚡</div>
              <h4>Same-day provisioning</h4>
              <p>Licenses and devices activated fast, so your team isn&apos;t waiting on access.</p>
            </div>
            <div className="feat">
              <div className="fic">🛡️</div>
              <h4>Hands-on migration</h4>
              <p>We help you move domains, devices, and data without the downtime.</p>
            </div>
            <div className="feat">
              <div className="fic">📈</div>
              <h4>Cost optimization</h4>
              <p>Right-size seats and cloud spend with reviews from real specialists.</p>
            </div>
            <div className="feat">
              <div className="fic">💬</div>
              <h4>Human support</h4>
              <p>A named account contact — not a ticket queue — for the whole lifecycle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="sf-section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ padding: 0 }}>
          <div className="stats">
            <div className="stat">
              <div className="num grad">400+</div>
              <div className="lbl">Teams provisioned</div>
            </div>
            <div className="stat">
              <div className="num grad">15k+</div>
              <div className="lbl">Seats under management</div>
            </div>
            <div className="stat">
              <div className="num grad">99.9%</div>
              <div className="lbl">License accuracy</div>
            </div>
            <div className="stat">
              <div className="num grad">&lt;1 day</div>
              <div className="lbl">Avg. activation time</div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="sf-section">
        <p className="eyebrow">How it works</p>
        <h2 className="h2">From quote to live in three steps</h2>
        <div className="wrap" style={{ padding: 0 }}>
          <div className="steps">
            <div className="step">
              <div className="n">1</div>
              <h4>Tell us what you need</h4>
              <p>Share your team size and goals. We build a tailored quote across Chrome, Cloud, and Marketplace.</p>
            </div>
            <div className="step">
              <div className="n">2</div>
              <h4>We provision &amp; migrate</h4>
              <p>Licenses activated, devices enrolled, data migrated — handled by our specialists end to end.</p>
            </div>
            <div className="step">
              <div className="n">3</div>
              <h4>Manage &amp; scale</h4>
              <p>One dashboard, one invoice, one support contact. Add or remove seats whenever you grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sf-section">
        <p className="eyebrow">Customers</p>
        <h2 className="h2">Teams that switched to Clinkdeck</h2>
        <div className="wrap" style={{ padding: 0 }}>
          <div className="quotes">
            <div className="quote">
              <p>
                &ldquo;Moved our whole org to Workspace and Chrome Enterprise in a weekend.
                One invoice instead of five.&rdquo;
              </p>
              <div className="who">
                <div className="av" />
                <div>
                  <div className="nm">Maya R.</div>
                  <div className="rl">COO, Northwind Labs</div>
                </div>
              </div>
            </div>
            <div className="quote">
              <p>
                &ldquo;They right-sized our GCP spend and cut 22% in the first quarter. Actual
                humans who pick up the phone.&rdquo;
              </p>
              <div className="who">
                <div className="av" />
                <div>
                  <div className="nm">Dax P.</div>
                  <div className="rl">Head of IT, Lumen Co</div>
                </div>
              </div>
            </div>
            <div className="quote">
              <p>
                &ldquo;Provisioned 300 Chromebooks and the Marketplace apps we needed in two
                days. Effortless.&rdquo;
              </p>
              <div className="who">
                <div className="av" />
                <div>
                  <div className="nm">Priya S.</div>
                  <div className="rl">Ops Lead, Bright Academy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sf-section" id="faq">
        <p className="eyebrow">FAQ</p>
        <h2 className="h2">Questions, answered</h2>
        <div className="faq">
          <details open>
            <summary>Are you an authorized Google reseller?</summary>
            <p>
              Not yet. Clinkdeck is currently in the process of becoming an authorized Google
              reseller — verification is underway and is not yet complete. We&apos;ll update this
              page the moment authorization is granted.
            </p>
          </details>
          <details>
            <summary>Are these genuine Google licenses?</summary>
            <p>
              Once our reseller authorization is complete, every license will be sourced through
              official Google channels with full warranty and support entitlements.
            </p>
          </details>
          <details>
            <summary>Can I buy Chrome, Cloud, and Marketplace together?</summary>
            <p>
              That&apos;s the point of Clinkdeck — mix products across all three families and
              receive a single consolidated invoice.
            </p>
          </details>
          <details>
            <summary>Do you help with migration?</summary>
            <p>
              On managed tiers we handle domain, device, and data migration end to end with zero
              downtime as the goal.
            </p>
          </details>
          <details>
            <summary>How is billing handled?</summary>
            <p>
              Product licenses are billed at Google rates; managed service adds a flat monthly
              fee. One predictable invoice, monthly.
            </p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section className="sf-section">
        <div className="wrap" style={{ padding: 0 }}>
          <div className="cta-band">
            <h2>Ready to simplify your Google stack?</h2>
            <p>Get a tailored quote across Chrome, Cloud, and Marketplace in under 24 hours.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/signin">
                Get a quote →
              </Link>
              <a className="btn btn-ghost" href="mailto:hello@clinkdeck.com">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
