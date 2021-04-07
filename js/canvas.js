const canvas = document.getElementById('dynamics');
const ctx = canvas.getContext('2d');

canvas.updateSize = function()
{
  const { width, height } = getWindowInnerSize();
  canvas.width = width;
  canvas.height = height - 26;
}

canvas.drawLine = function(x, y, a, b, color)
{
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(a, b);
  ctx.stroke();
}