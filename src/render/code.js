const logger = require('../logger');
const style = require('../style');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, literal } = node;

  logger.debug(`Render node type: ${type}`, { entering, isContainer, literal });

  style.code(doc, true);

  doc.text(literal, {
    continued: true,
  });

  style.code(doc, false);
}
