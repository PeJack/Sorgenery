import Helpers from '../Helpers'; 

class EffectsManager {
  constructor(client) {
    this.client = client;
    this.tilesize = this.client.tilesize;
    this.layer = this.client.layers.effects;
    this.sprite = this.layer.create(0, 0, "48bitSprites");
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.visible = false;

    this.create();
  }

  create() {
    this.setAnimations();
  } 

  setAnimations() {
    let off = Helpers.spriteOffset.strike1;
    this.sprite.animations.add("strike1", [off, off + 1, off + 1]);

    off = Helpers.spriteOffset.strike2;
    this.sprite.animations.add("strike2", [off, off + 1, off + 1]);

    off = Helpers.spriteOffset.strike3;
    this.sprite.animations.add("scratch", [off, off + 1, off + 1]);
  }

  strike(x, y, callback) {
    if (typeof callback == "function") {
      this.sprite.events.onAnimationComplete.remove(callback);
      this.sprite.events.onAnimationComplete.addOnce(callback);
    }

    this.sprite.reset(x, y - 6);

    if (Math.round(1 * Math.random())) {
      this.sprite.animations.play("strike1", 12, false, true);
    } else {
      this.sprite.animations.play("strike2", 12, false, true);
    }
  }

  scratch(x, y, callback) {
    if (typeof callback == "function") {
      this.sprite.events.onAnimationComplete.remove(callback);
      this.sprite.events.onAnimationComplete.addOnce(callback);
    }

    this.sprite.reset(x, y - 6);
    this.sprite.animations.play("scratch", 12, false);
  }

  arrowHit(dir) {
  }
}

export default EffectsManager;