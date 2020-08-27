const logger = require('../logger');
const style = require('../style');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;
  const { state } = cfg;
  const {
    blankLine = true
  } = state;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  style.paragraph(doc, entering);

  if (entering) {
    // the text segment mybe be followed immediately by another segment
    state.continued = true;
  } else {
    delete state.continued;

    // new line
    doc.text('\n');

    // add blank line (block margin)
    if (blankLine) {
      doc.text('\n');
    }
  }
}
