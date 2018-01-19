import Player from 'objects/Player';
import InputHandler from 'objects/InputHandler';
import LevelManager from 'systems/LevelManager';
import Polygon from 'prefabs/Polygon';

class Client extends Phaser.State {
    
  preload() {
    this.layers = {};
    this.running = false;
    this.tilesize = 48;
    this.positionUpdated = false;
  }

  create() {
    this.bmd = this.game.make.bitmapData(20, 20);
    // this.makeTexture(this.bmd, 10, '#fff');

    this.origin = new Phaser.Point(this.game.width / 2,this.game.height / 2);

    this.fill = this.game.make.bitmapData(this.game.width, this.game.height);
    this.fillSprite = this.game.add.sprite(0, 0, this.fill);

    //this.levelManager = new LevelManager(this);
    this.buttonHandler = this.game.buttonHandler;
    this.inputHandler = new InputHandler(this);

    this.layers.world = this.game.add.group();
    this.layers.entities = this.game.add.group();
    this.layers.polygons = this.game.add.group();

    this.worldSegments = [];
    this.createWorldSegments();

    this.player = new Player(this);
    this.player.sprite.x = this.origin.x;
    this.player.sprite.y = this.origin.y;
    this.player.sprite.inputEnabled = true;
    this.game.physics.arcade.enable(this.player.sprite);
    this.game.camera.follow(this.player.sprite);

    //this.layers.world.add(this.layers.background);
    //this.layers.background.addChild(this.layers.entities);
    //this.layers.background.resizeWorld();
    //this.layers.background.wrap = true;

    //this.visibility = this.game.add.graphics(0,0);
    //this.layers.background.mask = this.visibility;

    this.run();
  }

  run() {
    this.layers.polygons.removeAll(true);
    this.createPolygons(20);
    this.updateVisibility();
  }

  update() {
    this.inputHandler.update();

    if (this.positionUpdated) {
      this.updateVisibility();
      this.positionUpdated = false;
    }
  }

  createWorldSegments() {
    this.worldSegments.push(new Phaser.Line(0, 0, this.world.width, 0));
    this.worldSegments.push(new Phaser.Line(this.world.width, 0, this.world.width, this.world.height));
    this.worldSegments.push(new Phaser.Line(this.world.width, this.world.height, 0, this.world.height));
  }

  createPolygons(count) {
    let poly;
    for (let i = 0; i < count; i++) {
        poly = new Polygon(this.game, this.game.world.randomX, this.game.world.randomY, 100 ,this.game.rnd.integerInRange(3, 10));
        this.layers.polygons.add(poly);
    }
  }

  updateVisibility() {
    this.rays = [];
    this.intersects = [];

    this.castRays();
    this.getIntersects();
    this.sortIntersects();
    this.makeFillTexture();
  }

  castRays() {
    let rays = [], segment;

    this.layers.polygons.forEach(function(poly) {
        let i, j, x, y, angle;
        for (i = 0; i < poly.segments.length; i++) {
            segment = poly.segments[i];
            rays = this.createRaysFromSegment(segment);
            this.rays = this.rays.concat(rays);
        }
    }, this);

    for (let i = 0; i < this.worldSegments.length; i++) {
        segment = this.worldSegments[i];
        rays = this.createRaysFromSegment(segment);
        this.rays = this.rays.concat(rays);
    }
  }

  createRaysFromSegment(segment) {
    let rays = [];
    let j, x, y, angle, theta, ray;

    theta = Phaser.Point.angle(this.player.sprite.world, segment.start);
    
    for (j = -1; j <= 1; j++) {
        angle = theta + (j * 0.00001);
        x = this.player.sprite.world.x - Math.cos(angle) * 1000;
        y = this.player.sprite.world.y - Math.sin(angle) * 1000;
        
        ray = new Phaser.Line(this.player.sprite.world.x, this.player.sprite.world.y, x, y);
        rays.push(ray);
    }

    theta = Phaser.Point.angle(this.player.sprite.world, segment.end);
    for (j = -1; j <= 1; j++) {
        angle = theta + (j * 0.00001);
        x = this.player.sprite.world.x - Math.cos(angle) * 1000;
        y = this.player.sprite.world.y - Math.sin(angle) * 1000;
        
        ray = new Phaser.Line(this.player.sprite.world.x, this.player.sprite.world.y, x, y);
        rays.push(ray);
    }

    return rays;
  }

