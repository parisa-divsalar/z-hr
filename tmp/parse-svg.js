const fs = require('fs');
const filePath = process.argv[2];
const svg = fs.readFileSync(filePath, 'utf8');

const rectRe = /<rect\b([^>]*)\/>/g;

function attr(s, name) {
  const re = new RegExp(name + '="([^"]*)"');
  const m = s.match(re);
  return m ? m[1] : null;
}

const rects = [];
let m;
while ((m = rectRe.exec(svg))) {
  const a = m[1];
  rects.push({
    x: Number(attr(a, 'x') || 0),
    y: Number(attr(a, 'y') || 0),
    width: Number(attr(a, 'width') || 0),
    height: Number(attr(a, 'height') || 0),
    rx: attr(a, 'rx'),
    fill: attr(a, 'fill'),
    fillOpacity: attr(a, 'fill-opacity'),
    stroke: attr(a, 'stroke'),
    strokeWidth: attr(a, 'stroke-width'),
  });
}

rects.sort((a, b) => (a.y - b.y) || (a.x - b.x));
console.log('rect count:', rects.length);
console.table(rects.slice(0, 30));

const byArea = [...rects].sort((a, b) => (b.width * b.height) - (a.width * a.height));
console.log('--- biggest by area ---');
console.table(byArea.slice(0, 15));
