const fs = require('fs');
const path = require('path');
const util = require('util');
const sizeOf = require('image-size');
const { detector } = require('image-size/dist/detector');

const logger = require('../logger');
const utils = require('../utils');
const style = require('../style');
const config = require('../config');

const { isType, isBlank, fetch } = utils;

module.exports = async function render (doc, entering, node, cfg) {
  const { type, isContainer, destination, title } = node;
  const { fullName, state } = cfg;

  logger.debug(`Render node type: ${type}`, { entering, isContainer, destination, title });

  if (entering) {
    // new line
    doc.text('\n');

    state.align = 'center';

    // #region fetch and check image

    let isNormal = true;
    let imageBuffer = null;

    let newSource = destination;
    const { image: sourceTransform } = config.transform;
    if (isType(sourceTransform, 'Function')) {
      newSource = sourceTransform(destination, fullName);
      logger.debug(`Transform image source: ${destination} -> ${newSource}`);
    }
    newSource = decodeURI(newSource); // decode coded link

    // invalid source
    if (isNormal) {
      if (isBlank(newSource, { detectSpace: true })) {
        logger.warn(`Invalid image source: ${newSource}`);
        isNormal = false;
      }
    }

    // fetch image
    if (isNormal) {
      try {
        if ((/^http(s)?:\/\//).test(newSource)) { // remote http
          logger.info(`Fetch image from remote http path: ${newSource}`);
      
          imageBuffer = await fetch(newSource);
        } else if (path.isAbsolute(newSource)) { // local absolute
          logger.info(`Fetch image from local absolute path: ${newSource}`);
          
          imageBuffer = await util.promisify(fs.readFile)(newSource);
        } else { // local relative
          logger.info(`Fetch image from local relative path: ${newSource}`);

          const newPath = path.resolve(path.dirname(fullName), newSource);
          imageBuffer = await util.promisify(fs.readFile)(newPath);
        }
      } catch (error) {
        logger.warn(`Fetch image failed: ${error.message}`);
        isNormal = false;
      }
    }

    // invalid buffer
    if (isNormal) {
      if (!(imageBuffer && imageBuffer.length > 0)) {
        logger.warn(`Invalid image buffer: ${imageBuffer ? imageBuffer.length : null}`);
        isNormal = false;
      }
    }

    // invalid type
    if (isNormal) {
      const imageType = detector(imageBuffer);
      if (!(imageType === 'png' || imageType === 'jpg'
        /*|| imageType === 'jp2' || imageType === 'j2c'*/)) {
        logger.warn(`Unsupported image type: ${imageType}`);
        isNormal = false;
      }
    }

    // broken image
    if (!isNormal) {
      imageBuffer = Buffer.from(style.defaultImage, 'base64');
    }

    // invalid size
    const imageSize = sizeOf(imageBuffer);
    const imageWidth = imageSize.width;
    const imageHeight = imageSize.height;
    if (!(imageWidth && imageHeight)) {
      logger.error(`Invalid image size: ${imageWidth} ${imageHeight}`);
      return;
    }

    // #endregion

    // #region zoom and position image

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const { left, right, top, bottom } = doc.page.margins;

    // useable space
    let useableWidth = pageWidth - doc.x - right;
    let useableHeight = pageHeight - doc.y - bottom;

    // if (useableWidth < imageWidth) {
    //   // new line
    //   doc.text('\n');

    //   useableWidth = pageWidth - doc.x - right;
    //   useableHeight = pageHeight - doc.y - bottom;
    // }

    // zoom image
    let scaleWidth = useableWidth < imageWidth ? useableWidth / imageWidth : 1;
    let scaleHeight = useableHeight < imageHeight ? useableHeight / imageHeight : 1;
    let scaleSize = scaleWidth < scaleHeight ? scaleWidth : scaleHeight;
    let graphicWidth = scaleWidth * imageWidth;
    let graphicHeight = scaleWidth * imageHeight;

    if (useableHeight < graphicHeight + doc.currentLineHeight()) {
      // new page
      doc.addPage();

      useableWidth = pageWidth - doc.x - right;
      useableHeight = pageHeight - doc.y - bottom;
    }

    scaleWidth = useableWidth < imageWidth ? useableWidth / imageWidth : 1;
    scaleHeight = useableHeight < imageHeight ? useableHeight / imageHeight : 1;
    scaleSize = scaleWidth < scaleHeight ? scaleWidth : scaleHeight;
    graphicWidth = scaleSize * imageWidth;
    graphicHeight = scaleSize * imageHeight;
  
    // position image
    const options = {
      width: graphicWidth,
      height: graphicHeight,
      x: ((useableWidth - graphicWidth) / 2) + doc.x,
    };

    // #endregion

    style.image(doc, entering);

    doc.image(imageBuffer, options);
  } else {
    delete state.align;

    // new line
    doc.text('\n');

    style.image(doc, entering);
  }
}
