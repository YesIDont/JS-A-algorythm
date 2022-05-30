let grid, pathfinder;

window.addEventListener('load', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cellSize = 8;
  const path = [];

  grid = new Grid({
    width: Math.floor(canvas.width / cellSize),
    height: Math.floor(canvas.height / cellSize),
  });

  grid.loadSavedMap(JSON.parse(savedMap));

  pathfinder = new AStarPathfinder(grid);

  document.addEventListener('mousemove', () => {
    const node = grid.getCellUnderPointer(mouse.x, mouse.y, cellSize);

    if (!node || node.isObstacle || node.id === grid.target.id) return;

    grid.setTarget(node);
  });

  function frame() {
    pathfinder.findPath(grid.origin, grid.target, path);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.drawGrid(cellSize);
    grid.drawNodes(cellSize, path);

    requestAnimationFrame(frame);
  }

  frame();
});
