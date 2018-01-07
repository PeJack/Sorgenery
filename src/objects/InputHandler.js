class InputHandler {
	constructor(game){
        this.game = game;
        this.tilesize = 48;
        this.clickPosition = { x: 0, y: 0 };

        this.create();
	}

    create() {
        this.game.player.sprite.inputEnabled = true;
        this.game.player.sprite.input.useHandCursor = true;
        this.lastPosition = new Phaser.Point(0,0);
        this.game.input.circle.diameter = this.tilesize + 4;
        this.game.input.holdRate = 150;
        this.game.input.onDown.add(this.handleInputDown, this);
        this.game.input.onUp.add(this.handleInputUp, this);
        this.game.input.onHold.add(this.handleInputHold, this);
        // this.game.input.onTap.add(this.handleInputTap, this);
        this.buttonHandler = this.game.buttonHandler;
        this.buttons = this.buttonHandler.buttons;
        this.active = true;

        this.start();
    }

    start() {
        this.action = "none";
        this.active = true;
    }

    stop() {
        this.action = "none";
        this.game.player.path.length = 0;
    }

    getInputPosition() {
        return {
            x: Math.round(this.game.input.worldX / this.tilesize - 0.5),
            y: Math.round(this.game.input.worldY / this.tilesize - 0.5)
        }
    }

    handleInputDown() {
        if (this.game.player.path.length > 0) {
            this.game.player.path.length = 0;
        } else {
            if (this.action == "waiting" || !this.active || !this.game.player.walking) {
                // this.inputOverPlayer();
            }
        }
    }

    handleInputHold() {
        this.lastPosition.copyFrom(this.game.input.activePointer);
    }

    handleInputUp() {
        if (this.action != "waiting" && this.active) {

        }
    }

    handleInputButton() {
        if (this.buttonHandler.update() && this.action != "waiting" && this.active) {
            if (this.buttons.up) {
                this.startWalk(
                    [{
                        y: this.game.player.getPosition().y - 1
                    }],
                    "up"
                )
            }
            if (this.buttons.down) {
                this.startWalk(
                    [{
                        y: this.game.player.getPosition().y + 1
                    }],
                    "down"
                )
            }
            if (this.buttons.left) {
                this.startWalk(
                    [{
                        x: this.game.player.getPosition().x - 1
                    }],
                    "left"
                )
            }
            if (this.buttons.right) {
                this.startWalk(
                    [{
                        x: this.game.player.getPosition().x + 1
                    }],
                    "right"
                )
            }

            this.buttonHandler.timeOut();
        }
    }

    startWalk(path, direction) {
        this.action = "waiting";
        this.game.player.path = path;

        let currentPath = this.game.player.path.pop();

        if (currentPath) {
            this.game.player.walkToTile(currentPath, direction, function() {
                this.action = "none";
            }, this)
        }
    }

    update() {
        this.handleInputButton();
        this.lastPosition.copyFrom(this.game.input.activePointer);
    }
}

export default InputHandler;