import './globals.css'
import { Noto_Sans, Noto_Serif } from 'next/font/google'

const notoSans = Noto_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
})

const notoSerif = Noto_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-sans bg-zinc-950 text-white">{children}</body>
    </html>
  )
}