class Player {
  constructor(game){
    this.game = game;
    this.group = this.game.layers.chars;
    this.scale = 2;

    this.sprite = this.group.create(0, 0, "48bitSprites");
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(this.scale, this.scale);
    this.sprite.off = -8;
    this.sprite.effect = null;
    this.sprite.handler = this;
    this.sprite.getPosition = function() {
      return this.handler.getPosition()
    };
    this.sprite.target = {
      x: this.getPosition().x,
      y: this.getPosition().y
    };
    this.walking = false;
    this.path = [];

    this.directionCodes = {
      "up": null,
      "down": null,
      "left": this.scale,
      "right": -this.scale
    };

    this.create();
	}

  create() {
    this.setAnimations();
  }

  setAnimations() {
    this.sprite.animations.animationsCollection = {};
    let spriteOffset = 160;
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

  getPosition() {
    return this.game.getPosition(this.sprite);
  }

  walkToTile(path, direction, callback, handler) {
    let currentPosition = this.getPosition();
    let newCoords = this.game.posToCoord(path);
    if (newCoords.x) {
      this.sprite.target.x = newCoords.x;
    }
    if (newCoords.y) {
      this.sprite.target.y = newCoords.y;
    }

    let movingTween = this.game.add.tween(this.sprite);

    movingTween.onStart.add(function() {
      this.startWalk(this.directionCodes[direction])
    }, this);

    movingTween.onComplete.add(function() {
      this.stopWalk(callback, handler)
    }, this);

    movingTween.to({
      x: this.sprite.target.x,
      y: this.sprite.target.y + this.sprite.off
    }, 250, Phaser.Easing.Linear.None, true);
  }

  startWalk(direction) {
    if (this.walking == false) {
      this.walking = true;
    }

    let target = this.sprite.target;
    if (direction) {
      this.sprite.scale.x = direction;
      this.sprite.animations.play("walk", 8, true);
    } else {
      if (target.y < this.sprite.y) {
        this.sprite.animations.play("walkup", 8, true);
      } else {
        this.sprite.animations.play("walk", 8, true);
      }
    }
  }

  stopWalk(callback, handler) {
    this.walking = false;
    this.startIdle();

    if (typeof callback == "function") {
      callback.call(handler);
    }
  }

}

export default Player;