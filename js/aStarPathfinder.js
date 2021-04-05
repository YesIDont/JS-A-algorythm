class AStarPathfinder
{
  constructor({ gridReference, stepDelay = 0 })
  {
    this.grid = gridReference;
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
        this._logPathTimeAndLenght(Date.now() - startTime, path.length);
      }

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
    alert(`A* Algorithm found path in: ${time} ms. The path length is: ${length}`);
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
    this.openSet.add(origin);

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

    this.grid.getNeighbours(current).forEach(neighbour => {
      if (!this.openSet.hasItem(neighbour))
      {
        this.openSet.add(neighbour);
        neighbour.gCost = current.gCost + 1; // current.getWeightedDistanceTo(neighbour);
        const new_fCost = neighbour.get_fCost(target);
        if (neighbour.fCost === null || new_fCost < neighbour.fCost)
        {
          neighbour.fCost = new_fCost;
          neighbour.parent = current;
          if (stepByStep) neighbour.color = '#ff9900';
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
