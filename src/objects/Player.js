class Player {
  constructor(game){
    this.game = game;
    this.group = this.game.layers.objects;
    this.scale = 0.7;
    this.speed = 150;

    this.sprite = this.game.game.add.isoSprite(
      600, 300, 0, 'warlock', 'warlock_01', this.group
    );

    this.sprite.anchor.setTo(0.5);
    this.sprite.scale.setTo(this.scale, this.scale);
    this.sprite.off = -8;
    this.sprite.target = {
      x: this.getPosition().x,
      y: this.getPosition().y
    };

    this.sprite.head = this.sprite.addChild(this.group.create(0, 0, "f_doram"));
    this.sprite.head.anchor.setTo(0.5, 2.2);   
    // this.sprite.head.scale.setTo(this.scale, this.scale);

    this.walking = false;
    this.path = [];
    this.lastDirection = null;

    this.create();
	}

  create() {
    this.setAnimations();
    this.setHeadAnimations();
  }

  update() {
    if (this.game.cursors.up.isDown) {
      this.sprite.body.velocity.y = -this.speed;
    }
    else if (this.game.cursors.down.isDown) {
      this.sprite.body.velocity.y = this.speed;
    }
    else {
      this.sprite.body.velocity.y = 0;
    }

    if (this.game.cursors.left.isDown) {
      this.sprite.body.velocity.x = -this.speed;
    }
    else if (this.game.cursors.right.isDown) {
      this.sprite.body.velocity.x = this.speed;
    }
    else {
      this.sprite.body.velocity.x = 0;
    }
  }

  setAnimations() {
    this.sprite.animations.add("idle-front", ["warlock_01"]);
    this.sprite.animations.add("idle-front-left", ["warlock_02"]);
    this.sprite.animations.add("idle-left", ["warlock_03"]);
    this.sprite.animations.add("idle-back-left", ["warlock_04"]); 
    this.sprite.animations.add("idle-back", ["warlock_05"]);

    const walkFrontFrames = 
      Phaser.Animation.generateFrameNames('warlock_', 15, 22);
    this.sprite.animations.add("walk-front", walkFrontFrames);

    const walkFrontLeftFrames = 
      Phaser.Animation.generateFrameNames('warlock_', 29, 36);
    this.sprite.animations.add("walk-front-left", walkFrontLeftFrames);

    const walkLeftFrames = 
      Phaser.Animation.generateFrameNames('warlock_', 42, 49);
    this.sprite.animations.add("walk-left", walkLeftFrames);

    const walkBackLeftFrames = 
      Phaser.Animation.generateFrameNames('warlock_', 54, 61);
    this.sprite.animations.add("walk-back-left", walkBackLeftFrames);

    const walkBackFrames = 
      Phaser.Animation.generateFrameNames('warlock_', 64, 71);
    this.sprite.animations.add("walk-back", walkBackFrames);

    this.sprite.animations.play("idle-front", 2, false);

    // this.sprite.events.onAnimationComplete.add(this.startIdle, this);
  }

  setHeadAnimations() {
    this.sprite.head.animations.add("idle-front", ["f_doram_16"]);
    this.sprite.head.animations.add("idle-front-left", ["f_doram_17"]);
    this.sprite.head.animations.add("idle-left", ["f_doram_18"]);
    this.sprite.head.animations.add("idle-back-left", ["f_doram_19"]); 
    this.sprite.head.animations.add("idle-back", ["f_doram_20"]);

    this.sprite.head.animations.play("idle-front", 2, false);    
  }

  startIdle() {
    if (this.walking) { return; }

    this.sprite.animations.stop();
    if (this.lastDirection) {
      this.sprite.animations.play("idle-" + this.lastDirection, 2, false);
      this.sprite.head.animations.play("idle-" + this.lastDirection, 12, true);       
    }
  }

  getPosition() {
    return this.game.getPosition(this.sprite);
  }

  walkToTile(path, callback, handler) {
    let currentPosition = this.getPosition();
    let direction = [];
    let self = this;
    let newScale = null;
    
    path.forEach(function(currentPath) {
      let newCoords = self.game.posToCoord(currentPath);

      if (newCoords.y) {
        self.sprite.target.y = newCoords.y;
  
        if (self.sprite.y < self.sprite.target.y) {
          direction.push("front-left");
          self.sprite.body.velocity.y = self.speed;
        } else {
          direction.push("back-left");
          newScale = -self.scale;
          self.sprite.body.velocity.y = -self.speed;                  
        }
      }
  

      if (newCoords.x) {
        self.sprite.target.x = newCoords.x;

        if (self.sprite.x < self.sprite.target.x) {
          direction.push("front-left");          
          newScale = -self.scale;
          self.sprite.body.velocity.x = self.speed;
        } else {
          direction.push("back-left");
          newScale = self.scale;
          self.sprite.body.velocity.x = -self.speed;
        }
      } else if (!newScale) {
        newScale = self.scale;     
      }

      // if (newCoords.isoY) {
      //   self.sprite.target.isoY = newCoords.isoY;
  
      //   if (self.sprite.isoY < self.sprite.target.isoY) {
      //     direction.push("front");
      //   } else {
      //     direction.push("back");               
      //   }
      // }
  

      // if (newCoords.isoX) {
      //   self.sprite.target.isoX = newCoords.isoX;
      //   direction.push("left");

      //   if (self.sprite.isoX < self.sprite.target.isoX) {
      //     self.sprite.scale.x = -self.scale;
      //   } else {
      //     self.sprite.scale.x = self.scale;
      //   }
      // } else {
      //   self.sprite.scale.x = self.scale;     
      // }
    });
    this.sprite.scale.x = newScale || 1;
    this.sprite.isoZ = 0;

    direction = direction.join("-");
    this.lastDirection = direction;

    let movingTween = this.game.add.tween(this.sprite);

    movingTween.onStart.add(function() {
      this.startWalk(direction)
    }, this);

    movingTween.onComplete.add(function() {
      this.stopWalk(callback, handler)
    }, this);


    // let to = {};
    movingTween.to({x: this.sprite.x + 1}, 350, Phaser.Easing.Linear.None, true);
  }

  startWalk(direction) {
    if (this.walking == false) {
      this.walking = true;
    }

    this.sprite.animations.play("walk-" + direction, 12, true);   
    this.sprite.head.animations.play("idle-" + direction, 12, true);
  }

  stopWalk(callback, handler) {
    this.walking = false;
    // this.sprite.animations.stop(); 
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    // this.sprite.isoZ = 0;

    if (typeof callback == "function") {
      callback.call(handler);
    }
  }

}

export default Player;