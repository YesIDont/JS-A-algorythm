class Grid
{
  constructor({
    costMultiplier = 1,
    delay = 0,
    height = 64,
    isRuntime = false,
    loadDummyMap = false,
    mode = 'random',
    obstaclesDensity = 10,
    randomOriginAndTarget = true,
    size = 8,
    width = 64,
  })
  {
    this.costMultiplier = costMultiplier;
    this.delay = delay;
    this.height = height;
    this.isPerformingPathfinding = false;
    this.isRuntime = isRuntime;
    this.neighbourAddressMods = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    this.nodes = [[]];
    this.nodeSize = size;
    this.origin = null;
    this.path = [];
    this.randomOriginAndTarget = randomOriginAndTarget;
    this.target = null;
    this.width = width;

    const hasWalls = mode === 'walls';

    if (loadDummyMap)
    {
      this.nodes = dummyMap.map(row => row.map(node => new Node(node.x, node.y, this.nodeSize, node.isObstacle)));
    }
    else
    {
      for (let row = 0; row < height; row++)
      {
        this.nodes[row] = [];
        for (let column = 0; column < width; column++)
        {
          this.nodes[row][column] = new Node(row, column, size, hasWalls ? 0 : dice100(obstaclesDensity));
        }
      };
    };
    
    if (hasWalls)
    {
      doNTimes(obstaclesDensity, () => { this.makeRandomWall(); });
    }

    if (this.randomOriginAndTarget)
    {
      this.setRandomOriginAndTarget();
    }
    else
    {
      this.setOrigin(this.nodes[this.width - 1][0]);
      this.setTarget(this.nodes[0][this.height - 1]);
    }
  }

  drawNodes()
  {
    this.nodes.forEach(row => {
      row.forEach(node => {
        const isPartOfPath = this.path && this.path.some(pathNode => pathNode.isEqualTo(node));
        node.draw(isPartOfPath);
      });
    });
  }

  getRandomNode()
  {
    const row = getRandomFromRange(0, this.height - 1, true);
    const column = getRandomFromRange(0, this.width - 1, true);

    return this.nodes[row][column];
  }

  setOrigin(origin)
  {
    this.origin = origin;
    this.origin.color = '#0055FF';
    this.origin.isObstacle = false;
  }

  setTarget(target)
  {
    this.target = target;
    this.target.color = '#FF0000';
    this.target.isObstacle = false;
  }

  setRandomOriginAndTarget()
  {
    this.origin = this.getRandomNode();
    this.origin.isObstacle = false;
    this.origin.color = '#0055FF';
    this.target = this.getRandomNode();
    this.target.isObstacle = false;
    this.target.color = '#FF0000';
  }

  getNodeUnderPointer(point)
  {
    const row = Math.floor(point.y / this.nodeSize);
    const column = Math.floor(point.x / this.nodeSize);
    
    if (this.nodes[column] && this.nodes[column][row])
    {
      return this.nodes[column][row];
    }

    return null;
  }

  makeWall(start, end)
  {
    let min, max;
    const isHorizontal = start.y === end.y;
    const mod = isHorizontal ? 'x' : 'y';
      min = Math.min(start[mod], end[mod]);
      max = Math.max(start[mod], end[mod]);
      for (let i = min; i <= max; i++ )
      {
        const x = isHorizontal ? i : start.x;
        const y = isHorizontal ? start.y : i;
        if (this.nodes[x] && this.nodes[x][y])
        {
          this.nodes[x][y].setAsObstacle();
        }
      }
  }

  makeRandomWall(randomObstacle = false)
  {
    const start = this.getRandomNode();
    const end = start.getCopy();
    const mod = flipCoin() ? 'x' : 'y';
    const size = getRandomFromRange(0, mod === 'x' ? this.width : this.height);
    end[mod] += getRandomFromRange(-size, size);

    const newWall = this.makeWall(start, end);

    if (randomObstacle && dice100(20))
    {
      newWall.setAsNonObstacle();
    }
  }

  getNeighbours(refNode)
  {
    const neighbours = [];
    this.neighbourAddressMods.forEach(mod => {
      const row = refNode.x + mod[0];
      const column = refNode.y + mod[1];
      let potential = null;

      if (this.nodes[row] && this.nodes[row][column])
      {
        potential = this.nodes[row][column];

        if (!potential.isObstacle && !potential.wasVisisted)
        {
          neighbours.push(potential);
        }
      }
    });

    return neighbours;
  }

  reset()
  {
    this.nodes.forEach(row => {
      row.forEach(node => {
        if (!node.isObstacle)
        {
          node.wasVisisted = false;
          node.gCost = null;
          node.hCost = null;
          node.fCost = null;
          if (!node.isEqualTo(this.origin) && !node.isEqualTo(this.target)) node.color = 'transparent';
        }
      });
    });
  }

  closeSearch(startTime, pathLength)
  {
    console.log(`A* Algorithm found path: ${Date.now() - startTime} ms. The path length is: ${pathLength}`);
    this.isPerformingPathfinding = false;
  }

  getLowestFCost(array)
  {
    const lowest = array.reduce((acc, val) => {
      if (val.fCost < acc.fCost) return val;

      return acc;
    }, array[0]);

    return lowest;
  }

  aStar()
  {
    if (!this.origin || !this.target) return;
    const { origin, target } = this;
    const startTime = Date.now();
    
    this.reset();

    let frontier = [];
    origin.gCost = 0;
    origin.set_fCost(target);
    frontier.push(origin);

    this.isPerformingPathfinding = true;

    if (this.isRuntime)
    {
      this.aStarLoop(frontier, origin, target, startTime);
    }
    else
    {
      this.aStarLoopDelayed(frontier, origin, target, startTime); 
    }
  }

  aStarLoop(frontier, origin, target, startTime)
  {
    let current = this.getLowestFCost(frontier);
    // let current = frontier[0];
    // for (let i = 1; i < frontier.length - 1; i++)
    // {
    //   const node = frontier[i];
    //   if (node.fCost < current.fCost || node.fCost === current.fCost && node.hCost < current.hCost)
    //   {
    //     current = node;
    //   }
    // }
    if (!current)
    {
      this.isPerformingPathfinding = false;
      return;
    }

    if (!this.isRuntime && !current.isEqualTo(origin)) current.color = '#d1d1d1';

    if (current.isEqualTo(target))
    {
      this.path = [];
      current = target.parent;
      while(!current.isEqualTo(origin))
      {
        this.path.push(current);
        current = current.parent;
      }
      this.path.reverse();

      this.closeSearch(startTime, this.path.length);

      return;
    }

    current.wasVisisted = true;
    frontier = frontier.filter(node => !node.isEqualTo(current));

    this.getNeighbours(current).forEach(neighbour => {
      const newCost = current.gCost + current.getDistanceTo(neighbour);
      const isntInFrontier = frontier.every(node => !node.isEqualTo(neighbour));
      if (!neighbour.gCost || newCost < neighbour.gCost)
      {
        neighbour.gCost = newCost;
        neighbour.hCost = target.getDistanceTo(neighbour);
        neighbour.fCost = neighbour.gCost + (neighbour.hCost * this.costMultiplier);
        neighbour.parent = current;

        if (isntInFrontier)
        {
          frontier.push(neighbour);
          if (!this.isRuntime) neighbour.color = '#ff9900';
        }
      }
    });

    if (frontier.length > 0)
    {
      if (this.isRuntime) this.aStarLoop(frontier, origin, target, startTime)
      else this.aStarLoopDelayed(frontier, origin, target, startTime);
    }
    else
    {
      this.isPerformingPathfinding = false;
    }
  }

  aStarLoopDelayed(frontier, origin, target, startTime)
  {
    setTimeout(() => {
      if (frontier.length > 0) this.aStarLoop(frontier, origin, target, startTime)
      else this.isPerformingPathfinding = false;
    }, this.delay);
  }
};
