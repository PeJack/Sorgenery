// import * as poly2tri from 'poly2tri'
// import Grid from 'systems/Grid'

// class VisibilityPolygon {
//     constructor(polygons) {
//         this.minX = 0;
//         this.minY = 0;
//         this.maxX = 0;
//         this.maxY = 0;
//         this.vec2cache = [];
//         this.created = 0;
//         this.computedPolygon = [];
//         this.templine = [];
//         this.heap = [];
//         this.polygons = polygons;
//         this.triangles = [];

//         this.initialize();
//         this.map = new Array(this.segments.length);
//         this.points = new Array(this.segments.length * 2);

//         this.PI = Math.PI;
//         this.PI2 = this.PI * 2;
//         this.PImin = -1 * this.PI;
//         this.epsilon = 0.0000001;
//     };

//     initialize() {
//         let segments = [];
//         let j, k, m;
//         let i = 0
//           , n = this.polygons.length;

//         while (i < n) {
//             let contour = [];
//             j = 0;
//             m = this.polygons[i].length;

//             while (j < m) {
//                 contour.push(new poly2tri.Point(this.polygons[i][j][0],this.polygons[i][j][1]));
//                 k = j + 1;

//                 if (k === this.polygons[i].length) {
//                     k = 0;
//                 }

//                 if (this.polygons[i][j][0] < this.minX) {
//                     this.minX = this.polygons[i][j][0];
//                 }

//                 if (this.polygons[i][j][0] > this.maxX) {
//                     this.maxX = this.polygons[i][j][0];
//                 }
                
//                 if (this.polygons[i][j][1] < this.inY) {
//                     this.minY = this.polygons[i][j][1];
//                 }

//                 if (this.polygons[i][j][1] > this.maxY) {
//                     this.maxY = this.polygons[i][j][1];
//                 }

//                 segments.push([this.polygons[i][j], this.polygons[i][k]]);
//                 j += 1;
//             }

//             if (i !== 0) {
//                 let swctx = new poly2tri.SweepContext(contour);
//                 swctx.triangulate();
//                 let triangles = swctx.getTriangles();
//                 this.triangles = this.triangles.concat(triangles);
//             }

//             i += 1;
//         }

//         this.segments = segments;
//         this.grid = new Grid({
//             x: 0,
//             y: 0,
//             width: 2048,
//             height: 2048
//         },16,16);

//         let self = this;

//         this.mytriangles = [];
//         this.triangles.forEach(function(t) {
//             let minx = self.maxX
//               , maxx = 0
//               , miny = self.maxY
//               , maxy = 0;
//             let mytri = [];

//             t.getPoints().forEach(function(p) {
//                 if (p.x < minx) {
//                     minx = p.x;
//                 }

//                 if (p.x > maxx) {
//                     maxx = p.x;
//                 }

//                 if (p.y < miny) {
//                     miny = p.y;
//                 }

//                 if (p.y > maxy) {
//                     maxy = p.y;
//                 }

//                 mytri.push(self.getVec2(p.x, p.y));
//             });

//             self.mytriangles.push(mytri);
//         });

//         i = 0;
//         n = this.mytriangles.length;
//         while (i < n) {
//             let t = this.mytriangles[i];

//             j = 0;
//             m = t.length;
            
//             while (j < m) {
//                 k = j + 1;
//                 if (k === m) {
//                     k = 0;
//                 }
//                 this.grid.insert({
//                     fromX: t[j][0],
//                     fromY: t[j][1],
//                     toX: t[k][0],
//                     toY: t[k][1],
//                     mytriangle: t,
//                     id: i
//                 });
//                 j++;
//             }
//             i++;
//         }
//         return segments;
//     }

//     getVec2(x, y) {
//         let v = this.vec2cache.pop();

//         if (!v) {
//             v = [x, y];
//             this.created++;
//         } else {
//             v[0] = x;
//             v[1] = y;
//         }

//         return v;
//     };

//     freeVec2(vec2) {
//         this.vec2cache.push(vec2);
//     };

//     clearComputedPolygon() {
//         let v = this.computedPolygon.pop();

//         while (v) {
//             this.freeVec2(v);
//             v = this.computedPolygon.pop();
//         }
//     };

//     compute(position) {
//         this.clearComputedPolygon();
//         this.sortPoints(position);
//         let i = 0
//           , n = this.map.length;

//         while (i < n) {
//             this.map[i] = -1;
//             i += 1;
//         }

//         while (this.heap.length > 0) {
//             this.heap.pop();
//         }

//         let start = [position[0] + 1, position[1]];
//         i = 0;
//         n = this.segments.length;

//         while (i < n) {
//             let a1 = this.angle(this.segments[i][0], position);
//             let a2 = this.angle(this.segments[i][1], position);

