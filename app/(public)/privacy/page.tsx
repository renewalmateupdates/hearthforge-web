export const metadata = {
  title: 'Privacy Policy',
  description: 'How Raid Ready Labs collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">

      {/* Page header */}
      <section className="hf-page-header pb-16 border-b border-white/5">
        <div className="hf-section">
          <h1 className="text-5xl md:text-6xl font-bold text-hearthstone mb-4">Privacy Policy</h1>
          <p className="text-hearthstone/50 text-xl">Last updated June 2026</p>
        </div>
      </section>

      <div className="hf-section py-16">
        <div className="max-w-3xl mx-auto space-y-10 text-hearthstone/60 leading-relaxed">

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Information We Collect</h2>
            <p>
              When you contact us through our website, we collect the information you provide directly —
              such as your name, email address, phone number, and the content of your message. We do not
              collect this information for any purpose other than responding to your inquiry.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">How We Use Your Information</h2>
            <p>
              We use the information you provide solely to respond to inquiries, fulfill custom orders,
              and communicate with you about your requests. We do not sell, rent, or share your personal
              information with third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Cookies &amp; Analytics</h2>
            <p>
              This site may use basic analytics tools to understand traffic and improve our content. These
              tools do not identify you personally and are used only in aggregate to help us understand how
              visitors use the site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Data Retention</h2>
            <p>
              We retain contact form submissions only as long as needed to respond to your inquiry and
              maintain reasonable business records. You may request that we delete your information at
              any time by contacting us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Contact Us</h2>
            <p>
              If you have questions about this privacy policy or how your information is handled, reach out
              to us at{' '}
              <a href="mailto:team@raidreadylabs.com" className="text-brand-orange hover:text-amber transition-colors">
                team@raidreadylabs.com
              </a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
