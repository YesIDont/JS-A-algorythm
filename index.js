let grid, pathfinder;

window.addEventListener('load', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cellSize = 8;

  grid = new Grid({
    width: Math.floor(canvas.width / cellSize),
    height: Math.floor(canvas.height / cellSize),
    dummyMap: JSON.parse(savedMap),
  });

  pathfinder = new AStarPathfinder(grid);

  document.addEventListener('mousemove', () => {
    const node = grid.getNodeUnderPointer(mouse.x, mouse.y, cellSize);

    if (!node || node.isObstacle || node.id === grid.target.id) return;

    grid.setTarget(node);
  });

  function fillCircle(ctx, center, radius, color = '#FF0000') {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function frame() {
    pathfinder.findPath(grid.origin, grid.target, (path) => {
      grid.path = path;
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.drawGrid(cellSize);
    grid.drawNodes(cellSize);
    fillCircle(ctx, { x: mouse.x, y: mouse.y }, 3);

    requestAnimationFrame(frame);
  }

  frame();
});
