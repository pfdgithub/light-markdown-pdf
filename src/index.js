const logger = require('./logger');
const utils = require('./utils');
const config = require('./config');
const flow = require('./flow');

const { deepAssign, absolutePath } = utils;
const {
  getDocInstance, getMDNodeTree, renderCover,
  renderMDNodeTree, renderPagination, finishRender,
} = flow;

exports.run = async (cfg) => {
  deepAssign(config, cfg);
  logger.info('Init config', config);

  const { sourceDir, targetFile } = config;

  logger.info(`Collect files`);
  const mdNodeTree = await getMDNodeTree(sourceDir);

  if (mdNodeTree.length === 0) {
    logger.info(`No files found`);
    return;
  }

  logger.info(`Init instance`);
  const docInstance = await getDocInstance(targetFile);

  logger.info(`Render cover`);
  await renderCover(docInstance);

  logger.info(`Render files`);
  await renderMDNodeTree(docInstance, mdNodeTree);

  logger.info(`Render pagination`);
  await renderPagination(docInstance);

  logger.info(`Persistent render`);
  await finishRender(docInstance);

  logger.info(`Finished`);
};
