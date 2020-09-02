const logger = require('../logger');
const style = require('../style');
const utils = require('../utils');

const { cm2point } = utils;
const indentUnit = cm2point(0.7);

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
  state.listItemSets = state.listItemSets || [];

  if (entering) {
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
    state.listItemSets[state.listIndentLevel] = {
      index: startIndex,
      tight: listTight,
    };

    // add indent
    doc.x = doc.x + indentUnit;
  } else {
    // subtract indent
    doc.x = doc.x - indentUnit;

    // list nesting level
    if (state.listIndentLevel > 0) {
      state.listIndentLevel = state.listIndentLevel - 1;
    } else {
      delete state.listIndentLevel;
      delete state.listItemSets;
    }
  }
}
