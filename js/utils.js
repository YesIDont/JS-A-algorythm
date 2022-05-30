const log = console.log;

function flipCoin() {
  return Math.random() < 0.49;
}

function dice100(chance) {
  let random = Math.round(Math.random() * 100);

  return random < chance;
}

function fillCircle(ctx, center, radius, color = '#FF0000') {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function getRandomFromRange(min = 0, max = 1, shouldRound = false) {
  const random = Math.random() * (max - min) + min;

  return shouldRound ? Math.round(random) : random;
}

function compareNumbers(first, second) {
  return first > second ? 1 : first === second ? 0 : -1;
}

function getWindowInnerSize() {
  return {
    width:
      window.innerWidth && document.documentElement.clientWidth
        ? Math.min(window.innerWidth, document.documentElement.clientWidth)
        : window.innerWidth ||
          document.documentElement.clientWidth ||
          document.getElementsByTagName('body')[0].clientWidth,

    height:
      window.innerHeight && document.documentElement.clientHeight
        ? Math.min(window.innerHeight, document.documentElement.clientHeight)
        : window.innerHeight ||
          document.documentElement.clientHeight ||
          document.getElementsByTagName('body')[0].clientHeight,
  };
}

// function wait(timeToWait, callback) {
//   let startTime = new Date().getTime();
//   let counter = 0;
//   while (counter < timeToWait) {
//     counter = new Date().getTime() - startTime;
//   }
//   if (callback) callback();
// }

// function waitFor(conditionCheck, callback, interval = 0) {
//   if (conditionCheck()) {
//     callback();
//   } else {
//     setTimeout(() => {
//       waitFor(conditionCheck, callback, interval);
//     }, interval);
//   }
// }

function doNTimes(n, callback) {
  for (let i = 0; i < n; i++) {
    callback();
  }
}
