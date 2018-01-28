import Helpers from '../Helpers'

class Weapon {
  constructor(client, id, type, damage, range, effect, actor) {
    this.client = client;
    this.id = id;
    this.type = type;
    this.damage = damage;
    this.range = range;
    this.effect = effect;
    this.actor = actor;
  }

  attack(path) {
    if (this.type == 'melee') {
      this.meleeAttack(path);
    } else {
      this.rangeAttack(path);
    }
  }

  meleeAttack(path) {
    if (!this.actor) { return; }

    let newScale, obj1, obj2, angleRadians, angleDeg, x, y;

    if (path.worldX <= this.actor.sprite.x) {
      newScale = this.actor.scale;
    } else {
      newScale = -this.actor.scale;
    }

    if (!Helpers.pointInCircle(
      path.worldX, path.worldY, 
      this.actor.attackRange.world.x, 
      this.actor.attackRange.world.y, 
      this.actor.attackRange.range / 2
      )
    ) {
      obj1 = {x: path.worldX, y: path.worldY};
      obj2 = {x: this.actor.attackRange.world.x, y: this.actor.attackRange.world.y};
      // angleRadians = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
      angleDeg = (Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) * 180 / Math.PI);
      
      x = obj2.x - (this.actor.attackRange.range / 2) * Math.cos(-angleDeg * Math.PI / 180);
      y = obj2.y + (this.actor.attackRange.range / 2) * Math.sin(-angleDeg * Math.PI / 180);      
    } else {
      x = path.worldX;
      y = path.worldY;
    }

    this.actor.sprite.scale.x = newScale;

    this.actor.sprite.animations.play("attack", 10, false);
    this.effect.call(this.client.effectsManager, x, y);
  }
  
  rangeAttack(path) {
    let obj1, obj2, angle, x, y, offsetX, offsetY, checkingPath, reached;

    let newPath = [];

    obj1 = {x: path.worldX, y: path.worldY};
    obj2 = {x: this.actor.attackRange.world.x, y: this.actor.attackRange.world.y};
    angle = (Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) * 180 / Math.PI);

    if (!Helpers.pointInCircle(
      path.worldX, path.worldY, 
      this.actor.attackRange.world.x, 
      this.actor.attackRange.world.y, 
      this.actor.attackRange.range / 2
      )
    ) {
      x = obj2.x - (this.actor.attackRange.range / 2) * Math.cos(-angle * Math.PI / 180);
      y = obj2.y + (this.actor.attackRange.range / 2) * Math.sin(-angle * Math.PI / 180);      
    } else {
      x = path.worldX;
      y = path.worldY;
    }

    if (x - this.actor.sprite.x > 0) {
      offsetX = 1;
    } else {
      offsetX = -1;
    }

    if (y - this.actor.sprite.y > 0) {
      offsetY = 1;
    } else {
      offsetY = -1;
    }

    checkingPath = {
      x: this.actor.getPosition().x,
      y: this.actor.getPosition().y
    };

    let target = this.client.getPosition({x: x, y: y});
    target.x = Math.round(target.x);
    target.y = Math.round(target.y);

    while (this.client.mapsManager.canGo(checkingPath)) {
      if (checkingPath.x != target.x) {
        checkingPath.x += offsetX;
      };

      if (checkingPath.y != target.y) {
        checkingPath.y += offsetY;      
      };

      newPath.push(checkingPath);

      if (checkingPath.x == target.x && checkingPath.y == target.y) {
        break;
      };
    }

    newPath = newPath.map(function(np) {
      return this.client.posToCoord(np);
    }, this);

    this.actor.sprite.animations.play("attack", 10, false);
    
    let projectile = this.client.layers.items.create(this.actor.sprite.x, this.actor.sprite.y, "48bitSprites");
    projectile.frame = Helpers.spriteOffset.normalArrow;
    projectile.anchor.setTo(0.5, 0.5);
    projectile.angle = angle + 180;

    this.createProjectile(newPath, projectile);
  }

  createProjectile(path, projectile) {
    let firstPath = path.shift(),
        projectilePos = this.client.getPosition(projectile),
        firstPathPos = this.client.getPosition(firstPath),
        delay = 40 * (Math.abs(projectilePos.x - firstPathPos.x) + Math.abs(projectilePos.y - firstPathPos.y)),
        lastPos;

    // lastPos = Math.round(projectilePos.x) + "_" + Math.round(projectilePos.y);
    // this.client.itemsMap[lastPos] = projectile;
    // this.client.positionUpdated = true;
    
    let missleTween = this.client.game.add.tween(projectile);
    missleTween.to({
      x: firstPath.x, y: firstPath.y
    }, delay, Phaser.Easing.Linear.None, true).start();

    if (path.length != 0) {
      missleTween.onComplete.addOnce(function() {
        this.client.positionUpdated = true;
        // delete this.client.itemsMap[lastPos];
        this.createProjectile(path, projectile);
      }, this)
    } else {
      missleTween.onComplete.addOnce(function() {
        projectile.destroy();
      }, this)
    }
  }
}

export default Weapon;