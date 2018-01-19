class Cell {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.items = [];
    }

    insert(item) {
        if ((item.fromX >= this.x && item.fromY >= this.y && item.toX <= this.x + this.width && item.toY <= this.y + this.height) || this.intersect(item.fromX, item.fromY, item.toX, item.toY, this.x, this.y, this.x + this.width, this.y) || this.intersect(item.fromX, item.fromY, item.toX, item.toY, this.x, this.y, this.x, this.y + this.height) || this.intersect(item.fromX, item.fromY, item.toX, item.toY, this.x + this.width, this.y, this.x + this.width, this.y + this.height) || this.intersect(item.fromX, item.fromY, item.toX, item.toY, this.x, this.y + this.height, this.x + this.width, this.y + this.height)) {
            this.items.push(item);
        }
    }

    intersect(a10, a11, a20, a21, b10, b11, b20, b21) {
        let ua_t = (b20 - b10) * (a11 - b11) - (b21 - b11) * (a10 - b10);
        let ub_t = (a20 - a10) * (a11 - b11) - (a21 - a11) * (a10 - b10);
        let u_b = (b21 - b11) * (a20 - a10) - (b20 - b10) * (a21 - a11);
        
        if (u_b !== 0) {
            let ua = ua_t / u_b;
            let ub = ub_t / u_b;
            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                return true;
            }
        }

        return false;
    };
}

export default Cell;