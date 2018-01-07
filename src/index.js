import Boot from 'states/Boot';
import Preload from 'states/Preload';
import MainMenu from 'states/menu/MainMenu';
import Options from 'states/menu/Options';
import Credits from 'states/menu/Credits';

class Game extends Phaser.Game {

	constructor() {

		super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

		this.state.add('Boot', Boot, false);
		this.state.add('Preload', Preload, false);
    this.state.add('MainMenu', MainMenu, false);
    this.state.add('Options', Options, false);
		this.state.add('Credits', Credits, false);

		this.state.start('Boot');
	}

}

new Game();