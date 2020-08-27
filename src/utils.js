const path = require('path');
const http = require('http');
const https = require('https');

const config = require('./config');

exports.pdfDPI = 72;

exports.cm2point = (cm) => (0.3937008 * cm * this.pdfDPI);

exports.isType = (val, type) => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

exports.ascendingSort = (a, b) => a < b ? -1 : (a > b ? 1 : 0)

exports.absolutePath = (fileName, baseDir) => {
  let filePath = fileName;
  if (baseDir) {
    filePath = path.join(baseDir, fileName)
  }

  if (path.isAbsolute(filePath)) {
    return filePath;
  } else {
    return path.join(process.cwd(), filePath);;
  }
};

exports.relativePath = (fullName, baseDir) => {
  let from = process.cwd();
  if (baseDir) {
    from = baseDir;
  }

  return path.relative(from, fullName);
}

exports.isBlank = (text, options) => {
  const {
    detectEmpty = false,
    detectSpace = false,
  } = options || {};

  if (text === undefined) {
    return true;
  }
  if (text === null) {
    return true;
  }
  if (detectEmpty && text === '') {
    return true;
  }
  if (detectSpace && (/^\s*$/).test(text)) {
    return true;
  }
  return false;
};

exports.deepAssign = (to, from) => {
  let target = to;

  if (!this.isType(target, 'Array') && this.isType(from, 'Array')) {
    target = [];
  } else if (!this.isType(target, 'Object') && this.isType(from, 'Object')) {
    target = {};
  }

  if (this.isType(from, 'Array')) {
    from.forEach((item) => {
      const newItem = this.deepAssign(undefined, item);
      if (newItem !== undefined) {
        target.push(newItem);
      }
    });
  } else if (this.isType(from, 'Object')) {
    for (const key in from) {
      if (from.hasOwnProperty(key)) {
        target[key] = this.deepAssign(target[key], from[key]);
      }
    }
  } else if (from !== undefined) {
    target = from;
  }

  return target;
}

exports.fetch = (url) => {
  const protocol = (/^https:\/\//).test(url) ? https : http;
  return new Promise((resolve, reject) => {
    protocol.get(url, (res) => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        res.resume();
        reject(new Error(`Status code: ${statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
};

exports.createAnchor = (fullName, anchorName) => {
  let aName = anchorName && anchorName.trim();

  let targetName = fullName;
  if (aName) {
    targetName = `${fullName}#${aName}`
  }

  // privacy protection
  const localName = this.relativePath(targetName);
  return encodeURI(localName);
};

exports.gotoAnchor = (fullName, anchorName) => {
  const { fileSuffix } = config.directory;

  let aName = anchorName && anchorName.trim();

  let targetName = fullName;
  if (aName) {
    if ((/^#/).test(aName)) {
      // only hash
      targetName = `${fullName}${aName}`;
    } else {
      // relative path
      aName = path.normalize(aName);
      let [fragment, hash] = aName.split('#');
      if (fragment) {
        if (!path.extname(fragment)) {
          // no suffix
          fragment = `${fragment}${fileSuffix}`;
        }

        const dirname = path.dirname(fullName);
        const resolve = path.resolve(dirname, fragment);
        targetName = resolve;

        if (hash) {
          targetName = `${resolve}#${hash}`;
        }
      }
    }
  }

  // privacy protection
  const localName = this.relativePath(targetName);
  return encodeURI(localName);
};
