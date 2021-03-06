class MainMenu extends Phaser.State {
  preload() {
    this.optionCount = 1; // Количество кнопок меню.
  }

  create() {
    this.titleText = this.game.make.text(this.game.world.centerX, 100, "Sorgenery", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);

    let bg = this.game.add.sprite(0, 0, 'menu5');
    bg.width   = window.innerWidth * window.devicePixelRatio;
    bg.height  = window.innerHeight * window.devicePixelRatio

    this.game.add.existing(this.titleText);

    this.createButton("Start", function() {
      this.game.state.start("Game");
    })

    this.createButton("Options", function() {
      this.game.state.start("Options");
    })

    this.createButton("Credits", function() {  
      this.game.state.start("Credits");
    })
  }

  update() { 
  }

  newGame() {
  }

  createButton(text, callback) {
    let button = this.game.add.button(this.game.world.centerX, (this.optionCount * 80) + 200, 'button', callback, this, 2, 1, 0);
    button.anchor.setTo(0.5, 0.5);

    let txt = this.game.add.text(button.x, button.y, text, {
      font: '14px TheMinion',
      fill: 'black',
      align: 'center'
    });
    txt.anchor.setTo(0.5, 0.5);

    this.optionCount ++;
  }
}

export default MainMenu;
    