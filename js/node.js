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

  set_fCost(target)
  {
    this.fCost = this.gCost + this.getManhatanDistanceTo(target);
    return this.fCost;
  }

  getDistanceTo(other)
  {
    const dx = Math.abs(this.x - other.x);
    const dy = Math.abs(this.y - other.y);

    if (dx > dy)
    {
      return 14 * dy + 10 * (dx - dy);
    }
    return 14 * dx + 10 * (dy - dx);
  }

  getManhatanDistanceTo(other)
  {
    const dx = Math.abs(other.x - this.x);
    const dy = Math.abs(other.y - this.y);

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
