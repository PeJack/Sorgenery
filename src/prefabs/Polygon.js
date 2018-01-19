let Polygon = function(game, x, y, size, points) {
    if (!points || points < 3) {
        points = 3;
    }

    this.game = game;
    this.size = size;
    this.points = points;

    this.vertices = [];
    this.angles = [];
    this.segments = [];
    this.bmd = this.game.make.bitmapData(this.size, this.size);

    Phaser.Sprite.call(this, game, x, y, this.bmd);
    this.anchor.setTo(0.5, 0.5);

    this.createAngles();
    this.makeTexture();
    this.createSegments();
};

Polygon.prototype = Object.create(Phaser.Sprite.prototype);
Polygon.prototype.constructor = Polygon;

Polygon.prototype.createAngles = function() {
    for (let i = 0; i < this.points; i++) {
        this.angles.push(this.game.rnd.realInRange(-Math.PI, Math.PI));
    }

    this.angles.sort(function(a, b) {
        if (a < 0) {
            a += Math.PI * 2;
        }

        if (b < 0) {
            b += Math.PI * 2;
        }
        return a - b;
    });
}

Polygon.prototype.makeTexture = function() {
    let ctx = this.bmd.ctx;
    let x, y;
    ctx.strokeStyle = '#5c5c5';
    ctx.fillStyle = '#5c5c5c';
    ctx.beginPath();

    for (let i = 0; i < this.angles.length; i++) {
        x = Math.round(this.size / 2 + Math.sin(this.angles[i]) * this.size / 2);
        y = Math.round(this.size / 2 + Math.cos(this.angles[i]) * this.size / 2);
        ctx.lineTo(x, y);
        this.vertices.push(new Phaser.Point(x,y));
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    this.bmd.render();
    this.bmd.update();
}

Polygon.prototype.createSegments = function() {
    var v1, v2, segment;
    for (var i = 0; i < this.vertices.length; i++) {
        //translate segments to be relative to world
        v1 = this.vertices[i];
        
        if (i === this.vertices.length - 1) {
            v2 = this.vertices[0];
        } else {
            v2 = this.vertices[i + 1];
        }
        var p1 = new Phaser.Point(this.world.x + v1.x - (this.width * this.anchor.x),this.world.y + v1.y - (this.height * this.anchor.y));
        var p2 = new Phaser.Point(this.world.x + v2.x - (this.width * this.anchor.x),this.world.y + v2.y - (this.height * this.anchor.y));
        // create new line segment
        segment = new Phaser.Line(p1.x,p1.y,p2.x,p2.y);
        this.segments.push(segment);
    }
}

// class Polygon {
//     constructor(game, x, y, size, points) {
//         if (!points || points < 3) {
//             points = 3;
//         }

//         this.game = game;
//         this.size = size;
//         this.points = points;

//         this.vertices = [];
//         this.angles = [];
//         this.segments = [];
//         this.bmd = this.game.make.bitmapData(this.size, this.size);

//         Phaser.Sprite.call(this, game, x, y, this.bmd);
//         this.anchor.setTo(0.5, 0.5);

//         this.createAngles();
//         this.makeTexture();
//         this.createSegments();
//     }

//     createAngles() {
//         for (let i = 0; i < this.points; i++) {
//             this.angles.push(this.game.rnd.realInRange(-Math.PI, Math.PI));
//         }

//         this.angles.sort(function(a, b) {
//             if (a < 0) {
//                 a += Math.PI * 2;
//             }

//             if (b < 0) {
//                 b += Math.PI * 2;
//             }
//             return a - b;
//         });
//     }

//     makeTexture() {
//         let ctx = this.bmd.ctx;
//         let x, y;
//         ctx.strokeStyle = '#5c5c5';
//         ctx.fillStyle = '#5c5c5c';
//         ctx.beginPath();

//         for (let i = 0; i < this.angles.length; i++) {
//             x = Math.round(this.size / 2 + Math.sin(this.angles[i]) * this.size / 2);
//             y = Math.round(this.size / 2 + Math.cos(this.angles[i]) * this.size / 2);
//             ctx.lineTo(x, y);
//             this.vertices.push(new Phaser.Point(x,y));
//         }

//         ctx.closePath();
//         ctx.stroke();
//         ctx.fill();

//         this.bmd.render();
//         // this.bmd.refreshBuffer();
//     }

//     createSegments() {
//         var v1, v2, segment;
//         for (var i = 0; i < this.vertices.length; i++) {
//             //translate segments to be relative to world
//             v1 = this.vertices[i];
            
//             if (i === this.vertices.length - 1) {
//                 v2 = this.vertices[0];
//             } else {
//                 v2 = this.vertices[i + 1];
//             }
            
//             var p1 = new Phaser.Point(this.game.world.x + v1.x - (this.width * this.anchor.x),this.game.world.y + v1.y - (this.height * this.anchor.y));
//             var p2 = new Phaser.Point(this.game.world.x + v2.x - (this.width * this.anchor.x),this.game.world.y + v2.y - (this.height * this.anchor.y));
//             // create new line segment
//             segment = new Phaser.Line(p1.x,p1.y,p2.x,p2.y);
//             this.segments.push(segment);
//         }
//     }
// }

export default Polygon;