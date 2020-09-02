const logger = require('../logger');
const utils = require('../utils');
const style = require('../style');

const { cm2point, createAnchor } = utils;
const padding = cm2point(0.2);

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, level } = node;
  const { fullName, topOutline, state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer, level });

  // init heading bookmark
  state.headingOutline = state.headingOutline || [
    topOutline, // top bookmark
    null, // h1 bookmark
    null, // h2 bookmark
    null, // h3 bookmark
    null, // h4 bookmark
    null, // h5 bookmark
    null, // h6 bookmark
  ];

  if (entering) {
    style.heading(doc, entering, level);

    // the text segment mybe be followed immediately by another segment
    state.continued = true;

    // snapshot innerText
    state.headingInnerText = state.innerText;

    // padding top
    doc.y = doc.y + padding;
  } else {
    const {
      innerText: actual,
      headingInnerText: snapshot,
    } = state;

    delete state.continued;
    delete state.headingInnerText;

    // heading text
    const diff = actual.replace(snapshot, '');

    // get parent bookmark 
    const parentIdx = level - 1;
    const parentOutline = state.headingOutline[parentIdx];

    if (parentOutline && diff) {
      // create bookmark
      const currOutline = parentOutline.addItem(diff);
      // update to current bookmark
      state.headingOutline[level] = currOutline;
      logger.debug(`Create bookmark: ${diff}`);
    }

    if (diff) {
      // heading anchor
      const anchorName = createAnchor(fullName, diff);
      doc.addNamedDestination(anchorName);
      logger.debug(`Create heading anchor: ${anchorName}`);
    }

    // new line
    doc.text('\n');

    // padding bottom
    doc.y = doc.y + padding;

    style.heading(doc, entering, level);
  }
}
