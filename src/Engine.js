import Boot from 'states/Boot';
import Preload from 'states/Preload';
import MainMenu from 'states/MainMenu';
import Game from 'states/Game';

class Engine extends Phaser.Game {

	constructor() {

		super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

		this.state.add('Boot', Boot, false);
		this.state.add('Preload', Preload, false);
		this.state.add('MainMenu', MainMenu, false);
		this.state.add('Game', Game, false);

		this.state.start('Boot');
	}

}

new Engine();