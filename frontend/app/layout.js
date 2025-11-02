import './globals.css'

export const metadata = {
  title: 'AI Script Generator',
  description: 'Generate YouTube scripts with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
