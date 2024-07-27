import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "../components/theme-provider"
import Layout from '@/components/Layout'
import AuthProvider from '@/components/AuthProvider'
import { Toaster } from "@/components/ui/toaster"

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
          <AuthProvider>
            <Layout>
            <Toaster />
            {children}
            </Layout>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}