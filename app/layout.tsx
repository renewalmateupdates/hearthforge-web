import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Raid Ready Labs',
    default: 'Raid Ready Labs — Precision Craft for Creators',
  },
  description: 'Precision 3D-printed gear and custom builds for streamers, gamers, and content creators.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://raidreadylabs.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-space-grotesk)]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
