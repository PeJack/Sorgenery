import Helpers from '../Helpers';

class Actor {
  constructor(client, pos) {
    this.client = client;
    this.group = this.client.layers.actors;
    this.scale = 1;
    this.walking = false;
    this.currentDirection = "down";
    this.isPlayer = false;
    this.sprite = this.group.create(pos.x * this.client.tilesize, pos.y * this.client.tilesize, "48bitSprites");

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

    this.path = [];
    this.directionScales = {
      "up": null,
      "down": null,
      "left": this.scale,
      "right": -this.scale
    };
  }

  setAnimations() {
    this.sprite.animations.add("idle", [0 + this.spriteOffset, 1 + this.spriteOffset]);
    this.sprite.animations.add("walk", [1 + this.spriteOffset, 2 + this.spriteOffset, 3 + this.spriteOffset, 2 + this.spriteOffset]);
    this.sprite.animations.add("walkup", [7 + this.spriteOffset, 8 + this.spriteOffset, 9 + this.spriteOffset, 8 + this.spriteOffset]);
    this.sprite.animations.add("attack", [4 + this.spriteOffset, 5 + this.spriteOffset, 6 + this.spriteOffset, 6 + this.spriteOffset, 5 + this.spriteOffset, 4 + this.spriteOffset]);
    this.sprite.animations.play("idle", 2 + this.spriteOffset, false);
    this.sprite.events.onAnimationComplete.add(this.startIdle, this);
  }

  startIdle() {
    this.sprite.animations.stop();
  }

  startIdle() {
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
    
    if (this.isPlayer && this.client.checkCollision(checkingPath)) {
      if (typeof callback == "function") {
        callback.call(handler);
      }
      
      return; 
    }

    if (!this.isPlayer) {
      this.client.actorsMap[checkingPath.x + "." + checkingPath.y] = this;
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
    }, this.movingDelay, Phaser.Easing.Linear.None, true);
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

    if (!this.isPlayer){
      delete this.client.actorsMap[this.position.x + "." + this.position.y];
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

  destroy() {
    if (!this.isPlayer){
      delete this.client.actorsMap[this.position.x + "." + this.position.y];
    }
  }
}

export default Actor;