let grid, pathfinder;

window.addEventListener('load', () => {

  canvas.updateSize();

  let refNode = null;
  let isContinuousSearchOn = true;
  let isRandomOriginAndTargetOn = false;
  const size = 8;

  grid = new Grid({
    width: Math.floor(canvas.width / size),
    height: Math.floor(canvas.height / size),
    // width: 128,
    // height: 128,
    nodeSize: size,
    // obstaclesDensity: 30,
    wallsDensity: 15,
    // randomOriginAndTarget: true,
  });

  pathfinder = new AStarPathfinder({ grid });
  
  continuousSearchSwitch.onchange = ({ target, key }) => {
    isContinuousSearchOn = target.checked;
  };

  document.addEventListener('keydown', ({ key }) => {
    if (key === 'c') 
    {
      const continuous = !continuousSearchSwitch.checked;
      continuousSearchSwitch.checked = continuous;
      isContinuousSearchOn = continuous;
    }
  });
  
  randomOriginAndTargetSwitch.onchange = ({ target }) => {
    isRandomOriginAndTargetOn = target.checked;
  };

  stepByStepSwitch.onchange = ({ target }) => {
    pathfinder.stepByStep = target.checked;
  };

  runSingleSearchButton.onclick = () => {
      if (pathfinder.isSearching) pathfinder.shouldBreake = true;
      waitFor(
        () => pathfinder.isSearching === false && pathfinder.shouldBreake === false,
        () => {
          if (isRandomOriginAndTargetOn) grid.setRandomOriginAndTarget();
          if (pathfinder.stepByStep)
          {
            pathfinder.findPathStepByStep(grid.origin, grid.target, (path) => { grid.path = path; });
          }
          else
          {
            pathfinder.findPath(grid.origin, grid.target, (path) => { grid.path = path; });
          }
        },
      );
  };

  document.addEventListener('mousemove', ({ target }) => {
    if (isContinuousSearchOn)
    {
      const node = grid.getNodeUnderPointer(mouse.x, mouse.y - 25);
      if (target.id === canvas.id && node)
      {
        pathfinder.searchIsLocked = false;
  
        if (node)
        {
          if (mouse.isLeftDown && refNode && node.id !== refNode.id)
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
            if (!node.isObstacle && !pathfinder.isSearching && node.id !== grid.target.id && !pathfinder.searchIsLocked) {
              grid.setTarget(node);
              pathfinder.findPath(grid.origin, grid.target, (path) => { grid.path = path; });
            };
          }
        }
        return;
      };
      pathfinder.searchIsLocked = true;
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


  document.addEventListener('mouseup', () => {
    mouse.isLeftDown = false;
  });

  function frame()
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.drawGrid();
    grid.drawNodes();
    fillCircle(ctx, { x: mouse.x, y: mouse.y - 25 }, 3);
    requestAnimationFrame(frame);
  }

  frame();
});
