const base = require('../.eslintrc.base.js');

module.exports = {
  ...base,
  // allow specific syntax needed for typeorm entities
  overrides: [
    ...(base.overrides || []),
    {
      files: ['src/db/entities/*.ts'],
      rules: {
        '@typescript-eslint/no-inferrable-types': 'off',
      },
    },
  ],
};
