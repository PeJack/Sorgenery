import Segment from 'systems/Segment';

class VisibilityPolygon {
    constructor(segments, worldWidth, worldHeight) {
        this.segments = segments
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    getIntersection(ray, segment){
        let r_px = ray.a.x;
        let r_py = ray.a.y;
        let r_dx = ray.b.x - ray.a.x;
        let r_dy = ray.b.y - ray.a.y;

        let s_px = segment.a.x;
        let s_py = segment.a.y;
        let s_dx = segment.b.x - segment.a.x;
        let s_dy = segment.b.y - segment.a.y;

        let r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        let s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);

        if(r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag){
            return null;
        }

        let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        let T1 = (s_px + s_dx * T2 - r_px) / r_dx;

        if(T1 < 0) return null;
        if(T2 < 0 || T2 > 1) return null;

        return {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1
        };
    }

	isInPolygon(point,polygon){
		let ray = {
			a: {x: point.x, y: point.y},
			b: {x: point.x+1, y: point.y}
		};

		let numIntersections = 0;
		for (let i=0; i < polygon.length; i++){
			let startPoint = polygon[i];
			let endPoint = (i == polygon.length - 1) ? polygon[0] : polygon[i + 1];
			let segment = {
				ax: startPoint.x, ay: startPoint.y,
				bx: endPoint.x, by: endPoint.y
            };
            
			if (getIntersection(ray,segment)){
				numIntersections++;
			}
		}

		return (numIntersections%2==1);
    }
    
    createSegmentFromRay(ray) {
        let segment = new Segment();

        segment.start = ray.start;
        segment.end = ray.end;
        segment.direction.x = segment.end.x - segment.start.x;
        segment.direction.y = segment.end.y - segment.start.y;
        segment.magnitude = Math.sqrt(Math.pow(segment.direction.x, 2) + Math.pow(segment.direction.y, 2));

        return segment;
    }

    getClosestIntersection(ray) {
        let intersection = null;
        let closestIntersection;
        let raySegment = this.createSegmentFromRay(ray);
        let angles = [];

        this.segments.forEach(function(tileSegment) {
          if(raySegment.direction.x/raySegment.magnitude === tileSegment.direction.x / tileSegment.magnitude && raySegment.direction.y / raySegment.magnitude === tileSegment.direction.y / tileSegment.magnitude) {
            return null;
          }
  
          let T2 = (raySegment.direction.x * (tileSegment.start.y - raySegment.start.y) + raySegment.direction.y * (raySegment.start.x - tileSegment.start.x))/(tileSegment.direction.x * raySegment.direction.y - tileSegment.direction.y*raySegment.direction.x);
          let T1 = (tileSegment.start.x + tileSegment.direction.x * T2 - raySegment.start.x) / raySegment.direction.x;
  
          if(T1 < 0) {
            return null;
          }
          if(T2 < 0 || T2 > 1) {
            return null;
          }
          
          intersection = {
            x: raySegment.start.x + raySegment.direction.x * T1,
            y: raySegment.start.y + raySegment.direction.y * T1,
            tile: tileSegment.tile
          };
  
          intersection.direction = {
            x: intersection.x - raySegment.start.x,
            y: intersection.y - raySegment.start.y,
          };
  
          intersection.magnitude = Math.sqrt(Math.pow(intersection.direction.x,2) + Math.pow(intersection.direction.y,2));
          
          if (!closestIntersection) {
            closestIntersection = intersection;
          } else if (closestIntersection.magnitude > intersection.magnitude) {
            closestIntersection = intersection;
          }
        },this);

        return closestIntersection;
    }

    compute(position) {
        let intersections = [];
        let uniqueAngles = [];
        let j;
        let points = (function(segments) {
          let a = [];
          segments.forEach(function(segment) {
            a.push(segment.start, segment.end);
          });
          return a;
        })(this.segments);

        let uniquePoints = (function(points) {
          let set = {};
          return points.filter(function(point) {
            let key = point.x + ',' + point.y;

            if(key in set) {
              return false;
            } else {
              set[key] = true;
              return true;
            }
          });
        })(points);
  
        for(j = 0; j < uniquePoints.length; j++) {
          let uniquePoint = uniquePoints[j];
          let angle = Math.atan2(uniquePoint.y - position.y, uniquePoint.x - position.x);
          
          uniquePoint.angle = angle;
          uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
        }
  
        for(j = 0; j < uniqueAngles.length; j++) {
          let angle = uniqueAngles[j];
          let dx = Math.cos(angle);
          let dy = Math.sin(angle);
          ray.start.set(position.x, position.y);
          ray.end.set(position.x + dx, position.y + dy);
          let intersection = this.getClosestIntersection(ray);

          if(!!intersection && intersection.x > 0 && intersection.x < this.worldWidth && intersection.y > 0 && intersection.y < this.worldHeight) {
            intersection.angle = angle;
            intersections.push(intersection);
          }
        }

        intersections = intersections.sort(function(a,b){
            return a.angle - b.angle;
        });
  
        return intersections;
    }

}

export default VisibilityPolygon;