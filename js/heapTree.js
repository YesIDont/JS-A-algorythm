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

  pullOutLowest()
  {
    const firstItem = this.items[0];
    this.currentItemCount--;
    this.items[0] = this.items[this.currentItemCount];
    this.items[0].heapIndex = 0;
    this._sortDown(this.items[0]);

    return firstItem;
  }

  isItemInTheTree(item)
  {
    return this.items.some(i => i.isEqualTo(item));
  }

  getLength()
  {
    return this.currentItemCount;
  }

  _compareItems(A, B)
  {
    let compare = A.compare_fCostTo(B);
    if (compare == 0) compare = A.compare_hCostTo(B);

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
