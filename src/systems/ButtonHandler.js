class ButtonHandler {
  constructor(game){
    this.game = game;
    this.keyboard = this.game.input.keyboard;
    this.mouse = this.game.input.activePointer;

    this.lastTimeOut = 0;

    this.buttons = {
      activate: false,
      up: false,
      down: false,
      left: false,
      right: false,
      menu: false,
      attack: false
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
    if (this.keyboard.isDown(Phaser.Keyboard.UP)) {
      this.buttons.up = true;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      this.buttons.down = true;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.buttons.left = true;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.buttons.right = true;
    }

    if (this.mouse.isDown) {
      this.buttons.attack = true;
    }
  }
}

export default ButtonHandler;