import Navbar from "@/components/Landing/LandingNavbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg dark:bg-darkBg">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-heading text-text dark:text-darkText mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-text dark:text-darkText font-base">
          <section>
            <h2 className="text-2xl font-heading mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address (for authentication)</li>
              <li>Photos you upload for avatar generation</li>
              <li>Generated avatars</li>
              <li>Usage data (e.g., features used, credits spent)</li>
              <li>Technical data (e.g., browser type, IP address)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">Your information is used for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing our avatar generation service</li>
              <li>Account management and authentication</li>
              <li>Processing payments and managing credits</li>
              <li>Fraud detection and prevention</li>
              <li>Service improvement and optimization</li>
              <li>Communication about your account and our services</li>
              <li>
                Marketing and promotional purposes (generated avatars only)
              </li>
              <li>Legal compliance and fraud prevention</li>
              <li>Resolving disputes and enforcing our agreements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              3. Payment Information
            </h2>
            <p className="mb-4">Regarding payment processing:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not store your complete payment information</li>
              <li>
                Payments are processed through Polar, our secure payment
                provider
              </li>
              <li>
                We store only the last 4 digits of your card for reference
              </li>
              <li>
                Transaction history is kept for accounting and legal purposes
              </li>
              <li>Payment data is encrypted using industry standards</li>
              <li>We maintain records of credit purchases and usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              4. Data Storage and Security
            </h2>
            <p className="mb-4">We handle your data with care:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Original photos are automatically deleted on the 1st of each
                month
              </li>
              <li>Generated avatars are stored securely in our database</li>
              <li>We use industry-standard encryption for data transmission</li>
              <li>
                Your data is stored on secure servers provided by Supabase
              </li>
              <li>We regularly review and update our security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              5. Third-Party Services
            </h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Supabase (authentication and data storage)</li>
              <li>Vercel (hosting and analytics)</li>
              <li>Google Analytics (website usage tracking)</li>
              <li>Cloudflare Turnstile (spam protection)</li>
              <li>Replicate (AI model hosting)</li>
              <li>OpenAI (AI model hosting)</li>
              <li>Polar (payment processing)</li>
              <li>Stripe (payment processing)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Lodge a complaint with relevant authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication and session management</li>
              <li>Remembering your preferences</li>
              <li>Analytics and performance monitoring</li>
              <li>Security and fraud prevention</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              8. Children&apos;s Privacy
            </h2>
            <p>
              Our service is not intended for users under the age of 13. We do
              not knowingly collect or maintain information from children under
              13 years of age.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              9. Changes to Privacy Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our
              practices, please contact us at:
            </p>
            <p className="mt-2">Email: support@faceless-avatar.com</p>
          </section>

          <section className="mt-8">
            <p className="text-sm">Last updated: January 1, 2025</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">11. Data Deletion</h2>
            <p className="mb-4">When you request account deletion:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We permanently delete your personal information from our
                Supabase database
              </li>
              <li>
                All your uploaded photos and generated avatars are removed from
                storage
              </li>
              <li>Your credit history and transaction records are erased</li>
              <li>Your authentication data is removed from our system</li>
              <li>
                Please note that while we delete all data under our direct
                control, we cannot guarantee the deletion of:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Data processed by OpenAI's image generation models</li>
                  <li>Data processed by Replicate's AI models</li>
                  <li>Analytics data collected by third-party services</li>
                  <li>Backup copies required by law</li>
                  <li>
                    Data that may have been cached or stored by content delivery
                    networks
                  </li>
                </ul>
              </li>
              <li>
                Account deletion is permanent and irreversible - all associated
                data will be lost
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
