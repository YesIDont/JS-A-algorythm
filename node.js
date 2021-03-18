class Node
{
  constructor(row, column, size, isObstacle)
  {
    this.x = column;
    this.y = row;
    this.size = size;
    this.origin_cost = 0;
    this.target_cost = 0;
    this.visited = false;
    this.isObstacle = isObstacle;
    this.color = isObstacle ? '#000' : 'transparent';
  }

  getCost()
  {
    return this.origin_cost + this.target_cost;
  }

  isEqualTo(other)
  {
    return this.x === other.x && this.y === other.y;
  }

  getDistanceTo(other)
  {
    
  }

  draw(isHighlighted)
  {
    const { x, y, size, height } = this;

    ctx.fillStyle = isHighlighted ? '#0099FF' : this.color;
    ctx.fillRect(x * size, y * size, size, size);

    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.rect(x * size, y * size, size, size);
    ctx.stroke();
  }

  calculateCosts(refNode)
  {
    
  }
}
