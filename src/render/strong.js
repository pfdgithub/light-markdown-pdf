const logger = require('../logger');
const style = require('../style');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;
  const { state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  style.strong(doc, entering);

  if (entering) {
    state.stroke = true;
  } else {
    delete state.stroke;
  }
}
