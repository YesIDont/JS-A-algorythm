let grid, pathfinder;

window.addEventListener('load', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const size = 8;

  grid = new Grid({
    width: Math.floor(canvas.width / size),
    height: Math.floor(canvas.height / size),
    nodeSize: size,
    dummyMap: JSON.parse(savedMap),
  });

  pathfinder = new AStarPathfinder(grid);

  document.addEventListener('mousemove', () => {
    const node = grid.getNodeUnderPointer(mouse.x, mouse.y);

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
    grid.drawGrid();
    grid.drawNodes();
    fillCircle(ctx, { x: mouse.x, y: mouse.y }, 3);

    requestAnimationFrame(frame);
  }

  frame();
});
