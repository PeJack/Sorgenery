import Cell             from 'systems/Cell';
import DoublyLinkedList from 'systems/DoublyLinkedList';

class Grid {
    constructor(bounds, rows, cols) {
        this.bounds = bounds;
        this.rows = rows;
        this.cols = cols;
        this.cellX = this.bounds.width / this.cols;
        this.cellY = this.bounds.height / this.rows;
        this.cells = [];
        this.out = new DoublyLinkedList();
        for (let col = 0; col < this.cols; col++) {
            this.cells[col] = [];
            for (let row = 0; row < this.rows; row++) {
                this.cells[col][row] = new Cell(col * this.cellX,row * this.cellY,this.cellX,this.cellY);
            }
        }
    }

    insert(item) {
        if (item instanceof Array) {
            let i = 0
              , n = item.length;

            while (i < n) {
                this.insert(item);
                i++;
            }
        } else {
            for (let col = 0; col < this.cols; col++) {
                for (let row = 0; row < this.rows; row++) {
                    this.cells[col][row].insert(item);
                }
            }
        }
    }

    addOut(items) {
        let i = 0
          , n = items.length;

        while (i < n) {
            this.out.add(items[i]);
            i++;
        }
    }

    retrieve(item) {
        // figure out cells
        let nx = ((item.x % this.cellX) + item.width) > this.cellX ? true : false
          , ny = ((item.y % this.cellY) + item.height) > this.cellY ? true : false
          , x = Math.floor(item.x / this.cellX)
          , y = Math.floor(item.y / this.cellY);

        this.out.clear();

        this.addOut(this.cells[x][y].items);

        if (nx) {
            this.addOut(this.cells[x + 1][y].items);
        }
        if (ny) {
            this.addOut(this.cells[x][y + 1].items);
        }
        if (nx && ny) {
            this.addOut(this.cells[x + 1][y + 1].items);
        }

        return this.out;
    }
}

export default Grid;