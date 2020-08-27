const logger = require('../logger');
const style = require('../style');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  style.linebreak(doc, entering);

  // new line
  doc.text('\n');
}
