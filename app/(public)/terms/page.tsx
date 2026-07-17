export const metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions for using the Raid Ready Labs website and ordering our products.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">

      {/* Page header */}
      <section className="hf-page-header pb-16 border-b border-white/5">
        <div className="hf-section">
          <h1 className="text-5xl md:text-6xl font-bold text-hearthstone mb-4">Terms of Service</h1>
          <p className="text-hearthstone/50 text-xl">Last updated June 2026</p>
        </div>
      </section>

      <div className="hf-section py-16">
        <div className="max-w-3xl mx-auto space-y-10 text-hearthstone/60 leading-relaxed">

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Overview</h2>
            <p>
              Raid Ready Labs designs and produces precision 3D-printed gear and custom builds for streamers,
              gamers, and content creators. By using this website or placing an order, you agree to the
              terms below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Products &amp; Custom Orders</h2>
            <p>
              Product descriptions, pricing, and availability are subject to change without notice. Custom
              orders are made to the specifications discussed and confirmed directly with us via the contact
              form or email. We reserve the right to decline any order or custom request.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Materials &amp; Quality</h2>
            <p>
              Each piece is precision printed using materials matched to the build. Minor variations in
              color, texture, or finish are normal for printed goods and are not considered defects.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Intellectual Property</h2>
            <p>
              All designs, product photography, and content on this site are the property of Raid Ready Labs and
              may not be reproduced or used without permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Limitation of Liability</h2>
            <p>
              Raid Ready Labs products are provided as-is. We are not liable for any indirect, incidental, or
              consequential damages arising from the use of our products or website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-hearthstone mb-3">Contact Us</h2>
            <p>
              Questions about these terms? Reach out to us at{' '}
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
