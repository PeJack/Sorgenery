class Item extends Phaser.Sprite {
  constructor(client, data, x, y) {
    // data[3] - spriteName
    super(client.game, x, y, data[3]);

    this.client = client;
    this.group = this.client.layers.items;
    this.group.add(this);
    
    this.data = data;
    this.id = data[0];
    this.spriteName = data[3];
    this.level = data[5];
    this.stack = 1;
    this.maxStack = 1;
    this.width = this.client.tilesize;
    this.height = this.client.tilesize;
  }
}

export default Item;