import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Analytics | Raid Ready Labs Admin' }

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'google_analytics_id')
    .single()

  const gaId = settings?.value || ''

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Analytics</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Traffic and engagement for your site.</p>
      </div>

      {gaId ? (
        <div className="admin-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <p className="text-sm font-medium text-hearthstone">Google Analytics connected</p>
            <code className="text-xs text-hearthstone/40 ml-1">{gaId}</code>
          </div>
          <p className="text-hearthstone/50 text-sm">
            View your full analytics dashboard at{' '}
            <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
              analytics.google.com
            </a>
          </p>
          <div className="bg-white/3 rounded-xl p-6 border border-white/8 text-center">
            <p className="text-hearthstone/30 text-sm">
              Embed Google Analytics reports here by adding a Looker Studio embed or GA4 iframe.
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-card space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <p className="text-sm font-medium text-hearthstone">Google Analytics not connected</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-hearthstone/70">Setup Instructions</h3>
            <ol className="space-y-2 text-sm text-hearthstone/60 list-decimal list-inside">
              <li>
                Go to{' '}
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
                  analytics.google.com
                </a>{' '}
                and create a GA4 property for your site.
              </li>
              <li>Copy your Measurement ID (starts with <code className="text-amber/80">G-</code>).</li>
              <li>
                Go to{' '}
                <a href="/admin/settings" className="text-amber hover:underline">Site Settings</a>{' '}
                and paste it into the Google Analytics ID field.
              </li>
              <li>Add the GA4 script to your site&apos;s <code className="text-amber/80">app/layout.tsx</code> using the ID from settings.</li>
            </ol>
          </div>

          <div className="bg-white/3 rounded-xl p-4 border border-white/8">
            <p className="text-xs text-hearthstone/40 font-semibold uppercase tracking-wider mb-2">Example layout.tsx snippet</p>
            <pre className="text-xs text-hearthstone/60 overflow-x-auto">{`<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="ga4" strategy="afterInteractive">{
  \`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');\`
}</Script>`}</pre>
          </div>

          <a href="/admin/settings" className="admin-btn-primary inline-block text-sm">
            Go to Site Settings
          </a>
        </div>
      )}
    </div>
  )
}
