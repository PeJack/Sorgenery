import Player from 'objects/Player';
import InputHandler from 'objects/InputHandler';

class Game extends Phaser.State {
    
  preload() {
    this.layers = {};
    this.running = false;
    this.tilesize = 48;
  }

  create() {
    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage('tiles', 'tiles');

    this.layers.background      = this.map.createLayer('backgroundLayer');
    this.layers.mapBlocks       = this.map.createLayer('blockedLayer');
    this.layers.collectObjects  = this.game.add.group(this.game.world, "collectObjects");
    this.layers.spells          = this.game.add.group(this.game.world, "spells");
    this.layers.chars           = this.game.add.group(this.game.world, "chars");
    this.layers.bolts           = this.game.add.group();
    
    this.layers.bolts.enableBody = true;
    this.layers.bolts.physicsBodyType = Phaser.Physics.ARCADE;
    this.layers.bolts.setAll('anchor.x', 0.5);
    this.layers.bolts.setAll('anchor.y', 0.5);
    this.line = new Phaser.Line(300, 100, 500, 500);
    this.line1;
    
    // Коллизия на объекты с ID..
    // [0, 208, 240, 272, 273, 274, 292, 296, 297, 304, 305, 306, 324, 328, 329, 336, 337, 338, 356, 357, 358, 359, 360, 363, 364, 388, 389, 390, 391, 392, 395, 396, 420, 421, 422, 423, 424, 427, 428, 505, 506, 507, 537, 538, 539, 569, 570, 571, 634, 635, 636, 667, 694, 695, 697, 699, 700, 701, 702, 703, 731, 732, 733, 734, 735, 767, 768, 799, 800, 831, 832, 863, 864, 895, 924, 926, 927, 928, 958, 959, 960, 987, 990, 991, 992, 1019, 1022, 1023]
    this.map.setCollisionBetween(208, 1024, true, 'blockedLayer');
 
    // Ресайз мира.
    this.layers.background.resizeWorld();
    this.layers.background.wrap = true;

    this.createItems();
    
    // Игрок.
    this.player = this.layers.chars.create(0, 0, "48bitSprites");
    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);

    // Счет.
    this.score = 0;
    this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    this.scoreText.fixedToCamera = true;
    
    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
    console.log(this.cursors);

    this.run();
  }

  run() {
    // this.buttonHandler = this.game.buttonHandler;
    // this.player = new Player(this);
    // this.inputHandler = new InputHandler(this);
  }

  update() {
    // this.inputHandler.update()
    // this.player.update()

    //player movement
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    if(this.cursors.up.isDown) {
      this.player.body.velocity.y -= 150;
    }
    else if(this.cursors.down.isDown) {
      this.player.body.velocity.y += 150;
    }
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x -= 150;
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x += 150;
    }

    if (this.game.input.activePointer.isDown){
      this.line1 = null;
      this.fire();
    }
    
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
      this.line1 = new Phaser.Line(this.player.x, this.player.y, this.game.input.activePointer.x, this.game.input.activePointer.y);
    }


    // Collision.
    this.game.physics.arcade.collide(this.player, this.layers.mapBlocks);
    this.game.physics.arcade.overlap(this.player, this.layers.collectObjects, this.collect, null, this);
  }
  render() {
    this.game.debug.geom(this.line1);
  }

  posToCoord(obj) {
    return {
      x: obj.x * this.tilesize + this.tilesize / 2,
      y: obj.y * this.tilesize + this.tilesize / 2
    }
  }

  getPosition(obj) {
    return {
      x: (obj.x - this.tilesize / 2) / this.tilesize,
      y: (obj.y - this.tilesize / 2 - (obj.off || 0)) / this.tilesize 
    }
  }

  createItems() {
    this.layers.collectObjects.enableBody = true;
    let item, result;    
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.layers.collectObjects);
    }, this);
  }

  // Find objects in a Tiled layer that containt a property called "type" equal to a certain value.
  findObjectsByType(type, map, layer) {
    let result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  }
    
  // Create a sprite from an object.
  createFromTiledObject(element, group) {
    let sprite = group.create(element.x, element.y, element.properties.sprite);
  
    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key){
      sprite[key] = element.properties[key];
    });
  }


  collect(player, collectable) {
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;
    
    //remove sprite
    collectable.destroy();
  }

  fire() {
    // this.layers.bolts.createMultiple(30, 'bullet', 0, false);
    let bolt = this.layers.bolts.create(this.player.x, this.player.y, 'bullet');
    
    console.log('fire');
    bolt.rotation = this.game.physics.arcade.moveToPointer(bolt, 1000, this.game.input.activePointer, 500);
  }
}

export default Game;


// 4. Сделать поворот тела по мышке
// 5. Сделать отображения скила

// Делать группу под каждый скил?
// Как рисовать и удалять поле скила