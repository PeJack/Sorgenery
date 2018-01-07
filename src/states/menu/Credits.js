class Credits extends Phaser.State {
    preload() {
      this.optionCount = 1; // Количество кнопок меню.
      this.creditCount = 0; // Количество титров.
    }

    create() {
      var bg = this.game.add.sprite(0, 0, 'menu4');
      bg.width   = window.innerWidth * window.devicePixelRatio;
      bg.height  = window.innerHeight * window.devicePixelRatio

      this.addCredit('Music', 'Ludwig Van Beethoven');
      this.addCredit('Lorem Ipsum', 'Mipsem Dempsum');
      this.addCredit('Phaser.io', 'Powered By');
      this.addCredit('for playing', 'Thank you');
      this.createButton("<-- Back", function() {
        this.game.state.start("MainMenu");
      })
      this.game.add.tween(bg).to({alpha: 0}, 10000, Phaser.Easing.Cubic.Out, true, 4000);
    }

    update() { 
    }

    createButton(text, callback) {
      var button = this.game.add.button(90, (this.optionCount * 80), 'button', callback, this, 2, 1, 0);
      button.anchor.setTo(0.5, 0.5);

      var txt = this.game.add.text(button.x, button.y, text, {
        font: '14px TheMinion',
        fill: 'black',
        align: 'center'
      });
      txt.anchor.setTo(0.5, 0.5);

      this.optionCount ++;
    }

    addCredit(task, author) {
      var authorStyle = { font: '40pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
      var taskStyle = { font: '30pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
      var authorText = this.game.add.text(this.game.world.centerX, 900, author, authorStyle);
      var taskText = this.game.add.text(this.game.world.centerX, 950, task, taskStyle);
      authorText.anchor.setTo(0.5);
      authorText.stroke = "rgba(0,0,0,0)";
      authorText.strokeThickness = 4;
      taskText.anchor.setTo(0.5);
      taskText.stroke = "rgba(0,0,0,0)";
      taskText.strokeThickness = 4;
      this.game.add.tween(authorText).to( { y: -300 }, 10000, Phaser.Easing.Cubic.Out, true, this.creditCount * 3000);
      this.game.add.tween(taskText).to( { y: -200 }, 10000, Phaser.Easing.Cubic.Out, true, this.creditCount * 3000);
      this.creditCount ++;
    }
}

export default Credits;
