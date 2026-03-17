import React from 'react';
import { LayoutDashboard, Users, Send, Settings, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-zinc-950 text-zinc-50 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 flex flex-col p-6 space-y-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center font-bold text-zinc-950">U</div>
            <span className="text-xl font-bold tracking-tight text-white">Uprising</span>
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
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <button className="flex items-center space-x-3 px-3 py-2 text-zinc-400 hover:text-white mt-auto">
            <Settings size={20} />
            <span className="font-medium">Réglages</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-auto">
          <header className="h-16 border-b border-zinc-800 flex items-center px-8 justify-between">
            <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Outreach Pro / v1.0</h1>
            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
