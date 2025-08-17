import { useState, useEffect } from 'react';
import ZelenkaAPI from '../services/zelenkaAPI';

const useFortniteCosmeticItems = () => {
  const [cosmeticItems, setCosmeticItems] = useState({
    skins: [],
    pickaxes: [],
    emotes: [],
    gliders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return; // Prevent multiple API calls
    
    const fetchFortniteCosmeticItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use ZelenkaAPI service instead of direct fetch
        const api = new ZelenkaAPI();
        
        let data;
        try {
          // Try to get Fortnite parameters from the API 
          data = await api.makeRequest('/fortnite/params');
        } catch (apiError) {
          
          // Use fallback data if API endpoint doesn't exist
          data = null;
        }

        // Transform the API response into our format
        const transformedData = {
          skins: [],
          pickaxes: [],
          emotes: [],
          gliders: []
        };

        // If we have real API data, process it
        if (data) {
          // Process skin values
          if (data.skin && Array.isArray(data.skin)) {
            transformedData.skins = data.skin.map(skinValue => ({
              value: skinValue,
              label: formatCosmeticName(skinValue)
          }));
        }

        // Process pickaxe values
        if (data.pickaxe && Array.isArray(data.pickaxe)) {
          transformedData.pickaxes = data.pickaxe.map(pickaxeValue => ({
            value: pickaxeValue,
            label: formatCosmeticName(pickaxeValue)
          }));
        }

        // Process dance/emote values
        if (data.dance && Array.isArray(data.dance)) {
          transformedData.emotes = data.dance.map(danceValue => ({
            value: danceValue,
            label: formatCosmeticName(danceValue)
          }));
        }

          // Process glider values
          if (data.glider && Array.isArray(data.glider)) {
            transformedData.gliders = data.glider.map(gliderValue => ({
              value: gliderValue,
              label: formatCosmeticName(gliderValue)
            }));
          }
        } else {
          // If no API data, use fallback cosmetic data
          
          transformedData.skins = [
            { value: 'legendary_skin', label: 'Legendary Skins' },
            { value: 'epic_skin', label: 'Epic Skins' },
            { value: 'rare_skin', label: 'Rare Skins' }
          ];
          transformedData.pickaxes = [
            { value: 'legendary_pickaxe', label: 'Legendary Pickaxes' },
            { value: 'epic_pickaxe', label: 'Epic Pickaxes' }
          ];
          transformedData.emotes = [
            { value: 'legendary_emote', label: 'Legendary Emotes' },
            { value: 'epic_emote', label: 'Epic Emotes' }
          ];
          transformedData.gliders = [
            { value: 'legendary_glider', label: 'Legendary Gliders' },
            { value: 'epic_glider', label: 'Epic Gliders' }
          ];
        }

        setCosmeticItems(transformedData);
      } catch (err) {
        // Only log error if it's not a 401 (which is expected in development)
        if (!err.message.includes('401')) {
          console.error('Error fetching Fortnite cosmetic items:', err);
        } else {
          
        }
        setError(err.message);
        
        // Fallback to demo data for development
        const demoData = {
          skins: [
            { value: '138_athena_commando_m_psburnout', label: 'Burnout' },
            { value: '035_athena_commando_m_medieval', label: 'Black Knight' },
            { value: '028_athena_commando_f_medieval', label: 'Red Knight' },
            { value: '059_athena_commando_f_techops', label: 'Elite Agent' },
            { value: '072_athena_commando_m_fisherman', label: 'Fishstick' },
            { value: '040_athena_commando_m_scavenger', label: 'Scavenger' },
            { value: '075_athena_commando_f_clown', label: 'Peely' },
            { value: '012_athena_commando_m_soldier', label: 'Renegade Raider' },
            { value: '090_athena_commando_f_galaxy', label: 'Galaxy' },
            { value: '124_athena_commando_m_robot', label: 'The Scientist' },
            { value: '156_athena_commando_f_storm', label: 'Storm' },
            { value: '189_athena_commando_m_drift', label: 'Drift' },
            { value: '234_athena_commando_f_crystal', label: 'Crystal' },
            { value: '287_athena_commando_m_jonesy', label: 'John Wick' },
            { value: '342_athena_commando_f_mystic', label: 'Mystic' }
          ],
          pickaxes: [
            { value: 'pickaxe_id_104_cowgirl', label: 'Cowgirl Pickaxe' },
            { value: 'pickaxe_id_088_psburnout', label: 'Burnout Pickaxe' },
            { value: 'pickaxe_id_027_medieval', label: 'Medieval Pickaxe' },
            { value: 'pickaxe_id_059_techops', label: 'Tech Ops Pickaxe' },
            { value: 'pickaxe_id_012_renegade', label: 'Raider\'s Revenge' },
            { value: 'pickaxe_id_034_rainbow', label: 'Rainbow Smash' },
            { value: 'pickaxe_id_067_scythe', label: 'Reaper' },
            { value: 'pickaxe_id_089_candy', label: 'Candy Axe' },
            { value: 'pickaxe_id_156_storm', label: 'Storm Breaker' },
            { value: 'pickaxe_id_234_crystal', label: 'Crystal Llama' },
            { value: 'pickaxe_id_287_pencil', label: 'Pencil' },
            { value: 'pickaxe_id_342_mystic', label: 'Mystic Axe' }
          ],
          emotes: [
            { value: 'takethel', label: 'Take the L' },
            { value: 'floss', label: 'Floss' },
            { value: 'hiphop01', label: 'Hip Hop' },
            { value: 'robot', label: 'Robot' },
            { value: 'orange_justice', label: 'Orange Justice' },
            { value: 'best_mates', label: 'Best Mates' },
            { value: 'electro_shuffle', label: 'Electro Shuffle' },
            { value: 'fresh', label: 'Fresh' },
            { value: 'renegade', label: 'Renegade' },
            { value: 'the_worm', label: 'The Worm' },
            { value: 'infinite_dab', label: 'Infinite Dab' },
            { value: 'true_heart', label: 'True Heart' },
            { value: 'pump_it_up', label: 'Pump It Up' },
            { value: 'scenario', label: 'Scenario' }
          ],
          gliders: [
            { value: 'glider_id_138_bomberplane', label: 'Bomber Plane' },
            { value: 'glider_id_013_psblue', label: 'Blue Glider' },
            { value: 'glider_id_027_medieval', label: 'Medieval Glider' },
            { value: 'glider_id_059_techops', label: 'Tech Ops Glider' },
            { value: 'glider_id_089_umbrella', label: 'Umbrella' },
            { value: 'glider_id_124_robot', label: 'Robot Glider' },
            { value: 'glider_id_156_storm', label: 'Storm Glider' },
            { value: 'glider_id_234_crystal', label: 'Crystal Wing' },
            { value: 'glider_id_287_stealth', label: 'Stealth' },
            { value: 'glider_id_342_dragon', label: 'Dragon Glider' },
            { value: 'glider_id_456_victory', label: 'Victory Royale' },
            { value: 'glider_id_567_galaxy', label: 'Galaxy Scout' }
          ]
        };
        
        setCosmeticItems(demoData);

      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchFortniteCosmeticItems();
  }, [initialized]); // Add initialized as dependency

  return { cosmeticItems, loading, error };
};

// Helper function to format cosmetic names from API values
const formatCosmeticName = (value) => {
  if (!value) return value;
  
  // Remove common prefixes and format names
  let formatted = value
    .replace(/^(pickaxe_id_\d+_|glider_id_\d+_|\d+_athena_commando_[mf]_)/g, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return formatted || value;
};

export default useFortniteCosmeticItems;

