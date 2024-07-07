import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "../components/theme-provider"
import Layout from '@/components/Layout'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Admin Dashboard",
  description: "Efficiently manage your website with the Admin Dashboard. Keep track of inventory, manage customers, and handle orders seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Layout>
            {children}
            </Layout>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}