//             if ((a1 > this.PImin && a1 <= 0 && a2 <= this.PI && a2 >= 0 && a2 - a1 > this.PI) || (a2 > this.PImin && a2 <= 0 && a1 <= this.PI && a1 >= 0 && a1 - a2 > this.PI)) {
//                 this.insert(i, this.heap, position, this.segments, start, this.map);
//             }
//             i += 1;
//         }

//         i = 0;
//         n = this.points.length;

//         while (i < n) {
//             let extend = false;
//             let shorten = false;
//             let orig = i;
//             let vertex = this.segments[this.points[i][0]][this.points[i][1]];
            
//             let old_segment = this.heap[0];
//             do {
//                 if (this.map[this.points[i][0]] !== -1) {
//                     if (this.points[i][0] === old_segment) {
//                         extend = true;
//                         vertex = this.segments[this.points[i][0]][this.points[i][1]];
//                     }
//                     this.remove(this.map[this.points[i][0]], this.heap, position, this.segments, vertex, this.map);
//                 } else {
//                     this.insert(this.points[i][0], this.heap, position, this.segments, vertex, this.map);
//                     if (this.heap[0] !== old_segment) {
//                         shorten = true;
//                     }
//                 }
//                 ++i;
//                 if (i === this.points.length) {
//                     break;
//                 }
//             } while (this.points[i][2] < this.points[orig][2] + this.epsilon);
            
//             if (extend) {
//                 this.computedPolygon.push(this.getVec2(vertex[0], vertex[1]));
//                 let cur = this.intersectLines(this.segments[this.heap[0]][0], this.segments[this.heap[0]][1], position, vertex);
//                 if (!this.equal(cur, vertex)) {
//                     this.computedPolygon.push(cur);
//                 } else if (cur !== false) {
//                     this.freeVec2(cur);
//                 }
//             } else if (shorten) {
//                 this.computedPolygon.push(this.intersectLines(this.segments[old_segment][0], this.segments[old_segment][1], position, vertex));
//                 this.computedPolygon.push(this.intersectLines(this.segments[this.heap[0]][0], this.segments[this.heap[0]][1], position, vertex));
//             }
//         }
//         return this.computedPolygon;
//     }

//     inPolygon(position, polygon) {
//         let val = 0
//           , i = 0
//           , n = polygon.length;

//         while (i < n) {
//             val = Math.min(polygon[i][0], polygon[i][1], val);
//             i += 1;
//         }

//         let edge = this.getVec2(val - 1, val - 1);
//         let parity = 0;

//         i = 0;
//         n = polygon.length;

//         while (i < n) {
//             let j = i + 1;
//             if (j === polygon.length) {
//                 j = 0;
//             }
//             if (this.doLineSegmentsIntersect(edge[0], edge[1], position[0], position[1], polygon[i][0], polygon[i][1], polygon[j][0], polygon[j][1])) {
//                 let intersect = this.intersectLines(edge, position, polygon[i], polygon[j]);
//                 if (this.equal(position, intersect)) {
//                     this.freeVec2(intersect);
//                     this.freeVec2(edge);
//                     return true;
//                 }
//                 if (this.equal(intersect, polygon[i])) {
//                     if (this.angle2(position, edge, polygon[j]) < this.PI) {
//                         ++parity;
//                     }
//                 } else if (this.equal(intersect, polygon[j])) {
//                     if (this.angle2(position, edge, polygon[i]) < this.PI) {
//                         ++parity;
//                     }
//                 } else {
//                     ++parity;
//                 }
//                 this.freeVec2(intersect);
//             }
//             i += 1;
//         }

//         this.freeVec2(edge);
//         return (parity % 2) !== 0;
//     }

//     equal(a, b) {
//         return Math.abs(a[0] - b[0]) < this.epsilon && Math.abs(a[1] - b[1]) < this.epsilon;
//     }

//     remove(index, heap, position, segments, destination, map) {
//         map[heap[index]] = -1;
//         if (index === heap.length - 1) {
//             heap.pop();
//             return;
//         }

//         heap[index] = heap.pop();
//         map[heap[index]] = index;

//         let cur = index;
//         let parent = this.parent(cur);
//         let temp;

