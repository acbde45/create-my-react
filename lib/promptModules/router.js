module.exports = (api) => {
  api.injectFeature({
    name: 'Router',
    value: 'Router',
    short: 'Router',
    description: '使用 react-router-dom 实现路由功能',
    checked: false,
  });
};