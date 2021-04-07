class Grid
{
  constructor({
    height = 32,
    dummyMap,
    wallsDensity = 0,
    obstaclesDensity = 0,
    randomOriginAndTarget = false,
    nodeSize = 8,
    width = 32,
  })
  {
    this.height = height;
    this.neighbourAddressMods = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    this.nodes = [[]];
    this.nodeSize = nodeSize;
    this.origin = null;
    this.path = [];
    this.target = null;
    this.width = width;

    if (dummyMap)
    {
      this._loadSavedMap(dummyMap);
    }
    else
    {
      this.generate({ obstaclesDensity, wallsDensity, nodeSize });
    };

    if (randomOriginAndTarget)
    {
      this.setRandomOriginAndTarget();
    }
    else
    {
      this.setOrigin(this.nodes[width - 1][0]);
      this.setTarget(this.nodes[0][height - 1]);
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

  getNodeUnderPointer(x, y)
  {
    const row = Math.floor(y / this.nodeSize);
    const column = Math.floor(x / this.nodeSize);
    
    if (this.nodes[column] && this.nodes[column][row])
    {
      return this.nodes[column][row];
    }

    return null;
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

  generate({ obstaclesDensity = 0, wallsDensity = 0, cellsHorizontally, cellsVertically, nodeSize })
  {
    const width = cellsHorizontally || this.width;
    const height = cellsVertically || this.height;
    const size = nodeSize || this.nodeSize;
    this.nodes = [];
    let idCounter = 0;
    for (let x = 0; x < width; x++)
    {
      this.nodes[x] = [];
      for (let y = 0; y < height; y++)
      {
        this.nodes[x][y] = new Node(x, y, size, dice100(obstaclesDensity), idCounter);
        idCounter++;
      }
    };
    if (wallsDensity > 0) doNTimes(wallsDensity * wallsDensity, () => { this._makeRandomWall(wallsDensity * 1.5); });
  }

  setRandomOriginAndTarget()
  {
    this.origin = this._getRandomNode();
    this.origin.isObstacle = false;
    this.origin.color = '#0055FF';
    this.target = this._getRandomNode();
    this.target.isObstacle = false;
    this.target.color = '#00DD00';
  }

  _loadSavedMap(map)
  {
    this.nodes = [];
    let idCounter = 0;
    this.nodes = map.map(row => row.map(node => {
      const copy = new Node(node.x, node.y, this.nodeSize, node.isObstacle, idCounter);
      idCounter++;

      return copy;
    }));
  }

  _getRandomNode()
  {
    const row = getRandomFromRange(0, this.height - 1, true);
    const column = getRandomFromRange(0, this.width - 1, true);

    return this.nodes[column][row];
  }

  _makeWall(start, end, clearWallChance = 0)
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

  _makeRandomWall(clearWallChance = 0)
  {
    const start = this._getRandomNode();
    const end = start.getCopy();
    const mod = flipCoin() ? 'x' : 'y';
    const size = getRandomFromRange(0, mod === 'x' ? this.width : this.height);
    end[mod] += getRandomFromRange(-size, size);
    this._makeWall(start, end, clearWallChance);
  }

  reset(shouldKeepOriginAndTarget)
  {
    this.nodes.forEach(row => {
      row.forEach(node => {
        if (!node.isObstacle)
        {
          node.wasVisisted = false;
          node.gCost = null;
          node.hCost = null;
          node.fCost = null;
          if (shouldKeepOriginAndTarget)
          {
            if (!node.isEqualTo(this.origin) && !node.isEqualTo(this.target)) node.color = 'transparent';
          }
          else
          {
            node.color = 'transparent';
          }
        }
      });
    });
  }
};
