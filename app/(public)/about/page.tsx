import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Target, Gauge, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'About',
  description: 'Learn the story behind Hearthforge — built by creators, for creators.',
}

const VALUES = [
  { Icon: Target, title: 'Purpose-Built', desc: 'Every product is designed for how creators actually work — not what looks good in a spec sheet.' },
  { Icon: Gauge, title: 'Precision First', desc: 'We obsess over tolerances, finish quality, and fit. If it isn\'t right, it doesn\'t ship.' },
  { Icon: ShieldCheck, title: 'Built to Last', desc: 'Premium materials and thoughtful design. No planned obsolescence, no throwaway parts.' },
]

const TEAM = [
  { name: 'Butch Chiappinelli', role: 'Co-Founder · Design & Manufacturing', initials: 'BC' },
  { name: 'Joshua Bostic', role: 'Co-Founder · Software & Business', initials: 'JB' },
]

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: sections } = await supabase.from('about_sections').select('*').order('section_key')

  const map = new Map((sections || []).map(s => [s.section_key, s]))
  const story = map.get('story')
  const mission = map.get('mission')

  const storyContent = story?.content || 'Hearthforge was born from a shared passion for clean setups and precision craftsmanship. Founded by Butch and Joshua, we build modular 3D-printed accessories designed specifically for creators who want their workspace to work as hard as they do.'
  const missionContent = mission?.content || 'To give creators the tools to build their perfect workspace — one precision-crafted piece at a time.'

  return (
    <div className="min-h-screen">

      {/* Page header */}
      <section className="pt-12 md:pt-16 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-orange/6 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange text-xs font-semibold mb-6 tracking-wide">
            OUR STORY
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-hearthstone mb-5">
            Built by Creators,<br />
            <span className="text-brand-orange">for Creators</span>
          </h1>
          <p className="text-hearthstone/55 text-xl leading-relaxed">
            Precision Craft. Forged for Creators.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          {story?.image_url ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-hearthstone mb-6">
                  {story?.title || 'Our Story'}
                </h2>
                <p className="text-hearthstone/60 leading-relaxed text-lg">{storyContent}</p>
              </div>
              <div className="aspect-video rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
                <img src={story.image_url} alt="Our story" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-hearthstone mb-6">
                {story?.title || 'Our Story'}
              </h2>
              <p className="text-hearthstone/60 leading-relaxed text-lg">{storyContent}</p>
            </div>
          )}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="relative rounded-3xl border border-brand-orange/20 bg-brand-orange/5 px-8 py-16 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[80px]" />
            </div>
            <div className="relative max-w-2xl mx-auto">
              <span className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-4 block">Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold text-hearthstone mb-5">
                {mission?.title || 'Our Mission'}
              </h2>
              <p className="text-hearthstone/60 text-xl leading-relaxed">
                {missionContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-hearthstone mb-3">What We Stand For</h2>
            <p className="text-hearthstone/50">The principles behind every piece we make.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="p-7 rounded-2xl border border-white/8 bg-white/3 hover:border-brand-orange/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-5 group-hover:bg-brand-orange/15 transition-colors">
                  <v.Icon className="w-5 h-5 text-brand-orange" />
                </div>
                <h3 className="text-lg font-semibold text-hearthstone mb-3">{v.title}</h3>
                <p className="text-hearthstone/50 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-hearthstone mb-3">The Team</h2>
            <p className="text-hearthstone/50">Two founders. One shared obsession with quality.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {TEAM.map((member, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/8 bg-white/3 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-xl font-bold text-brand-orange">{member.initials}</span>
                </div>
                <h3 className="font-semibold text-hearthstone text-lg mb-1">{member.name}</h3>
                <p className="text-hearthstone/45 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl font-bold text-hearthstone mb-4">Want to work with us?</h2>
          <p className="text-hearthstone/50 mb-8 text-lg">Custom orders, wholesale, or just to say hey.</p>
          <Link href="/contact"
            className="inline-block px-10 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold text-base transition-colors shadow-lg shadow-brand-orange/20">
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  )
}

