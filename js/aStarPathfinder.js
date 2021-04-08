class AStarPathfinder
{
  constructor({ grid, stepDelay = 0, stepByStep = false }) {
    this.grid = grid;
    this.openSet = new heapTree();
    this.stepDelay = stepDelay;
    this.stepByStep = stepByStep;
    this.pathIsFound = false;
    this.isSearching = false;
    this.searchIsLocked = false;
    this.shouldBreake = false;
  }

  findPath(origin, target, usePathCallback)
  {
    if (!this.isSearching && origin && target)
    {
      const startTime = this._searchSetup(origin, target);

      while(true)
      {
        if (!this._searchLoop(origin, target)) break;
      }

      let path = [];
      if (this.pathIsFound)
      {
        path = this._tracePathBackToOrigin(origin, target);
      }
      this._finalizeSearch(startTime, path, usePathCallback);
    }
  }

  async findPathStepByStep(origin, target, usePathCallback)
  {
    if (!this.isSearching && origin && target)
    {
      try {
        this.stepByStep = true;
        const startTime = this._searchSetup(origin, target, true);
        const path = await new Promise((resolve) => {
          this._loopDelayed(origin, target, resolve);
        });
        this._finalizeSearch(startTime, path, usePathCallback);
      }
      catch (error)
      {
        console.log(error);
      }
    }
  }

  _searchSetup(origin, target)
  {
    this.pathIsFound = false;
    this.isSearching = true;
    this.grid.path = [];
    this.grid.reset(true);
    const startTime = Date.now();
    origin.gCost = 0;
    origin.fCost = origin.get_fCost(target);
    this.openSet.reset();
    this.openSet.push(origin);

    return startTime;
  }

  _logPathTimeAndLenght(time, length)
  {
    if (this.pathIsFound)
    {
      console.log(`Found path in: ${time} ms, length: ${length}`);
      return;
    }

    console.log(`Could not find the path :/`);
  }

  _finalizeSearch(startTime, path, usePathCallback)
  {
    const length = path.length;
    this._logPathTimeAndLenght(Date.now() - startTime, length);
    if (length) usePathCallback(path);
    this.isSearching = false;
    this.shouldBreake = false;
  }

  _searchLoop(origin, target)
  {
    let current = this.openSet.pullOutTheLowest();

    if (!current || !origin || !target) return false;
    
    if (current.isEqualTo(target))
    {
      this.pathIsFound = true;

      return false;
    }
    else if (this.stepByStep && !current.isEqualTo(origin))
    {
      current.color = '#d1d1d1';
    };

    current.wasVisisted = true;

    this.grid.getNeighbours(current).forEach(node => {
      const new_gCost = current.gCost + 1;
      const isNodeNOTInOpen = !this.openSet.hasItem(node);
      if (isNodeNOTInOpen || new_gCost < node.gCost)
      {
        node.gCost = new_gCost;
        node.set_fCost(target);
        node.parent = current;
        if (isNodeNOTInOpen)
        {
          this.openSet.push(node);
          if (this.stepByStep && !node.isEqualTo(target)) node.color = '#ff9900';
        }
      };
    });

    return true;
  }

  _loopDelayed(origin, target, resolve)
  {
    if (this.shouldBreake) return resolve([]);
    setTimeout(() => {

      if (this._searchLoop(origin, target, true))
      {
        this._loopDelayed(origin, target, resolve);

        return;
      }
      let path = [];
      if (this.pathIsFound) path = this._tracePathBackToOrigin(origin, target);
      resolve(path);

    }, this.stepDelay);
  }

  _tracePathBackToOrigin(origin, target)
  {
    const path = [];
    let current = target.parent;
    if (!current)
    {
      this.pathIsFound = false;
      return path;
    }
    while(!current.isEqualTo(origin))
    {
      path.push(current);
      current = current.parent;
    }
    return path.reverse();
  }
}
