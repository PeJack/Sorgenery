class ButtonHandler {
  constructor(game){
    this.game = game;
    this.keyboard = this.game.input.keyboard;
    this.lastTimeOut = 0;

    this.buttons = {
      activate: false,
      up: false,
      down: false,
      left: false,
      right: false,
      menu: false,
    };

    this.buttonHelper = {
      space: this.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      enter: this.keyboard.addKey(Phaser.Keyboard.ENTER),
      numpadEnter: this.keyboard.addKey(Phaser.Keyboard.NUMPAD_ENTER),
      x: this.keyboard.addKey(Phaser.Keyboard.X)
    };
}

  update() {
    if (this.game.time.now < this.lastTimeOut) {
      return false;
    } else {
      this.reset();
      this.handleKeyboard();
      return true;
    }
  }
	
  timeOut() {
    this.lastTimeOut = this.game.time.now + 200;
    this.reset();
  }

  reset() {
    for (let button in this.buttons) {
      this.buttons[button] = false;
    }
  }

  handleKeyboard() {
    if (this.keyboard.isDown(Phaser.Keyboard.UP) || this.keyboard.isDown(Phaser.Keyboard.W)) {
      this.buttons.up = true;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.DOWN) || this.keyboard.isDown(Phaser.Keyboard.S)) {
      this.buttons.down = true;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.LEFT) || this.keyboard.isDown(Phaser.Keyboard.A)) {
      this.buttons.left = true;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.keyboard.isDown(Phaser.Keyboard.D)) {
      this.buttons.right = true;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.E)) {
      this.buttons.activate = true;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.ESC)) {
      this.buttons.menu = true;
    }
  }

}

export default ButtonHandler;