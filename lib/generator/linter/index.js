module.exports = (generator, { hasTypeScript }) => {
  generator.render('./template', { hasTypeScript });

  generator.extendPackage({
    scripts: {
      'lint:fix': 'eslint ./src --ext .jsx,.js --quiet --fix --ignore-path ./.gitignore',
      'lint:format': 'prettier  --loglevel warn --write "./**/*.{js,jsx,css,md,json}" ',
      lint: 'yarn lint:format && yarn lint:fix ',
    },
    devDependencies: {
      'babel-eslint': '^10.1.0',
      eslint: '^7.20.0',
      'eslint-config-prettier': '^8.3.0',
      'eslint-plugin-simple-import-sort': '^7.0.0',
      'eslint-plugin-import': '^2.23.4',
      'eslint-config-airbnb': '^18.2.1',
      'pre-commit': '^1.2.2',
      prettier: '^2.3.2',
    },
    'pre-commit': 'lint',
  });

  if (hasTypeScript) {
    generator.extendPackage({
      scripts: {
        'lint:fix': 'eslint ./src --ext .jsx,.js,.ts,.tsx --quiet --fix --ignore-path ./.gitignore',
        'lint:format': 'prettier  --loglevel warn --write "./**/*.{js,jsx,ts,tsx,css,md,json}" ',
        lint: 'yarn lint:format && yarn lint:fix ',
        'type-check': 'tsc',
      },
      devDependencies: {
        '@typescript-eslint/eslint-plugin': '^4.28.2',
        '@typescript-eslint/parser': '^4.28.2',
      },
    });
  }
};
