class InputHandler {
  constructor(client){
    this.client = client;
    this.clickPosition = { x: 0, y: 0 };
    
    this.create();
  }

  create() {
    this.client.game.input.circle.diameter = this.client.tilesize + 4;
    this.client.game.input.holdRate = 150;
    this.client.game.input.onTap.add(this.handleInputTap, this);
    this.buttonHandler = this.client.buttonHandler;
    this.buttons = this.buttonHandler.buttons;
    this.active = false;
  }

  start() {
    this.action = "none";
    this.active = true;
  }

  stop() {
    this.action = "none";
    this.active = false;
  }

  handleInputButton() {
    if (this.buttonHandler.update() && this.action != "waiting" && this.active) {
      if (this.buttons.up) {
        this.startWalk(
          [{
            y: this.client.player.getPosition().y - 1
          }],
          "up"
        )
      }

      if (this.buttons.down) {  
        this.startWalk(
          [{
            y: this.client.player.getPosition().y + 1
          }],
          "down"
        )
      }

      if (this.buttons.left) {
        this.startWalk(
          [{
            x: this.client.player.getPosition().x - 1
          }],
          "left"
        )
      }

      if (this.buttons.right) {
        this.startWalk(
          [{
            x: this.client.player.getPosition().x + 1
          }],
          "right"
        )
      }

      // if (this.buttons.attack) {
      //     this.attack();
      // }

      this.buttonHandler.timeOut();
    }
  }

  handleInputTap(pointer) {
    this.attack();
  }

  startWalk(path, direction) {
    this.action = "waiting";
    this.client.player.path = path;

    let currentPath = this.client.player.path.pop();

    if (currentPath) {
      this.client.player.walkToTile(currentPath, direction, function() {
        this.action = "none";
      }, this)
    }
  }

  attack() {
    this.client.player.weapon.attack(this.client.game.input.activePointer);
  }

  update() {
    this.handleInputButton();
  }

}

export default InputHandler;