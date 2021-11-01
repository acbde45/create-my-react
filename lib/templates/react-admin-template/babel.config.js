/**
 * Babel 配置
 *
 * @see https://babeljs.io/docs/en/options
 * @param {import("@babel/core").ConfigAPI} api
 * @returns {import("@babel/core").TransformOptions}
 */
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['react-app', '@emotion/babel-preset-css-prop'],
    // plugins: [
    //   [
    //     'babel-plugin-import',
    //     {
    //       libraryName: '@material-ui/core',
    //       // Use "'libraryDirectory': ''," if your bundler does not support ES modules
    //       libraryDirectory: 'esm',
    //       camel2DashComponentName: false,
    //     },
    //     'core',
    //   ],
    // ],
  };
};
