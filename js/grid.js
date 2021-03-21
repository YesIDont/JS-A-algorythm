class Grid
{
  constructor({
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
    this.width = width;
    this.height = height;
    this.nodeSize = size;
    this.nodes = [[]];
    this.path = [];
    this.origin = null;
    this.target = null;
    this.neighbourAddressMods = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    this.isPerformingPathfinding = false;
    this.delay = delay;
    this.isRuntime = isRuntime;
    this.randomOriginAndTarget = randomOriginAndTarget;

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
      this.setOrigin(this.nodes[0][0]);
      this.origin.isObstacle = false;
      this.setTarget(this.nodes[this.width - 1][this.height - 1]);
      this.target.sObstacle = false;
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
  }

  setTarget(target)
  {
    this.target = target;
    this.target.color = '#FF0000';
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

  makeRandomWall()
  {
    const start = this.getRandomNode();
    const end = start.getCopy();
    const size = getRandomFromRange(0, this.width);
    const mod = flipCoin() ? 'x' : 'y';
    end[mod] += getRandomFromRange(-size, size);

    let min, max;
    if (start.x === end.x)
    {
      min = Math.min(start.y, end.y);
      max = Math.max(start.y, end.y);
      for (let i = min; i <= max; i++ )
      {
        if (this.nodes[start.x] && this.nodes[start.x][i])
        {
          if (dice100(70)) this.nodes[start.x][i].setAsObstacle()
          else this.nodes[start.x][i].setAsNonObstacle();
        }
      }
    }
    else
    {
      min = Math.min(start.x, end.x);
      max = Math.max(start.x, end.x);
      for (let i = min; i <= max; i++ )
      {
        if (this.nodes[i] && this.nodes[i][start.y])
        {
          if (dice100(70)) this.nodes[i][start.y].setAsObstacle()
          else this.nodes[i][start.y].setAsNonObstacle();
        }
      }
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
          if (!node.isEqualTo(this.origin) && !node.isEqualTo(this.target)) node.color = 'transparent';
        }
      });
    });
  }

  getLowestFCost(array)
  {
    const lowest = array.reduce((acc, val) => {
      if (val.fCost < acc.fCost) return val;

      return acc;
    }, array[0]);

    return lowest;
  }

  closeSearch(startTime)
  {
    console.log(`A* Algorithm found path: ${Date.now() - startTime} ms`);
    this.isPerformingPathfinding = false;
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

    const cameFrom = new Map();
    cameFrom.set(origin, null);

    const costSoFar = new Map();
    costSoFar.set(origin, 0);

    this.isPerformingPathfinding = true;

    if (this.isRuntime)
    {
      this.aStarLoop(frontier, origin, target, cameFrom, startTime);
    }
    else
    {
      this.aStarLoopDelayed(frontier, origin, target, cameFrom, costSoFar, startTime); 
    }
  }

  aStarLoop(frontier, origin, target, cameFrom, costSoFar, startTime)
  {
    // let current = this.getLowestFCost(frontier);
    let current = frontier[0];
    for (let i = 1; i < frontier.length - 1; i++)
    {
      const node = frontier[i];
      if (node.fCost < current.fCost || node.fCost === current.fCost && node.hCost < current.hCost)
      {
        current = node;
      }
    }
    if (!current)
    {
      this.isPerformingPathfinding = false;
      return;
    }

    if (!this.isRuntime && !current.isEqualTo(origin)) current.color = '#d1d1d1';

    if (current.isEqualTo(target))
    {
      this.path = [];
      current = cameFrom.get(target);
      while(!current.isEqualTo(origin))
      {
        this.path.push(current);
        current = cameFrom.get(current);
      }
      this.path.reverse();

      this.closeSearch(startTime);

      return;
    }

    current.wasVisisted = true;
    frontier = frontier.filter(node => !node.isEqualTo(current));

    this.getNeighbours(current).forEach(neighbour => {
      // const newCost = current.gCost + current.getDistanceTo(neighbour);
      // const newCost = costSoFar.get() + 1;// + current.getDistanceTo(neighbour);
      const newCost = current.gCost + 1;// + current.getDistanceTo(neighbour);
      const isntInFrontier = frontier.every(node => !node.isEqualTo(neighbour));
      // if (newCost < neighbour.gCost || isntInFrontier)
      // if (!costSoFar.has(neighbour) || newCost < costSoFar.get(neighbour))
      if (!neighbour.gCost || newCost < neighbour.gCost)
      {
        neighbour.gCost = newCost;
        // costSoFar.set(neighbour, newCost)
        // neighbour.hCost = target.getDistanceTo(neighbour);
        neighbour.hCost = target.getDistanceTo(neighbour);
        neighbour.fCost = neighbour.gCost + neighbour.hCost;
        // neighbour.gCost = current.gCost + 1;
        // neighbour.set_fCost(target);
        cameFrom.set(neighbour, current);

        if (isntInFrontier)
        {
          frontier.push(neighbour);
          if (!this.isRuntime) neighbour.color = '#ff9900';
        }
      }
    });

    if (this.isRuntime && frontier.length > 0) this.aStarLoop(frontier, origin, target, cameFrom, startTime)
    else this.aStarLoopDelayed(frontier, origin, target, cameFrom, costSoFar, startTime);
  }

  aStarLoopDelayed(frontier, origin, target, cameFrom, costSoFar, startTime)
  {
    setTimeout(() => {
      if (frontier.length > 0) this.aStarLoop(frontier, origin, target, cameFrom, costSoFar, startTime);
    }, this.delay);
  }
};
