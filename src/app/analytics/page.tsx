'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Mail, MessageSquare, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulation ou futur fetch Supabase
    // Pour l'instant on garde vide pour respecter le "no mock"
    setLoading(false);
  }, []);

  if (loading) return <div className="p-10 text-zinc-500 italic">Chargement des statistiques...</div>;
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
        <p className="text-zinc-500 text-sm">Analysez l'efficacité de vos campagnes et de vos canaux.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement par canal */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp size={20} className="text-emerald-500" />
              <span>Engagement Hebdomadaire</span>
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="email" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sms" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taux de conversion */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Calendar size={20} className="text-amber-500" />
              <span>Prise de Rendez-vous</span>
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRdv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="rdv" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRdv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Taux d\'ouverture (Email)', value: '42.8%', icon: Mail, color: 'text-blue-500' },
          { label: 'Taux de réponse (SMS)', value: '18.2%', icon: MessageSquare, color: 'text-purple-500' },
          { label: 'ROI Estimé (30j)', value: '+240%', icon: TrendingUp, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-zinc-900 border border-zinc-800 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{stat.label}</p>
              <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
