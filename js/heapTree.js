class heapTree {
  constructor() {
    this.items = [];
    this.currentItemCount = 0;
  }

  push(item) {
    item.heapIndex = this.currentItemCount;
    this.items[this.currentItemCount] = item;
    this.sortUp(item);
    this.currentItemCount++;
  }

  pullOutTheLowest() {
    const firstItem = this.items.shift();
    if (this.items.length > 0) {
      const last = this.items.pop();
      this.items.unshift(last);
      this.items[0].heapIndex = 0;
      if (this.items.length > 1) this.sortDown(this.items[0]);
    }
    this.currentItemCount -= 1;

    return firstItem;
  }

  hasItem(item) {
    return this.items.some((i) => i.id === item.id);
  }

  getLength() {
    return this.currentItemCount;
  }

  reset() {
    this.items = [];
    this.currentItemCount = 0;
  }

  compareNumbers(A, B) {
    if (A < B) return -1;
    if (A === B) return 0;
    return 1;
  }

  compareItems(A, B) {
    let compare = this.compareNumbers(A.fCost, B.fCost);
    if (compare == 0) compare = this.compareNumbers(A.hCost, B.hCost);

    return -compare;
  }

  getParentIndex(itemIndex) {
    let parentIndex = Math.floor((itemIndex - 1) * 0.5);
    if (parentIndex < 0) return 0;

    return parentIndex;
  }

  sortUp(item) {
    let parentIndex = this.getParentIndex(item.heapIndex);

    let shouldKeepSearching = true;
    while (shouldKeepSearching) {
      const parentItem = this.items[parentIndex];
      if (parentItem && this.compareItems(item, parentItem) > 0) {
        this.swap(item, parentItem);
      } else {
        shouldKeepSearching = false;
      }
      parentIndex = this.getParentIndex(item.heapIndex);
    }
  }

  sortDown(item) {
    let shouldKeepSearching = true;
    while (shouldKeepSearching) {
      const index = item.heapIndex;
      const childLeftIndex = index * 2 + 1;
      const childRightIndex = index * 2 + 2;
      let swapIndex = 0;

      if (childLeftIndex < this.currentItemCount) {
        swapIndex = childLeftIndex;

        const left = this.items[childLeftIndex];
        const right = this.items[childRightIndex];
        if (
          childRightIndex < this.currentItemCount &&
          left &&
          right &&
          this.compareItems(left, right) < 0
        ) {
          swapIndex = childRightIndex;
        }

        const potential = this.items[swapIndex];
        if (potential && this.compareItems(item, potential) < 0) {
          this.swap(item, potential);
        } else {
          shouldKeepSearching = false;
        }
      } else {
        shouldKeepSearching = false;
      }
    }
  }

  swap(A, B) {
    const indexA = A.heapIndex;
    const indexB = B.heapIndex;
    B.heapIndex = indexA;
    A.heapIndex = indexB;
    this.items[indexA] = B;
    this.items[indexB] = A;
  }
}
