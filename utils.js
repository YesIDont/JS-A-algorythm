// test success for given n/100 chance
function dice100( chance ) {
  // percentage chance ( n out of 100 )
  let random = Math.round( Math.random() * 100 );
  return random < chance;
};

const log = console.log;

function fillCircle(ctx, center, radius, color = '#FF0000')
{
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
};
