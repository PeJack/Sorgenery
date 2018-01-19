class Player {
  constructor(client){
    this.client = client;
    this.group = this.client.layers.entities;
    this.scale = 1;

    this.sprite = this.group.create(0, 0, "48bitSprites");
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(this.scale, this.scale);

    this.create();
	}

  create() {
    this.setAnimations();
  }

  setAnimations() {
    let spriteOffset = 170;

    this.sprite.animations.add("idle", [0 + spriteOffset, 1 + spriteOffset]);
    this.sprite.animations.add("walk", [1 + spriteOffset, 2 + spriteOffset, 3 + spriteOffset, 2 + spriteOffset]);
    this.sprite.animations.add("walkup", [7 + spriteOffset, 8 + spriteOffset, 9 + spriteOffset, 8 + spriteOffset]);
    this.sprite.animations.add("attack", [4 + spriteOffset, 5 + spriteOffset, 6 + spriteOffset, 6 + spriteOffset, 5 + spriteOffset, 4 + spriteOffset]);
    this.sprite.animations.play("idle", 2 + spriteOffset, false);
    this.sprite.events.onAnimationComplete.add(this.startIdle, this);
  }

  startIdle() {
    this.sprite.animations.stop();
  }

  setState(state) {
    if (state.speed === 0 || (state.speed > 0 && this.sprite.x === state.x && this.sprite.y === state.y)) {
      this.sprite.animations.stop();
    } else {
      this.animations.play('walk', 8, true);
    }

    this.sprite.x = state.x;
    this.sprite.y = state.y;
    this.sprite.rotation = state.rotation;
  }

}

export default Player;