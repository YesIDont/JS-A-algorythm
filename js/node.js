class Node
{
  constructor(row, column, size, isObstacle)
  {
    this.x = row;
    this.y = column;
    this.size = size;
    // number of steps took to get to that node from start point
    this.gCost = null;
    // estimated cost fron that node to the target point got from pythagorean theorem
    this.hCost = null;
    // the sum of both costs above
    this.fCost = null;
    this.isObstacle = isObstacle;
    this.wasVisisted = false;
    this.color = isObstacle ? '#000' : 'transparent';
    this.parent = null;
  }

  isEqualTo(other)
  {
    return this.x === other.x && this.y === other.y;
  }

  getStamp()
  {
    return this.x + this.y;
  }

  get_hCost(target)
  {
    const x = Math.abs(target.x - this.x);
    const y = Math.abs(target.y - this.y);

    return Math.sqrt(x * x + y * y);
  }

  get_fCost(target)
  {
    return this.gCost + this.getEuclideanDistance(target);
    // return this.gCost + this.getManhatanDistanceTo(target);
    // return this.gCost + this.getWeightedDistanceTo(target);
  }

  set_fCost(target)
  {
    this.fCost = this.gCost + this.getEuclideanDistance(target);
    // this.fCost = this.gCost + this.getManhatanDistanceTo(target);
    // this.fCost = this.gCost + this.getWeightedDistanceTo(target);
    return this.fCost;
  }

  getCoordiatesDifference(other)
  {
    return {
      dx: Math.abs(this.x - other.x),
      dy: Math.abs(this.y - other.y),
    }
  }

  getEuclideanDistance(other)
  {
    const { dx, dy } = this.getCoordiatesDifference(other);

    return Math.sqrt(dx * dx + dy * dy);
  }

  getWeightedDistanceTo(other)
  {
    const { dx, dy } = this.getCoordiatesDifference(other);

    if (dx > dy)
    {
      return 14 * dy + 10 * (dx - dy);
    }
    return 14 * dx + 10 * (dy - dx);
  }

  getManhatanDistanceTo(other)
  {
    const { dx, dy } = this.getCoordiatesDifference(other);

    return dx + dy;
  }

  setAsObstacle()
  {
    this.isObstacle = true;
    this.color = '#000';

    return this;
  }

  setAsNonObstacle()
  {
    this.isObstacle = false;
    this.color = 'transparent';

    return this;
  }

  getCopy()
  {
    return new Node(this.x, this.y, this.size, this.isObstacle);
  }

  draw(isPartOfPath)
  {
    const { x, y, size } = this;

    ctx.fillStyle = isPartOfPath ? '#ff0000' : this.color;
    ctx.fillRect(x * size, y * size, size, size);

    ctx.strokeStyle = '#d1d1d1';
    ctx.beginPath();
    ctx.rect(x * size, y * size, size, size);
    ctx.stroke();
  }
}
