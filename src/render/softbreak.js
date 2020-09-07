const logger = require('../logger');
const style = require('../style');
const config = require('../config');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  style.softbreak(doc, entering);

  const { softbreak } = config.styling;

  // default new line (compatible with irregular syntax)
  if (softbreak) {
    doc.text(softbreak);
  }
}
