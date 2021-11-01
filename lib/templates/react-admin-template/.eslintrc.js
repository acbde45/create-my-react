/**
 * ESLint 配置
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'prettier'],
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'prettier', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    jasmine: true,
    jest: true,
    node: true,
  },
  // Airbnb's ESLint config requires this
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // 关闭对拓展名的检查，因为存在bug
    'import/extensions': 'off',
    // 可以使用console
    'no-console': 'off',
    // 不能使用 ++ 的方式自增
    'no-plusplus': 'off',
    // 标识符中可以有悬空下划线
    'no-underscore-dangle': 'off',
    // 可以使用按位操作符
    'no-bitwise': 'off',
    // 函数参数不能修改
    'no-param-reassign': 'off',
    // 可以使用hasOwnProperty方法
    'no-prototype-builtins': 'off',
    // 可以拼接字符串
    'prefer-template': 'off',
    // We will use TypeScript's types for component props instead
    'react/prop-types': 'off',
    // 不需要必须引入React在每个tsx文件里
    'react/react-in-jsx-scope': 'off',
    // 组件属性可以用展开运算符
    'react/jsx-props-no-spreading': 'off',
    // 关闭React.Fragment的检查
    'react/jsx-fragments': 'off',
    // 不使用defaultProps，因为我们用的是ts
    'react/require-default-props': 'off',
    // 可以用花括号包裹jsx里的字符串
    'react/jsx-curly-brace-presence': 'off',
    // 标签属性值为true不强求缩写
    'react/jsx-boolean-value': 'off',
    // useEffect里面不一定需要全部的依赖
    'react-hooks/exhaustive-deps': 'off',
    // Include .prettierrc.js rules
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    // We don't want unused vars
    '@typescript-eslint/no-unused-vars': ['error'],
    // 允许函数在定义之前使用
    '@typescript-eslint/no-use-before-define': 'off',
    // 不强求any
    '@typescript-eslint/no-explicit-any': 'off',
    // 对于某些第三方库没有ts declaration，允许使用@ts-ignore
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
