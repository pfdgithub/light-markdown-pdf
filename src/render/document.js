const logger = require('../logger');
const utils = require('../utils');
const style = require('../style');

const { createAnchor } = utils;

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;
  const { fullName, state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  style.document(doc, entering);

  state.innerText = '';

  if (entering) {
    // file anchor
    const anchorName = createAnchor(fullName);
    doc.addNamedDestination(anchorName);
    logger.debug(`Create document anchor: ${anchorName}`);
  } else {

  }
}
