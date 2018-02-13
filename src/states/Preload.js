class Preload extends Phaser.State {
  
  loadInterface() {
    this.game.load.spritesheet("48bitSprites", "assets/sprites/48bitSprites.png", 48, 48);
    this.game.load.spritesheet("timer", 'assets/interface/timer.png', 66, 10);
    this.game.load.spritesheet("timer_bg", 'assets/interface/timer_bg.png', 66, 10);
    this.game.load.atlas("inventory", 'assets/interface/invent.png', 'assets/interface/invent.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.image("ic_hand", "assets/interface/icons/ic_hand.png");
  }

  loadWeapons() {
    this.game.load.image('wp_arb11', 'assets/sprites/weapons/wp_arb11.png');
    this.game.load.image('wp_arb12', 'assets/sprites/weapons/wp_arb12.png');
    this.game.load.image('wp_arb13', 'assets/sprites/weapons/wp_arb13.png'); 
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

    this.game.load.image('forest-tiles', 'assets/sprites/foresttiles_0.png');
    this.game.load.json('items', 'data/items.json');

    this.loadInterface();
    this.loadWeapons();
  }

  create() {
    // this.game.state.start("MainMenu");
    this.game.state.start("Client")
  }
}

export default Preload;
