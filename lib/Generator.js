const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const globby = require('globby');
const yaml = require('yaml-front-matter');
const resolve = require('resolve');
const ejs = require('ejs');
const { isBinaryFileSync } = require('isbinaryfile');
const writeFileTree = require('./utils/writeFileTree');

class Generator {
  constructor(sourceDir, targetDir, options) {
    this.sourceDir = sourceDir;
    this.targetDir = targetDir;
    this.options = options;
    this.files = {};
  }

  async resolveFiles() {
    // 读取目录中所有的文件
    const _files = await globby(['**/*'], { cwd: this.sourceDir, dot: true });
    for (const rawPath of _files) {
      const sourcePath = path.resolve(this.sourceDir, rawPath);
      // 解析文件内容
      const content = this.renderFile(sourcePath, this.options);
      // only set file if it's not all whitespace, or is a Buffer (binary files)
      if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
        this.files[rawPath] = content;
      }
    }
  }

  async generate() {
    const spinner = ora('正在生成项目...\n').start();
    await this.resolveFiles();
    await writeFileTree(this.targetDir, this.files);
    spinner.succeed();
  }

  renderFile(name, data, ejsOptions = {}) {
    // 如果是二进制文件，直接将读取结果返回
    if (isBinaryFileSync(name)) {
      return fs.readFileSync(name); // return buffer
    }

    const template = fs.readFileSync(name, 'utf-8');

    // custom template inheritance via yaml front matter.
    // ---
    // extend: 'source-file'
    // replace: !!js/regexp /some-regex/
    // OR
    // replace:
    //   - !!js/regexp /foo/
    //   - !!js/regexp /bar/
    // ---
    const parsed = yaml.loadFront(template);
    const content = parsed.__content;
    let finalTemplate = content.trim() + `\n`;

    if (parsed.when) {
      finalTemplate = `<%_ if (${parsed.when}) { _%>` + finalTemplate + `<%_ } _%>`;

      // use ejs.render to test the conditional expression
      // if evaluated to falsy value, return early to avoid extra cost for extend expression
      const result = ejs.render(finalTemplate, data, ejsOptions);
      if (!result) {
        return '';
      }
    }

    const replaceBlockRE = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/g;
    if (parsed.extend) {
      let extendPath;
      if (parsed.extend.startsWith(':')) {
        // 用户项目根目录
        extendPath = path.join(process.cwd(), parsed.extend.slice(1));
      } else {
        const isAbsolute = path.isAbsolute(parsed.extend);
        if (isAbsolute) {
          extendPath = parsed.extend;
        } else {
          extendPath = resolve.sync(parsed.extend, { basedir: path.dirname(name) });
        }
      }

      finalTemplate = fs.readFileSync(extendPath, 'utf-8');
      if (parsed.replace) {
        if (Array.isArray(parsed.replace)) {
          const replaceMatch = content.match(replaceBlockRE);
          if (replaceMatch) {
            const replaces = replaceMatch.map(m => {
              if (parsed.keepSpace) {
                return m.replace(replaceBlockRE, '$1');
              }

              return m.replace(replaceBlockRE, '$1').trim();
            });

            parsed.replace.forEach((r, i) => {
              finalTemplate = finalTemplate.replace(r, replaces[i]);
            });
          }
        } else if (parsed.keepSpace) {
          finalTemplate = finalTemplate.replace(parsed.replace, content);
        } else {
          finalTemplate = finalTemplate.replace(parsed.replace, content.trim());
        }
      }
    }

    return ejs.render(finalTemplate, data, ejsOptions);
  }
}

module.exports = Generator;
