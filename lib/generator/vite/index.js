module.exports = (generator, { hasTypeScript }) => {
  generator.extendPackage({
    scripts: {
      dev: 'vite',
      build: 'vite build',
      serve: 'vite preview',
    },
    devDependencies: {
      '@vitejs/plugin-react-refresh': '^1.3.5',
      vite: '^2.4.1',
    },
  });

  if (hasTypeScript) {
    generator.extendPackage({
      scripts: {
        build: 'tsc && vite build',
      },
    });
  }

  generator.render('./template');
};
