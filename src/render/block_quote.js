const logger = require('../logger');
const style = require('../style');
const utils = require('../utils');

const { cm2point } = utils;
const indentUnit = cm2point(0.5);

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer } = node;
  const { state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer });

  style.block_quote(doc, entering);

  // init quote nesting level (count from 0)
  state.quoteIndentLevel = (typeof state.quoteIndentLevel === 'number')
    ? state.quoteIndentLevel : -1;

  // init quote start point stack
  state.quotePointStack = state.quotePointStack || [];

  if (entering) {
    // don't add a blank lines
    state.blankLine = false;

    // quote nesting level
    state.quoteIndentLevel = state.quoteIndentLevel + 1;

    // start page and point
    const { start, count } = doc.bufferedPageRange();
    const startPage = start + count;
    const { x: startX, y: startY } = doc;

    // push start position
    state.quotePointStack.push([startPage, startX, startY]);

    // add indent
    doc.x = doc.x + indentUnit;
  } else {
    // subtract indent
    doc.x = doc.x - indentUnit;

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const { left, right, top, bottom } = doc.page.margins;

    // pop start position
    const [ startPage, startX, startY ] = state.quotePointStack.pop();
    const { start, count } = doc.bufferedPageRange();

    // end page and point
    const endPage = start + count;
    const endX = doc.x;
    const endY = doc.y;

    // #region quote line (it may span multiple pages)

    for (let curPage = startPage; curPage <= endPage; curPage++) {
      let sx = 0, sy = 0, ex = 0, ey = 0;

      // current page start point
      if (curPage === startPage) {
        sx = startX;
        sy = startY;
      } else {
        sx = startX;
        sy = top;
      }

      // current page end point
      if (curPage === endPage) {
        ex = endX;
        ey = endY;
      } else {
        ex = endX;
        ey = pageHeight - bottom;
      }

      // count from 0
      doc.switchToPage(curPage - 1);

      style.block_quote(doc, true);
      doc.moveTo(sx, sy).lineTo(ex, ey).stroke();
      style.block_quote(doc, false);
    }

    // #endregion

    // reset location
    doc.x = startX;
    doc.y = endY;

    // new line
    doc.text('\n');

    delete state.blankLine;

    // quote nesting level
    if (state.quoteIndentLevel > 0) {
      state.quoteIndentLevel = state.quoteIndentLevel - 1;
    } else {
      delete state.quoteIndentLevel;
      delete state.quotePointStack;
    }
  }
}
