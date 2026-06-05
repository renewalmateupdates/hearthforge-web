import ContactForm from './ContactForm'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Hearthforge — custom orders, questions, and inquiries.',
}

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('key, value')

  const settingsMap: Record<string, string> = {}
  for (const s of settings || []) settingsMap[s.key] = s.value || ''

  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-hearthstone mb-5">Get in Touch</h1>
          <p className="text-hearthstone/50 text-lg mb-10">
            Custom orders, questions, or just want to talk shop? We&apos;d love to hear from you.
          </p>

          <div className="space-y-6">
            {settingsMap.contact_email && (
              <div>
                <p className="text-xs font-semibold text-hearthstone/30 uppercase tracking-wider mb-1">Email</p>
                <a href={`mailto:${settingsMap.contact_email}`} className="text-hearthstone/70 hover:text-hearthstone transition-colors">
                  {settingsMap.contact_email}
                </a>
              </div>
            )}
            {settingsMap.contact_phone && (
              <div>
                <p className="text-xs font-semibold text-hearthstone/30 uppercase tracking-wider mb-1">Phone</p>
                <a href={`tel:${settingsMap.contact_phone}`} className="text-hearthstone/70 hover:text-hearthstone transition-colors">
                  {settingsMap.contact_phone}
                </a>
              </div>
            )}
            {settingsMap.address && (
              <div>
                <p className="text-xs font-semibold text-hearthstone/30 uppercase tracking-wider mb-1">Location</p>
                <p className="text-hearthstone/70">{settingsMap.address}</p>
              </div>
            )}
          </div>

          <div className="mt-12 p-6 rounded-2xl border border-white/8 bg-white/3">
            <h3 className="font-semibold text-hearthstone mb-2">Custom Orders Welcome</h3>
            <p className="text-hearthstone/50 text-sm leading-relaxed">
              Have specific dimensions or requirements? We work with customers directly on custom sizes,
              colors, and configurations. Reach out and let&apos;s build something together.
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
