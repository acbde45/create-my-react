const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const PackageManager = require('./PackageManager');
const Generator = require('./Generator');
const { log } = require('./utils/logger');
const findSubdirs = require('./utils/findSubdirs');
const clearConsole = require('./utils/clearConsole');

async function create(name, { packageManager }) {
  const targetDir = path.join(process.cwd(), name);
  // 如果目标目录已存在，询问是覆盖还是合并
  if (fs.existsSync(targetDir)) {
    // 清空控制台
    clearConsole();

    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `该文件夹 ${chalk.cyan(targetDir)} 已存在，请选择处理方式：`,
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '合并', value: 'merge' },
        ],
      },
    ]);

    if (action === 'overwrite') {
      log(`\n删除 ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    }
  }

  // 清空控制台
  clearConsole();

  const templateNames = findSubdirs(path.join(__dirname, './templates'));
  const { templateName } = await inquirer.prompt([
    {
      name: 'templateName',
      type: 'list',
      message: `请选择创建新项目的模版`,
      choices: templateNames.map(t => ({ name: t, value: t })),
    },
  ]);

  const templateDir = path.join(__dirname, 'templates', templateName);
  const generator = new Generator(templateDir, targetDir);

  generator.generate();

  const pm = new PackageManager(targetDir, packageManager);

  // 下载依赖
  await pm.install();
  log('\n依赖下载完成! 执行下列命令开始开发：\n');
  log(`cd ${name}`);
  log(`npm run start`);
}

module.exports = create;