//         if (cur !== 0 && this.lessThan(heap[cur], heap[parent], position, segments, destination)) {
//             while (cur > 0) {
//                 parent = this.parent(cur);
//                 if (!this.lessThan(heap[cur], heap[parent], position, segments, destination)) {
//                     break;
//                 }
//                 map[heap[parent]] = cur;
//                 map[heap[cur]] = parent;
//                 temp = heap[cur];
//                 heap[cur] = heap[parent];
//                 heap[parent] = temp;
//                 cur = parent;
//             }
//         } else {
//             while (true) {
//                 let left = this.child(cur);
//                 let right = left + 1;
//                 if (left < heap.length && this.lessThan(heap[left], heap[cur], position, segments, destination) && (right === heap.length || this.lessThan(heap[left], heap[right], position, segments, destination))) {
//                     map[heap[left]] = cur;
//                     map[heap[cur]] = left;
//                     temp = heap[left];
//                     heap[left] = heap[cur];
//                     heap[cur] = temp;
//                     cur = left;
//                 } else if (right < heap.length && this.lessThan(heap[right], heap[cur], position, segments, destination)) {
//                     map[heap[right]] = cur;
//                     map[heap[cur]] = right;
//                     temp = heap[right];
//                     heap[right] = heap[cur];
//                     heap[cur] = temp;
//                     cur = right;
//                 } else {
//                     break;
//                 }
//             }
//         }
//     }

//     insert(index, heap, position, segments, destination, map) {
//         let intersect = this.intersectLines(segments[index][0], segments[index][1], position, destination);

//         if (intersect === false) {
//             return;
//         }
//         this.freeVec2(intersect);
//         let cur = heap.length;
//         heap.push(index);

//         map[index] = cur;
//         while (cur > 0) {
//             let parent = this.parent(cur);

//             if (!this.lessThan(heap[cur], heap[parent], position, segments, destination)) {
//                 break;
//             }

//             map[heap[parent]] = cur;
//             map[heap[cur]] = parent;

//             let temp = heap[cur];

//             heap[cur] = heap[parent];
//             heap[parent] = temp;
//             cur = parent;
//         }
//     }

//     lessThan(index1, index2, position, segments, destination) {
//         let inter1 = this.intersectLines(segments[index1][0], segments[index1][1], position, destination);
//         let inter2 = this.intersectLines(segments[index2][0], segments[index2][1], position, destination);
        
//         if (!this.equal(inter1, inter2)) {
//             let d1 = this.distance(inter1, position);
//             let d2 = this.distance(inter2, position);
//             this.freeVec2(inter1);
//             this.freeVec2(inter2);
//             return d1 < d2;
//         }

//         let end1 = 0;
//         if (this.equal(inter1, segments[index1][0])) {
//             end1 = 1;
//         }

//         let end2 = 0;
//         if (this.equal(inter2, segments[index2][0])) {
//             end2 = 1;
//         }

//         let a1 = this.angle2(segments[index1][end1], inter1, position);
//         let a2 = this.angle2(segments[index2][end2], inter2, position);
        
//         this.freeVec2(inter1);
//         this.freeVec2(inter2);

//         if (a1 < this.PI) {
//             if (a2 > this.PI) {
//                 return true;
//             }
//             return a2 < a1;
//         }

//         return a1 < a2;
//     }

//     parent(index) {
//         return Math.floor((index - 1) / 2);
//     }

//     child(index) {
//         return 2 * index + 1;
//     }

//     angle2(a, b, c) {
//         let a1 = this.angle(a, b);
//         let a2 = this.angle(b, c);
//         let a3 = a1 - a2;

//         if (a3 < 0) {
//             a3 += this.PI2;
//         }

//         if (a3 > this.PI2) {
//             a3 -= this.PI2;
//         }
        
//         return a3;
//     }

//     sortPoints(position) {
//         let i = 0
//           , n = this.segments.length;

//         while (i < n) {
//             for (let j = 0; j < 2; ++j) {
//                 let a = this.angle(this.segments[i][j], position);
//                 if (this.points[2 * i + j]) {
//                     this.points[2 * i + j][0] = i;
//                     this.points[2 * i + j][1] = j;
//                     this.points[2 * i + j][2] = a;
//                 } else {
//                     this.points[2 * i + j] = [i, j, a];
//                 }
//             }
//             i += 1;
//         }

//         this.points = this.points;
//     }

//     angle(a, b) {
//         return Math.atan2(b[1] - a[1], b[0] - a[0]);
//     }

//     intersectLines(a1, a2, b1, b2) {
//         let ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
//         let u_b = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
        
//         if (u_b !== 0) {
//             let ua = ua_t / u_b;
//             return this.getVec2(a1[0] - ua * (a1[0] - a2[0]), a1[1] - ua * (a1[1] - a2[1]));
//         }

//         return false;
//     }

//     intersectLines2(a1, a2, b1, b2) {
//         let ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
//         let ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
//         let u_b = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
        
//         if (u_b !== 0) {
//             let ua = ua_t / u_b;
//             let ub = ub_t / u_b;

//             if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
//                 return this.getVec2(a1[0] + -1 * ua * (a1[0] - a2[0]), a1[1] + -1 * ua * (a1[1] - a2[1]));
//             }
//         }
//         return false;
//     }

