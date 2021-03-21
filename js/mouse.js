const mouse = {
  x: 0,
  y: 0,
  isLeftDown: false,
};

function getmousePosition( e )
{
  let v = e || window.event;
  let x = v.pageX;
  let y = v.pageY;

  // IE 8
  if ( x === undefined || x === null ) {
    const { scrollLeft, scrollTop } = document.body
    const { documentElement } = document
    x = v.clientX + scrollLeft + documentElement.scrollLeft;
    y = v.clientY + scrollTop + documentElement.scrollTop;
  }

  mouse.x = x;
  mouse.y = y;
};

document.addEventListener( 'mousemove', getmousePosition );