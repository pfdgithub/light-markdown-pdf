// #region base styling

const defFontSize = 12;
const defColor = '#24292e';
const defLineWidth = 1;
const defStrokeColor = '#24292e';

// default styling
exports.defaults = (doc) => {
  doc.fontSize(defFontSize);
  doc.fillColor(defColor);
  doc.lineWidth(defLineWidth);
  doc.strokeColor(defStrokeColor);
};

// #endregion

// #region file styling

// file title
exports.title = (doc) => {
  this.defaults(doc);
  doc.fontSize(40);
  doc.fillColor(defColor);
};

// file author
exports.author = (doc) => {
  this.defaults(doc);
  doc.fontSize(20);
  doc.fillColor(defColor);
};

// file version
exports.version = (doc) => {
  this.defaults(doc);
  doc.fontSize(10);
  doc.fillColor(defColor);
};

// file pagination
exports.pagination = (doc) => {
  this.defaults(doc);
  doc.fontSize(10);
  doc.fillColor('#ccc');
};

// #endregion

// #region node styling

exports.document = (doc, entering) => {
  this.defaults(doc);
};

exports.text = (doc, entering) => {
  // no styling
};

exports.linebreak = (doc, entering) => {
  // no styling
};

exports.softbreak = (doc, entering) => {
  // no styling
};

exports.emph = (doc, entering) => {
  // no styling
};

exports.strong = (doc, entering) => {
  // no styling
};

exports.link = (doc, entering) => {
  if (entering) {
    doc.fillColor('#0366d6');
  } else {
    doc.fillColor(defColor);
  }
};

exports.thematic_break = (doc, entering) => {
  this.defaults(doc);
  if (entering) {
    doc.lineWidth(1);
    doc.strokeColor('#ccc');
  } else {
    doc.lineWidth(defLineWidth);
    doc.strokeColor(defStrokeColor);
  }
};

exports.heading = (doc, entering, level) => {
  this.defaults(doc);
  if (entering) {
    if (level === 1) {
      doc.fontSize(26);
    } else if (level === 2) {
      doc.fontSize(20);
    } else {
      doc.fontSize(14);
    }
  } else {
    doc.fontSize(defFontSize);
  }
};

exports.paragraph = (doc, entering) => {
  this.defaults(doc);
};

exports.image = (doc, entering) => {
  this.defaults(doc);
  if (entering) {
    doc.fillColor('#999');
  } else {
    doc.fillColor(defColor);
  }
};

exports.code = (doc, entering) => {
  this.defaults(doc);
  if (entering) {
    doc.fillColor('#c7254e');
  } else {
    doc.fillColor(defColor);
  }
};

exports.code_block_container = (doc, entering) => {
  this.defaults(doc);
  if (entering) {
    doc.lineWidth(1);
    doc.strokeColor('#ccc');
  } else {
    doc.lineWidth(defLineWidth);
    doc.strokeColor(defStrokeColor);
  }
};

exports.code_block = (doc, entering) => {
  this.defaults(doc);
  if (entering) {
    doc.fillColor('#333');
  } else {
    doc.fillColor(defColor);
  }
};

exports.block_quote = (doc, entering) => {
  this.defaults(doc);
  if (entering) {
    doc.lineWidth(1);
    doc.strokeColor('#ccc');
  } else {
    doc.lineWidth(defLineWidth);
    doc.strokeColor(defStrokeColor);
  }
};

exports.list = (doc, entering) => {
  this.defaults(doc);
};

exports.item = (doc, entering) => {
  this.defaults(doc);
};

exports.html_inline = (doc, entering) => {
  this.defaults(doc);
};

exports.html_block = (doc, entering) => {
  this.defaults(doc);
};

// exports.custom_inline = (doc, entering) => {
//   this.defaults(doc);
// };

// exports.custom_block = (doc, entering) => {
//   this.defaults(doc);
// };

// #endregion

// #region syntax styling

// syntax highlighting colors
exports.syntaxColors = {
  default: '#002b36',
  keyword: '#cb4b16',
  atom: '#d33682',
  number: '#009999',
  def: '#2aa198',
  variable: '#108888',
  'variable-2': '#b58900',
  'variable-3': '#6c71c4',
  property: '#2aa198',
  operator: '#6c71c4',
  comment: '#999988',
  string: '#dd1144',
  'string-2': '#009926',
  meta: '#768E04',
  qualifier: '#b58900',
  builtin: '#d33682',
  bracket: '#cb4b16',
  tag: '#93a1a1',
  attribute: '#2aa198',
  header: '#586e75',
  quote: '#93a1a1',
  link: '#93a1a1',
  special: '#6c71c4',
};

// #endregion

// #region broken image

// data:image/png;base64,
// https://www.underconsideration.com/brandnew/archives/google_broken_image_00_b_logo_detail.gif
exports.defaultImage = `\
iVBORw0KGgoAAAANSUhEUgAAABQAAAAYCAIAAAB1KUohAAACpklEQVR4AYyUA6wlSxRFO7Z/jD8z\
cSYe27Zt27Zt28azbdu2bV6snnrXrOx0SuvsU2opNjY2PDzMpnx9/Gpra1WGRXr8+PGXT19dXdz+\
OjiblYOTy6/ff86cPoNNS0uLAfzq5cvs7Fxqbd0WVVnbhMetWzfxN4ZjErNqGhUl1T1COeW9iIqu\
p7j2ypUreJSWlpIF/jo4JDq7oEqRVtSeXiyT2hA0RU9yjgyzZjAWSBTq/+AXz4CZkZTXFpvdSkVE\
JReaCD4hs4acsRVDmLOFOmeYyPRWAP0ltbSrkvM7gePTq3Bm5vdvX9ldAlEnhA4mVZVJIR1E2u6e\
gW6efsjVw8c/KBSScDIcGJFllqSItfCtapATYef5UlIzcoEN1mwqSAGznVnFsqjgFBqdfv3aVR0c\
ntpsKjYC2EgCxtk6bF5MBuHa9MFsaWhyvZ0wRyD2yDxMtjQDksuQaVBBmoFlJrHKN77MPS77V0wE\
ouKfUEk/ElsAZgwHJdQBg30I99npvH2xw6jVrjNXuk3Z4r7ogu81n4Q8j6gKth3GPIwJ5CGvo2CL\
nIYudRmL4Le6r97jdiqxsEAcMoW7zQvTwcLznO/VmU7/wSxzGa/9Yn46YFdlc4nWMzEp7ciRY30w\
Ry885zgPxApAaL37nMG/pTP+B1V6hQ3zDE7hhstwQFRGeF75fo/969wWAmhFFOm75JDys761TmBU\
3sW8wikgLJsbJt9th+DAXylBcxz7afNEItu7YVeK6gq0ZEhe4Ojf/XyzMlwDI2Vnnthdj5sHQjeL\
vdWK/IFVeuVN3NMBf6TNngsuR52773bv0d2nEn829cqbKgrbCnOasuAosjhs/Z51H368h2gDFiBA\
B9Z110JkyzrKKxqryssqGIAhjokgZQ3cTkjpg6kMAMLvX/9FiGUAAAAAAElFTkSuQmCC\
`;

// #endregion
