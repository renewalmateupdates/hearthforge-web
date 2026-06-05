import { createClient } from '@/lib/supabase/server'
import FAQAccordion from './FAQAccordion'
import type { FAQ } from '@/types'

export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Hearthforge products, shipping, and ordering.',
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
    <div className="max-w-3xl mx-auto px-5 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-hearthstone mb-4">FAQ</h1>
        <p className="text-hearthstone/50 text-lg">Answers to the most common questions.</p>
      </div>

      {(!faqs || faqs.length === 0) && (
        <div className="text-center py-16">
          <p className="text-hearthstone/40">No FAQs yet. Check back soon.</p>
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
  )
}
