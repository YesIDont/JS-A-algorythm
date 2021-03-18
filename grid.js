class Grid
{
  constructor(width, height, size)
  {
    this.width = width;
    this.height = height;
    this.nodeSize = size;
    this.nodes = [[]];

    for (let row = 0; row < height; row++)
    {
      this.nodes[row] = [];

      for (let column = 0; column < width; column++)
      {
        this.nodes[row][column] = new Node(row, column, size, dice100(10));
      }
    }
  }

  draw(highlight)
  {
    this.nodes.forEach(row => {
      row.forEach(square => {
        const isHighlighted = highlight &&
          highlight.x === square.x &&
          highlight.y === square.y;
        square.draw(isHighlighted);
      });
    });
  }

  getNodeUnderPoint(point)
  {
    const row = Math.floor(point.y / this.nodeSize);
    const column = Math.floor(point.x / this.nodeSize);
    
    if (this.nodes[row] && this.nodes[row][column])
    {
      return this.nodes[row][column];
    }

    return null;
  }

  getNeighbours(refNode)
  {
    const neighbours = [];

    for (let r = -1; r <= 1; r++)
    {
      for (let c = -1; c <= 1; c++)
      {
        if (r === 0 && c === 0) continue;
        let potential = null;
        const row = refNode.y + r;
        const column = refNode.x + c;
        if (row >= 0 && row < this.height && column >= 0 && column < this.width)
        {
          potential = this.nodes[row][column];
        }

        if (potential && !potential.isObstacle)
        {
          neighbours.push(potential);
        }
      }
    }

    return neighbours;
  }

  findPath(startNode, targetNode)
  {
    const openedNodes = [];
    const closedNodes = [];
    openedNodes.push(startNode);

    while(openedNodes.length > 0)
    {
      let currentNode = openedNodes[0];

      // get the node with either lowest overall cost or closest to the target
      for (let i = 0; i < openedNodes.length; i++)
      {
        const n = openedNodes[i];
        const nCost = n.getCost();
        const currentCost = currentNode.getCost();
        if (nCost < currentCost || nCost === currentCost && n.target_cost < currentNode.target_cost)
        {
          currentNode = n;
        }
      }

      // with updated current node remove it from opened nodes and add to closed nodes
      openedNodes = openedNodes.filter(node => !node.isEqualTo(currentNode));
      closedNodes.push(currentNode);

      // check if the current node is the target (i.e. we found our path)
      if (currentNode.isEqualTo(targetNode))
      {
        return
      }

      const currentNeighbours = this.getNeighbours(currentNode);
      currentNeighbours.forEach(neighbour => {
        if (closedNodes.some(node => node.isEqualTo(neighbour)))
        {
          return;
        }
      });
    }
  }
};
