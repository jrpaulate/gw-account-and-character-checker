import { useState, useEffect } from 'react';
import gw2Api from '../services/gw2Api';

function AccountStats() {
  const [accountData, setAccountData] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAccountData = async () => {
    setLoading(true);
    setError('');

    try {
      const [account, walletData] = await Promise.all([
        gw2Api.getAccount(),
        gw2Api.getAccountWallet().catch(() => null)
      ]);

      setAccountData(account);
      setWallet(walletData);
    } catch (err) {
      setError(err.message || 'Failed to fetch account data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAccountAge = (createdDate) => {
    const created = new Date(createdDate);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatPlaytime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days.toLocaleString()} days, ${remainingHours} hours`;
    }
    return `${hours} hours`;
  };

  const getCoinDisplay = () => {
    if (!wallet) return null;
    
    const goldCurrency = wallet.find(c => c.id === 1);
    if (!goldCurrency) return '0g 0s 0c';
    
    const copper = goldCurrency.value;
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemainder = copper % 100;
    
    return `${gold}g ${silver}s ${copperRemainder}c`;
  };

  if (loading) {
    return <div className="loading">Loading account data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!accountData) {
    return null;
  }

  return (
    <div className="account-stats">
      <h2>Account Information</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Account Name</h3>
          <p className="stat-value">{accountData.name}</p>
        </div>

        <div className="stat-card">
          <h3>Account Age</h3>
          <p className="stat-value">{calculateAccountAge(accountData.created).toLocaleString()} days</p>
          <p className="stat-label">Since {formatDate(accountData.created)}</p>
        </div>

        {accountData.age && (
          <div className="stat-card">
            <h3>Total Playtime</h3>
            <p className="stat-value">{formatPlaytime(accountData.age)}</p>
            <p className="stat-label">Across all characters</p>
          </div>
        )}

        <div className="stat-card">
          <h3>World</h3>
          <p className="stat-value">{accountData.world}</p>
        </div>

        <div className="stat-card">
          <h3>Commander Tag</h3>
          <p className="stat-value">{accountData.commander ? '✓ Yes' : '✗ No'}</p>
        </div>

        {accountData.guilds && (
          <div className="stat-card">
            <h3>Guilds</h3>
            <p className="stat-value">{accountData.guilds.length}</p>
          </div>
        )}

        <div className="stat-card">
          <h3>Gold</h3>
          <p className="stat-value">{getCoinDisplay()}</p>
        </div>

        <div className="stat-card">
          <h3>Fractal Level</h3>
          <p className="stat-value">{accountData.fractal_level || 0}</p>
        </div>

        <div className="stat-card">
          <h3>WvW Rank</h3>
          <p className="stat-value">{accountData.wvw_rank || 0}</p>
        </div>

        {/* {accountData.daily_ap && (
          <div className="stat-card">
            <h3>Daily AP</h3>
            <p className="stat-value">{accountData.daily_ap}</p>
          </div>
        )}

        {accountData.monthly_ap && (
          <div className="stat-card">
            <h3>Monthly AP</h3>
            <p className="stat-value">{accountData.monthly_ap}</p>
          </div>
        )} */}
      </div>

      {accountData.access && accountData.access.length > 0 && (
        <div className="access-info">
          <h3>Account Access</h3>
          <div className="access-badges">
            {accountData.access.map(access => (
              <span key={access} className="badge">{access}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountStats;
