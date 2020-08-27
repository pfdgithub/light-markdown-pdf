const logger = require('../logger');
const style = require('../style');
const utils = require('../utils');

const { cm2point } = utils;
const indentUnit = cm2point(0.5);

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, listType, listTight, listStart, listDelimiter } = node;
  const { state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer
    , listType, listTight, listStart, listDelimiter });

  style.list(doc, entering);

  // init list nesting level (count from 0)
  state.listIndentLevel = (typeof state.listIndentLevel === 'number')
    ? state.listIndentLevel : -1;

  // init list cycle index
  state.listItemIndexSets = state.listItemIndexSets || [];

  if (entering) {
    // add a blank line if list is tight
    state.blankLine = !listTight;

    // list nesting level
    state.listIndentLevel = state.listIndentLevel + 1;

    // list cycle index
    let startIndex;
    if (listType === 'bullet') {
      // unordered list
      startIndex = null;
    } else if (listType === 'ordered') {
      // ordered list
      startIndex = listStart;
    }
    state.listItemIndexSets[state.listIndentLevel] = startIndex;

    // add indent
    doc.x = doc.x + indentUnit;
  } else {
    // subtract indent
    doc.x = doc.x - indentUnit;

    // add blank line (block margin)
    if (listTight) {
      doc.text('\n');
    }

    delete state.blankLine;

    // list nesting level
    if (state.listIndentLevel > 0) {
      state.listIndentLevel = state.listIndentLevel - 1;
    } else {
      delete state.listIndentLevel;
      delete state.listItemIndexSets;
    }
  }
}
