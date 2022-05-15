export class Queue {
  private elements: HTMLDivElement[] = []

  enqueue(newElement: HTMLDivElement) {
    this.elements.push(newElement);
    setTimeout(() => {
      this.dequeue();
    }, 1000);
  }

  dequeue() {
    this.elements.shift();
  }

  getQueueLength() {
    return this.elements.length;
  }
}
