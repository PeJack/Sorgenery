class Node {
    constructor (value) {
      this.data = value
      this.previous = null
      this.next = null
    }
}
   
class DoublyLinkedList {
    constructor() {
      this._length = 0
      this.head = null
      this.tail = null
    }
  
    add(value) {
      const node = new Node(value)
    
      if (this._length) {
          this.tail.next = node
          node.previous = this.tail
          this.tail = node
      } else {
          this.head = node
          this.tail = node
      }
    
      this._length++
    
      return node
    }
  
    searchNodeAt(position) {
      let currentNode = this.head
      let length = this._length
      let count = 1
      const message = {failure: 'Failure: non-existent node in this list.'}
    
      // 1st use-case: an invalid position
      if (length === 0 || position < 1 || position > length) {
          throw new Error(message.failure)
      }
    
      // 2nd use-case: a valid position
      while (count < position) {
        currentNode = currentNode.next
        count++
      }
    
      return currentNode
    }
  
    remove(position) {
      let currentNode = this.head
      let length = this._length
      let count = 1
      const message = {failure: 'Failure: non-existent node in this list.'}
      let beforeNodeToDelete = null
      let nodeToDelete = null
      let deletedNode = null
    
      // 1st use-case: an invalid position
      if (length === 0 || position < 1 || position > length) {
        throw new Error(message.failure)
      }
      // 2nd use-case: the first node is removed
      if (position === 1) {
        this.head = currentNode.next;
        // 2nd use-case: there is a second node
        if (!this.head) {
          this.head.previous = null
        // 2nd use-case: there is no second node
        } else {
          this.tail = null
        }
      // 3rd use-case: the last node is removed
      } else if (position === this._length) {
        this.tail = this.tail.previous
        this.tail.next = null
      // 4th use-case: a middle node is removed
      } else {
        while (count < position) {
          currentNode = currentNode.next
          count++
        }
        beforeNodeToDelete = currentNode.previous
        nodeToDelete = currentNode
        afterNodeToDelete = currentNode.next

        beforeNodeToDelete.next = afterNodeToDelete
        afterNodeToDelete.previous = beforeNodeToDelete
        deletedNode = nodeToDelete
        nodeToDelete = null
      }
    
      this._length--

      return message.success
    }

    clear() {
        while (this._length > 0) {
            this.remove(0);
        }
    }
}
  
  export default DoublyLinkedList