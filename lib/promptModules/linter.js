module.exports = (api) => {
  api.injectFeature({
    name: 'Linter / Formatter',
    value: 'linter',
    short: 'Linter',
    description: '检查并且使用 ESLint 和 Prettier 提高代码质量',
    checked: true,
  });
};