'use strict';

class QueueIterator {

  constructor(queue) {

    this._queue = queue;
    this._start = queue._head;
  }

  next() {

    if (this._start > this._queue._tale) {
      return {
        value: undefined,
        done: true,
      };
    }

    return {
      value: this._queue[`_${this._start++}`],
      done: this._start > this._queue._tale,
    };

  }

}

class Queue {

  constructor(maxSize, ...args) {

    if (typeof maxSize !== 'number') {
      throw new TypeError();
    }

    if (maxSize < 0 || isNaN(maxSize) || !Number.isSafeInteger(maxSize)) {
      throw new RangeError();
    }

    this._maxSize = maxSize;
    this._head = 0;
    this._tale = 0;

    for (let arg of args) {
      this.enqueue(arg);
    }

  }

  get isEmpty() {
    return this._tale === 0;
  }

  get size() {
    return this._tale - this._head;
  }

  enqueue(value) {

    if (this._tale >= this._maxSize) {
      throw new RangeError('Stack overflow');
    }

    this[`_${this._tale++}`] = value;

    return this._tale;
  }

  dequeue() {

    if (this.isEmpty) {
      return;
    }

    const firstItem = this[`_${this._head}`];
    delete this[`_${this._head++}`];
    return firstItem;

  }

  front() {

    if (this.isEmpty) {
      return;
    }

    return this[`_${this._head}`];
  }

  [Symbol.iterator]() {
    return new QueueIterator(this);
  }

}

class PriorityQueue extends Queue {

  constructor(maxSize, ...args) {
    super(maxSize);

    for (let arg of args) {
      this.enqueue(arg);
    }

  }

  enqueue({value, priority}) {

    if (this._tale >= this._maxSize) {
      throw new RangeError('Stack overflow');
    }
    if (typeof priority !== 'number') {
      throw new TypeError();
    }
    if (priority < 0 || isNaN(priority) || !Number.isSafeInteger(priority)) {
      throw new RangeError();
    }
    this[`_${this._tale++}`] = {value, priority};

    const sortedByPriority = [...this].sort((a, b) => {
      return a.priority - b.priority;
    });

    let counter = 0;
    for (let i = this._head; i < this._tale; i++) {
      this[`_${i}`] = sortedByPriority[counter++];
    }

    return this._tale;
  }

}

const pq = new PriorityQueue(100, {value: 1, priority: 3},
    {value: 2, priority: 2}, {value: 3, priority: 1});
