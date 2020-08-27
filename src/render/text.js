const logger = require('../logger');
const utils = require('../utils');
const style = require('../style');

const { gotoAnchor } = utils;

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, literal } = node;
  const { fullName, state } = cfg;
  const {
    innerText = '',
    continued = false,
    underline = false,
    oblique = false,
    stroke = false,
    goTo = null,
    link = null,
    align = 'left',
  } = state;

  logger.debug(`Render node type: ${type}`, { entering, isContainer, literal });

  style.text(doc, entering);

  state.innerText = innerText + literal;

  // text options
  const options = {};

  // #region styling
  options.continued = continued;
  options.underline = underline;
  options.oblique = oblique;
  options.stroke = stroke;
  options.align = align;
  // #endregion

  // #region link
  if (goTo) {
    const anchorName = gotoAnchor(fullName, goTo);
    options.goTo = anchorName;
    logger.debug(`Goto anchor: ${anchorName}`);
  } else {
    options.link = link;
  }
  // #endregion

  doc.text(literal, options);
}
