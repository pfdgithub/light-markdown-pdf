const fs = require('fs');
const path = require('path');
const util = require('util');
const PDFDocument = require('pdfkit');

const config = require('./config');
const logger = require('./logger');
const MDNode = require('./md-node');
const utils = require('./utils');
const style = require('./style');

const { cm2point, isType, ascendingSort, absolutePath } = utils;

exports.getMDNodeTree = async (currDir) => {
  const { fileSuffix, fileIgnore, filePriority, dirIgnore, dirPriority } = config.directory;

  // absolute path
  const getFullName = (name) => absolutePath(name, currDir);

  // check ignore and priority
  const isMatchRule = (ruleList, val) => {
    return ruleList.some((rule) => {
      if (isType(rule, 'String')) {
        return rule === val;
      }
      if (isType(rule, 'RegExp')) {
        return rule.test(val);
      }
      return false;
    });
  };

  // dir and file
  const direntList = await util.promisify(fs.readdir)(absolutePath(currDir));

  const dirList = [];
  const fileList = [];

  // filter dir and file
  for (let i = 0; i < direntList.length; i++) {
    const dirent = direntList[i];

    const fullName = getFullName(dirent);
    const stat = await util.promisify(fs.stat)(fullName);

    if (stat.isDirectory()) {
      if (isMatchRule(dirIgnore, dirent)) {
        logger.warn(`Ignore directory name: ${fullName}`);
      } else {
        dirList.push(dirent);
      }
    } else if (stat.isFile()) {
      // *.md file
      if (path.extname(dirent) === fileSuffix) {
        if (isMatchRule(fileIgnore, dirent)) {
          logger.warn(`Ignore file name: ${fullName}`);
        } else {
          fileList.push(dirent);
        }
      }
    } else {
      logger.warn(`Unsupported dirent type: ${fullName}`);
    }
  }

  // sort dir and file
  dirList.sort((a, b) => {
    if (isMatchRule(dirPriority, a)) {
      return -1;
    }
    return ascendingSort(a, b);
  });
  fileList.sort((a, b) => {
    // Ensure that index or readme will always be the first
    const aName = path.basename(a, fileSuffix);
    const bName = path.basename(b, fileSuffix);
    if (isMatchRule(filePriority, aName)) {
      return -1;
    }
    return ascendingSort(aName, bName);
  });

  // convert to MDNode
  const mdNodeList = [];
  for (let i = 0; i < fileList.length; i++) {
    const fileName = fileList[i];

    mdNodeList.push(new MDNode({
      name: path.basename(fileName, fileSuffix),
      fullName: getFullName(fileName),
    }));
  }

  for (let i = 0; i < dirList.length; i++) {
    const dirName = dirList[i];
    const dirPath = getFullName(dirName);

    // recursion dir
    const nodeList = await this.getMDNodeTree(dirPath);

    // discard invalid directory
    if (nodeList.length > 0) {
      mdNodeList.push(new MDNode({
        name: dirName,
        fullName: dirPath,
        children: nodeList,
      }));
    }
  }

  return mdNodeList;
}

exports.getDocInstance = (targetFile) => {
  const { layout, size, margin } = config.page;
  const { defaultFontName, registerFont } = config.font;
  const { title, author } = config.cover;

  // page config
  const options = {
    layout,
    size,
    margin: cm2point(margin),
    info: {},
    autoFirstPage: false, // disable auto create first page
    bufferPages: true, // disable auto flush page
  };
  if (title) {
    options.info.Title = title;
  }
  if (author) {
    options.info.Author = author;
  }

  const target = fs.createWriteStream(absolutePath(targetFile));
  const doc = new PDFDocument(options);
  doc.pipe(target);

  // font config
  if (registerFont) {
    Object.keys(registerFont).map((fontName) => {
      const fontSrc = registerFont[fontName];
      doc.registerFont(fontName, absolutePath(fontSrc));
    });
  }
  if (defaultFontName) {
    doc.font(defaultFontName);
  }

  return doc;
};

exports.renderCover = (doc) => {
  const { title, author, version } = config.cover;

  if (!(title || author || version)) {
    return;
  }

  // new page
  doc.addPage();

  // Center and right aligned
  let titleWidth = 0;

  // render title
  if (title) {
    // cover bookmark
    doc.outline.addItem(title);

    style.title(doc);
    titleWidth = doc.widthOfString(title || '');
    doc.y = doc.page.height / 2 - doc.currentLineHeight();
    doc.text(title, { align: 'center' });
  }

  // render author
  if (author) {
    style.author(doc);
    doc.text(author, {
      align: 'center',
      indent: titleWidth ? (titleWidth - doc.widthOfString(author)) : 0,
    });
  }

  // render version
  if (version) {
    style.version(doc);
    doc.text(version, {
      align: 'center',
      indent: titleWidth ? (titleWidth - doc.widthOfString(version)) : 0,
    });
  }
};

exports.renderMDNodeTree = async (doc, mdNodeList, cfg) => {
  const {
    dirBookmark = false, // use dir name as bookmark
    fileBookmark = false, // use file name as bookmark

    getParentOutline = null, // get parent bookmark
  } = cfg || config.bookmark;

  // current recursion depth bookmark
  let recursionOutline = null;
  const getCurrOutline = () => {
    if (recursionOutline) {
      return recursionOutline;
    }
    if (getParentOutline) {
      return getParentOutline();
    }
    return doc.outline;
  };

  for (let i = 0; i < mdNodeList.length; i++) {
    const mdNode = mdNodeList[i];
    const { name, children } = mdNode;

    if (children) {
      // dir bookmark
      const onPageAdded = () => {
        recursionOutline = getCurrOutline();
        if (dirBookmark) {
          return recursionOutline.addItem(name);
        }
        return recursionOutline;
      }

      // recursion dir
      await this.renderMDNodeTree(doc, children, {
        ...config.bookmark,
        // after create new page, before add file bookmarks 
        getParentOutline: onPageAdded
      });
    } else {
      // file bookmark
      const onPageAdded = () => {
        recursionOutline = getCurrOutline();
        if (fileBookmark) {
          return recursionOutline.addItem(name);
        }
        return recursionOutline;
      }

      // render file
      await mdNode.render(doc, {
        // after create new page, before add heading bookmarks 
        getParentOutline: onPageAdded
      });
    }
  }
};

exports.renderPagination = (doc) => {
  // the range of buffered pages
  const { start, count } = doc.bufferedPageRange();
  const end = start + count;

  for (let i = start; i < end; i++) {
    doc.switchToPage(i);
    style.pagination(doc);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const { left, right, top, bottom } = doc.page.margins;

    const line = doc.currentLineHeight();
    const y = pageHeight - (bottom + line) / 2;

    doc.page.margins.bottom = 0;
    doc.text(`${i + 1}/${count}`, 0, y, {
      align: 'right',
    });
    doc.page.margins.bottom = bottom;
  }
};

exports.finishRender = (doc) => {
  doc.flushPages();
  doc.end();
};
