import Player from 'objects/Player';
import InputHandler from 'objects/InputHandler';

class Game extends Phaser.State {
    
  preload() {
    this.layers = {};
    this.running = false;
    this.tilesize = 48;
  }

  create() {
    this.layers.background = this.game.add.group(this.game.world, "background");
    this.layers.objects = this.game.add.group(this.game.world, "objects");
    this.layers.enemies = this.game.add.group(this.game.world, "enemies");
    this.layers.chars = this.game.add.group(this.game.world, "chars");
    this.layers.spells = this.game.add.group(this.game.world, "spells");
    this.layers.effects = this.game.add.group(this.game.world, "effects");
    this.layers.enemyHealth = this.game.add.group(this.game.world, "enemyHealth");
    this.layers.spellbook = this.game.add.group();
    this.layers.menu = this.game.add.group();
    this.layers.hud = this.game.add.group();

    this.layers.spellbook.fixedToCamera = true;
    this.layers.menu.fixedToCamera = true;
    this.layers.hud.fixedToCamera = true;

    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage('tiles', 'tiles');

    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
 
    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();
    // layer.resizeWorld();
    this.backgroundlayer.wrap = true;

    this.createItems();
    
    //we know there is just one result
    this.player = this.game.add.sprite(0, 0, '48bitSprites');
    this.game.physics.arcade.enable(this.player);
    
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
    
    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    
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

    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
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
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    let item, result;    
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  }

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
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
    
  //create a sprite from an object
  createFromTiledObject(element, group) {
    let sprite = group.create(element.x, element.y, element.properties.sprite);
  
    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key){
      sprite[key] = element.properties[key];
    });
  }


  collect(player, collectable) {
    console.log('yummy!');
 
    //remove sprite
    collectable.destroy();
  }
}

export default Game;
    