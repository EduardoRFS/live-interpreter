module.exports = {
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-restricted-syntax': 0,
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.ts', '*.spec.ts'],
      extends: ['plugin:jest/recommended'],
      rules: {
        'jest/valid-describe': 0,
        'no-shadow': 0,
      },
    },
  ],
};
