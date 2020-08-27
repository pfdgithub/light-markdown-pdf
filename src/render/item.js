const logger = require('../logger');
const style = require('../style');
const utils = require('../utils');

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, listType, listTight, listStart, listDelimiter } = node;
  const { state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer
    , listType, listTight, listStart, listDelimiter });

  style.item(doc, entering);

  // current list cycle index
  const currentIndex = state.listItemIndexSets[state.listIndentLevel];

  if (entering) {
    const startX = doc.x;
    const startY = doc.y;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const { left, right, top, bottom } = doc.page.margins;
    const contentWidth = pageWidth - left - right;
    const contentHeight = pageHeight - top - bottom;
    const lineHeight = doc.currentLineHeight();

    // remain height
    const useableHeight = contentHeight - startY;
    if (useableHeight < lineHeight) {
      // new page
      doc.addPage();
      // keep indent
      doc.x = startX;
    }

    const x = doc.x;
    const y = doc.y;
    const indexWidth = doc.widthOfString('abcd'); // about 4 characters width
    const spaceWidth = doc.widthOfString('a'); // about 1 character width

    if (typeof currentIndex === 'number') { // ordered list
      const indexX = x - indexWidth;

      // list index
      doc.text(`${currentIndex}.`, indexX, y, {
        align: 'right',
        height: lineHeight,
        width: indexWidth - spaceWidth,
      });
    } else { // unordered list
      const radius = lineHeight / 6;
      const indexX = x - spaceWidth - radius;
      const indexY = y + lineHeight / 2;

      // list index
      doc.circle(indexX, indexY, radius).fill();
    }

    // reset location
    doc.x = x;
    doc.y = y;
  } else {
    // add list cycle index
    if (typeof currentIndex === 'number') {
      state.listItemIndexSets[state.listIndentLevel] = currentIndex + 1;
    }
  }
}
