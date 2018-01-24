import Helpers from '../Helpers'

class Player {
  constructor(client, x, y){
    this.client = client;
    this.group = this.client.layers.entities;
    this.scale = 1;
    this.walking = false;
    this.speed = 150;
    this.moveSpeed = {
      x: 0,
      y: 0
    };
    this.currentDirection = "down";
    this.directionCodes = {
      "up": 0,
      "down": 4,
      "left": 6,
      "right": 2
    }

    this.currentAnimation = null;
    this.sprite = this.group.create(x * this.client.tilesize, y * this.client.tilesize, "48bitSprites");
    // this.sprite = this.client.game.add.sprite(x * this.client.tilesize, y * this.client.tilesize, "48bitSprites");
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

    this.attackRange = this.client.game.add.graphics(0, 0);
    this.attackRange.lineStyle(2, 0xFF0000, 0.2);
    this.attackRange.drawCircle(0, 0, 100);
    this.attackRange = this.sprite.addChild(this.attackRange);
    this.attackRange.radius = 100;
    
    this.meleeAnimation = this.client.effectsManager.strike;
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

  update() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    if (this.buttonHandler.update()) {
      if (this.buttons.left) {
        this.moveSpeed.x = -this.speed;
        this.sprite.scale.x = this.scale;
        this.currentAnimation = "walk";
      } else if (this.buttons.right) {
        this.moveSpeed.x = this.speed;
        this.sprite.scale.x = -this.scale;        
        this.currentAnimation = "walk";
      } else {
        this.moveSpeed.x = 0;
        this.currentAnimation = "idle";
      }
  
      if (this.buttons.up) {
        this.moveSpeed.y = -this.speed;
        this.currentAnimation = "walkup";
      } else if (this.buttons.down) {
        this.moveSpeed.y = this.speed;
        this.currentAnimation = "walk";      
      } else {
        this.moveSpeed.y = 0;
        this.currentAnimation = "idle";      
      }
  
      if (Math.abs(this.moveSpeed.x) > 0 || Math.abs(this.moveSpeed.y) > 0) {
        this.sprite.body.velocity.x = this.moveSpeed.x;
        this.sprite.body.velocity.y = this.moveSpeed.y;
      }
  
      if (Math.abs(this.sprite.body.velocity.x) > 0 || Math.abs(this.sprite.body.velocity.y) > 0) {
        this.position = {
          x: this.getPosition().x,
          y: this.getPosition().y
        };
        this.client.positionUpdated = true;
        this.sprite.animations.play(this.currentAnimation, 12, true);
      } else {
        this.sprite.animations.stop();
      }

      this.buttonHandler.timeOut();
    }
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

    if (!this.client.levelManager.map.canGo(checkingPath)) {
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
    this.position = {
      x: this.getPosition().x,
      y: this.getPosition().y
    };

    this.client.positionUpdated = true;

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
    this.client.entityMap[this.sprite.x + '_' + this.sprite.y] = this;
    this.walking = false;
    this.startIdle();

    if (typeof callback == "function") {
      callback.call(handler);
    }
  }

  attack(path) {
    let newScale;
    if (path.worldX <= this.sprite.x) {
      newScale = this.scale;
    } else {
      newScale = -this.scale;
    }

    if (!Helpers.pointInCircle(
      path.worldX, path.worldY, 
      this.attackRange.world.x, 
      this.attackRange.world.y, 
      this.attackRange.radius / 2
      )
    ) {
      
    }

    this.sprite.scale.x = newScale;
    this.meleeAnimation.call(this.client.effectsManager, path.worldX, path.worldY);
    this.sprite.animations.play("attack", 16, false);
  }
}

export default Player;