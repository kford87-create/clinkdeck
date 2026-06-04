import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import { signOut } from "@/app/lib/signin-actions";

export default async function Header() {
  const me = await getCurrentUser();

  return (
    <nav className="sf-nav">
      <div className="wrap sf-nav-inner">
        <Link href="/" className="brand">
          <span className="logo" />
          Clinkdeck
        </Link>

        <div className="nav-links">
          <Link href="/#chrome">Chrome</Link>
          <Link href="/#cloud">Cloud</Link>
          <Link href="/#marketplace">Marketplace</Link>
          <Link href="/#faq">FAQ</Link>
        </div>

        <div className="nav-cta">
          {me ? (
            <>
              <Link href="/settings" className="nav-link hide-sm">
                Account
              </Link>
              <form action={signOut}>
                <button type="submit" className="nav-link" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/signin" className="nav-link hide-sm">
              Sign in
            </Link>
          )}
          <Link href="/signin" className="btn btn-primary">
            Get a quote
          </Link>
        </div>
      </div>
    </nav>
  );
}
