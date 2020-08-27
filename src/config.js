const path = require('path');

const pkg = require('../package.json');

const log = {
  debug: false,
};

const page = {
  layout: 'portrait',
  size: 'A4',
  margin: 1, // cm
};

const font = {
  defaultFontName: '',
  registerFont: {},
};

const cover = {
  title: '',
  author: '',
  version: '',
};

const bookmark = {
  dirBookmark: true,
  fileBookmark: true,
};

const directory = {
  fileSuffix: '.md',
  // String or RegExp (no suffix)
  fileIgnore: [],
  filePriority: ['index', 'readme', 'INDEX', 'README'],
  dirIgnore: ['node_modules'],
  dirPriority: [],
};

const transform = {
  // custom asset path
  link: (target, file) => (target),
  image: (source, file) => (source),
};

module.exports = {
  sourceDir: '',
  targetFile: '',
  log,
  page,
  font,
  cover,
  bookmark,
  directory,
  transform,
};