window.addEventListener('load', () => {

  const grid = new Grid(16, 16, 32);
  let highlightedSquare = null;
  let origin = null;
  let target = null;

  document.addEventListener('mousemove', () => {
    highlightedSquare = grid.getNodeUnderPoint(mouse);
  });

  document.addEventListener('click', () => {
    if (origin === null && highlightedSquare !== null)
    {
      origin = highlightedSquare;
      origin.color = '#00FF33';
    }
    else if (target === null && highlightedSquare !== null)
    {
      target = highlightedSquare;
      target.color = '#FF1100';
    }
  });

  function frame()
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.draw(highlightedSquare);
    fillCircle(ctx, mouse, 3);
    requestAnimationFrame(frame);
  }

  frame();

});