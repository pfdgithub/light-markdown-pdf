const path = require('path');

const logger = require('../logger');
const utils = require('../utils');
const style = require('../style');
const config = require('../config');

const { isType, isBlank } = utils;

module.exports = function render (doc, entering, node, cfg) {
  const { type, isContainer, destination, title } = node;
  const { fullName, state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer, destination, title });

  style.link(doc, entering);

  if (entering) {
    // #region fetch and check image

    let newTarget = destination;
    const { link: linkTransform } = config.transform;
    if (isType(linkTransform, 'Function')) {
      newTarget = linkTransform(destination, fullName);
      logger.debug(`Transform link target: ${destination} -> ${newTarget}`);
    }

    // invalid target
    if (isBlank(newTarget, { detectSpace: true })) {
      logger.warn(`Invalid link target: ${newTarget}`);
      return;
    }

    // anchor target
    let anchorName = null;
    if ((/^http(s)?:\/\//).test(newTarget)) { // remote http
      logger.debug(`Link target to remote http path: ${newTarget}`);
    } else if (path.isAbsolute(newTarget)) { // local absolute
      logger.debug(`Link target to local absolute path: ${newTarget}`);
    } else { // local relative
      logger.debug(`Link target to local relative path: ${newTarget}`);
      anchorName = newTarget; // only allow relative path
      anchorName = decodeURI(anchorName); // decode coded link
    }
    // #endregion

    state.underline = true;
    state.goTo = anchorName;
    state.link = newTarget;
  } else {
    delete state.underline;
    delete state.goTo;
    delete state.link;
  }
}
