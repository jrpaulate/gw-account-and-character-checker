import { useState } from 'react';
import gw2Api from '../services/gw2Api';

function ApiKeyInput({ onApiKeyVerified }) {
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsVerifying(true);

    try {
      gw2Api.setApiKey(apiKey);
      const isValid = await gw2Api.verifyApiKey();
      
      if (isValid) {
        onApiKeyVerified(apiKey);
      } else {
        setError('Invalid API key');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify API key');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="api-key-container">
      <h2>Connect Your Guild Wars 2 Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your GW2 API key"
            disabled={isVerifying}
            className="api-key-input"
          />
          <button 
            type="submit" 
            disabled={isVerifying}
            className="connect-button"
          >
            {isVerifying ? 'Verifying...' : 'Connect'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div className="info-text">
        <p>
          <strong>How to get your API key:</strong>
        </p>
        <ol>
          <li>Visit <a href="https://account.arena.net/applications" target="_blank" rel="noopener noreferrer">ArenaNet Applications</a></li>
          <li>Log in with your Guild Wars 2 account</li>
          <li>Click "New Key" and give it a name</li>
          <li>Select the permissions you want to grant (account, characters, etc.)</li>
          <li>Copy the generated key and paste it above</li>
        </ol>
      </div>
    </div>
  );
}

export default ApiKeyInput;
