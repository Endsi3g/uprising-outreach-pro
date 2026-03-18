import { supabase } from './supabase';

/**
 * Service pour gérer la collaboration et le partage.
 */
export const collaboration = {
  /**
   * Génère un lien de partage pour une campagne ou un prospect.
   */
  generateShareLink: async (type: 'campaign' | 'prospect', id: string) => {
    // Dans une version réelle, on générerait un token JWT ou un hash dans une table 'shares'
    // Ici on simule un lien public simple basé sur l'ID
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/share/${type}/${id}`;
  },

  /**
   * Marque un prospect comme "partagé" ou assigné à un collègue.
   */
  assignToColleague: async (prospectId: string, colleagueEmail: string) => {
    const { data, error } = await supabase
      .from('prospects')
      .update({ 
        metadata: { 
          assigned_to: colleagueEmail,
          shared_at: new Date().toISOString() 
        } 
      })
      .eq('id', prospectId);
    
    return { data, error };
  }
};
