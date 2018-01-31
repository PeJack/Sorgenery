class VisualTimer {
  constructor(opts) {
    this.type = 'down';

    if (opts.type) {
      this.type = opts.type;
    }

    this.totalTime = opts.seconds;
    this.client = opts.client;
    this.game = this.client.game;
    this.onComplete = opts.onComplete;

    let key = 'timer';
    if (opts.key) {
      key = opts.key;
    }

    this.background = this.game.add.sprite(0, 0, key + "_bg", 0);
    this.background.anchor.setTo(0, 3.5);
    this.background.visible = false;

    this.sprite = this.game.add.sprite(0, 0, key, 0);
    this.sprite.anchor.setTo(0, 3.5);
    this.sprite.visible = false;

    this.client.layers.hud.add(this.background);  
    this.client.layers.hud.add(this.sprite);  

    this.fullWidth = this.sprite.width;

    this.hasFinished = true;
  }

  reset() {
		if (this.timer) {
			this.timer.stop();
    }
    
    // let self = this;
    
    this.hasFinished = false;
    this.sprite.width = this.fullWidth;
    this.sprite.visible = true;
    this.background.visible = true;

    // this.timer = this.game.time.create(true);

		// this.timer.repeat(Phaser.Timer.SECOND, this.totalTime, this.timerTick, this);
		// this.timer.onComplete.add(function() {
    //   this.hasFinished = true;
    //   this.sprite.visible = false;
		// 	if (this.onComplete) {
		// 		this.onComplete();
		// 	}
    // }, this);

    this.timer = this.game.add.tween(this.sprite);

    this.timer.to(
      { width: 0 },  
      this.totalTime * 1000, 
      Phaser.Easing.Linear.None,
      false,
      0
    );

    this.timer.onComplete.add(function() {
      this.hasFinished = true;
      this.sprite.visible = false;
      this.background.visible = false;

      if (this.onComplete) {
        this.onComplete();
      }
    }, this);

		// this.rect = new Phaser.Rectangle(0, 0, 0, this.sprite.height);
    
    // if (this.type == 'down') {
		// 	this.sprite.crop(null);
		// } else {
		// 	this.sprite.crop(this.rect);
    // }
  }
  
  setTime(seconds) {
		this.totalTime = seconds;
		this.reset();
  }
  
  start() {
    this.reset();
    this.timer.start();
  }
  
  stop() {
		this.timer.stop();
  }
  
  pause() {
		this.timer.pause();
  }
  
  resume() {
		this.timer.resume();
  }
  
  remainingTime() {
		return this.totalTime - this.timer.seconds;
  }
  
  timerTick() {
    let myTime = (this.type == 'down') ? this.remainingTime() : this.timer.seconds;
    let newWidth = Math.max(0, (myTime / this.totalTime) * this.fullWidth);


		// this.sprite.crop(this.rect);
    
    // this.myTween = this.game.add.tween(this.sprite).to(
    //   { width: newWidth },  
    //   Phaser.Timer.SECOND, 
    //   Phaser.Easing.Linear.None,
    //   false,
    //   0,
    //   this.totalTime
    // ); 

    // this.myTween.onRepeat.add(function() { 
    //   this.currentTime -= 1;
    //   newWidth = Math.max(0, (this.currentTime / this.totalTime) * this.fullWidth);
    // }, this);

    // this.myTween.onComplete.add(function() {
    //   console.log('complete');
    // }, this)
    
    //this.myTween.start();
  }
}

export default VisualTimer;
