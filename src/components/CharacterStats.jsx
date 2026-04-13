import { useState, useEffect, useCallback } from 'react';
import gw2Api from '../services/gw2Api';
import CharacterEquipment from './CharacterEquipment';

function CharacterStats() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterDetails, setCharacterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCharacterDetails = useCallback(async (characterName) => {
    setSelectedCharacter(characterName);
    setDetailsLoading(true);
    setError('');

    try {
      const details = await gw2Api.getCharacter(characterName);
      setCharacterDetails(details);
    } catch (err) {
      setError(err.message || 'Failed to fetch character details');
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError('');

      try {
        const characterNames = await gw2Api.getCharacterNames();
        setCharacters(characterNames);
        
        if (characterNames.length > 0) {
          loadCharacterDetails(characterNames[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch characters');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [loadCharacterDetails]);

  const formatPlaytime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days} days, ${remainingHours} hours`;
    }
    return `${hours} hours`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading characters...</div>;
  }

  if (error && characters.length === 0) {
    return <div className="error-message">{error}</div>;
  }

  if (characters.length === 0) {
    return <div className="no-data">No characters found on this account.</div>;
  }

  return (
    <div className="character-stats">
      <h2>Characters</h2>
      
      <div className="character-selector">
        <label htmlFor="character-select">Select a character:</label>
        <select
          id="character-select"
          value={selectedCharacter || ''}
          onChange={(e) => loadCharacterDetails(e.target.value)}
          className="character-dropdown"
        >
          {characters.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <p className="character-count">Total characters: {characters.length}</p>
      </div>

      {detailsLoading && <div className="loading">Loading character details...</div>}

      {!detailsLoading && characterDetails && (
        <div className="character-details">
          <div className="character-header">
            <h3>{characterDetails.name}</h3>
            {/* <p className="character-title">{characterDetails.title || 'No title'}</p> */}
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h4>Race</h4>
              <p className="stat-value">{characterDetails.race}</p>
            </div>

            <div className="stat-card">
              <h4>Profession</h4>
              <p className="stat-value">{characterDetails.profession}</p>
            </div>

            <div className="stat-card">
              <h4>Gender</h4>
              <p className="stat-value">{characterDetails.gender}</p>
            </div>

            <div className="stat-card">
              <h4>Level</h4>
              <p className="stat-value">{characterDetails.level}</p>
            </div>

            <div className="stat-card">
              <h4>Age</h4>
              <p className="stat-value">{formatPlaytime(characterDetails.age)}</p>
            </div>

            <div className="stat-card">
              <h4>Created</h4>
              <p className="stat-value">{formatDate(characterDetails.created)}</p>
            </div>

            <div className="stat-card">
              <h4>Deaths</h4>
              <p className="stat-value">{characterDetails.deaths || 0}</p>
            </div>

            {characterDetails.guild && (
              <div className="stat-card">
                <h4>Guild</h4>
                <p className="stat-value">Member</p>
              </div>
            )}
          </div>

          {characterDetails.crafting && characterDetails.crafting.length > 0 && (
            <div className="crafting-section">
              <h4>Crafting Disciplines</h4>
              <div className="crafting-list">
                {characterDetails.crafting.map((craft, index) => (
                  <div key={index} className="craft-item">
                    <span className="craft-name">{craft.discipline}</span>
                    <span className="craft-level">Level {craft.rating}</span>
                    {craft.active && <span className="craft-badge">Active</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {characterDetails.backstory && characterDetails.backstory.length > 0 && (
            <div className="backstory-section">
              <h4>Backstory</h4>
              <div className="backstory-list">
                {characterDetails.backstory.map((story, index) => (
                  <span key={index} className="badge">{story}</span>
                ))}
              </div>
            </div>
          )}

          {characterDetails.equipment && characterDetails.equipment.length > 0 && (
            <CharacterEquipment equipment={characterDetails.equipment} />
          )}

          {characterDetails.equipment_pvp && (
            <div className="build-section">
              <h4>PvP Build</h4>
              <p className="build-info">Amulet: {characterDetails.equipment_pvp.amulet || 'None'}</p>
            </div>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default CharacterStats;
