const GW2_API_BASE_URL = 'https://api.guildwars2.com/v2';

/**
 * Guild Wars 2 API Service
 * Handles all API calls to the GW2 API
 */
class GW2ApiService {
  constructor() {
    this.apiKey = null;
  }

  /**
   * Set the API key for authenticated requests
   */
  setApiKey(key) {
    this.apiKey = key;
  }

  /**
   * Make a request to the GW2 API
   */
  async request(endpoint, params = {}) {
    const url = new URL(`${GW2_API_BASE_URL}${endpoint}`);
    
    // Add API key if available
    if (this.apiKey) {
      url.searchParams.append('access_token', this.apiKey);
    }

    // Add additional params
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Invalid API key or insufficient permissions');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GW2 API Error:', error);
      throw error;
    }
  }

  /**
   * Get account information
   */
  async getAccount() {
    return await this.request('/account');
  }

  /**
   * Get list of character names
   */
  async getCharacterNames() {
    return await this.request('/characters');
  }

  /**
   * Get detailed character information
   */
  async getCharacter(characterName) {
    return await this.request(`/characters/${encodeURIComponent(characterName)}`);
  }

  /**
   * Get account achievements
   */
  async getAccountAchievements() {
    return await this.request('/account/achievements');
  }

  /**
   * Get account wallet (currencies)
   */
  async getAccountWallet() {
    return await this.request('/account/wallet');
  }

  /**
   * Get account bank
   */
  async getAccountBank() {
    return await this.request('/account/bank');
  }

  /**
   * Get account materials storage
   */
  async getAccountMaterials() {
    return await this.request('/account/materials');
  }

  /**
   * Get item details by ID
   */
  async getItem(itemId) {
    return await this.request(`/items/${itemId}`);
  }

  /**
   * Get multiple items by IDs
   */
  async getItems(itemIds) {
    if (!itemIds || itemIds.length === 0) return [];
    const ids = itemIds.join(',');
    return await this.request(`/items?ids=${ids}`);
  }

  /**
   * Get skin details by ID
   */
  async getSkin(skinId) {
    return await this.request(`/skins/${skinId}`);
  }

  /**
   * Verify API key is valid
   */
  async verifyApiKey() {
    try {
      await this.getAccount();
      return true;
    } catch {
      return false;
    }
  }
}

// Export a singleton instance
export const gw2Api = new GW2ApiService();
export default gw2Api;
