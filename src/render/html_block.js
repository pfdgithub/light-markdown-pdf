const logger = require('../logger');
const style = require('../style');
const code_block = require('./code_block');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, literal } = node;

  logger.debug(`Render node type: ${type}`, { entering, isContainer, literal });

  style.html_block(doc, true);

  code_block(doc, entering, node, cfg);

  style.html_block(doc, false);
}
