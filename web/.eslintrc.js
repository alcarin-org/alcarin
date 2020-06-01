const base = require('../.eslintrc.base.js');

module.exports = {
  ...base,
  extends: base.extends.concat(['plugin:react/recommended']),
};
