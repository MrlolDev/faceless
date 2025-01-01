import Navbar from "@/components/LandingNavbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg dark:bg-darkBg">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-heading text-text dark:text-darkText mb-8">
          Terms and Conditions
        </h1>

        <div className="space-y-6 text-text dark:text-darkText font-base">
          <section>
            <h2 className="text-2xl font-heading mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Faceless Avatar, you agree to be bound by
              these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">2. Credits System</h2>
            <p>Our service operates on a credit-based system:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>New users receive 10 initial credits</li>
              <li>Each avatar generation costs approximately 1 credit</li>
              <li>Credits cannot be transferred between accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">3. User Content</h2>
            <p>When using our service:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>You must have rights to the images you upload</li>
              <li>Generated avatars are for personal use only</li>
              <li>
                We do not store your original photos permanently, we bulk delete
                them every 1st of the month
              </li>
              <li>
                By using our service, you grant us the right to use your
                generated avatars for promotional purposes
              </li>
              <li>
                We reserve the right to delete any content that violates our
                terms or that we deem inappropriate
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              4. Account Termination
            </h2>
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Suspend or terminate accounts at our discretion without prior
                notice
              </li>
              <li>Ban users who violate our terms of service</li>
              <li>
                Delete or modify any content associated with terminated accounts
              </li>
              <li>Refuse service to anyone for any reason</li>
              <li>
                Retain or delete any data associated with terminated accounts
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">5. Privacy & Data</h2>
            <p>We are committed to protecting your privacy:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>We only collect necessary user data</li>
              <li>Your generated avatars are stored securely</li>
              <li>
                We do not share your personal information with third parties
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              6. Service Availability
            </h2>
            <p>While we strive for 100% uptime:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>We do not guarantee continuous service availability</li>
              <li>We may perform maintenance at any time</li>
              <li>Service features may change without notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">
              7. Intellectual Property
            </h2>
            <p>Regarding intellectual property rights:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                We retain all rights to the AI models and generation process
              </li>
              <li>
                We may use generated avatars in our marketing materials,
                website, and social media
              </li>
              <li>
                While you maintain rights to your original photos, we have
                perpetual rights to use and display the AI-generated avatars
              </li>
              <li>
                You may not claim ownership of our AI technology or generation
                process
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">8. Contact</h2>
            <p>
              For any questions regarding these terms, please contact us at
              support@faceless-avatar.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
