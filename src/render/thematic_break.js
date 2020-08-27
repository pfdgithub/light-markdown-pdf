const logger = require('../logger');
const style = require('../style');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;
  const { state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  // doc.addPage();

  const y = doc.y;
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const { left, right, top, bottom } = doc.page.margins;
  const startX = left;
  const endX = pageWidth - right;

  style.thematic_break(doc, true);
  doc.moveTo(startX, y).lineTo(endX, y).stroke();
  style.thematic_break(doc, false);

  // new line
  doc.text('\n');
}
