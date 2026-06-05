import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'About',
  description: 'Learn the story behind Hearthforge — built by creators, for creators.',
}

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: sections } = await supabase.from('about_sections').select('*').order('section_key')

  const map = new Map((sections || []).map(s => [s.section_key, s]))
  const story = map.get('story')
  const mission = map.get('mission')
  const team = map.get('team')

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-hearthstone mb-4">About Hearthforge</h1>
        <p className="text-hearthstone/50 text-lg">Precision Craft. Forged for Creators.</p>
      </div>

      {/* Story */}
      {story && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 items-center">
          <div>
            <h2 className="text-2xl font-bold text-hearthstone mb-4">{story.title || 'Our Story'}</h2>
            {story.content && (
              <p className="text-hearthstone/60 leading-relaxed text-lg">{story.content}</p>
            )}
          </div>
          {story.image_url ? (
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/8">
              <img src={story.image_url} alt="Our story" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-video rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center">
              <span className="text-hearthstone/10 text-6xl">🔥</span>
            </div>
          )}
        </section>
      )}

      {/* Mission */}
      {mission && (
        <section className="relative mb-20 rounded-3xl border border-brand-orange/20 bg-brand-orange/5 p-10 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-[80px]" />
          </div>
          <div className="relative">
            <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-4 block">Mission</span>
            <h2 className="text-2xl md:text-3xl font-bold text-hearthstone mb-4">{mission.title || 'Our Mission'}</h2>
            {mission.content && (
              <p className="text-hearthstone/60 text-lg max-w-2xl mx-auto leading-relaxed">{mission.content}</p>
            )}
          </div>
        </section>
      )}

      {/* Team */}
      {team && team.content && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-hearthstone mb-4">{team.title || 'The Team'}</h2>
          {team.image_url && (
            <div className="aspect-video rounded-2xl overflow-hidden border border-white/8 mb-6">
              <img src={team.image_url} alt="The team" className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-hearthstone/60 leading-relaxed">{team.content}</p>
        </section>
      )}

      {/* Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: '🎯', title: 'Purpose-Built', desc: 'Every product is designed for how creators actually work.' },
          { icon: '🔩', title: 'Precision First', desc: 'We obsess over tolerances, finish quality, and fit.' },
          { icon: '🌱', title: 'Built to Last', desc: 'Premium materials. No planned obsolescence.' },
        ].map((v, i) => (
          <div key={i} className="p-6 rounded-2xl border border-white/8 bg-white/3">
            <div className="text-3xl mb-3">{v.icon}</div>
            <h3 className="font-semibold text-hearthstone mb-1">{v.title}</h3>
            <p className="text-hearthstone/50 text-sm">{v.desc}</p>
          </div>
        ))}
      </section>

      <div className="text-center">
        <Link href="/contact" className="inline-block px-8 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold transition-colors">
          Get in Touch
        </Link>
      </div>
    </div>
  )
}
