let grid, pathfinder;

window.addEventListener('load', () => {

  let isPathfindingBlocked = false;
  let refNode = null;

  grid = new Grid({
    width: 128,
    height: 128,
    nodeSize: 6,
    obstaclesDensity: 30,
    // mode: 'walls',
    isRuntime: true,
    randomOriginAndTarget: false,
    // loadDummyMap: true,
  });

  pathfinder = new AStarPathfinder({ gridReference: grid });

  if (grid.isRuntime)
  {
    document.addEventListener('mousemove', ({ target }) => {
      if (target.id === 'canvas')
      {
        const node = grid.getNodeUnderPointer(mouse);
  
        if (node)
        {
          if (mouse.isLeftDown && refNode && !node.isEqualTo(refNode))
          {
            if (refNode.isObstacle)
            {
              node.setAsObstacle();
            }
            else
            {
              node.setAsNonObstacle();
            }
          }
          else
          {
            if (!node.isObstacle) {
              grid.setTarget(node);
            };
          }
        }
      };
      isPathfindingBlocked = false;
    });
  
    document.addEventListener('mousedown', ({ target }) => {
      mouse.isLeftDown = true;
      const node = grid.getNodeUnderPointer(mouse);
      if (target.id === 'canvas' && node)
      {
        refNode = node;
      }
    });
  }


  document.addEventListener('mouseup', () => {
    mouse.isLeftDown = false;
  });

  function frame()
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (grid.isRuntime && !pathfinder.isSerching && !isPathfindingBlocked)
    {
      grid.path = pathfinder.findPath(grid.origin, grid.target);
      isPathfindingBlocked = true;
    }
    grid.drawGrid();
    grid.drawNodes();
    fillCircle(ctx, mouse, 3);
    requestAnimationFrame(frame);
  }

  frame();
  if (!grid.isRuntime) pathfinder.findPathStepByStep(grid.origin, grid.target, (path) => { grid.path = path; });

});
