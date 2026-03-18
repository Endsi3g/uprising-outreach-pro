import React from 'react';
import './globals.css';
import { LayoutDashboard, Users, Send, Settings, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { ThemeProvider } from '@/lib/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-background text-foreground flex h-screen overflow-hidden transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Sidebar */}
          <aside className="w-64 border-r border-border bg-card flex flex-col p-6 space-y-8 transition-colors duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">U</div>
              <span className="text-xl font-bold tracking-tight text-foreground">Uprising</span>
            </div>

            <nav className="flex-1 space-y-2">
              {[
                { name: 'Vue Globale', icon: LayoutDashboard, href: '/' },
                { name: 'Prospects', icon: Users, href: '/prospects' },
                { name: 'Campagnes', icon: Send, href: '/campaigns' },
                { name: 'Analytics', icon: BarChart3, href: '/analytics' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            <button className="flex items-center space-x-3 px-3 py-2 text-muted-foreground hover:text-foreground mt-auto">
              <Settings size={20} />
              <span className="font-medium">Réglages</span>
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-auto bg-background transition-colors duration-300">
            <header className="h-16 border-b border-border flex items-center px-8 justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300">
              <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Outreach Pro / v1.0</h1>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="h-8 w-8 rounded-full bg-accent border border-border"></div>
              </div>
            </header>
            <div className="p-8">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

