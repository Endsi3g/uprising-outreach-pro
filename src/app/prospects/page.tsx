'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Clock,
  ExternalLink,
  Share2
} from 'lucide-react';
import { collaboration } from '@/lib/collaboration';

interface Prospect {
  id: string;
  company_name: string;
  email: string | null;
  industry: string | null;
  city: string | null;
  status: string;
  score: number;
  website: string | null;
  created_at: string;
}

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScouting, setIsScouting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Québec');
  
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  const [emailIntro, setEmailIntro] = useState('J\'ai découvert votre entreprise et je suis impressionné par votre travail. J\'aimerais discuter de la façon dont nous pourrions collaborer.');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    setLoading(true);
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

  const startScouting = async () => {
    if (!searchQuery) return;
    setIsScouting(true);
    try {
      const response = await fetch('/api/prospect/auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `${searchQuery} in ${location}`, campaignId: 'default' }),
      });
      const data = await response.json();
      console.log('Scouting results:', data);
      await fetchProspects();
    } catch (error) {
      console.error('Scouting error:', error);
    } finally {
      setIsScouting(false);
    }
  };

  const sendEmail = async () => {
    if (!selectedProspect?.email) return;
    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedProspect.email,
          subject: `Collaboration avec ${selectedProspect.company_name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #2563eb;">Bonjour ${selectedProspect.company_name},</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                ${emailIntro}
              </p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #6b7280;">
                Cordialement,<br>
                <strong>L'équipe Uprising</strong>
              </div>
            </div>
          `,
          prospectId: selectedProspect.id
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Email envoyé avec succès !');
        setSelectedProspect(null);
        await fetchProspects();
      } else {
        alert('Erreur: ' + (data.error?.message || data.error));
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('Une erreur est survenue lors de l\'envoi de l\'email.');
    } finally {
      setSendingEmail(false);
    }
  };

  const [runningSequence, setRunningSequence] = useState<string | null>(null);

  const startSequence = async (prospectId: string) => {
    setRunningSequence(prospectId);
    try {
      const response = await fetch('/api/outreach/sequence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prospectId }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Séquence lancée avec succès !');
        await fetchProspects();
      } else {
        alert('Erreur: ' + (data.error?.message || data.error));
      }
    } catch (error) {
      console.error('Sequence error:', error);
      alert('Une erreur est survenue lors du lancement de la séquence.');
    } finally {
      setRunningSequence(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Modal */}
      {selectedProspect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in">
            <h2 className="text-xl font-bold mb-4 text-foreground">Envoyer un email à {selectedProspect.company_name}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Destinataire</label>
                <div className="px-3 py-2 bg-accent rounded-lg text-sm text-foreground border border-border">{selectedProspect.email}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Message d'introduction</label>
                <textarea 
                  value={emailIntro}
                  onChange={(e) => setEmailIntro(e.target.value)}
                  className="w-full h-32 bg-accent border border-border rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="Écrivez votre message ici..."
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setSelectedProspect(null)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={sendEmail}
                  disabled={sendingEmail}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {sendingEmail ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Mail size={16} />}
                  <span>{sendingEmail ? 'Envoi...' : 'Envoyer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Prospects</h1>
          <p className="text-muted-foreground text-sm">Gérez et suivez vos leads qualifiés en temps réel.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200">
            <div className="pl-3 text-muted-foreground">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Quoi ? (ex: Plombier)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none px-3 py-2 text-sm text-foreground focus:outline-none w-40"
            />
            <div className="h-4 w-[1px] bg-border" />
            <input 
              type="text" 
              placeholder="Où ? (ex: Montréal)" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-none px-3 py-2 text-sm text-foreground focus:outline-none w-32"
            />
            <button 
              onClick={startScouting}
              disabled={isScouting || !searchQuery}
              className={`px-4 py-2 text-sm font-bold transition-all duration-200 ${
                isScouting ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {isScouting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Scouting...</span>
                </div>
              ) : 'Trouver'}
            </button>
          </div>
          
          <button className="flex items-center space-x-2 bg-accent border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-foreground">
            <Filter size={18} />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Entreprise</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Secteur / Ville</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Score</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-10 h-16 bg-muted/10"></td>
                </tr>
              ))
            ) : prospects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground italic">
                  Aucun prospect trouvé. Utilisez la barre de recherche ci-dessus pour commencer !
                </td>
              </tr>
            ) : (
              prospects.map((p) => (
                <tr key={p.id} className="hover:bg-accent/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground flex items-center">
                        {p.company_name}
                        {p.website && (
                          <a href={p.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{p.email || "Pas d&apos;email"}</span>

                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground/80">{p.industry || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground">{p.city || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${p.score > 70 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {p.score || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock size={12} className="mr-1.5" />
                      {new Date(p.created_at).toLocaleDateString('fr-CA', { day: '2-digit', month: 'short' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => startSequence(p.id)}
                        disabled={runningSequence === p.id}
                        className={`p-2 rounded-lg transition-colors ${runningSequence === p.id ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10'}`}
                        title="Lancer Séquence Automatique"
                      >
                        {runningSequence === p.id ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Share2 size={18} className="rotate-90" />}
                      </button>
                      <button 
                        onClick={() => setSelectedProspect(p)}
                        disabled={!p.email}
                        className={`p-2 rounded-lg transition-colors ${p.email ? 'text-muted-foreground hover:text-primary hover:bg-primary/10' : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'}`}
                        title={p.email ? "Envoyer un email" : "Email non disponible"}
                      >
                        <Mail size={18} />
                      </button>
                      <button 
                        onClick={async () => {
                          const link = await collaboration.generateShareLink('prospect', p.id);
                          navigator.clipboard.writeText(link);
                          alert('Lien de partage copié !');
                        }}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                        title="Partager"
                      >
                        <Share2 size={18} />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
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
