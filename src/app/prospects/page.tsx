'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  ExternalLink
} from 'lucide-react';

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProspects(data || []);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
      case 'contacted': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'replied': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      default: return 'bg-zinc-400/10 text-zinc-400 border-zinc-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Prospects</h1>
          <p className="text-zinc-500 text-sm">Gérez et suivez vos leads qualifiés en temps réel.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64"
            />
          </div>
          <button className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
            <Filter size={18} />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/50 bg-white/[0.01]">
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Entreprise</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Secteur / Ville</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Intent</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Dernier Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-8 h-16 bg-zinc-900/20"></td>
                </tr>
              ))
            ) : prospects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 italic">
                  Aucun prospect trouvé. Lancez un scraping pour commencer !
                </td>
              </tr>
            ) : (
              prospects.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white flex items-center">
                        {p.company_name}
                        {p.website && (
                          <a href={p.website} target="_blank" className="ml-2 text-zinc-600 hover:text-white transition-colors">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">{p.email || 'Email non trouvé'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-zinc-300">{p.industry}</span>
                      <span className="text-xs text-zinc-500">{p.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.intent_strength === 'high' ? 'bg-emerald-500' : p.intent_strength === 'medium' ? 'bg-amber-500' : 'bg-zinc-500'}`} />
                      <span className="text-xs text-zinc-400">{p.intent_type || 'Discovery'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-500 flex items-center">
                      <Clock size={12} className="mr-1.5" />
                      {new Date(p.created_at).toLocaleDateString('fr-CA')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-600 hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
