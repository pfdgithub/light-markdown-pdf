/**
 * runmode/runmode.js
 * Can be used to run a CodeMirror mode over text without actually opening an editor instance.
 * See the [demo](https://codemirror.net/demo/runmode.html) for an example.
 * There are alternate versions of the file available
 * for running [stand-alone](https://codemirror.net/addon/runmode/runmode-standalone.js) (without including all of CodeMirror)
 * and for running [under node.js](https://codemirror.net/addon/runmode/runmode.node.js) (see bin/source-highlight for an example of using the latter).
 */
const CodeMirror = require('codemirror/addon/runmode/runmode.node.js');
require('codemirror/mode/meta.js');

const logger = require('../logger');
const style = require('../style');
const utils = require('../utils');

const { cm2point } = utils;
const codePadding = cm2point(0.2);

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, info, literal } = node;

  logger.debug(`Render node type: ${type}`, { entering, isContainer, info, literal });

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const { left, right, top, bottom } = doc.page.margins;

  // start page and point
  const startRange = doc.bufferedPageRange();
  const startPage = startRange.start + startRange.count;
  const { x: rectStartX, y: rectStartY } = doc;

  // code and rect size
  const codeStartX = rectStartX + codePadding;
  const codeStartY = rectStartY + codePadding;
  const _left = left >= rectStartX ? left : rectStartX; // list indent
  const rectWidth = pageWidth - _left - right;
  const codeWidth = rectWidth - (codePadding * 2);
  const codeHeight = doc.heightOfString(literal, {
    width: codeWidth
  });
  const rectHeight = codeHeight + (codePadding * 2);

  // #region draw code

  style.code_block(doc, true);

  // find language mode
  const lang = info || '';
  const meta = CodeMirror.findModeByMIME(lang)
    || CodeMirror.findModeByName(lang)
    || CodeMirror.findModeByExtension(lang)
    || CodeMirror.findModeByFileName(lang);

  if (lang && meta) {
    const { mode, mime } = meta;

    // load language mode
    if (!CodeMirror.modes[mode]) {
      require(`codemirror/mode/${mode}/${mode}.js`);
    }

    // code start point
    doc.x = codeStartX;
    doc.y = codeStartY;

    // syntax highlighter
    CodeMirror.runMode(literal, mime, (text, type) => {
      const color = style.syntaxColors[type] || style.syntaxColors.default;
      doc.fillColor(color);
      doc.text(text, {
        continued: text !== '\n',
        width: codeWidth,
      });
    });
  } else {
    // default color
    doc.text(literal, codeStartX, codeStartY, {
      width: codeWidth
    });
  }

  style.code_block(doc, false);

  // #endregion

  // end page and point
  const endRange = doc.bufferedPageRange();
  const endPage = endRange.start + endRange.count;
  const { x: codeEndX, y: codeEndY } = doc;
  const rectEndX = rectStartX + rectWidth;
  const rectEndY = codeEndY + codePadding;

  // #region draw rect (it may span multiple pages)

  for (let curPage = startPage; curPage <= endPage; curPage++) {
    let sx = 0, sy = 0, ex = 0, ey = 0;

    // current page start point
    if (curPage === startPage) {
      sx = rectStartX;
      sy = rectStartY;
    } else {
      sx = rectStartX;
      sy = top;
    }

    // current page end point
    if (curPage === endPage) {
      ex = rectEndX;
      ey = rectEndY;
    } else {
      ex = rectEndX;
      ey = pageHeight - bottom;
    }

    // count from 0
    doc.switchToPage(curPage - 1);

    style.code_block_container(doc, true);

    // rect container
    doc.moveTo(sx, sy).lineTo(sx, ey).stroke(); // left line
    doc.moveTo(ex, sy).lineTo(ex, ey).stroke(); // right line
    if (curPage === startPage) {
      doc.moveTo(sx, sy).lineTo(ex, sy).stroke(); // top line
    }
    if (curPage === endPage) {
      doc.moveTo(sx, ey).lineTo(ex, ey).stroke(); // bottom line
    }

    style.code_block_container(doc, false);
  }

  // #endregion

  // reset location
  doc.x = rectStartX;
  doc.y = rectEndY;

  // new line
  doc.text('\n');
}
