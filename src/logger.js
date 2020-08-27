const config = require('./config');

exports.debug = (message, ...rest) => {
  const { debug } = config.log;

  if (debug) {
    console.debug(message, ...rest);
  }
};

exports.info = (message, ...rest) => {
  console.info(message, ...rest);
};

exports.warn = (message, ...rest) => {
  console.warn(message, ...rest);
};

exports.error = (message, ...rest) => {
  console.error(message, ...rest);
};