import VisibilityPolygon from 'systems/VisibilityPolygon';
import Segment from 'systems/Segment';

class LevelManager {
    constructor(client) {
        this.client = client;
        this.map = this.client.game.add.tilemap('lvl1');
        this.map.addTilesetImage('tiles', 'tiles');

        this.client.layers.background = this.map.createLayer('backgroundLayer');
        this.client.layers.collisions = this.map.createLayer('blockedLayer');        
        this.tiles = this.client.layers.background.getTiles(0, 0, this.client.game.width, this.client.game.height, true, true);
        this.segments = this.createSegmentsFromTiles();
        // this.vp = new VisibilityPolygon(this.segments, this.client.game.world.width, this.client.game.world.height);

    }

    getNormalizedPolygons() {
        let polygons, poly, lastPoly, nextPoly;
        polygons = [];

        if (this.map.objects.collision) {
            this.map.objects.collision.forEach(function(collision) {
                lastPoly = null;
                nextPoly = null;

                if (collision.rectangle) {
                    polygons.push({
                        a: {
                            x: collision.x, 
                            y: collision.y
                        }, 
                        b: {
                            x: collision.x + collision.width,
                            y: collision.y
                        }
                    })

                    polygons.push({
                        a: {
                            x: collision.x + collision.width, 
                            y: collision.y
                        }, 
                        b: {
                            x: collision.x + collision.width,
                            y: collision.y + collision.height
                        }
                    })

                    polygons.push({
                        a: {
                            x: collision.x + collision.width, 
                            y: collision.y + collision.height
                        }, 
                        b: {
                            x: collision.x,
                            y: collision.y + collision.height
                        }
                    })

                    polygons.push({
                        a: {
                            x: collision.x, 
                            y: collision.y + collision.height
                        }, 
                        b: {
                            x: collision.x, 
                            y: collision.y
                        }
                    })
                } else if (collision.polyline) {
                    for(let i = 0; i < collision.polyline.length; i++) {
                        poly = collision.polyline[i];
                        nextPoly = collision.polyline[i + 1];

                        if (!nextPoly) { continue; }

                        if (lastPoly) {
                            polygons.push({
                                a: {
                                    x: collision.x + lastPoly.x, 
                                    y: collision.y + lastPoly.y
                                }, 
                                b: {
                                    x: collision.x + poly[0], 
                                    y: collision.y + poly[1]
                                }
                            })
                        } else {
                            polygons.push({
                                a: {
                                    x: collision.x + poly[0], 
                                    y: collision.y + poly[1]
                                }, 
                                b: {
                                    x: collision.x + nextPoly[0], 
                                    y: collision.y + nextPoly[1]
                                }
                            })
                        }
                    }
                }
            })
        }
        return polygons;
    }

    createSegmentsFromTiles() {
        let segments = [], segment;

        this.tiles.forEach(function(tile) {
            if(!!tile.faceBottom) {
              segment = new Segment();
              segment.start.x = tile.left;
              segment.end.x = tile.right;
              segment.start.y = tile.bottom;
              segment.end.y = tile.bottom;
              segment.tile = tile;

              if(!(segment in segments)) {
                segments.push(this.calculateSegmentProperties(segment));
              }
            }

            if(!!tile.faceTop) {
              segment = new Segment();
              segment.start.x = tile.left;
              segment.end.x = tile.right;
              segment.start.y = tile.top;
              segment.end.y = tile.top;
              segment.tile = tile;

              if(!(segment in segments)) {
                segments.push(this.calculateSegmentProperties(segment));
              }
            }
            if(!!tile.faceLeft) {
              segment = new Segment();
              segment.start.x = tile.left;
              segment.end.x = tile.left;
              segment.start.y = tile.top;
              segment.end.y = tile.bottom;
              segment.tile = tile;

              if(!(segment in segments)) {
                segments.push(this.calculateSegmentProperties(segment));
              }
            }
            if(!!tile.faceRight) {
              segment = new Segment();
              segment.start.x = tile.right;
              segment.end.x = tile.right;
              segment.start.y = tile.top;
              segment.end.y = tile.bottom;
              segment.tile = tile;

              if(!(segment in segments)) {
                segments.push(this.calculateSegmentProperties(segment));
              }
            }

            return segments;
        }, this);

        return segments;
    }

    calculateSegmentProperties(segment) {
        segment.direction.x = segment.end.x - segment.start.x;
        segment.direction.y = segment.end.y - segment.start.y;
        segment.magnitude = Math.sqrt(Math.pow(segment.direction.x, 2) + Math.pow(segment.direction.y, 2));
        return segment;
    }
}

export default LevelManager;