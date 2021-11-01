const fs = require('fs-extra');
const path = require('path');

function findSubdirs(p) {
  return fs.readdirSync(p).filter((f) => fs.statSync(path.join(p, f)).isDirectory());
}

module.exports = findSubdirs;