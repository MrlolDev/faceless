import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border py-4 bg-bg">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-base">
        <div>
          © {new Date().getFullYear()} Faceless Avatar. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:underline hover:text-main">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:underline hover:text-main">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
