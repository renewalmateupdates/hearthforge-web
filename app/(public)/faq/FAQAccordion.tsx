'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { FAQ } from '@/types'

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {faqs.map(faq => {
        const isOpen = open === faq.id
        return (
          <div key={faq.id} className="rounded-xl border border-white/8 overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/3 transition-colors"
            >
              <span className="font-medium text-hearthstone pr-4">{faq.question}</span>
              {isOpen
                ? <ChevronUp className="w-4 h-4 text-hearthstone/40 shrink-0" />
                : <ChevronDown className="w-4 h-4 text-hearthstone/40 shrink-0" />
              }
            </button>
            {isOpen && (
              <div className="px-6 pb-5 border-t border-white/5">
                <p className="text-hearthstone/60 leading-relaxed pt-4">{faq.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
