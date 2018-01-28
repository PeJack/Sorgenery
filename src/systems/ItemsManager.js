class ItemsManager {
  constructor(client) {
    this.client = client; 
    this.list = {};
  }

  init() {
    this.list = this.client.game.cache.getJSON('items');
  }
}

export default ItemsManager;