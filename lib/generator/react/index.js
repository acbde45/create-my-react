module.exports = (generator) => {
  generator.render('./template');

  generator.extendPackage({
    dependencies: {
      react: '^17.0.2',
      'react-dom': '^17.0.2',
    },
  });

  generator.extendPackage({
    browserslist: {
      production: ['>0.2%', 'not dead', 'not op_mini all'],
      development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
    },
  });
};
