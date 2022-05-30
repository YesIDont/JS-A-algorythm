class Node {
  constructor(row, column, isObstacle, id = 0) {
    this.id = id;
    this.x = row;
    this.y = column;
    // number of steps took to get to that node from start point
    this.gCost = null;
    // estimated cost fron that node to the target point got from pythagorean theorem
    this.hCost = null;
    // the sum of both costs above
    this.fCost = null;
    this.isObstacle = isObstacle;
    this.wasVisisted = false;
    this.parent = null;
    this.heapIndex = null;
    this.neighbours = [];
  }
}
