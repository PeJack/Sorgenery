import Helpers from '../Helpers';

class Inventory {
  constructor(client, actor) {
    this.client = client;
    this.actor  = actor;
    this.group  = this.client.layers.hud;
    
    this.pending = [];
    this.items = [];
    this.slots = 15;

    this.padding = 2;
    this.iconSize = 40;
    this.cols = 5;
    
    this.width = 
      (this.iconSize * this.cols) + 
      (this.padding * this.cols) + 
      this.padding;
    
    this.height =
      (this.iconSize * 
      Math.ceil(this.slots / this.cols)) +
      this.padding *
      Math.ceil(this.slots / this.cols) +
      this.padding;
    
    // let headerGraphics = this.client.game.make.bitmapData(this.width, 20);
    // headerGraphics.ctx.fillStyle = '#111111';
    // headerGraphics.ctx.fillRect(0, 0, this.width, 12);
    this.header = this.group.create(window.screen.width - (this.width + 90), 30, "inventory", 1);
    this.header.width = this.width + 90;
    this.header.fixedToCamera = true;
    this.header.inputEnabled = true;
    this.header.input.enableDrag();
    this.header.input.useHandCursor = true;

    let bgGraphics  = this.client.game.make.bitmapData(this.width, this.height);
    // bgGraphics.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    // bgGraphics.ctx.fillRect(0, 0, this.width, this.height);
    this.background = this.group.create(this.header.x + 18, this.header.y + 30, bgGraphics);
    this.background.width = this.width + 50;
    this.background.height = this.height + 15;  

    this.background.fixedToCamera = true;
    this.background.slots = [];
    this.background.items = [];

    this.fakeBg = this.group.create(this.header.x - 4, this.header.y + 30, "inventory", 0);
    this.fakeBg.width = this.width + 100;
    this.fakeBg.height = this.height + 35;
    this.fakeBg.fixedToCamera = true;

    this.background.bringToTop();

    this.header.events.onDragUpdate.add(function(sprite, pointer, dragX, dragY) {
      this.background.cameraOffset.setTo(sprite.cameraOffset.x + 18, sprite.cameraOffset.y + 30);
      this.fakeBg.cameraOffset.setTo(sprite.cameraOffset.x - 4, sprite.cameraOffset.y + 30);
    }, this);


    let count = 0;
    for (let y = this.padding + 5; y < this.height; y += this.iconSize + this.padding) {
      for (let x = this.padding; x < this.width; x += this.iconSize + this.padding) {
        if (count < this.slots) {
          if (count < 5) {
            let index = count + 3 == 6 ? 5 : count + 3 > 6 ? count + 2 : count  + 3;
            let decor = this.client.game.add.sprite(x, y + 2, "inventory", index);
            decor.alpha = 0.1;
            decor.width = this.iconSize;
            decor.height = this.iconSize - 5;
            this.background.addChild(decor);
          }

          let slot = this.client.game.add.sprite(x, y, "inventory", count < 5 ? 15 : 16);
 
          slot.width = this.iconSize;
          slot.height = this.iconSize;
          slot.special = count < 5;

          this.background.addChild(slot);
          this.background.slots.push(slot);

          count += 1;
        }
      }
    }

    let text = this.client.game.add.text(this.padding + 20, this.padding + 10, "Инвентарь", {font: '14px Courier New', fill: '#ffffff'});
    this.header.addChild(text);

    let self = this;
    this.client.game.input.keyboard.onDownCallback = function(e) {
      if (e.keyCode == 73) { // 73 = I
        self.open();
      }
    }
  }

  update() {
    while (this.pending.length > 0) {
      this.processItem(this.pending.shift());
    }
  }

  open() {
    this.header.visible = !this.header.visible;
    this.background.visible = !this.background.visible;
  }

  addItem(item) {
    this.pending.push(item);
  }

