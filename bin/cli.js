#! /usr/bin/env node

const program = require('commander');
const create = require('../lib/create');

const version = require('../package.json').version;

program
  .version(version)
  .command('create <project-name>')
  .option('-p, --package-manager <packageManager>', '使用哪儿个包管理工具下载依赖', 'yarn')
  .description('开始一个新项目')
  .action((projectName, options) => {
    create(projectName, options);
  });

program.parse();
