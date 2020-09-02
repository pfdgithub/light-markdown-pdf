# light-markdown-pdf

Lightweight conversion scheme from markdown to pdf.  

## Warn

Because the Chinese font file is too large, npm cannot upload it.  
Please download the font file from [github](https://github.com/pfdgithub/light-markdown-pdf/blob/master/src/asset/PingFang-SC-Regular.ttf) and use a [custom configuration](#Custom).  

## Intro

No [Puppeteer](https://github.com/puppeteer/puppeteer) or [PhantomJS](https://github.com/ariya/phantomjs/) dependency.  
Use [CommonMark](https://github.com/commonmark/commonmark.js) to convert markdown files to abstract syntax tree (AST), and then use [pdfkit](https://github.com/foliojs/pdfkit) to convert to pdf files.  

## Unsupported

Features outside the [specification](https://spec.commonmark.org/) are not supported.  

e.g.  
- [table](https://talk.commonmark.org/t/tables-in-pure-markdown/81)  
- [strike](https://talk.commonmark.org/t/strikeout-threw-out-strikethrough-strikes-out-throughout/820)  

## Supported

Features inside the [specification](https://spec.commonmark.org/) are supported.  

e.g.  
- document (bookmark)
- text
- linebreak
- softbreak
- emph
- strong
- link (http/anchor)
- thematic_break
- heading (bookmark)
- paragraph
- image (http/local png/jpg)
- code
- code_block (syntax highlighter)
- block_quote (nested)
- list (ordered/unordered/nested)
- item
- html_inline (like code)
- html_block (like code_block)

## Usage

### Install

```shell
npm install --save light-markdown-pdf
```

### CLI

```shell
lmp --help
Usage: lmp [options]

Lightweight conversion scheme from markdown to pdf

Options:
  -V, --version             output the version number
  -s, --sourceDir <dir>     input *.md file directory
  -t, --targetFile <file>   output *.pdf file path
  -c, --configFile <file>   custom config file path
  --verbose                 output all log
  --coverTitle <title>      pdf cover title
  --coverAuthor <author>    pdf cover author
  --coverVersion <version>  pdf cover version
  --fontName <name>         default font name
  --fontFile <file>         default font file path
  --ignoreDirBookmark       don't use directory name as bookmark
  --ignoreFileBookmark      don't use file name as bookmark
  -h, --help                display help for command
```

### Custom

```shell
lmp --sourceDir . --targetFile $npm_package_name.pdf --fontName PingFang --fontFile ./src/asset/PingFang-SC-Regular.ttf --coverTitle $npm_package_name --coverAuthor $npm_package_author_name --coverVersion $npm_package_version
```

or

```shell
lmp --configFile ./src/config.js
```

```javascript
// ./src/config.js

const path = require('path');
const pkg = require('../package.json');

module.exports = {
  sourceDir: process.cwd(),
  targetFile: path.join(process.cwd(), `${pkg.name}@${pkg.version}.pdf`),
  font: {
    defaultFontName: 'PingFang',
    registerFont: {
      PingFang: path.join(process.cwd(), 'src/asset/PingFang-SC-Regular.ttf'),
    },
  },
  cover: {
    title: pkg.name,
    author: pkg.author,
    version: pkg.version,
  },
}
```