  processItem(item) {
    let stackSlot = this.findSlotWithSameItem(item);
    this.client.layers.items.remove(item);
    delete this.client.itemsMap[item.lastPos.x + "." + item.lastPos.y];
    
    item.alpha = 1;

    if (!Helpers.find(item.children, "title", "levelText") && item.level) {
      let levelText = this.client.game.add.text(0, 0, Helpers.romanize(item.level), {font: '8px Courier New', fill: '#ffffff'});
      levelText.title = "levelText";
      item.addChild(levelText);
      levelText.y = item.getLocalBounds().height - 10;      
    }

    if (item.maxStack && stackSlot) {
      if ((stackSlot.item.stack + item.stack) > stackSlot.item.maxStack) {
        let diff = (stackSlot.item.stack + item.stack) - stackSlot.item.maxStack;
        stackSlot.item.stack += (item.stack - diff);
        item.stack -= diff;
        item.processAgain = true;
      } else {
        stackSlot.item.stack += item.stack;
      }

      // обновление текста стака или его создание
      if (Helpers.find(stackSlot.item.children, "title", "stackText")) {
        let stackText = Helpers.find(stackSlot.item.children, "title", "stackText");
        stackText.setText(stackSlot.item.stack);
        stackText.x = stackSlot.item.getLocalBounds().width - stackText.width - 5; 
        stackText.y = 3;
      } else {
        let stackText = this.client.game.add.text(0, 0, stackSlot.item.stack, {font: '9px Courier New', fill: '#ffffff'});
        stackText.title = "stackText";
        stackSlot.item.addChild(stackText); 
        stackText.x = stackSlot.item.getLocalBounds().width - stackText.width - 5;  
        stackText.y = 3;     
      }

      if (item.processAgain) {
        return this.processItem(item);
      }

      item.kill();
      this.group.removeChild(item);
    } else {
      let emptySlot = this.findFirstEmptySlot();

      if (emptySlot) {
        item.x = emptySlot.x;
        item.y = emptySlot.y;
        item.width = this.iconSize;
        item.height = this.iconSize;
        item.inputEnabled = true;
        item.input.enableDrag();
        item.input.useHandCursor = true;

        this.background.addChild(item);
        emptySlot.item = item;
        item.slot = emptySlot;

        if (Helpers.find(emptySlot.item.children, "title", "stackText")) {
          let stackText = Helpers.find(emptySlot.item.children, "title", "stackText");
          stackText.setText(emptySlot.item.stack);
          stackText.x = emptySlot.item.getLocalBounds().width - stackText.width - 5;
          stackText.y = 3; 
        }

        this.items.push(item);

        let heldItemSlot;

        item.events.onDragStart.add(function (heldItem, pointer) {
          this.background.removeChild(heldItem);
          this.background.addChild(heldItem);

          heldItemSlot = heldItem.slot;
        }, this);

        item.events.onDragStop.add(function (heldItem, pointer) {
          let closestSlot = this.findClosestSlotTo(heldItem);

          if (closestSlot) {
            // ближайший слот содержит предмет
            if (closestSlot.item != undefined) {

              let closestItem = closestSlot.item;

              // поменять предметы местами
              closestItem.x = heldItemSlot.x;
              closestItem.y = heldItemSlot.y;

              closestItem.slot = heldItemSlot;
              heldItem.slot = closestSlot;

              closestSlot.item = heldItem;
              heldItemSlot.item = closestItem;

            } else { // если слот пустой
              heldItem.slot = closestSlot;
              closestSlot.item = heldItem;

              heldItemSlot.item = null;

            }

            // переместить предмет в ближайший слот
            heldItem.x = closestSlot.x;
            heldItem.y = closestSlot.y;
            
          } else { // выбросить предмет
            item.slot.item = undefined;
            this.background.removeChild(item);
            this.items.splice(this.items.indexOf(item), 1);
            
            // вернуть предмет обратно в мир
            item.width = this.client.tilesize;
            item.height = this.client.tilesize;

            item.x = this.actor.sprite.x;
            item.y = this.actor.sprite.y;
            item.lastPos.x = this.actor.position.x;
            item.lastPos.y = this.actor.position.y;

            item.events.destroy();

            this.client.layers.items.add(item);
            this.client.itemsMap[item.lastPos.x + "." + item.lastPos.y] = item;            
          }
        }, this);

        item.events.onInputDown.add(function (item, pointer) {
          if (pointer.rightButton.isDown) {
            if (item.stack > 1) {
              item.stack -= 1;
              Helpers.find(item.children, "title", "stackText").setText(item.stack);
              this.client.itemsManager.create(item.id, null, this.actor.sprite);
            } else {
              item.kill();
              item.slot.item = undefined;
              this.background.removeChild(item);
              this.items.splice(this.items.indexOf(item), 1);
              this.client.itemsManager.create(item.id, null, this.actor.sprite);              
            }
          }
        }, this);
      }
    }
  }

  findSlotWithSameItem(item) {
    for(let i = 0; i < this.background.slots.length; i++) {
      let slot = this.background.slots[i];

      if(slot.item) {
        if(slot.item.id == item.id
        && slot.item.stack < slot.item.maxStack)
            return slot;
      }
    }
    return false;
  }

  findFirstEmptySlot() {
    for(var i = 0; i < this.background.slots.length; i++) {
      let slot = this.background.slots[i];
      if(slot.item == undefined && !slot.special) {
        return slot;
      }
    }
    return false;
  }

  findClosestSlotTo(sprite) {
    let closestSlot, dist;
    let lastDist = 50; 

    this.background.slots.forEach(function(slot) {
      dist = this.client.game.math.distance(slot.x, slot.y, sprite.x, sprite.y);
      
      if(dist < lastDist) {
        lastDist = dist;
        closestSlot = slot;
      }
    }, this);

    return closestSlot;
  }
}

export default Inventory;