import Actor from './Actor';

class Player extends Actor {
  constructor(client, data, pos) {
    super(client, pos);
    
    // След характеристики должны получаться из json файла или базы (data)
    this.spriteOffset = 110;
    this.hp = 100;
    this.sp = 110;
    this.damage = 1;
    this.movingDelay = 200;

    this.buttonHandler = this.client.buttonHandler;
    this.buttons = this.buttonHandler.buttons;

    this.isPlayer = true;

    this.setAnimations();
	}

  pickUp(item) {
    this.inventory.addItem(item);
  }
}

export default Player;