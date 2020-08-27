const logger = require('../logger');
const style = require('../style');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  style.softbreak(doc, entering);

  // new line (compatible with irregular syntax)
  doc.text('\n');
}
