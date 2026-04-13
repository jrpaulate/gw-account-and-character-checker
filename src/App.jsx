import { useState } from 'react'
import './App.css'
import ApiKeyInput from './components/ApiKeyInput'
import AccountStats from './components/AccountStats'
import CharacterStats from './components/CharacterStats'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('account')

  const handleApiKeyVerified = (apiKey) => {
    setIsConnected(true)
    // Store API key in localStorage for persistence (optional)
    localStorage.setItem('gw2_api_key', apiKey)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    localStorage.removeItem('gw2_api_key')
  }

  // Check for stored API key on mount
  useState(() => {
    const storedKey = localStorage.getItem('gw2_api_key')
    if (storedKey) {
      // You could verify the stored key here
      setIsConnected(true)
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Guild Wars 2 Account Viewer</h1>
        {isConnected && (
          <button onClick={handleDisconnect} className="disconnect-button">
            Disconnect
          </button>
        )}
      </header>

      <main className="app-main">
        {!isConnected ? (
          <ApiKeyInput onApiKeyVerified={handleApiKeyVerified} />
        ) : (
          <>
            <nav className="tabs">
              <button
                className={`tab ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                Account Stats
              </button>
              <button
                className={`tab ${activeTab === 'characters' ? 'active' : ''}`}
                onClick={() => setActiveTab('characters')}
              >
                Characters
              </button>
            </nav>

            <div className="content">
              {activeTab === 'account' && <AccountStats />}
              {activeTab === 'characters' && <CharacterStats />}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
