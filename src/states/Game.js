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

        this.run();
    }

    run() {
        this.buttonHandler = this.game.buttonHandler;
        this.player = new Player(this);
        this.inputHandler = new InputHandler(this);
    }

    update() {
        this.inputHandler.update()
        // this.player.update()
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
}

export default Game;
    