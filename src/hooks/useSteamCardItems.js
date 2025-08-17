import { useState, useEffect } from 'react';

const useSteamCardItems = () => {
  const [cardItems, setCardItems] = useState({
    games: [],
    cards: [],
    backgrounds: [],
    emoticons: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return; // Prevent multiple API calls
    
    const fetchSteamCardItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both Steam games and parameters from LZT Market API
        const [gamesResponse, paramsResponse] = await Promise.all([
          fetch('/api/lzt-proxy/steam/games'),
          fetch('/api/lzt-proxy/steam/params')
        ]);

        if (!gamesResponse.ok || !paramsResponse.ok) {
          throw new Error(`HTTP error! Games: ${gamesResponse.status}, Params: ${paramsResponse.status}`);
        }

        const [gamesData, paramsData] = await Promise.all([
          gamesResponse.json(),
          paramsResponse.json()
        ]);

        // Transform the API response into our format
        const transformedData = {
          games: [],
          cards: [],
          backgrounds: [],
          emoticons: []
        };

        // Process games data from the Steam games API response
        if (gamesData.games && Array.isArray(gamesData.games)) {
          transformedData.games = gamesData.games.slice(0, 50).map(game => ({
            value: game.app_id,
            label: game.title
          }));
        }

        // Process gift items from params API response  
        if (paramsData.category && paramsData.category.params) {
          const giftParam = paramsData.category.params.find(param => param.name === 'gift');
          if (giftParam && giftParam.values && Array.isArray(giftParam.values)) {
            const giftItems = giftParam.values;
            
            // Categorize gift items based on their names
            giftItems.forEach(gift => {
              const itemName = gift.title || '';
              const itemValue = gift.hash_name || gift.id;
              
              if (itemName.toLowerCase().includes('trading card') || 
                  itemName.toLowerCase().includes(' card ') ||
                  itemName.toLowerCase().includes('foil')) {
                transformedData.cards.push({
                  value: itemValue,
                  label: itemName
                });
              } else if (itemName.toLowerCase().includes('background') || 
                        itemName.toLowerCase().includes('wallpaper')) {
                transformedData.backgrounds.push({
                  value: itemValue,
                  label: itemName
                });
              } else if (itemName.toLowerCase().includes('emoticon') || 
                        itemName.toLowerCase().includes(':') ||
                        itemName.includes('😀') || itemName.includes('😎')) {
                transformedData.emoticons.push({
                  value: itemValue,
                  label: itemName
                });
              }
            });
            
            // If we don't have enough categorized items, add some as general steam items
            if (transformedData.cards.length < 5) {
              giftItems.slice(0, 10).forEach(gift => {
                if (!transformedData.cards.find(card => card.value === gift.hash_name)) {
                  transformedData.cards.push({
                    value: gift.hash_name,
                    label: `${gift.title} (Trading Card)`
                  });
                }
              });
            }
            
            if (transformedData.backgrounds.length < 5) {
              giftItems.slice(10, 20).forEach(gift => {
                if (!transformedData.backgrounds.find(bg => bg.value === gift.hash_name)) {
                  transformedData.backgrounds.push({
                    value: gift.hash_name,
                    label: `${gift.title} (Background)`
                  });
                }
              });
            }
            
            if (transformedData.emoticons.length < 5) {
              giftItems.slice(20, 30).forEach(gift => {
                if (!transformedData.emoticons.find(emote => emote.value === gift.hash_name)) {
                  transformedData.emoticons.push({
                    value: gift.hash_name,
                    label: `${gift.title} (Emoticon)`
                  });
                }
              });
            }
          }
        }

        setCardItems(transformedData);
      } catch (err) {
        console.error('Error fetching Steam card items:', err);
        setError(err.message);
        
        // Fallback to demo data for development
        setCardItems({
          games: [
            { value: '730', label: 'Counter-Strike 2' },
            { value: '440', label: 'Team Fortress 2' },
            { value: '570', label: 'Dota 2' },
            { value: '271590', label: 'Grand Theft Auto V' },
            { value: '359550', label: 'Tom Clancy\'s Rainbow Six Siege' },
            { value: '252950', label: 'Rocket League' },
            { value: '578080', label: 'PUBG: BATTLEGROUNDS' },
            { value: '105600', label: 'Terraria' },
            { value: '238960', label: 'Path of Exile' },
            { value: '230410', label: 'Warframe' },
            { value: '252490', label: 'Rust' },
            { value: '346110', label: 'ARK: Survival Evolved' },
            { value: '377160', label: 'Fallout 4' },
            { value: '218620', label: 'PAYDAY 2' },
            { value: '304930', label: 'Unturned' }
          ],
          cards: [
            { value: 'cs2_card_ak47', label: 'CS2 AK-47 Card' },
            { value: 'cs2_card_awp', label: 'CS2 AWP Card' },
            { value: 'tf2_card_heavy', label: 'TF2 Heavy Card' },
            { value: 'tf2_card_spy', label: 'TF2 Spy Card' },
            { value: 'dota2_card_pudge', label: 'Dota 2 Pudge Card' },
            { value: 'dota2_card_invoker', label: 'Dota 2 Invoker Card' },
            { value: 'gta5_card_franklin', label: 'GTA V Franklin Card' },
            { value: 'gta5_card_trevor', label: 'GTA V Trevor Card' },
            { value: 'rainbow6_card_ash', label: 'Rainbow Six Ash Card' },
            { value: 'pubg_card_sanhok', label: 'PUBG Sanhok Card' },
            { value: 'terraria_card_guide', label: 'Terraria Guide Card' },
            { value: 'rust_card_scientist', label: 'Rust Scientist Card' }
          ],
          backgrounds: [
            { value: 'cs2_bg_mirage', label: 'CS2 Mirage Background' },
            { value: 'cs2_bg_dust2', label: 'CS2 Dust2 Background' },
            { value: 'tf2_bg_2fort', label: 'TF2 2Fort Background' },
            { value: 'dota2_bg_ancient', label: 'Dota 2 Ancient Background' },
            { value: 'gta5_bg_city', label: 'GTA V City Background' },
            { value: 'rainbow6_bg_house', label: 'Rainbow Six House Background' },
            { value: 'pubg_bg_erangel', label: 'PUBG Erangel Background' },
            { value: 'terraria_bg_forest', label: 'Terraria Forest Background' },
            { value: 'rust_bg_monument', label: 'Rust Monument Background' },
            { value: 'fallout4_bg_vault', label: 'Fallout 4 Vault Background' }
          ],
          emoticons: [
            { value: 'cs2_emote_gg', label: 'CS2 GG Emoticon' },
            { value: 'cs2_emote_clutch', label: 'CS2 Clutch Emoticon' },
            { value: 'tf2_emote_medic', label: 'TF2 Medic Emoticon' },
            { value: 'dota2_emote_rampage', label: 'Dota 2 Rampage Emoticon' },
            { value: 'gta5_emote_wasted', label: 'GTA V Wasted Emoticon' },
            { value: 'rainbow6_emote_ace', label: 'Rainbow Six Ace Emoticon' },
            { value: 'pubg_emote_chicken', label: 'PUBG Chicken Dinner Emoticon' },
            { value: 'terraria_emote_moon', label: 'Terraria Moon Lord Emoticon' },
            { value: 'rust_emote_rad', label: 'Rust Radiation Emoticon' },
            { value: 'fallout4_emote_pip', label: 'Fallout 4 Pip-Boy Emoticon' }
          ]
        });
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchSteamCardItems();
  }, [initialized]); // Add initialized as dependency

  return { cardItems, loading, error };
};

export default useSteamCardItems;

