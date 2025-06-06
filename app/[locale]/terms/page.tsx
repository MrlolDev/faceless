import Navbar from "@/components/Landing/LandingNavbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg dark:bg-darkBg">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-heading text-text dark:text-darkText mb-8">
          Terms and Conditions
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last updated: January 2, 2025
        </p>

        <div className="space-y-6 text-text dark:text-darkText font-base">
          <section>
            <h2 className="text-2xl font-heading mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Faceless Avatar, you agree to be bound by
              these Terms and Conditions. We reserve the right to modify these
              terms at any time without prior notice. Your continued use of the
              service after any changes constitutes acceptance of the modified
              terms.
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
            <h2 className="text-2xl font-heading mb-4">
              3. Paid Plans & Billing
            </h2>
            <p>Regarding our paid credit packages:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>All purchases are final and non-transferable</li>
              <li>Prices are subject to change without notice</li>
              <li>
                We accept payments through our authorized payment processors
              </li>
              <li>You agree to provide accurate billing information</li>
              <li>
                Fraudulent purchases will result in immediate account
                termination
              </li>
              <li>
                We reserve the right to refuse service to any paid account
              </li>
              <li>
                Paid status does not exempt users from our terms of service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">4. Refund Policy</h2>
            <p>Our refund policy is as follows:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Refund requests must be submitted within 7 days of purchase
              </li>
              <li>
                Refunds will be considered for technical issues preventing
                service use
              </li>
              <li>
                Refunds will not be issued for:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Already used credits</li>
                  <li>Dissatisfaction with generated avatars</li>
                  <li>Fraudulent purchases or chargebacks</li>
                  <li>Violations of our terms of service</li>
                </ul>
              </li>
              <li>
                We reserve the right to deny refunds to accounts showing signs
                of abuse
              </li>
              <li>
                Approved refunds will be processed through the original payment
                method
              </li>
              <li>Processing of refunds may take 5-10 business days</li>
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
            <p className="mt-4">When you delete your account:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                We will permanently delete all your personal data from our
                servers
              </li>
              <li>Your generated avatars will be removed from our storage</li>
              <li>Your credit history and transactions will be deleted</li>
              <li>
                We cannot delete data that has been processed by third-party
                services (such as OpenAI or Replicate) as it falls under their
                respective data retention policies
              </li>
              <li>
                Account deletion is permanent and cannot be reversed - all
                credits and generated content will be lost
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
            <h2 className="text-2xl font-heading mb-4">8. Communications</h2>
            <p>By using our service:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                You agree to receive emails about related projects and topics
              </li>
              <li>You can opt-out of marketing communications at any time</li>
              <li>
                We may still send you essential service-related communications
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading mb-4">9. Contact</h2>
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
