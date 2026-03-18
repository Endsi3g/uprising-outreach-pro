'use client';
import React from 'react';
import { 
  ArrowUpRight, 
  Users, 
  Mail, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = React.useState<any[]>([
    { label: 'Prospects Scrapés', value: '0', icon: Users, trend: '0%', color: 'text-blue-500' },
    { label: 'Emails Envoyés', value: '0', icon: Mail, trend: '0%', color: 'text-emerald-500' },
    { label: 'SMS Envoyés', value: '0', icon: MessageSquare, trend: '0%', color: 'text-purple-500' },
    { label: 'RDV Programmés', value: '0', icon: Calendar, trend: '0%', color: 'text-amber-500' },
  ]);

  return (
    <div className="space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card, i) => (
          <div key={i} className="glass p-6 rounded-2xl card-hover relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${card.color}`}>
                <card.icon size={20} />
              </div>
              <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                {card.trend}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-400 text-sm font-medium">{card.label}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">Activité Récente</h2>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors">Voir tout</button>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="divide-y divide-zinc-800/50">
              <div className="p-12 text-center text-zinc-500 italic">
                Aucune activité récente. Les événements s'afficheront ici en temps réel.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats / Funnel */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Performances Canal</h2>
          <div className="glass p-6 rounded-2xl space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-zinc-400">Email Open Rate</span>
                <span className="text-sm font-bold text-white">0%</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-zinc-400">SMS Reply Rate</span>
                <span className="text-sm font-bold text-white">0%</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>

            <div className="border-t border-zinc-800/50 pt-6 mt-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Insight du jour</p>
                <p className="text-sm text-zinc-300">
                  Lancez votre première campagne pour obtenir des insights basés sur l'IA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
