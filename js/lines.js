'use strict';
(function ($) {
  function resize () {
    $('svg').each(function (i, el) {
      var svg = $(el);

      svg.attr('height', 500);
      svg.attr('width', svg.parent().width());
      svg.empty();
      draw(svg);
    });
  }

  $(window).on('resize', resize);
  resize();
}(window.jQuery));

function draw ($svg) {
  var width = $svg.width(),
    height = $svg.height();

  $svg.attr({
    viewbox: '0 0 ' + width + ' ' + height,
    xmlns: 'http://www.w3.org/2000/svg'
  });

  var type = $svg.attr('data-type');
  if (type === 'two-to-one') {
    draw2to1($svg, width, height);
  } else if (type === 'one-to-one') {
    draw1to1($svg, width, height);
  } else {
    console.log($svg);
  }
}

function draw2to1 ($svg, width) {
  var path = create('path');

  var pathDef = [
    'M 0,120',
    'L ' + (width / 2) + ',120',
    'L ' + (width / 2) + ',235',
    'L ' + (width) + ',235'
  ].join(' ');

  setAttr(path, 'd', pathDef);
  // setAttr(path, 'stroke', 'black');
  setAttr(path, 'stroke-width', 15);
  setAttr(path, 'fill', 'none')
  setAttr(path, 'class', 'first zero');

  $svg.append(path);

  // Path 2
  path = create('path');

  pathDef = [
    'M 0,420',
    'L ' + (width / 2) + ',420',
    'L ' + (width / 2) + ',315',
    'L ' + (width) + ',315'
  ].join(' ');

  setAttr(path, 'd', pathDef);
  // setAttr(path, 'stroke', 'black');
  setAttr(path, 'stroke-width', 15);
  setAttr(path, 'fill', 'none');
  setAttr(path, 'class', 'second zero');

  $svg.append(path);

}

function draw1to1 ($svg, width) {
  var path = create('path');

  setAttr(path, 'd', 'M 0,270 L ' + width + ',270');
  // setAttr(path, 'stroke', 'black');
  setAttr(path, 'stroke-width', 15);
  setAttr(path, 'class', 'third zero');

  $svg.append(path);
}

function create (name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function setAttr (el, name, value) {
  el.setAttributeNS(null, name, value);
}
