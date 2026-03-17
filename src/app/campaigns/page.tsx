'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Send, 
  ListTodo, 
  Settings, 
  Play, 
  Pause,
  Plus,
  Mail,
  MessageSquare
} from 'lucide-react';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await supabase.from('campaigns').select('*');
      setCampaigns(data || []);
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Vos Campagnes</h1>
          <p className="text-zinc-500 text-sm">Orchestrez vos séquences d'emails et SMS.</p>
        </div>
        <button className="flex items-center space-x-2 bg-emerald-500 text-zinc-950 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
          <Plus size={18} />
          <span>Nouvelle Campagne</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock Campaign Card */}
        <div className="glass p-6 rounded-2xl card-hover flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Send size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Actif</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Prospection Québec - Rénovation</h3>
            <p className="text-xs text-zinc-500">Séquence: Email (J1) → SMS (J3) → Email (J7)</p>
          </div>
          <div className="flex items-center space-x-4 pt-4 border-t border-zinc-800/50">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">{i}</div>
              ))}
              <div className="w-6 h-6 rounded-full border border-zinc-950 bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-500">+85</div>
            </div>
            <span className="text-xs text-zinc-400">88 prospects engagés</span>
          </div>
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 bg-zinc-900 border border-zinc-800 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2">
              <Pause size={14} />
              <span>Suspendre</span>
            </button>
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors">
              <Settings size={14} className="text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Empty State / Add Card */}
        <button className="border-2 border-dashed border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-zinc-700 hover:bg-white/[0.01] transition-all group">
          <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 group-hover:bg-zinc-800">
            <Plus size={24} className="text-zinc-600" />
          </div>
          <span className="text-sm font-bold text-zinc-500">Ajouter une campagne</span>
        </button>
      </div>

      <div className="space-y-4 pt-10">
        <h2 className="text-lg font-bold text-white">Scripts & Templates (Pattern Interrupt)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-400">
                <Mail size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Email Template</span>
              </div>
              <span className="text-xs text-zinc-500 font-mono italic">Local AI Powered</span>
            </div>
            <div className="bg-zinc-950/50 rounded-xl p-4 font-mono text-xs text-zinc-400 border border-zinc-900">
              <p className="text-white mb-2 underline">Sujet: Question directe pour {"{NomBusiness}"}</p>
              Salut, C'est un peu direct mais je regardais votre site à {"{Ville}"}. J'ai une idée concrète pour booster vos demandes de devis sur le secteur {"{Secteur}"}. Je peux t'envoyer ça ?
            </div>
          </div>
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-400">
                <MessageSquare size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">SMS Hook</span>
              </div>
            </div>
            <div className="bg-zinc-950/50 rounded-xl p-4 font-mono text-xs text-zinc-400 border border-zinc-900">
              Oui, c'est de la prospection à froid (honnêteté oblige!). J'ai une idée pour {"{NomBusiness}"} suite à mon mail. Dis-moi si tu veux en savoir plus ?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
