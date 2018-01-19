class InputHandler {
  constructor(client){
    this.client = client;
    this.tilesize = 48;
    this.clickPosition = { x: 0, y: 0 };

    this.create();
  }

  create() {
    // this.client.player.sprite.inputEnabled = true;

    this.buttonHandler = this.client.buttonHandler;
    this.buttons = this.buttonHandler.buttons;
    this.active = true;

    this.start();
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  update() {
    if (this.buttonHandler.update() && this.active) {
      this.client.player.sprite.body.velocity.y = 0;
      this.client.player.sprite.body.velocity.x = 0;

      if (this.buttons.left) {
        this.client.player.sprite.body.velocity.x -= 150;
        this.client.positionUpdated = true; 
      } else if (this.buttons.right) {
        this.client.player.sprite.body.velocity.x += 150;
        this.client.positionUpdated = true;         
      }
  
      if (this.buttons.up) {
        this.client.player.sprite.body.velocity.y -= 150; 
        this.client.positionUpdated = true;        
      } else if (this.buttons.down) {
        this.client.player.sprite.body.velocity.y += 150; 
        this.client.positionUpdated = true;        
      }

      this.buttonHandler.timeOut();
    }
  }
}

export default InputHandler;