//     distance(a, b) {
//         let dx = a[0]-b[0];
//         let dy = a[1]-b[1];
//         return dx * dx + dy * dy;
//     }

//     isOnSegment(xi, yi, xj, yj, xk, yk) {
//         return (xi <= xk || xj <= xk) && (xk <= xi || xk <= xj) && (yi <= yk || yj <= yk) && (yk <= yi || yk <= yj);
//     }

//     computeDirection(xi, yi, xj, yj, xk, yk) {
//         let a = (xk - xi) * (yj - yi);
//         let b = (xj - xi) * (yk - yi);
//         return a < b ? -1 : a > b ? 1 : 0;
//     }

//     doLineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
//         let d1 = this.computeDirection(x3, y3, x4, y4, x1, y1);
//         let d2 = this.computeDirection(x3, y3, x4, y4, x2, y2);
//         let d3 = this.computeDirection(x1, y1, x2, y2, x3, y3);
//         let d4 = this.computeDirection(x1, y1, x2, y2, x4, y4);

//         return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) || (d1 === 0 && this.isOnSegment(x3, y3, x4, y4, x1, y1)) || (d2 === 0 && this.isOnSegment(x3, y3, x4, y4, x2, y2)) || (d3 === 0 && this.isOnSegment(x1, y1, x2, y2, x3, y3)) || (d4 === 0 && this.isOnSegment(x1, y1, x2, y2, x4, y4));
//     }

//     lineSegmentDistance(point, line) {
//         let v = line[0], w = line[1], d, t;

//         return (d = this.distance(v, w)) ? ((t = ((point[0] - v[0]) * (w[0] - v[0]) + (point[1] - v[1]) * (w[1] - v[1])) / d) < 0 ? this.getVec2(v[0], v[1]) : t > 1 ? this.getVec2(w[0], w[1]) : this.getVec2(v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]))) : this.getVec2(v[0], v[1]);
//     }

//     subtract(v1, v2) {
//         return this.getVec2(v1[0] - v2[0], v1[1] - v2[1]);
//     }

//     len(v) {
//         return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
//     }

//     sqrlen(v) {
//         return v[0] * v[0] + v[1] * v[1];
//     }

//     dot(v1, v2) {
//         return v1[0] * v2[0] + v1[1] * v2[1];
//     }

//     circleIntersectsPolygon(circle, polygon) {
//         if (this.inPolygon(circle, polygon)) {
//             return true;
//         }

//         let closest;
//         let dist_v;
//         let dist_v_len;
//         let i = 0
//           , n = polygon.length;

//         while (i < n) {
//             let k = i + 1;

//             if (k === n) {
//                 k = 0;
//             }

//             this.templine[0] = polygon[i];
//             this.templine[1] = polygon[k];

//             closest = this.lineSegmentDistance(circle, this.templine);
//             dist_v = this.subtract(circle, closest);
//             dist_v_len = this.len(dist_v);
            
//             this.freeVec2(closest);

//             if (dist_v_len <= 0) {
//                 this.freeVec2(dist_v);
//                 return true;
//                 // deny move
//             }

//             if (dist_v_len < circle[2]) {
//                 dist_v[0] = dist_v[0] / dist_v_len * (circle[2] - dist_v_len);
//                 dist_v[1] = dist_v[1] / dist_v_len * (circle[2] - dist_v_len);
//                 return dist_v;
//             }

//             this.freeVec2(dist_v);
//             i += 1;
//         }
//         return false;
//     }

//     circleLineIntersection(circle, line) {
//         let closest;
//         let dist_v;
//         let dist_v_len;
//         let rr = circle[2] * circle[2];

//         closest = this.lineSegmentDistance(circle, line);
//         dist_v = this.subtract(circle, closest);
//         dist_v_len = this.sqrlen(dist_v);

//         this.freeVec2(dist_v);
//         if (dist_v_len < rr) {
//             // hit
//             return closest;
//         } else {
//             this.freeVec2(closest);
//             return false;
//         }
//     }

//     firstIntersection(line) {
//         let segment, inter, bestInter, maxDist, dist;
//         let segments = this.segments;

//         bestInter = [];
//         maxDist = -1;

//         let i = 0
//           , n = segments.length;

//         while (i < n) {
//             segment = segments[i];
//             inter = this.intersectLines2(line[0], line[1], segment[0], segment[1]);
//             if (inter !== false) {
//                 // we have an intersection that is on our line
//                 dist = this.distance(line[0], inter);
//                 // line[0],inter);
//                 if (maxDist === -1 || dist < maxDist) {
//                     bestInter[0] = inter[0];
//                     bestInter[1] = inter[1];
//                     maxDist = dist;
//                 }
//                 this.freeVec2(inter);
//             }
//             i += 1;
//         }

//         return bestInter;
//     }
// }