  getIntersects() {
    let ray, poly, segment, intersect, closestIntersect, intersectDistance;

    this.intersects = [];

    for (let i = 0; i < this.rays.length; i++) {
        ray = this.rays[i];
        closestIntersect = {
          distance: null,
          angle: ray.angle,
          point: null
        };

        this.layers.polygons.forEach(function(poly) {
          for (let k = 0; k < poly.segments.length; k++) {
            segment = poly.segments[k];

            if (intersect = Phaser.Line.intersects(ray, segment)) {
              
              intersectDistance = Phaser.Point.distance(ray.start, intersect);
              if (!closestIntersect.distance || intersectDistance < closestIntersect.distance) {
                closestIntersect.distance = intersectDistance;
                closestIntersect.point = intersect;
              }
            }
          }
        });

        if (!closestIntersect.point) {
          closestIntersect.point = ray.end;
        }

        this.intersects.push(closestIntersect);
    }
  }

  sortIntersects() {
    this.intersects.sort(function(a, b) {
        let at = a.angle;
        let bt = b.angle;

        if (at < 0) {
            at += Math.PI * 2;
        }
        if (bt < 0) {
            bt += Math.PI * 2;
        }
        return at - bt;
    });
  }

  makeTexture(bmd, size, color) {
    let ctx = bmd.ctx;
    let i, x, y;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.translate(size, size);

    ctx.arc(0, 0, size - 3, 0, Math.PI * 2);
    ctx.fill();

    for (i = 0; i < Math.PI * 2; i += Math.PI / 8) {
        ctx.beginPath();
        x = Math.cos(i) * size;
        y = Math.sin(i) * size;
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
    }
    bmd.render();
    bmd.update();
  }

  makeFillTexture() {
    this.fill.clear();
    // this.visibility.clear();

    let ctx = this.fill.ctx;
    let intersect, x, y;
    let points = [];

    let grd = ctx.createRadialGradient(this.player.sprite.x, this.player.sprite.y, 10, this.player.sprite.x, this.player.sprite.y, 500);
    // light blue
    grd.addColorStop(0, '#8ED6FF');
    // dark blue
    grd.addColorStop(0.5, '#004CB3');
    grd.addColorStop(1, '#000');

    ctx.fillStyle = grd;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < this.intersects.length; i++) {
        intersect = this.intersects[i];
        x = intersect.point.x;
        y = intersect.point.y;
        ctx.lineTo(x, y);
    }

    ctx.fill();
    ctx.closePath();
    this.fill.render();
    this.fill.update();
  }

  render() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#a7aebe");
  }

  drawVisibilityPoly() {
    this.graphics.clear();

    let points = [];
    this.intersects.forEach(function(intersect) {
      points.push(intersect.x, intersect.y);
    });
    let poly = new Phaser.Polygon(points);
    
    this.graphics.beginFill(0xFF0000);

    this.graphics.drawPolygon(poly);
  }

  // drawVisibilityPolygon(position) {
  //   this.visibility.clear();

  //   let fuzzyRadius = 10;
  //   this.visiblePolygons = this.levelManager.vp.compute(position);
  //   // for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI*2) / 10){
  //   //   let dx = Math.cos(angle) * fuzzyRadius;
  //   //   let dy = Math.sin(angle) * fuzzyRadius;
  //   //   let newPos = {x: position.x + dx, y: position.y + dy};
  //   //   this.visiblePolygons.push(this.levelManager.vp.compute(newPos));
  //   // };

  //   // this.visibility.beginFill();

  //   // this.visibility.moveTo(this.visiblePolygons[0].x, this.visiblePolygons[0].y);

  //   // for (let i = 0; i < this.visiblePolygons.length; i++) {
  //   //   this.visibility.lineTo(this.visiblePolygons[i].x, this.visiblePolygons[i].y);
  //   // }

  //   // this.visibility.endFill();

  //   let points = [];
  //   this.visiblePolygons.forEach(function(poly) {
  //     points.push(poly.x, poly.y);
  //   });

  //   let visiblePolygon = new Phaser.Polygon(points);

  //   this.visibility.beginFill(0xFF0000);
  //   this.visibility.drawPolygon(visiblePolygon);
  // }
}

export default Client;