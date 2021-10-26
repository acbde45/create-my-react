module.exports = generator => {
  generator.render('./template');

  generator.extendPackage({
    devDependencies: {
      '@types/react': '^17.0.14',
      '@types/react-dom': '^17.0.9',
      typescript: '^4.3.2',
    },
  });
};
