class Node
{
  constructor(row, column, size, isObstacle, id)
  {
    this.id = id;
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
    this.heapIndex = null;
  }

  getEuclideanDistance(other)
  {
    const dx = Math.abs(this.x - other.x);
    const dy = Math.abs(this.y - other.y);

    return Math.sqrt(dx * dx + dy * dy);
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
    return new Node(this.x, this.y, this.size, this.isObstacle, this.id);
  }
}
