const fs = require('fs');
const util = require('util');
const commonmark = require('commonmark');

const logger = require('./logger');
const renderMap = {
  document: require('./render/document'),
  text: require('./render/text'),
  linebreak: require('./render/linebreak'),
  softbreak: require('./render/softbreak'),
  emph: require('./render/emph'),
  strong: require('./render/strong'),
  link: require('./render/link'),
  thematic_break: require('./render/thematic_break'),
  heading: require('./render/heading'),
  paragraph: require('./render/paragraph'),
  image: require('./render/image'),
  code: require('./render/code'),
  code_block: require('./render/code_block'),
  block_quote: require('./render/block_quote'),
  list: require('./render/list'),
  item: require('./render/item'),
  html_inline: require('./render/html_inline'),
  html_block: require('./render/html_block'),
};

const { Parser } = commonmark;

module.exports = function MDNode ({
  name,
  fullName,
  children,
}) {
  this.name = name;
  this.fullName = fullName;
  this.children = children;

  this.parser = new Parser();

  this.render = async (doc, config) => {
    if (this.children) {
      logger.error(`Unsupported render directory: ${this.fullName}`);
      return;
    }

    logger.info(`Render file: ${this.fullName}`);

    const {
      getParentOutline = () => doc.outline
    } = config || {};

    // new page (will reset styling?)
    doc.addPage();

    // parent bookmark
    const parentOutline = getParentOutline();

    // render config
    const renderCfg = {
      fullName: this.fullName,
      // file bookmark
      topOutline: parentOutline,
      // content state
      state: {},
    };

    // read markdown file
    const file = await util.promisify(fs.readFile)(this.fullName);
    const text = file.toString();

    // convert to abstract syntax tree
    const parsed = this.parser.parse(text);
    const walker = parsed.walker();

    let event;
    while ((event = walker.next())) {
      // https://github.com/commonmark/commonmark.js#usage
      const { node, entering } = event;
      const { type, isContainer } = node;

      if (renderMap[type]) {
        await renderMap[type](doc, entering, node, renderCfg);
      } else {
        logger.warn(`Unsupported node type: ${type}`, { entering, isContainer });
      }
    }
  };
}
