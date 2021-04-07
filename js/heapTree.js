class heapTree {
  constructor()
  {
    this.items = [];
    this.currentItemCount = 0;
  }

  add(item)
  {
    item.heapIndex = this.currentItemCount;
    this.items[this.currentItemCount] = item;
    this._sortUp(item);
    this.currentItemCount++;
  }

  pullOutTheLowest()
  {
    const firstItem = this.items[0];
    this.currentItemCount--;
    this.items[0] = this.items[this.currentItemCount];
    if (!this.items[0]) return undefined;
    this.items[0].heapIndex = 0;
    this._sortDown(this.items[0]);

    return firstItem;
  }

  hasItem(item)
  {
    return this.items.some(i => i.isEqualTo(item));
  }

  getLength()
  {
    return this.currentItemCount;
  }

  reset()
  {
    this.items = [];
    this.currentItemCount = 0;
  }

  _compareNumbers(A, B)
  {
    if (A < B) return -1;
    if (A === B) return 0;
    return 1;
  }

  _compareItems(A, B)
  {
    let compare = this._compareNumbers(A.fCost, B.fCost);
    if (compare == 0) compare = this._compareNumbers(A.hCost, B.hCost)

    return -compare;
  }

  _getParentIndex(itemIndex)
  {
    let parentIndex = Math.floor(itemIndex - 1) * 0.5;

    return parentIndex < 0 ? 0 : parentIndex;
  }

  _sortUp(item)
  {
    let parentIndex = this._getParentIndex(item.heapIndex);

    let shouldKeepSearching = true;
    while(shouldKeepSearching)
    {
      const parentItem = this.items[parentIndex];
      if (parentItem && this._compareItems(item, parentItem) > 0)
      {
        this._swap(item, parentItem);
      }
      else {
        shouldKeepSearching = false;
      }
      parentIndex = this._getParentIndex(item.heapIndex);
    }
  }

  _sortDown(item)
  {
    let shouldKeepSearching = true;
    while(shouldKeepSearching)
    {
      const index = item.heapIndex;
      const childLeftIndex = index * 2 + 1;
      const childRightIndex = index * 2 + 2;
      let swapIndex = 0;

      if (childLeftIndex < this.currentItemCount)
      {
        swapIndex = childLeftIndex;

        const left = this.items[childLeftIndex];
        const right = this.items[childRightIndex];
        if (childRightIndex < this.currentItemCount && left && right && this._compareItems(left, right) < 0)
        {
          swapIndex = childRightIndex;
        }

        const potential = this.items[swapIndex];
        if (this._compareItems(item, potential) < 0)
        {
          this._swap(item, potential);
        }
        else {
          shouldKeepSearching = false;
        }
      }
      else {
        shouldKeepSearching = false;
      }
    }
  }

  _swap(A, B)
  {
    const indexA = A.heapIndex;
    const indexB = B.heapIndex;
    B.heapIndex = indexA;
    A.heapIndex = indexB;
    this.items[indexA] = B;
    this.items[indexB] = A;
  }
}
