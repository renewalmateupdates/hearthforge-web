import { createClient } from '@/lib/supabase/server'
import FAQAccordion from './FAQAccordion'
import type { FAQ } from '@/types'

export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Raid Ready Labs products, shipping, and ordering.',
}

export default async function FAQPage() {
  const supabase = await createClient()
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  const categories = [...new Set((faqs || []).map(f => f.category).filter(Boolean))]

  return (
    <div className="min-h-screen">

      {/* Page header */}
      <section className="hf-page-header pb-16 border-b border-white/5">
        <div className="hf-section">
          <h1 className="text-5xl md:text-6xl font-bold text-hearthstone mb-4">FAQ</h1>
          <p className="text-hearthstone/50 text-xl">Answers to the most common questions.</p>
        </div>
      </section>

      <div className="hf-section py-16">

      {(!faqs || faqs.length === 0) && (
        <div className="py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">💬</span>
          </div>
          <h2 className="text-2xl font-bold text-hearthstone mb-3">Questions? We Have Answers</h2>
          <p className="text-hearthstone/50 text-lg max-w-md mx-auto mb-8 leading-relaxed">
            Our FAQ is being put together. In the meantime, reach out and we&apos;ll get back to you directly.
          </p>
          <a href="/contact"
            className="inline-block px-8 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold transition-colors shadow-lg shadow-brand-orange/20">
            Contact Us
          </a>
        </div>
      )}

      {faqs && faqs.length > 0 && (
        <div className="space-y-10">
          {categories.map(cat => {
            const catFaqs = (faqs || []).filter(f => f.category === cat)
            return (
              <section key={cat}>
                {categories.length > 1 && (
                  <h2 className="text-xs font-semibold text-hearthstone/30 uppercase tracking-wider mb-4">{cat}</h2>
                )}
                <FAQAccordion faqs={catFaqs} />
              </section>
            )
          })}
          {/* FAQs without category */}
          {(faqs || []).filter(f => !f.category).length > 0 && (
            <FAQAccordion faqs={(faqs || []).filter(f => !f.category)} />
          )}
        </div>
      )}

      <div className="mt-16 p-6 rounded-2xl border border-white/8 bg-white/3 text-center">
        <h3 className="font-semibold text-hearthstone mb-2">Still have questions?</h3>
        <p className="text-hearthstone/50 text-sm mb-4">We&apos;re happy to help. Reach out directly.</p>
        <a href="/contact" className="inline-block px-6 py-3 rounded-xl bg-brand-orange hover:bg-amber text-white text-sm font-semibold transition-colors">
          Contact Us
        </a>
      </div>

      </div>
    </div>
  )
}

