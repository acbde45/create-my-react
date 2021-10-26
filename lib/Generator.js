const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const { isBinaryFileSync } = require('isbinaryfile');
const sortObject = require('./utils/sortObject');
const normalizeFilePaths = require('./utils/normalizeFilePaths');
const writeFileTree = require('./utils/writeFileTree');
const injectImports = require('./utils/codemods/injectImports');

const isObject = val => val && typeof val === 'object';

class Generator {
  constructor(pkg, context) {
    this.pkg = pkg;
    this.imports = {};
    this.files = {};
    this.entryFile = `src/main.js`;
    this.fileMiddlewares = [];
    this.context = context;
    this.configTransforms = {};
  }

  extendPackage(fields) {
    const pkg = this.pkg;
    for (const key in fields) {
      const value = fields[key];
      const existing = pkg[key];
      if (isObject(value) && (key === 'dependencies' || key === 'devDependencies' || key === 'scripts')) {
        pkg[key] = Object.assign(existing || {}, value);
      } else {
        pkg[key] = value;
      }
    }
  }

  async generate() {
    // 解析文件内容
    await this.resolveFiles();
    // 将 package.json 中的字段排序
    this.sortPkg();
    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';
    // 将所有文件写入到用户要创建的目录
    await writeFileTree(this.context, this.files);
  }

  // 按照下面的顺序对 package.json 中的 key 进行排序
  sortPkg() {
    // ensure package.json keys has readable order
    this.pkg.dependencies = sortObject(this.pkg.dependencies);
    this.pkg.devDependencies = sortObject(this.pkg.devDependencies);
    this.pkg.scripts = sortObject(this.pkg.scripts, ['dev', 'build', 'test:unit', 'test:e2e', 'lint', 'deploy']);

    this.pkg = sortObject(this.pkg, [
      'name',
      'version',
      'private',
      'description',
      'author',
      'scripts',
      'husky',
      'lint-staged',
      'main',
      'module',
      'browser',
      'jsDelivr',
      'unpkg',
      'files',
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'vue',
      'babel',
      'eslintConfig',
      'prettier',
      'postcss',
      'browserslist',
      'jest',
    ]);
  }

  // 使用 ejs 解析 lib\generator\xx\template 中的文件
  async resolveFiles() {
    const files = this.files;
    for (const middleware of this.fileMiddlewares) {
      await middleware(files, ejs.render);
    }

    // normalize file paths on windows
    // all paths are converted to use / instead of \
    // 将反斜杠 \ 转换为正斜杠 /
    normalizeFilePaths(files);

    // 处理 import 语句的导入的注入
    Object.keys(files).forEach(file => {
      let imports = this.imports[file];
      imports = imports instanceof Set ? Array.from(imports) : imports;
      if (imports && imports.length > 0) {
        files[file] = injectImports({ path: file, source: files[file] }, { imports });
      }
    });
  }

  render(source, additionalData = {}, ejsOptions = {}) {
    // 获取调用 generator.render() 函数的文件的父目录路径
    const baseDir = extractCallDir();
    source = path.resolve(baseDir, source);
    this._injectFileMiddleware(async files => {
      const data = this._resolveData(additionalData);
      // https://github.com/sindresorhus/globby
      const globby = require('globby');
      // 读取目录中所有的文件
      const _files = await globby(['**/*'], { cwd: source, dot: true });
      for (const rawPath of _files) {
        const sourcePath = path.resolve(source, rawPath);
        // 解析文件内容
        const content = this.renderFile(sourcePath, data, ejsOptions);
        // only set file if it's not all whitespace, or is a Buffer (binary files)
        if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
          files[rawPath] = content;
        }
      }
    });
  }

  _injectFileMiddleware(middleware) {
    this.fileMiddlewares.push(middleware);
  }

  // 合并选项
  _resolveData(additionalData) {
    return {
      options: this.options,
      ...additionalData,
    };
  }

  renderFile(name, data, ejsOptions) {
    // 如果是二进制文件，直接将读取结果返回
    if (isBinaryFileSync(name)) {
      return fs.readFileSync(name); // return buffer
    }

    // 返回文件内容
    const template = fs.readFileSync(name, 'utf-8');
    return ejs.render(template, data, ejsOptions);
  }

  /**
   * Add import statements to a file.
   */
  injectImports(file, imports) {
    const _imports = this.imports[file] || (this.imports[file] = new Set());
    (Array.isArray(imports) ? imports : [imports]).forEach(imp => {
      _imports.add(imp);
    });
  }
}

// http://blog.shaochuancs.com/about-error-capturestacktrace/
// 获取调用栈信息
function extractCallDir() {
  const obj = {};
  Error.captureStackTrace(obj);
  // 在 lib\generator\xx 等各个模块中 调用 generator.render()
  // 将会排在调用栈中的第四个，也就是 obj.stack.split('\n')[3]
  const callSite = obj.stack.split('\n')[3];

  // the regexp for the stack when called inside a named function
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
  // the regexp for the stack when called inside an anonymous
  const anonymousStackRegExp = /at (.*):\d+:\d+$/;

  let matchResult = callSite.match(namedStackRegExp);
  if (!matchResult) {
    matchResult = callSite.match(anonymousStackRegExp);
  }

  const fileName = matchResult[1];
  // 获取对应文件的目录
  return path.dirname(fileName);
}

module.exports = Generator;
