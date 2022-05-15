import { fakeAsync, tick } from '@angular/core/testing';
import { Queue } from './queue';

describe('Queue', () => {
  let instance: Queue;

  beforeEach(() => {
    instance = new Queue();
  });

  it('should create an instance', () => {
    expect(new Queue()).toBeTruthy();
  });

  describe('enqueue', () => {
    it('should add element received as param in elements array', () => {
      instance.enqueue({} as HTMLDivElement);
      expect(instance.getQueueLength()).toBe(1);

      instance.enqueue({} as HTMLDivElement);
      instance.enqueue({} as HTMLDivElement);
      expect(instance.getQueueLength()).toBe(3);
    });

    it('should call dequeue after a second', fakeAsync(() => {
      const spiedDequeue = spyOn(instance, 'dequeue');

      instance.enqueue({} as HTMLDivElement);
      tick(1000);

      expect(spiedDequeue).toHaveBeenCalledTimes(1);

      instance.enqueue({} as HTMLDivElement);
      instance.enqueue({} as HTMLDivElement);
      tick(1000);

      expect(spiedDequeue).toHaveBeenCalledTimes(3);
    }));
  });

  describe('dequeue', () => {
    it('should remove an element from queue', () => {
      instance.enqueue({} as HTMLDivElement);
      instance.enqueue({} as HTMLDivElement);

      instance.dequeue();

      expect(instance.getQueueLength()).toBe(1);
    });
  });

  describe("getQueueLength", () => {
    it("should return number of elements in queue", () => {
      instance.enqueue({} as HTMLDivElement);
      instance.enqueue({} as HTMLDivElement);
      expect(instance.getQueueLength()).toBe(2);

      instance.enqueue({} as HTMLDivElement);
      expect(instance.getQueueLength()).toBe(3);
    })
  })
});
