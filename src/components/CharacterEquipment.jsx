import { useState, useEffect } from 'react';
import gw2Api from '../services/gw2Api';

// Equipment slot display names
const EQUIPMENT_SLOTS = {
  HelmAquatic: 'Aquatic Helm',
  Backpack: 'Backpack',
  Coat: 'Chest',
  Boots: 'Boots',
  Gloves: 'Gloves',
  Helm: 'Helm',
  Leggings: 'Legs',
  Shoulders: 'Shoulders',
  Accessory1: 'Accessory 1',
  Accessory2: 'Accessory 2',
  Ring1: 'Ring 1',
  Ring2: 'Ring 2',
  Amulet: 'Amulet',
  WeaponA1: 'Weapon Set 1 (Main)',
  WeaponA2: 'Weapon Set 1 (Off)',
  WeaponB1: 'Weapon Set 2 (Main)',
  WeaponB2: 'Weapon Set 2 (Off)',
  Sickle: 'Sickle',
  Axe: 'Axe',
  Pick: 'Pick'
};

// Rarity colors matching GW2
const RARITY_COLORS = {
  Junk: '#aaa',
  Basic: '#000',
  Fine: '#62a4da',
  Masterwork: '#1a9306',
  Rare: '#fcd00b',
  Exotic: '#ffa405',
  Ascended: '#fb3e8d',
  Legendary: '#4c139d'
};

function CharacterEquipment({ equipment }) {
  const [itemDetails, setItemDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!equipment || equipment.length === 0) {
      setLoading(false);
      return;
    }

    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        // Extract all item IDs
        const itemIds = equipment.map(item => item.id).filter(Boolean);
        
        if (itemIds.length > 0) {
          const items = await gw2Api.getItems(itemIds);
          
          // Create a map of item ID to item details
          const itemMap = {};
          items.forEach(item => {
            itemMap[item.id] = item;
          });
          
          setItemDetails(itemMap);
        }
      } catch (error) {
        console.error('Failed to fetch item details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [equipment]);

  if (!equipment || equipment.length === 0) {
    return (
      <div className="equipment-section">
        <h4>Equipment</h4>
        <p className="no-data">No equipment data available</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="equipment-section">
        <h4>Equipment</h4>
        <div className="loading">Loading equipment...</div>
      </div>
    );
  }

  // Group equipment by category
  const armor = [];
  const weapons = [];
  const trinkets = [];
  const tools = [];

  equipment.forEach(item => {
    const detail = itemDetails[item.id];
    if (!detail) return;

    const slot = item.slot;
    
    if (['Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots', 'HelmAquatic'].includes(slot)) {
      armor.push({ ...item, detail });
    } else if (slot.startsWith('Weapon')) {
      weapons.push({ ...item, detail });
    } else if (['Accessory1', 'Accessory2', 'Ring1', 'Ring2', 'Amulet'].includes(slot)) {
      trinkets.push({ ...item, detail });
    } else if (['Backpack', 'Sickle', 'Axe', 'Pick'].includes(slot)) {
      tools.push({ ...item, detail });
    }
  });

  const EquipmentItem = ({ item }) => {
    const { detail, slot } = item;
    const rarity = detail.rarity || 'Basic';
    const rarityColor = RARITY_COLORS[rarity] || '#fff';

    return (
      <div className="equipment-item" style={{ borderColor: rarityColor }}>
        {detail.icon && (
          <img 
            src={detail.icon} 
            alt={detail.name}
            className="equipment-icon"
          />
        )}
        <div className="equipment-info">
          <div className="equipment-slot">{EQUIPMENT_SLOTS[slot] || slot}</div>
          <div className="equipment-name" style={{ color: rarityColor }}>
            {detail.name}
          </div>
          {detail.level && (
            <div className="equipment-level">Level {detail.level}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="equipment-section">
      <h4>Equipment</h4>
      
      <div className="equipment-grid">
        {armor.length > 0 && (
          <div className="equipment-category">
            <h5>Armor</h5>
            <div className="equipment-list">
              {armor.map((item, index) => (
                <EquipmentItem key={index} item={item} />
              ))}
            </div>
          </div>
        )}

        {weapons.length > 0 && (
          <div className="equipment-category">
            <h5>Weapons</h5>
            <div className="equipment-list">
              {weapons.map((item, index) => (
                <EquipmentItem key={index} item={item} />
              ))}
            </div>
          </div>
        )}

        {trinkets.length > 0 && (
          <div className="equipment-category">
            <h5>Trinkets</h5>
            <div className="equipment-list">
              {trinkets.map((item, index) => (
                <EquipmentItem key={index} item={item} />
              ))}
            </div>
          </div>
        )}

        {tools.length > 0 && (
          <div className="equipment-category">
            <h5>Back & Tools</h5>
            <div className="equipment-list">
              {tools.map((item, index) => (
                <EquipmentItem key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterEquipment;
