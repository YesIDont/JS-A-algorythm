class Grid
{
  constructor({
    height = 64,
    isRuntime = false,
    loadDummyMap = false,
    mode = 'random',
    obstaclesDensity = 10,
    randomOriginAndTarget = true,
    nodeSize = 8,
    width = 64,
  })
  {
    this.height = height;
    this.isRuntime = isRuntime;
    this.neighbourAddressMods = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    this.nodes = [[]];
    this.nodeSize = nodeSize;
    this.origin = null;
    this.path = [];
    this.randomOriginAndTarget = randomOriginAndTarget;
    this.target = null;
    this.width = width;

    const hasWalls = mode === 'walls';

    let idCounter = 0;
    if (loadDummyMap)
    {
      this.nodes = dummyMap.map(row => row.map(node => {
        const copy = new Node(node.x, node.y, nodeSize, node.isObstacle, idCounter);
        idCounter++;

        return copy;
      }));
    }
    else
    {
      for (let row = 0; row < height; row++)
      {
        this.nodes[row] = [];
        for (let column = 0; column < width; column++)
        {
          this.nodes[row][column] = new Node(row, column, nodeSize, hasWalls ? 0 : dice100(obstaclesDensity), idCounter);
          idCounter++;
        }
      };
    };
    
    if (hasWalls)
    {
      doNTimes((width * nodeSize) * obstaclesDensity, () => { this.makeRandomWall(); });
    }

    if (this.randomOriginAndTarget)
    {
      this.setRandomOriginAndTarget();
    }
    else
    {
      this.setOrigin(this.nodes[height - 1][0]);
      this.setTarget(this.nodes[0][width - 1]);
    }
  }

  drawGrid()
  {
    const size = this.nodeSize;
    const rows = this.nodes.length;
    const columns = this.nodes[0].length;
    let r = 0;
    let c = 0;

    for (r; r < rows; r++)
    {
      canvas.drawLine(r * size, 0, r * size, columns * size, '#d1d1d1');
    }

    for (c; c < columns; c++)
    {
      canvas.drawLine(0, c * size, rows * size, c * size, '#d1d1d1');
    }
    
  }

  drawNodes()
  {
    this.nodes.forEach(row => {
      row.forEach(node => {
        const { x, y } = node;
        const size = this.nodeSize;

        const isPartOfPath = this.path && this.path.some(pathNode => pathNode.isEqualTo(node));
        ctx.fillStyle = isPartOfPath ? '#ff0000' : node.color;
        ctx.fillRect(x * size, y * size, size, size);
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

  makeWall(start, end, clearWallChance = 0)
  {
    let min, max;
    const isHorizontal = start.y === end.y;
    const mod = isHorizontal ? 'x' : 'y';
    min = Math.min(start[mod], end[mod]);
    max = Math.max(start[mod], end[mod]);
    const isClearWall = dice100(clearWallChance);
    for (let i = min; i <= max; i++ )
    {
      const x = isHorizontal ? i : start.x;
      const y = isHorizontal ? start.y : i;
      if (this.nodes[x] && this.nodes[x][y])
      {
        const node = this.nodes[x][y];
        node.setAsObstacle();
        if (isClearWall) node.setAsNonObstacle();
      }
    }
  }

  makeRandomWall(clearWallChance = 70)
  {
    const start = this.getRandomNode();
    const end = start.getCopy();
    const mod = flipCoin() ? 'x' : 'y';
    const size = getRandomFromRange(0, mod === 'x' ? this.width : this.height);
    end[mod] += getRandomFromRange(-size, size);
    this.makeWall(start, end, clearWallChance);
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
};
