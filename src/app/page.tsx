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
  return (
    <div className="space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Prospects Scrapés', value: '1,284', icon: Users, trend: '+12%', color: 'text-blue-500' },
          { label: 'Emails Envoyés', value: '856', icon: Mail, trend: '+5%', color: 'text-emerald-500' },
          { label: 'SMS Envoyés', value: '432', icon: MessageSquare, trend: '+18%', color: 'text-purple-500' },
          { label: 'RDV Programmés', value: '24', icon: Calendar, trend: '+8%', color: 'text-amber-500' },
        ].map((card, i) => (
          <div key={i} className="glass p-6 rounded-2xl card-hover relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${card.color}`}>
                <card.icon size={20} />
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
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
              {[
                { type: 'mail', user: 'Jean Tremblay', action: 'a ouvert votre email', time: 'Il y a 2 min', brand: 'Plomberie Repentigny' },
                { type: 'sms', user: 'Marc Dubois', action: 'a répondu par SMS', time: 'Il y a 15 min', brand: 'Toiture Excellence' },
                { type: 'check', user: 'Lucie Roy', action: 'a réservé un appel', time: 'Il y a 1h', brand: 'Rénovation Montréal' },
                { type: 'mail', user: 'Sébastien Gagnon', action: 'email envoyé', time: 'Il y a 3h', brand: 'Électricité Plus' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      {item.type === 'mail' && <Mail size={16} className="text-blue-400" />}
                      {item.type === 'sms' && <MessageSquare size={16} className="text-purple-400" />}
                      {item.type === 'check' && <CheckCircle2 size={16} className="text-emerald-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.user}</p>
                      <p className="text-xs text-zinc-500">{item.brand} • {item.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-600 font-medium flex items-center">
                      <Clock size={12} className="mr-1" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
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
                <span className="text-sm font-bold text-white">42%</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-zinc-400">SMS Reply Rate</span>
                <span className="text-sm font-bold text-white">18%</span>
              </div>
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div className="border-t border-zinc-800/50 pt-6 mt-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Insight du jour</p>
                <p className="text-sm text-zinc-300">
                  Le pattern interrupt "Sujet direct" génère +25% d'ouverture sur le secteur Rénovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
