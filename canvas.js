const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas width and height
canvas.width = window.innerWidth && document.documentElement.clientWidth
  ? Math.min( window.innerWidth, document.documentElement.clientWidth )
  : window.innerWidth
    || document.documentElement.clientWidth
    || document.getElementsByTagName('body')[0].clientWidth;

canvas.height = window.innerHeight && document.documentElement.clientHeight
  ? Math.min(window.innerHeight, document.documentElement.clientHeight)
  : window.innerHeight
    || document.documentElement.clientHeight
    || document.getElementsByTagName('body')[0].clientHeight;
