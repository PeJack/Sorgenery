import Boot from 'states/Boot';
import Preload from 'states/Preload';

import Game from 'states/Game';
import MainMenu from 'states/menu/MainMenu';
import Options from 'states/menu/Options';
import Credits from 'states/menu/Credits';

class Engine extends Phaser.Game {

  constructor() {
    super(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Sorgenery', null, true, false);

    this.state.add('Boot', Boot, false);
    this.state.add('Preload', Preload, false);
    this.state.add('Game', Game, false);
    this.state.add('MainMenu', MainMenu, false);
    this.state.add('Options', Options, false);
    this.state.add('Credits', Credits, false);

    this.state.start('Boot');
  }

}

new Engine();