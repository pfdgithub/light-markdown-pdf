const logger = require('../logger');
const style = require('../style');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;
  const { state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  style.emph(doc, entering);

  if (entering) {
    state.oblique = true;
  } else {
    delete state.oblique;
  }
}
