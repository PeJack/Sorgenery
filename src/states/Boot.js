import ButtonHandler from 'objects/ButtonHandler'

class Boot extends Phaser.State {

	preload() {
		this.game.fontsize = 32;
		this.game.load.image("loaderFull", "assets/interface/loader_full.png");
    this.game.load.image("loaderEmpty", "assets/interface/loader_empty.png");
    this.game.load.spritesheet("loading", "assets/sprites/loading.png", 48, 48);
    this.game.load.spritesheet("button", "assets/sprites/button_sprite_sheet.png", 191, 65);
	}

	create() {
		this.game.stage.smoothed = false;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.stage.disableVisibilityChange = true;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;

		this.game.buttonHandler = new ButtonHandler(this.game);
        this.game.debugging = false;

		this.game.state.start("Preload");
	}

}

export default Boot;