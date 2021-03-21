breadthFirstSearch(start, target) {
  start.color = 'blue';
  target.color = 'red';
  const frontier = [];
  frontier.push(start);
  const cameFrom = new Map();
  cameFrom.set(start, null);
  const startTime = Date.now();

  while(frontier.length > 0)
  {
    this.breadthFirstSearchLoop(start, target, frontier, cameFrom, startTime);
  }
  if (this.path.length < 1) console.log(`Breadth Frist Search couldn't find path.`);
}

breadthFirstSearchLoop(start, target, frontier, cameFrom, startTime)
{
  const current = frontier.pop();
  if (!current.isEqualTo(start)) current.color = '#999';

  if (current.isEqualTo(target))
  {
    let current = target;
    while(!current.isEqualTo(start))
    {
      this.path.push(current);
      current = cameFrom.get(current);
    }
    this.path.push(start);
    this.path.reverse();

    console.log(`Breadth Frist Search found path: ${Date.now() - startTime} ms`);
    frontier = [];
    return;
  }
  this.getNeighbours(current).forEach(neighbour => {
    if (!cameFrom.has(neighbour))
    {
      frontier.unshift(neighbour);
      cameFrom.set(neighbour, current);
      if (!neighbour.isEqualTo(start)) neighbour.color = '#d4d4d4';
    }
  });
}