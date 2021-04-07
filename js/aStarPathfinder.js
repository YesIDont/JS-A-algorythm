class AStarPathfinder
{
  constructor({ grid, stepDelay = 0 })
  {
    this.grid = grid;
    this.openSet = new heapTree();
    this.stepDelay = stepDelay;
    this.pathIsFound = false;
    this.isSerching = false;
  }

  findPath(origin, target, usePathCallback)
  {
    if (!this.isSerching && origin && target)
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
      this._logPathTimeAndLenght(Date.now() - startTime, path.length);

      usePathCallback(path);
      this.isSerching = false;
    }
  }

  async findPathStepByStep(origin, target, usePathCallback)
  {
    if (!this.isSerching && origin && target)
    {
      try {
        const startTime = this._searchSetup(origin, target, true);
        const path = await new Promise((resolve) => {
          this._loopDelayed(origin, target, resolve);
        });
        this._logPathTimeAndLenght(Date.now() - startTime, path.length);
        usePathCallback(path);
        this.isSerching = false;
      }
      catch (error)
      {
        console.log(error);

        return [];
      }
    }
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

  _searchSetup(origin, target, stepByStep = false)
  {
    this.stepByStep = stepByStep;
    this.pathIsFound = false;
    this.isSerching = true;
    this.grid.reset();
    const startTime = Date.now();
    origin.gCost = 0;
    origin.fCost = origin.get_fCost(target);
    this.openSet.reset();
    this.openSet.push(origin);

    return startTime;
  }

  _searchLoop(origin, target, stepByStep = false)
  {
    let current = this.openSet.pullOutTheLowest();

    if (!current || !origin || !target) return false;

    if (current.isEqualTo(target))
    {
      this.pathIsFound = true;

      return false;
    }
    else if (stepByStep && !current.isEqualTo(origin))
    {
      current.color = '#d1d1d1';
    };

    current.wasVisisted = true;

    this.grid.getNeighbours(current).forEach(node => {
      const new_gCost = current.gCost + 1;
      const isNodeNotInOpen = !this.openSet.hasItem(node);
      if (isNodeNotInOpen || new_gCost < node.gCost)
      {
        node.gCost = new_gCost;
        node.set_fCost(target);
        node.parent = current;
        if (isNodeNotInOpen)
        {
          this.openSet.push(node);
          if (stepByStep) node.color = '#ff9900';
        }
      };
    });

    return true;
  }

  _loopDelayed(origin, target, resolve)
  {
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
    while(!current.isEqualTo(origin))
    {
      path.push(current);
      current = current.parent;
    }
    return path.reverse();
  }
}
