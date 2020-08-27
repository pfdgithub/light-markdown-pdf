# light-markdown-pdf

Lightweight conversion scheme from markdown to pdf.  

## Intro

No [Puppeteer](https://github.com/puppeteer/puppeteer) or [PhantomJS](https://github.com/ariya/phantomjs/) dependency.  

Use [CommonMark](https://github.com/commonmark/commonmark.js) to convert markdown files to abstract syntax tree (AST), and then use [pdfkit](https://github.com/foliojs/pdfkit) to convert to pdf files.  

*Allows to [replace font files](#Custom), can directly render Chinese fonts.*  

## Unsupported markdown features

Features outside the [specification](https://spec.commonmark.org/) are not supported.  

e.g.  
- [table](https://talk.commonmark.org/t/tables-in-pure-markdown/81)  
- [strike](https://talk.commonmark.org/t/strikeout-threw-out-strikethrough-strikes-out-throughout/820)  

## Supported markdown features

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
  --dirBookmark             use directory name as bookmark (default: true)
  --fileBookmark            use file name as bookmark (default: true)
  -h, --help                display help for command
```

### Custom

```javascript
const path = require('path');

module.exports = {
  sourceDir: process.cwd(),
  targetFile: path.join(process.cwd(), `${pkg.name}@${pkg.version}.pdf`),
  log: {
    debug: false,
  },
  page: {
    layout: 'portrait',
    size: 'A4',
    margin: 1, // cm
  },
  font: {
    defaultFontName: 'PingFang',
    registerFont: {
      PingFang: path.join(__dirname, 'asset/PingFang-SC-Regular.ttf'),
    },
  },
  cover: {
    title: '',
    author: '',
    version: '',
  },
  bookmark: {
    dirBookmark: true,
    fileBookmark: true,
  },
  directory: {
    fileSuffix: '.md',
    // String or RegExp (no suffix)
    fileIgnore: [],
    filePriority: ['index', 'readme', 'INDEX', 'README'],
    dirIgnore: ['node_modules'],
    dirPriority: [],
  },
  transform: {
    // custom asset path
    link: (target, file) => (target),
    image: (source, file) => (source),
  },
}
```
