const logger = require('../logger');
const style = require('../style');
const code = require('./code');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, literal } = node;

  logger.debug(`Render node type: ${type}`, { entering, isContainer, literal });

  style.html_inline(doc, true);

  code(doc, entering, node, cfg);

  style.html_inline(doc, false);
}
