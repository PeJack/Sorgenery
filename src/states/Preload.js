class Preload extends Phaser.State {
  loadImages() {
    this.game.load.image('menu1', 'assets/interface/menu1.jpg');
    this.game.load.image('menu2', 'assets/interface/menu2.jpg');
    this.game.load.image('menu3', 'assets/interface/menu3.jpg');
    this.game.load.image('menu4', 'assets/interface/menu4.jpg');
    this.game.load.image('menu5', 'assets/interface/menu5.jpg');
    this.game.load.image('menu6', 'assets/interface/menu6.jpg');
    this.game.load.image('menu7', 'assets/interface/menu7.jpg');
  }

	preload() {
		let a = 1;
    let loadingText = this.game.add.text(this.game.world.centerX - 16 / a, this.game.world.centerY - 54 / a, "Колдую", {
        font: this.game.fontsize + "px " + this.game.font,
        fill: "white",
        align: "center"
    });

		loadingText.anchor.setTo(0.5, 0.5);

		this.loading = this.game.add.sprite(this.game.world.centerX + 80 / a, this.game.world.centerY - 54 / a, "loading");
		this.loading.anchor.setTo(0.5, 0.5);
    this.loading.animations.add("loading");
		this.loading.animations.play("loading", 16, true);
		this.loaderEmpty = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "loaderEmpty");
    this.preloadBar = this.game.add.sprite(this.game.world.centerX - this.loaderEmpty.width / (2 * a), this.game.world.centerY, "loaderFull");
		this.loaderEmpty.anchor.setTo(0.5, 0);

		this.game.load.setPreloadSprite(this.preloadBar);

    this.loadImages();
	}

	create() {
    setTimeout(function () {
      console.log('keke');
    }, 5000);
    this.game.state.start("MainMenu");
	}
}

export default Preload;
