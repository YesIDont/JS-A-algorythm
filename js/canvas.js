const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.drawLine = function (x, y, a, b, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(a, b);
  ctx.stroke();
};
