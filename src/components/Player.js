import Helpers from '../Helpers';

class Player {
  constructor(client, x, y){
    this.client = client;
    this.group = this.client.layers.actors;
    this.scale = 1;
    this.walking = false;
    this.speed = 150;
    this.moveSpeed = {
      x: 0,
      y: 0
    };
    this.currentDirection = "down";

    this.currentAnimation = null;
    this.sprite = this.group.create(x * this.client.tilesize, y * this.client.tilesize, "48bitSprites");

    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(this.scale, this.scale);
    this.sprite.off = -8;
    this.sprite.target = {
      x: this.sprite.x,
      y: this.sprite.y
    };
    this.position = {
      x: this.getPosition().x,
      y: this.getPosition().y
    };

    // initialize weapon - bare hands (id == 0)
    this.weapon = this.client.weaponsManager.create(0, this);
    
    this.attackRange = this.client.game.add.graphics(0, 0);
    this.attackRange.range = this.weapon.range;
    this.attackRange.lineStyle(2, 0xFF0000, 0.2);
    this.attackRange.drawCircle(0, 0, this.attackRange.range);
    this.attackRange = this.sprite.addChild(this.attackRange);
    
    this.walking = false;
    this.path = [];

    this.directionScales = {
      "up": null,
      "down": null,
      "left": this.scale,
      "right": -this.scale
    };

    this.create();
	}

  create() {
    this.buttonHandler = this.client.buttonHandler;
    this.buttons = this.buttonHandler.buttons;

    this.setAnimations();
  }

  setAnimations() {
    let spriteOffset = 110;

    this.sprite.animations.add("idle", [0 + spriteOffset, 1 + spriteOffset]);
    this.sprite.animations.add("walk", [1 + spriteOffset, 2 + spriteOffset, 3 + spriteOffset, 2 + spriteOffset]);
    this.sprite.animations.add("walkup", [7 + spriteOffset, 8 + spriteOffset, 9 + spriteOffset, 8 + spriteOffset]);
    this.sprite.animations.add("attack", [4 + spriteOffset, 5 + spriteOffset, 6 + spriteOffset, 6 + spriteOffset, 5 + spriteOffset, 4 + spriteOffset]);
    this.sprite.animations.play("idle", 2 + spriteOffset, false);
    this.sprite.events.onAnimationComplete.add(this.startIdle, this);
  }

  startIdle() {
    // if (this.walking) { return; }
    this.sprite.animations.stop();
  }

  getPosition() {
    return this.client.getPosition(this.sprite);
  }

  walkToTile(path, direction, callback, handler) {
    if (!path || (!path.x && !path.y)) { 
      if (typeof callback == "function") {
        callback.call(handler);
      }

      return; 
    }
    
    let checkingPath = path;
    if (!checkingPath.x) {
      checkingPath.x = this.getPosition().x;
    } else if (!checkingPath.y) {
      checkingPath.y = this.getPosition().y;
    }

    if (!this.client.mapsManager.canGo(checkingPath)) {
      if (typeof callback == "function") {
        callback.call(handler);
      }
      
      return; 
    }

    let newCoords = this.client.posToCoord(path);
    if (newCoords.x) {
      this.sprite.target.x = newCoords.x;
    }
    if (newCoords.y) {
      this.sprite.target.y = newCoords.y;
    }

    this.currentDirection = direction;
    let movingTween = this.client.add.tween(this.sprite);

    movingTween.onStart.add(function() {
      this.startWalk(this.directionScales[direction])
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

    this.position = {
      x: this.getPosition().x,
      y: this.getPosition().y
    };

    this.client.positionUpdated = true;
    
    if (typeof callback == "function") {
      callback.call(handler);
    }
  }

  pickUp(item) {
    this.inventory.addItem(item);
  }
}

export default Player;