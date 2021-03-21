window.addEventListener('load', () => {

  let isPathfindingBlocked = false;
  let refNode = null;

  const grid = new Grid({
    // width: 64,
    // height: 64,
    // size: 8,
    obstaclesDensity: 300,
    mode: 'walls',
    // delay: 100,
    // isRuntime: true,
    randomOriginAndTarget: false,
    // loadDummyMap: true,
  });

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
            isPathfindingBlocked = false;
          }
        }
      }
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
    if (!grid.isPerformingPathfinding && !isPathfindingBlocked)
    {
      grid.aStar();
      isPathfindingBlocked = true;
    }
    grid.drawNodes();
    fillCircle(ctx, mouse, 3);
    requestAnimationFrame(frame);
  }

  frame();

});
